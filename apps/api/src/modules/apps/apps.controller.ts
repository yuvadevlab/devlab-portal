/**
 * @file apps/api/src/modules/apps/apps.controller.ts
 * @description REST controller for application catalog queries and live kill-switch status toggling.
 * @module @devlab/portal-api/apps
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from "@nestjs/common";
import { AppsService } from "./apps.service";
import { AuthGuard } from "../auth/auth.guard";
import { CreateAppDto, UpdateAppSettingsDto, UpdateAppStatusDto } from "./dto/app.dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Logger } from "@yuva-devlab/logger";

@Controller("api/v1/apps")
export class AppsController {
  private readonly logger = new Logger("AppsController");

  constructor(private readonly appsService: AppsService) {}

  /**
   * Retrieves all registered applications with dynamic latency and health statuses.
   */
  @Get()
  @UseGuards(AuthGuard)
  async listApps(@CurrentUser() user: { sub: string; role?: string; tenant_id?: string }) {
    this.logger.info(
      `[listApps] Listing apps for actor=${user?.sub} (tenant=${user?.tenant_id || "all"})`,
    );
    return this.appsService.listApps(user);
  }

  /**
   * Retrieves a single application by ID or appId.
   */
  @Get(":id")
  @UseGuards(AuthGuard)
  async getApp(
    @Param("id") id: string,
    @CurrentUser() user: { sub: string; role?: string; tenant_id?: string },
  ) {
    this.logger.info(`[getApp] Fetching app "${id}" for actor=${user?.sub}`);
    return this.appsService.getApp(id, user);
  }

  /**
   * Registers a new application in the ecosystem catalog.
   */
  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createApp(
    @Body() dto: CreateAppDto,
    @CurrentUser() user: { sub: string; role?: string; tenant_id?: string },
  ) {
    if (!user?.sub) {
      throw new UnauthorizedException("Authenticated user identifier is required");
    }
    this.logger.info(
      `[createApp] Registering app "${dto.appId}" (${dto.name}) by actor=${user.sub}`,
    );
    return this.appsService.createApp(dto, user);
  }

  /**
   * Updates application operational configuration.
   */
  @Patch(":id")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateAppSettings(
    @Param("id") id: string,
    @Body() dto: UpdateAppSettingsDto,
    @CurrentUser() user: { sub: string; role?: string; tenant_id?: string },
  ) {
    if (!user?.sub) {
      throw new UnauthorizedException("Authenticated user identifier is required");
    }
    this.logger.info(`[updateAppSettings] Updating settings for app "${id}" by actor=${user.sub}`);
    return this.appsService.updateAppSettings(id, dto, user);
  }

  /**
   * Toggles kill-switch status (isActive / maintenanceNote) and broadcasts event.
   */
  @Patch(":id/status")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateAppStatusDto,
    @CurrentUser() user: { sub: string; role?: string; tenant_id?: string },
  ) {
    if (!user?.sub) {
      throw new UnauthorizedException("Authenticated user identifier is required");
    }
    this.logger.info(
      `[updateStatus] Toggling status for app "${id}" (isActive=${dto.isActive}) by actor=${user.sub}`,
    );
    return this.appsService.updateAppStatus(id, dto, user);
  }
}
