/**
 * @file apps/api/src/modules/apps/apps.controller.ts
 * @description REST controller for application catalog queries and live kill-switch status toggling.
 * @module @devlab/portal-api/apps
 */

import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AppsService } from "./apps.service.js";
import { AuthGuard } from "../auth/auth.guard.js";
import { UpdateAppStatusDto } from "./dto/app.dto.js";
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
    return this.appsService.updateAppStatus(id, dto, user?.sub || "cmuzm86p00000sxyr2ct88hws");
  }
}
