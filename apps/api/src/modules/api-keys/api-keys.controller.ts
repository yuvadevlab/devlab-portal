/**
 * @file apps/api/src/modules/api-keys/api-keys.controller.ts
 * @description REST endpoints for API key creation, listing, revocation, and high-speed validation.
 * @module @devlab/portal-api/api-keys
 */

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiKeysService } from "./api-keys.service";
import { AuthGuard } from "../auth/auth.guard";
import { CreateApiKeyDto } from "./dto/api-key.dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("api/v1/api-keys")
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  /**
   * Generates a new scoped API key for the target application.
   */
  @Post()
  @UseGuards(AuthGuard)
  async createApiKey(@CurrentUser() user: { sub: string }, @Body() dto: CreateApiKeyDto) {
    return this.apiKeysService.createApiKey(user.sub, dto);
  }

  /**
   * Lists all scoped API keys with prefix preview.
   */
  @Get()
  @UseGuards(AuthGuard)
  async listApiKeys(
    @CurrentUser() user: { sub: string; role?: string; tenant_id?: string },
    @Query("app_id") appId?: string,
  ) {
    return this.apiKeysService.listApiKeys(appId, user);
  }

  /**
   * Revokes an active API key immediately.
   */
  @Delete(":id")
  @UseGuards(AuthGuard)
  async revokeApiKey(
    @CurrentUser() user: { sub: string; role?: string; tenant_id?: string },
    @Param("id") id: string,
  ) {
    return this.apiKeysService.revokeApiKey(id, user.sub, user);
  }

  /**
   * Validates an API key from Authorization header or query parameter.
   */
  @Get("validate")
  @HttpCode(HttpStatus.OK)
  async validateApiKey(
    @Headers("authorization") authHeader?: string,
    @Query("key") queryKey?: string,
  ) {
    const rawKey = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7).trim()
      : queryKey || "";
    return this.apiKeysService.validateApiKey(rawKey);
  }
}
