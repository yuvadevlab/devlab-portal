/**
 * @file apps/api/src/modules/auth/jwks.controller.ts
 * @description Controller serving RFC 7517 JWKS endpoint for distributed public key discovery.
 * @module @devlab/portal-api/auth
 */

import { Controller, Get, Header } from "@nestjs/common";
import { KeypairService } from "./keys/keypair.service.js";

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
}
