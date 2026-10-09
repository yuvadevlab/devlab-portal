/**
 * @file apps/api/src/modules/platform/platform.service.ts
 * @description Service handling platform-wide dynamic configuration and database-driven navigation.
 * @module @devlab/portal-api/platform
 */

import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { Logger } from "@yuva-devlab/logger";

@Injectable()
export class PlatformService {
  private readonly logger = new Logger("PlatformService");

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all enabled platform navigation items ordered by priority index.
   */
  async getNavigationItems() {
    this.logger.debug("Fetching enabled platform navigation items from database");
    return this.prisma.navigationItem.findMany({
      where: { isEnabled: true },
      orderBy: { order: "asc" },
    });
  }
}
