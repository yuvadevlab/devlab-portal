/**
 * @file apps/api/src/modules/auth/jwks.controller.ts
 * @description Controller serving RFC 7517 JWKS endpoint and OIDC discovery metadata.
 * @module @devlab/portal-api/auth
 */

import { Controller, Get, Header } from "@nestjs/common";
import { KeypairService } from "./keys/keypair.service";

@Controller(".well-known")
export class JwksController {
  constructor(private readonly keypairService: KeypairService) {}

  /**
   * Returns standard JWK Set containing public keys for RS256 token verification.
   * Cached for 1 hour by downstream microservices.
   */
  @Get("jwks.json")
  @Header("Content-Type", "application/json")
  @Header("Cache-Control", "public, max-age=3600")
  getJwks(): { keys: unknown[] } {
    return this.keypairService.getPublicJwks();
  }

  /**
   * Returns RFC 8414 OpenID Connect Discovery metadata.
   */
  @Get("openid-configuration")
  @Header("Content-Type", "application/json")
  getOpenIdConfiguration() {
    const issuer = process.env.OIDC_ISSUER || "http://localhost:3015";
    return {
      issuer,
      authorization_endpoint: `${issuer}/oauth/authorize`,
      token_endpoint: `${issuer}/oauth/token`,
      jwks_uri: `${issuer}/.well-known/jwks.json`,
      response_types_supported: ["code", "token"],
      subject_types_supported: ["public"],
      id_token_signing_alg_values_supported: ["RS256"],
      scopes_supported: ["openid", "profile", "email"],
      token_endpoint_auth_methods_supported: ["client_secret_basic", "client_secret_post"],
      claims_supported: ["sub", "iss", "aud", "exp", "iat", "email", "name", "role"],
    };
  }
}
