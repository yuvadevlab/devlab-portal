/**
 * @file apps/api/src/modules/auth/keys/keypair.service.ts
 * @description Manages RSA 2048-bit keypairs for RS256 JWT signing, verification, and JWKS publishing.
 * @module @devlab/portal-api/auth/keys
 */

import { Injectable, OnModuleInit } from "@nestjs/common";
import * as jose from "jose";
import fs from "node:fs";
import path from "node:path";
import { Logger } from "@yuva-devlab/logger";

export const DEVLAB_KEY_ID = "devlab-key-1";

@Injectable()
export class KeypairService implements OnModuleInit {
  private readonly logger = new Logger("KeypairService");
  private privateKey!: jose.CryptoKey | Uint8Array;
  private publicKey!: jose.CryptoKey | Uint8Array;
  private publicJwk!: jose.JWK;

  /**
   * Loads existing RSA keypair from storage/env or generates a new 2048-bit keypair on startup.
   */
  async onModuleInit(): Promise<void> {
    const keysDir = path.resolve(process.cwd(), ".keys");
    const privateKeyPath = path.join(keysDir, "private.key");

    if (fs.existsSync(privateKeyPath)) {
      this.logger.info("Loading existing RSA keypair from filesystem...");
      const pem = fs.readFileSync(privateKeyPath, "utf-8");
      this.privateKey = await jose.importPKCS8(pem, "RS256");
      const publicKeyPath = path.join(keysDir, "public.key");
      const pubPem = fs.readFileSync(publicKeyPath, "utf-8");
      this.publicKey = await jose.importSPKI(pubPem, "RS256");
    } else {
      this.logger.info("Generating new RSA 2048-bit keypair for RS256 tokens...");
      const pair = await jose.generateKeyPair("RS256", { modulusLength: 2048 });
      this.privateKey = pair.privateKey;
      this.publicKey = pair.publicKey;

      try {
        fs.mkdirSync(keysDir, { recursive: true });
        const pemPrivate = await jose.exportPKCS8(pair.privateKey);
        const pemPublic = await jose.exportSPKI(pair.publicKey);
        fs.writeFileSync(privateKeyPath, pemPrivate, "utf-8");
        fs.writeFileSync(path.join(keysDir, "public.key"), pemPublic, "utf-8");
        this.logger.info("Persisted generated RSA keypair to .keys directory.");
      } catch (err) {
        this.logger.warn("Could not persist keypair to disk, using in-memory keys:", err);
      }
    }

    const jwk = await jose.exportJWK(this.publicKey);
    this.publicJwk = {
      ...jwk,
      kid: DEVLAB_KEY_ID,
      use: "sig",
      alg: "RS256",
    };
    this.logger.info(`RS256 JWKS initialized with key ID: ${DEVLAB_KEY_ID}`);
  }

  /**
   * Returns RFC 7517 compliant public JSON Web Key Set.
   */
  getPublicJwks(): { keys: jose.JWK[] } {
    return {
      keys: [this.publicJwk],
    };
  }

  /**
   * Signs a payload into an RS256 JSON Web Token.
   */
  async signJwt(
    payload: Record<string, unknown>,
    options: { expiresIn?: string; subject?: string; audience?: string } = {},
  ): Promise<string> {
    const issuer = process.env.OIDC_ISSUER || "http://localhost:3010";
    let jwtBuilder = new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "RS256", kid: DEVLAB_KEY_ID })
      .setIssuedAt()
      .setIssuer(issuer)
      .setExpirationTime(options.expiresIn || "1h");

    if (options.subject) {
      jwtBuilder = jwtBuilder.setSubject(options.subject);
    }
    if (options.audience) {
      jwtBuilder = jwtBuilder.setAudience(options.audience);
    }

    return jwtBuilder.sign(this.privateKey);
  }

  /**
   * Verifies an RS256 JSON Web Token against the active public key.
   */
  async verifyJwt(token: string): Promise<jose.JWTVerifyResult> {
    return jose.jwtVerify(token, this.publicKey, {
      issuer: process.env.OIDC_ISSUER || "http://localhost:3010",
    });
  }
}
