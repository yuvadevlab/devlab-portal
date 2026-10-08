/**
 * @file apps/api/src/modules/auth/auth.module.ts
 * @description Authentication module registering KeypairService, AuthService, JWKS, and Auth controllers.
 * @module @devlab/portal-api/auth
 */

import { Module } from "@nestjs/common";
import { KeypairService } from "./keys/keypair.service.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { JwksController } from "./jwks.controller.js";
import { AuthGuard } from "./auth.guard.js";

@Module({
  controllers: [AuthController, JwksController],
  providers: [KeypairService, AuthService, AuthGuard],
  exports: [KeypairService, AuthService, AuthGuard],
})
export class AuthModule {}
