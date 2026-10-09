/**
 * @file apps/api/src/modules/apps/apps.service.ts
 * @description Application registry service with health ping monitor and distributed kill-switch rail.
 * @module @devlab/portal-api/apps
 */

import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaService } from "../../prisma/prisma.service.js";
import { RedisService } from "../redis/redis.service.js";
import { EventsGateway } from "../websocket/events.gateway.js";
import { CreateAppDto, UpdateAppSettingsDto, UpdateAppStatusDto } from "./dto/app.dto.js";
import { Logger } from "@yuva-devlab/logger";

@Injectable()
export class AppsService {
  private readonly logger = new Logger("AppsService");

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  /**
   * Retrieves all registered applications and pings health URLs concurrently.
   */
  async listApps() {
    const apps = await this.prisma.registeredApp.findMany({
      orderBy: { name: "asc" },
    });

    return Promise.all(
      apps.map(async (app) => {
        let latencyMs = 0;
        let healthStatus = "healthy";

        if (app.isActive && app.healthUrl) {
          const start = Date.now();
          try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 1500);
            const response = await fetch(app.healthUrl, { signal: controller.signal });
            clearTimeout(timer);
            latencyMs = Date.now() - start;
            healthStatus = response.ok ? "healthy" : "degraded";
          } catch {
            healthStatus = "unreachable";
            latencyMs = -1;
          }
        } else if (!app.isActive) {
          healthStatus = "maintenance";
        }

        return { ...app, latencyMs, healthStatus };
      }),
    );
  }

  /**
   * Finds a registered application by ID or unique appId.
   */
  async getApp(idOrAppId: string) {
    const app = await this.prisma.registeredApp.findFirst({
      where: { OR: [{ id: idOrAppId }, { appId: idOrAppId }] },
    });
    if (!app) {
      throw new NotFoundException(`Application "${idOrAppId}" not found`);
    }
    return app;
  }

  /**
   * Registers a new application, provisions client credentials, and commits audit log.
   */
  async createApp(dto: CreateAppDto, actorId: string) {
    const existing = await this.prisma.registeredApp.findFirst({
      where: { OR: [{ appId: dto.appId }, { slug: dto.slug || dto.appId }] },
    });
    if (existing) {
      throw new ConflictException(`App with ID "${dto.appId}" or slug already exists`);
    }

    const rawSecret = dto.clientSecret || `dl_sec_${crypto.randomBytes(24).toString("hex")}`;
    const secretHash = await bcrypt.hash(rawSecret, 10);
    const slug = dto.slug || dto.appId.toLowerCase().replace(/[^a-z0-9_-]/g, "-");

    const app = await this.prisma.registeredApp.create({
      data: {
        appId: dto.appId,
        name: dto.name,
        slug,
        description: dto.description ?? null,
        iconUrl: dto.iconUrl ?? null,
        originUrl: dto.originUrl,
        callbackUrls:
          dto.callbackUrls && dto.callbackUrls.length > 0 ? dto.callbackUrls : [dto.originUrl],
        healthUrl: dto.healthUrl || `${dto.originUrl}/api/health`,
        environment: (dto.environment as any) || "local_dev",
        isActive: true,
        clientSecretHash: secretHash,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: "APP_REGISTERED",
        actorId,
        targetType: "registered_app",
        targetId: app.id,
        metadata: { appId: app.appId, name: app.name, environment: app.environment },
      },
    });

    this.logger.info(`App "${app.name}" registered by actor "${actorId}"`);
    return { ...app, clientSecret: rawSecret };
  }

  /**
   * Updates application operational configuration.
   */
  async updateAppSettings(idOrAppId: string, dto: UpdateAppSettingsDto, actorId: string) {
    const app = await this.getApp(idOrAppId);

    const updated = await this.prisma.registeredApp.update({
      where: { id: app.id },
      data: {
        name: dto.name ?? app.name,
        description: dto.description ?? app.description,
        originUrl: dto.originUrl ?? app.originUrl,
        callbackUrls: dto.callbackUrls ?? app.callbackUrls,
        healthUrl: dto.healthUrl ?? app.healthUrl,
        maintenanceNote:
          dto.maintenanceNote !== undefined ? dto.maintenanceNote : app.maintenanceNote,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: "APP_UPDATED",
        actorId,
        targetType: "registered_app",
        targetId: app.id,
        metadata: JSON.parse(JSON.stringify({ appId: app.appId, changes: dto })),
      },
    });

    return updated;
  }

  /**
   * Toggles the kill-switch (isActive) and broadcasts real-time events across Redis and WebSockets.
   */
  async updateAppStatus(idOrAppId: string, dto: UpdateAppStatusDto, actorId: string) {
    const app = await this.getApp(idOrAppId);

    const updated = await this.prisma.registeredApp.update({
      where: { id: app.id },
      data: {
        isActive: dto.isActive,
        maintenanceNote: dto.maintenanceNote ?? null,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: dto.isActive ? "APP_ACTIVATED" : "APP_DEACTIVATED",
        actorId,
        targetType: "registered_app",
        targetId: app.id,
        metadata: {
          appId: app.appId,
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

    await this.redis.publish("app.state.changed", JSON.stringify(payload));
    this.eventsGateway.broadcastAppStateChanged(payload);

    this.logger.info(`Kill-switch toggled for "${app.name}": isActive=${updated.isActive}`);

    return updated;
  }
}
