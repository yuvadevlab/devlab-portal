/**
 * @file apps/api/src/modules/auth/auth.module.ts
 * @description NestJS module configuring OAuth2 authentication, JWT issuance, and JWKS endpoints.
 * @module @devlab/portal-api/auth
 */

import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { OAuthService } from "./oauth.service";
import { AuthController } from "./auth.controller";
import { JwksController } from "./jwks.controller";
import { KeypairService } from "./keys/keypair.service";
import { AuthGuard } from "./auth.guard";

@Module({
  controllers: [AuthController, JwksController],
  providers: [AuthService, OAuthService, KeypairService, AuthGuard],
  exports: [AuthService, OAuthService, KeypairService, AuthGuard],
})
export class AuthModule {}
