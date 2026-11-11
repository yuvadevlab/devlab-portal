/**
 * @file apps/api/src/modules/apps/apps.service.ts
 * @description Application registry service with health ping monitor and distributed kill-switch rail.
 * @module @devlab/portal-api/apps
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from "@nestjs/common";
import type { AppEnvironment, Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";
import { EventsGateway } from "../websocket/events.gateway";
import { CreateAppDto, UpdateAppSettingsDto, UpdateAppStatusDto } from "./dto/app.dto";
import { AuditAction, AuditTargetType, UserRole } from "../../common/constants/enums";
import { isValidUuid } from "@yuva-devlab/regex";
import { Logger } from "@yuva-devlab/logger";
import { probeAppHealth } from "./apps-health-checker";
import { buildAppUpdateData } from "./apps-update.helper";
import { provisionClientSecret } from "./apps-crypto.helper";
import { SupervisorService } from "../supervisor/supervisor.service";

@Injectable()
export class AppsService {
  private readonly logger = new Logger("AppsService");

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly eventsGateway: EventsGateway,
    private readonly supervisorService: SupervisorService,
  ) {}

  /**
   * Retrieves all registered applications and pings health URLs concurrently.
   */
  async listApps(user?: { sub?: string; role?: string; tenant_id?: string }) {
    const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
    const tenantId = user?.tenant_id;
    this.logger.info(
      `[listApps] Querying apps for actor=${user?.sub} (tenant=${tenantId || "all"})`,
    );

    if (!isSuperAdmin && !tenantId) return [];
    const where: Prisma.RegisteredAppWhereInput = isSuperAdmin ? {} : { tenantId };

    const apps = await this.prisma.registeredApp.findMany({ where, orderBy: { name: "asc" } });

    const results = await Promise.all(
      apps.map(async (app) => {
        const { latencyMs, healthStatus } = await probeAppHealth(app);
        return { ...app, latencyMs, healthStatus };
      }),
    );
    this.logger.info(`[listApps] Returning ${results.length} app(s) with health statuses`);
    return results;
  }

  /**
   * Finds a registered application by ID or unique appId.
   */
  async getApp(idOrAppId: string, user?: { sub?: string; role?: string; tenant_id?: string }) {
    this.logger.info(`[getApp] Looking up application "${idOrAppId}"`);
    const app = await this.prisma.registeredApp.findFirst({
      where: isValidUuid(idOrAppId)
        ? { OR: [{ id: idOrAppId }, { appId: idOrAppId }] }
        : { appId: idOrAppId },
    });
    if (!app) {
      this.logger.warn(`[getApp] Application "${idOrAppId}" not found`);
      throw new NotFoundException(`Application "${idOrAppId}" not found`);
    }
    const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
    if (!isSuperAdmin && app.tenantId && app.tenantId !== user?.tenant_id) {
      this.logger.warn(`[getApp] Forbidden access to "${app.appId}" for actor=${user?.sub}`);
      throw new ForbiddenException("You do not have permission to access this application");
    }
    this.logger.info(`[getApp] Found app "${app.name}" (${app.appId})`);
    return app;
  }

  /**
   * Registers a new application, provisions client credentials, and commits audit log.
   */
  async createApp(dto: CreateAppDto, actor: { sub: string; role?: string; tenant_id?: string }) {
    const start = Date.now();
    this.logger.info(
      `[createApp] Starting registration for appId="${dto.appId}" by actor=${actor.sub}`,
    );

    const existing = await this.prisma.registeredApp.findFirst({
      where: { OR: [{ appId: dto.appId }, { slug: dto.slug || dto.appId }] },
    });
    if (existing) {
      this.logger.warn(`[createApp] App with ID "${dto.appId}" or slug already exists`);
      throw new ConflictException(`App with ID "${dto.appId}" or slug already exists`);
    }

    const { rawSecret, secretHash } = await provisionClientSecret(dto.clientSecret);
    const slug = dto.slug || dto.appId.toLowerCase().replace(/[^a-z0-9_-]/g, "-");

    const app = await this.prisma.registeredApp.create({
      data: {
        appId: dto.appId,
        name: dto.name,
        slug,
        description: dto.description ?? null,
        iconUrl: dto.iconUrl ?? null,
        themeColor: dto.themeColor ?? "teal",
        originUrl: dto.originUrl,
        apiUrl: dto.apiUrl ?? null,
        callbackUrls:
          dto.callbackUrls && dto.callbackUrls.length > 0 ? dto.callbackUrls : [dto.originUrl],
        healthUrl:
          dto.healthUrl ||
          (dto.apiUrl ? `${dto.apiUrl}/api/v1/health` : `${dto.originUrl}/api/v1/health`),
        environment: (dto.environment as AppEnvironment) || "local_dev",
        isActive: true,
        clientSecretHash: secretHash,
        tenantId: actor.tenant_id ?? null,
        maintenanceNote: dto.maintenanceNote ?? null,
        workingDir: dto.workingDir ?? null,
        devCommand: dto.devCommand ?? "pnpm dev",
        buildCommand: dto.buildCommand ?? "pnpm build",
        startCommand: dto.startCommand ?? "pnpm start",
        envVars: dto.envVars ? JSON.parse(JSON.stringify(dto.envVars)) : undefined,
        dependsOn: dto.dependsOn ?? [],
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: AuditAction.APP_REGISTERED,
        actorId: actor.sub,
        targetType: AuditTargetType.APP,
        targetId: app.appId,
        metadata: { appId: app.appId, name: app.name, environment: app.environment },
      },
    });

    const duration = Date.now() - start;
    this.logger.info(
      `[createApp] App "${app.name}" registered in tenant="${actor.tenant_id ?? "none"}" (${duration}ms)`,
    );
    return { ...app, clientSecret: rawSecret };
  }

  /**
   * Updates application operational configuration.
   */
  async updateAppSettings(
    idOrAppId: string,
    dto: UpdateAppSettingsDto,
    actor: { sub: string; role?: string; tenant_id?: string },
  ) {
    const start = Date.now();
    this.logger.info(
      `[updateAppSettings] Modifying settings for app "${idOrAppId}" by actor=${actor.sub}`,
    );
    const app = await this.getApp(idOrAppId, actor);

    if (dto.appId && dto.appId !== app.appId) {
      const exists = await this.prisma.registeredApp.findUnique({ where: { appId: dto.appId } });
      if (exists && exists.id !== app.id) {
        this.logger.warn(`[updateAppSettings] Conflict: App ID "${dto.appId}" already registered`);
        throw new ConflictException(`App ID "${dto.appId}" is already registered`);
      }
    }

    if (dto.slug && dto.slug !== app.slug) {
      const exists = await this.prisma.registeredApp.findUnique({ where: { slug: dto.slug } });
      if (exists && exists.id !== app.id) {
        this.logger.warn(`[updateAppSettings] Conflict: Slug "${dto.slug}" already taken`);
        throw new ConflictException(`Slug "${dto.slug}" is already taken`);
      }
    }

    const updated = await this.prisma.registeredApp.update({
      where: { id: app.id },
      data: buildAppUpdateData(app, dto),
    });

    await this.prisma.auditLog.create({
      data: {
        action: AuditAction.APP_UPDATED,
        actorId: actor.sub,
        targetType: AuditTargetType.APP,
        targetId: updated.appId,
        metadata: JSON.parse(
          JSON.stringify({ appId: updated.appId, name: updated.name, changes: dto }),
        ),
      },
    });

    const duration = Date.now() - start;
    this.logger.info(
      `[updateAppSettings] App "${updated.appId}" settings updated successfully (${duration}ms)`,
    );
    return updated;
  }

  /**
   * Toggles the kill-switch (isActive) and broadcasts real-time events across Redis and WebSockets.
   */
  async updateAppStatus(
    idOrAppId: string,
    dto: UpdateAppStatusDto,
    actor: { sub: string; role?: string; tenant_id?: string },
  ) {
    const start = Date.now();
    this.logger.info(
      `[updateAppStatus] Setting app "${idOrAppId}" isActive=${dto.isActive} by actor=${actor.sub}`,
    );
    const app = await this.getApp(idOrAppId, actor);

    const updated = await this.prisma.registeredApp.update({
      where: { id: app.id },
      data: {
        isActive: dto.isActive,
        maintenanceNote: dto.maintenanceNote ?? null,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: dto.isActive ? AuditAction.APP_ACTIVATED : AuditAction.APP_DEACTIVATED,
        actorId: actor.sub,
        targetType: AuditTargetType.APP,
        targetId: app.appId,
        metadata: {
          appId: app.appId,
          name: app.name,
          previousState: app.isActive,
          newState: dto.isActive,
          maintenanceNote: dto.maintenanceNote,
        },
      },
    });

    const payload = {
      appId: app.appId,
      name: app.name,
      isActive: updated.isActive,
      maintenanceNote: updated.maintenanceNote,
      updatedAt: updated.updatedAt,
    };

    // When Kill Switch is engaged (isActive = false), immediately terminate the running process
    if (!dto.isActive) {
      this.logger.warn(
        `[updateAppStatus] Kill switch engaged for "${app.name}" (${app.appId}): terminating supervisor process`,
      );
      try {
        await this.supervisorService.stopProcess(app.appId, app.tenantId ?? actor.tenant_id, true);
      } catch (err) {
        this.logger.warn(
          `[updateAppStatus] Failed terminating supervisor process for "${app.appId}": ${(err as Error).message}`,
        );
      }
    }

    await this.redis.publish("app.state.changed", JSON.stringify(payload));
    this.eventsGateway.broadcastAppStateChanged(payload);

    const duration = Date.now() - start;
    this.logger.info(
      `[updateAppStatus] Kill-switch toggled for "${app.name}": isActive=${updated.isActive} (${duration}ms)`,
    );
    return updated;
  }
}
