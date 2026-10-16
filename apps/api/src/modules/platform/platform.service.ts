/**
 * @file apps/api/src/modules/platform/platform.service.ts
 * @description Service handling platform-wide dynamic configuration and database-driven navigation.
 * @module @devlab/portal-api/platform
 */

import { Injectable, BadRequestException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";
import { Logger } from "@yuva-devlab/logger";
import { CreateTenantDto } from "./dto/tenant.dto";
import { UserRole } from "../../common/constants/enums";

@Injectable()
export class PlatformService {
  private readonly logger = new Logger("PlatformService");

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

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

  /**
   * Retrieves all active platform tenants from the database.
   */
  async getTenants(user?: { sub?: string; role?: string; tenant_id?: string }) {
    this.logger.debug("Fetching active platform tenants from database");
    const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
    const tenantId = user?.tenant_id;

    const where: Prisma.TenantWhereInput = { isActive: true };
    if (!isSuperAdmin && tenantId) {
      where.id = tenantId;
    }

    return this.prisma.tenant.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        plan: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  /**
   * Provisions a new workspace tenant identity in PostgreSQL.
   */
  async createTenant(dto: CreateTenantDto) {
    const rawSlug =
      dto.slug ||
      dto.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    const slug = rawSlug || `tenant-${Date.now()}`;

    const existing = await this.prisma.tenant.findUnique({ where: { slug } });
    if (existing) {
      throw new BadRequestException(`Tenant with slug "${slug}" already exists`);
    }

    this.logger.log(`Provisioning new tenant: ${dto.name} (${slug})`);
    return this.prisma.tenant.create({
      data: {
        name: dto.name.trim(),
        slug,
        plan: dto.plan || "enterprise",
        isActive: true,
      },
    });
  }

  /**
   * Evaluates dynamic real-time platform telemetry and cluster component health.
   */
  async getSystemTelemetry(user?: { sub?: string; role?: string; tenant_id?: string }) {
    let dbConnected = false;
    let dbLatencyMs = 0;
    try {
      const dbStart = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      dbLatencyMs = Date.now() - dbStart;
      dbConnected = true;
    } catch (err) {
      this.logger.warn("Database health check ping failed:", err);
      dbConnected = false;
    }

    let redisConnected = false;
    let redisLatencyMs = 0;
    try {
      const redisStart = Date.now();
      const pong = await this.redis.getClient().ping();
      redisLatencyMs = Date.now() - redisStart;
      redisConnected = pong === "PONG";
    } catch (err) {
      this.logger.warn("Redis health check ping failed:", err);
      redisConnected = false;
    }

    let totalApps = 0;
    let activeApps = 0;
    let activeUsers = 0;
    if (dbConnected) {
      try {
        const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
        const tenantId = user?.tenant_id;
        const appWhere =
          !isSuperAdmin && tenantId
            ? { tenantId }
            : !isSuperAdmin
              ? { id: "00000000-0000-0000-0000-000000000000" }
              : {};
        const userWhere =
          !isSuperAdmin && tenantId
            ? { tenantId }
            : !isSuperAdmin
              ? { id: "00000000-0000-0000-0000-000000000000" }
              : {};
        [totalApps, activeApps, activeUsers] = await Promise.all([
          this.prisma.registeredApp.count({ where: appWhere }),
          this.prisma.registeredApp.count({ where: { ...appWhere, isActive: true } }),
          this.prisma.user.count({ where: { ...userWhere, isActive: true } }),
        ]);
      } catch {
        // Fallback gracefully on query error
      }
    }

    const port = Number(process.env.PORT) || 3015;
    const isProd = process.env.NODE_ENV === "production";
    const isStaging = process.env.NODE_ENV === "staging";
    const environmentLabel = isProd ? "Production" : isStaging ? "Staging" : "Local Dev";

    let status = "operational";
    let statusText = "All systems operational";
    if (!dbConnected && !redisConnected) {
      status = "outage";
      statusText = "Critical cluster outage";
    } else if (!dbConnected) {
      status = "degraded";
      statusText = "Database connection offline";
    } else if (!redisConnected) {
      status = "degraded";
      statusText = "Redis PubSub connection offline";
    }

    const version = process.env.npm_package_version
      ? `DevLab Portal v${process.env.npm_package_version}`
      : "DevLab Portal v2.0.0";

    return {
      status,
      statusText,
      apiPort: port,
      apiLabel: `API :${port}`,
      redisStatus: redisConnected ? "Redis PubSub active" : "Redis disconnected",
      isRedisHealthy: redisConnected,
      isDbHealthy: dbConnected,
      dbLatencyMs,
      redisLatencyMs,
      totalApps,
      activeApps,
      activeUsers,
      uptimeSeconds: Math.floor(process.uptime()),
      version,
      environment: process.env.NODE_ENV || "development",
      environmentLabel,
      docsUrl: process.env.DOCS_URL || "https://docs.devlab.io",
      docsLabel: "Documentation",
    };
  }
}
