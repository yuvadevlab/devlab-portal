/**
 * @file apps/api/src/modules/health/health.controller.ts
 * @description Health probe controller providing dual liveness and readiness routes (/health & /api/v1/health).
 * @module @devlab/portal-api/health
 */

import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { API_VERSION, BUILD_METADATA } from "../../common/constants/version";
import { Logger } from "@yuva-devlab/logger";

@Controller()
export class HealthController {
  private readonly logger = new Logger("HealthController");

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Universal health probe supporting both /health and /api/v1/health endpoints.
   */
  @Get(["health", "api/v1/health"])
  @HttpCode(HttpStatus.OK)
  async getHealth() {
    let dbStatus = "connected";
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (err) {
      this.logger.error("Database health check probe failed", err);
      dbStatus = "unreachable";
    }

    return {
      status: dbStatus === "connected" ? "ok" : "degraded",
      service: "devlab-portal-api",
      version: API_VERSION,
      build: BUILD_METADATA,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: dbStatus,
      },
    };
  }
}
