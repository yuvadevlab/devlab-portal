/**
 * @file apps/api/src/modules/apps/apps.service.ts
 * @description Application registry service with health ping monitor and distributed kill-switch rail.
 * @module @devlab/portal-api/apps
 */

import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { RedisService } from "../redis/redis.service.js";
import { EventsGateway } from "../websocket/events.gateway.js";
import { UpdateAppStatusDto } from "./dto/app.dto.js";
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

    const results = await Promise.all(
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

        return {
          ...app,
          latencyMs,
          healthStatus,
        };
      }),
    );

    return results;
  }

  /**
   * Finds a registered application by ID or unique appId.
   */
  async getApp(idOrAppId: string) {
    const app = await this.prisma.registeredApp.findFirst({
      where: { OR: [{ id: idOrAppId }, { appId: idOrAppId }] },
    });
    if (!app) {
      throw new NotFoundException(`Application '${idOrAppId}' not found`);
    }
    return app;
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

    // 1. Audit Log record
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

    // 2. Broadcast to Redis Pub/Sub topic
    await this.redis.publish("app.state.changed", JSON.stringify(payload));

    // 3. Emit directly via WebSocket gateway
    this.eventsGateway.broadcastAppStateChanged(payload);

    this.logger.info(
      `Kill-switch toggled for '${app.name}': isActive=${updated.isActive} (Note: '${updated.maintenanceNote || "None"}')`,
    );

    return updated;
  }
}
