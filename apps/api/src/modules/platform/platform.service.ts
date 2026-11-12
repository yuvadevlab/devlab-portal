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
    this.logger.info("[getNavigationItems] Querying enabled navigation items");
    const items = await this.prisma.navigationItem.findMany({
      where: { isEnabled: true },
      orderBy: { order: "asc" },
    });
    this.logger.info(`[getNavigationItems] Found ${items.length} navigation item(s)`);
    return items;
  }

  /**
   * Retrieves all active platform tenants from the database.
   */
  async getTenants(user?: { sub?: string; role?: string; tenant_id?: string }) {
    const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
    const tenantId = user?.tenant_id;
    this.logger.info(
      `[getTenants] Querying tenants for actor=${user?.sub} (tenant=${tenantId || "all"})`,
    );

    const where: Prisma.TenantWhereInput = { isActive: true };
    if (!isSuperAdmin && tenantId) {
      where.id = tenantId;
    }

    const tenants = await this.prisma.tenant.findMany({
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
    this.logger.info(`[getTenants] Found ${tenants.length} active tenant(s)`);
    return tenants;
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

    this.logger.info(`[createTenant] Attempting to provision tenant: ${dto.name} (${slug})`);
    const existing = await this.prisma.tenant.findUnique({ where: { slug } });
    if (existing) {
      this.logger.warn(`[createTenant] Tenant with slug "${slug}" already exists`);
      throw new BadRequestException(`Tenant with slug "${slug}" already exists`);
    }

    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.name.trim(),
        slug,
        plan: dto.plan || "enterprise",
        isActive: true,
      },
    });
    this.logger.info(
      `[createTenant] Tenant "${tenant.name}" (${tenant.id}) provisioned successfully`,
    );

    await this.redis.publish(
      "tenant.events",
      JSON.stringify({
        event: "tenant.created",
        tenantId: tenant.id,
        slug: tenant.slug,
        name: tenant.name,
        plan: tenant.plan,
        timestamp: new Date().toISOString(),
      }),
    );

    return tenant;
  }

  /**
   * Evaluates dynamic real-time platform telemetry and cluster component health.
   */
  async getSystemTelemetry(user?: { sub?: string; role?: string; tenant_id?: string }) {
    this.logger.info(
      `[getSystemTelemetry] Evaluating platform cluster telemetry for actor=${user?.sub}`,
    );
    let dbConnected = false;
    let dbLatencyMs = 0;
    try {
      const dbStart = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      dbLatencyMs = Date.now() - dbStart;
      dbConnected = true;
    } catch (err) {
      this.logger.warn(`[getSystemTelemetry] Database ping failed: ${(err as Error).message}`);
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
      this.logger.warn(`[getSystemTelemetry] Redis ping failed: ${(err as Error).message}`);
      redisConnected = false;
    }

    let totalApps = 0;
    let activeApps = 0;
    let activeUsers = 0;
    if (dbConnected) {
      try {
        const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
        const tenantId = user?.tenant_id;
        const appWhere = tenantId && !isSuperAdmin ? { tenantId } : {};
        const userWhere = tenantId && !isSuperAdmin ? { tenantId } : {};
        [totalApps, activeApps, activeUsers] = await Promise.all([
          this.prisma.registeredApp.count({ where: appWhere }),
          this.prisma.registeredApp.count({ where: { ...appWhere, isActive: true } }),
          this.prisma.user.count({ where: { ...userWhere, isActive: true } }),
        ]);
      } catch {
        // Fallback gracefully on query error
      }
    }

    const port = Number(process.env.PORT) || 4000;
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

    this.logger.info(
      `[getSystemTelemetry] Cluster status="${status}" dbLatency=${dbLatencyMs}ms redisLatency=${redisLatencyMs}ms`,
    );

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
      latencyMs: dbLatencyMs + redisLatencyMs,
      totalApps,
      activeApps,
      activeUsers,
      uptimeSeconds: Math.floor(process.uptime()),
      version,
      environment: process.env.NODE_ENV || "development",
      environmentLabel,
      docsUrl: process.env.DOCS_URL || undefined,
      docsLabel: "Documentation",
    };
  }
}
