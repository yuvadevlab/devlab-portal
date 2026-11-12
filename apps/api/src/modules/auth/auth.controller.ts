/**
 * @file apps/api/src/modules/auth/auth.controller.ts
 * @description Controller providing OAuth2/OIDC endpoints and user session authentication.
 * @module @devlab/portal-api/auth
 */

import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from "@nestjs/common";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { OAuthService } from "./oauth.service";
import { AuthGuard } from "./auth.guard";
import {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthorizeDto,
  TokenDto,
} from "./dto/auth.dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Logger } from "@yuva-devlab/logger";

@Controller()
export class AuthController {
  private readonly logger = new Logger("AuthController");

  constructor(
    private readonly authService: AuthService,
    private readonly oauthService: OAuthService,
  ) {}

  /**
   * Direct login for Web Shell operator credentials. Rate-limited to 5 req/min.
   */
  @Post("auth/login")
  @UseGuards(ThrottlerGuard)
  @Throttle({ auth: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    this.logger.info("[login] Incoming login request");
    return this.authService.login(dto);
  }

  /**
   * User self-registration into the active tenant workspace. Rate-limited to 5 req/min.
   */
  @Post("auth/register")
  @UseGuards(ThrottlerGuard)
  @Throttle({ auth: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    this.logger.info("[register] Incoming registration request");
    return this.authService.register(dto);
  }

  /**
   * Initiates password reset recovery flow. Rate-limited to 5 req/min.
   */
  @Post("auth/forgot-password")
  @UseGuards(ThrottlerGuard)
  @Throttle({ auth: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    this.logger.info("[forgotPassword] Password recovery requested");
    return this.authService.forgotPassword(dto);
  }

  /**
   * Resets password using verification token. Rate-limited to 5 req/min.
   */
  @Post("auth/reset-password")
  @UseGuards(ThrottlerGuard)
  @Throttle({ auth: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    this.logger.info("[resetPassword] Reset password confirmation submitted");
    return this.authService.resetPassword(dto);
  }

  /**
   * Returns current authenticated user profile.
   */
  @Get("auth/me")
  @UseGuards(AuthGuard)
  async getMe(@CurrentUser() user: { sub: string }) {
    this.logger.info(`[getMe] Fetching current profile for actor=${user?.sub}`);
    return this.authService.getUserById(user.sub);
  }

  /**
   * OIDC Authorization endpoint initiating PKCE flow.
   */
  @Get("oauth/authorize")
  async authorize(
    @Query() dto: AuthorizeDto,
    @Query("user_id") userId: string,
    @Res() res: Response,
  ) {
    this.logger.info(`[authorize] OIDC authorization initiated for client_id=${dto.client_id}`);
    if (!userId) {
      this.logger.warn("[authorize] Missing user_id parameter");
      throw new BadRequestException(
        "user_id query parameter is required to initiate authorization",
      );
    }
    const result = await this.oauthService.authorize(dto, userId);
    return res.redirect(result.redirectUrl);
  }

  /**
   * Standard RFC 6749 OAuth2 Token Exchange endpoint.
   */
  @Post("oauth/token")
  @HttpCode(HttpStatus.OK)
  async token(@Body() dto: TokenDto) {
    this.logger.info(`[token] Token exchange request (grant_type=${dto.grant_type})`);
    return this.oauthService.exchangeToken(dto);
  }
}
