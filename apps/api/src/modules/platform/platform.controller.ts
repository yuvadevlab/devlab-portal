/**
 * @file apps/api/src/modules/platform/platform.controller.ts
 * @description REST controller serving server-driven platform configuration, tenants, and telemetry.
 * Adheres strictly to Big 3 dynamic configuration standard (/api/v1/platform/...).
 * @module @devlab/portal-api/platform
 */

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AuthGuard } from "../auth/auth.guard";
import { PlatformService } from "./platform.service";
import { PlatformAppStatusService } from "./platform-app-status.service";
import { CreateTenantDto } from "./dto/tenant.dto";

@Controller("api/v1/platform")
export class PlatformController {
  constructor(
    private readonly platformService: PlatformService,
    private readonly appStatusService: PlatformAppStatusService,
  ) {}

  /**
   * Retrieves operational kill-switch and lifecycle status for a registered application.
   */
  @Get("apps/:appId/status")
  @HttpCode(HttpStatus.OK)
  async getAppStatus(@Param("appId") appId: string) {
    return this.appStatusService.getAppStatus(appId);
  }

  /**
   * Retrieves server-driven navigation menus and tabs from the database.
   */
  @Get("navigation")
  @HttpCode(HttpStatus.OK)
  async getNavigation() {
    return this.platformService.getNavigationItems();
  }

  /**
   * Retrieves active platform tenants from the database.
   */
  @Get("tenants")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getTenants(@CurrentUser() user: { sub: string; role?: string; tenant_id?: string }) {
    return this.platformService.getTenants(user);
  }

  /**
   * Provisions a new workspace tenant in the database.
   */
  @Post("tenants")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createTenant(@Body() dto: CreateTenantDto) {
    return this.platformService.createTenant(dto);
  }

  /**
   * Retrieves live cluster telemetry, port, and redis status.
   */
  @Get("telemetry")
  @HttpCode(HttpStatus.OK)
  async getTelemetry(@CurrentUser() user?: { sub: string; role?: string; tenant_id?: string }) {
    return this.platformService.getSystemTelemetry(user);
  }
}
