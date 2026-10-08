/**
 * @file apps/api/src/modules/auth/auth.guard.ts
 * @description NestJS guard verifying RS256 JWT tokens on protected endpoints.
 * @module @devlab/portal-api/auth
 */

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { KeypairService } from "./keys/keypair.service.js";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly keypairService: KeypairService) {}

  /**
   * Verifies Authorization Bearer header against RS256 keypair.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or malformed Authorization header");
    }

    const token = authHeader.substring(7).trim();
    try {
      const { payload } = await this.keypairService.verifyJwt(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired authentication token");
    }
  }

  private getRequest(context: ExecutionContext) {
    if (context.getType() === "http") {
      return context.switchToHttp().getRequest();
    }
    // GraphQL context support
    const ctx = context.getArgs()[2];
    return ctx?.req || context.switchToHttp().getRequest();
  }
}
