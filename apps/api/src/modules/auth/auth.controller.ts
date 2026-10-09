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
import type { Response } from "express";
import { AuthService } from "./auth.service.js";
import { AuthGuard } from "./auth.guard.js";
import { LoginDto, AuthorizeDto, TokenDto } from "./dto/auth.dto.js";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Direct login for Web Shell operator credentials.
   */
  @Post("auth/login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * Returns current authenticated user profile.
   */
  @Get("auth/me")
  @UseGuards(AuthGuard)
  async getMe(@CurrentUser() user: { sub: string }) {
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
    if (!userId) {
      throw new BadRequestException(
        "user_id query parameter is required to initiate authorization",
      );
    }
    const result = await this.authService.authorize(dto, userId);
    return res.redirect(result.redirectUrl);
  }

  /**
   * Standard RFC 6749 OAuth2 Token Exchange endpoint.
   */
  @Post("oauth/token")
  @HttpCode(HttpStatus.OK)
  async token(@Body() dto: TokenDto) {
    return this.authService.exchangeToken(dto);
  }
}
