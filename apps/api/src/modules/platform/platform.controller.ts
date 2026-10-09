/**
 * @file apps/api/src/modules/platform/platform.controller.ts
 * @description REST controller serving server-driven platform configuration and navigation menus.
 * Adheres strictly to Big 3 dynamic configuration standard (/api/v1/platform/...).
 * @module @devlab/portal-api/platform
 */

import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { PlatformService } from "./platform.service.js";

@Controller("api/v1/platform")
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  /**
   * Retrieves server-driven navigation menus and tabs from the database.
   */
  @Get("navigation")
  @HttpCode(HttpStatus.OK)
  async getNavigation() {
    return this.platformService.getNavigationItems();
  }
}
