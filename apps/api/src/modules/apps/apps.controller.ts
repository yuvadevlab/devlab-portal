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
import { AppsService } from "./apps.service.js";
import { AuthGuard } from "../auth/auth.guard.js";
import { CreateAppDto, UpdateAppSettingsDto, UpdateAppStatusDto } from "./dto/app.dto.js";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";

@Controller("api/v1/apps")
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  /**
   * Retrieves all registered applications with dynamic latency and health statuses.
   */
  @Get()
  async listApps() {
    return this.appsService.listApps();
  }

  /**
   * Retrieves a single application by ID or appId.
   */
  @Get(":id")
  async getApp(@Param("id") id: string) {
    return this.appsService.getApp(id);
  }

  /**
   * Registers a new application in the ecosystem catalog.
   */
  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createApp(@Body() dto: CreateAppDto, @CurrentUser() user: { sub: string }) {
    if (!user?.sub) {
      throw new UnauthorizedException("Authenticated user identifier is required");
    }
    return this.appsService.createApp(dto, user.sub);
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
    @CurrentUser() user: { sub: string },
  ) {
    if (!user?.sub) {
      throw new UnauthorizedException("Authenticated user identifier is required");
    }
    return this.appsService.updateAppSettings(id, dto, user.sub);
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
    @CurrentUser() user: { sub: string },
  ) {
    if (!user?.sub) {
      throw new UnauthorizedException("Authenticated user identifier is required");
    }
    return this.appsService.updateAppStatus(id, dto, user.sub);
  }
}
