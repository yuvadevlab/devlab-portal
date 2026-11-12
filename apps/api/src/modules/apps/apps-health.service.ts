/**
 * @file apps/api/src/modules/apps/apps-health.service.ts
 * @description Background application health polling service with Redis & in-memory caching.
 * @module @devlab/portal-api/apps
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";
import { Logger } from "@yuva-devlab/logger";
import { probeAppHealth, AppHealthResult } from "./apps-health-checker";

@Injectable()
export class AppsHealthService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger("AppsHealthService");
  private readonly cache = new Map<string, AppHealthResult>();
  private timer: NodeJS.Timeout | null = null;
  private isPolling = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Starts background health check polling cycle upon module initialization.
   */
  onModuleInit(): void {
    setTimeout(() => void this.poll(), 2000);
    this.timer = setInterval(() => void this.poll(), 20000);
    this.logger.info("Background health poller started (20s interval)");
  }

  /**
   * Cleans up background interval timer on module teardown.
   */
  onModuleDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Runs one full health evaluation sweep across all active registered apps.
   */
  async poll(): Promise<void> {
    if (this.isPolling) return;
    this.isPolling = true;
    try {
      const apps = await this.prisma.registeredApp.findMany({
        where: { isActive: true },
        select: { id: true, appId: true, isActive: true, healthUrl: true },
      });

      await Promise.all(
        apps.map(async (app) => {
          const result = await probeAppHealth(app);
          this.cache.set(app.id, result);
          this.cache.set(app.appId, result);

          if (this.redis.isAvailable()) {
            try {
              await this.redis
                .getClient()
                .set(`app:health:${app.appId}`, JSON.stringify(result), "EX", 60);
            } catch (err) {
              this.logger.warn(
                `Redis cache write failed for ${app.appId}: ${(err as Error).message}`,
              );
            }
          }
        }),
      );
    } catch (err) {
      this.logger.warn(`Health polling sweep failed: ${(err as Error).message}`);
    } finally {
      this.isPolling = false;
    }
  }

  /**
   * Returns cached health for an app, falling back to Redis or live probe.
   */
  async getHealth(app: {
    id: string;
    appId: string;
    isActive: boolean;
    healthUrl?: string | null;
  }): Promise<AppHealthResult> {
    const cached = this.cache.get(app.id) || this.cache.get(app.appId);
    if (cached) return cached;

    if (this.redis.isAvailable()) {
      try {
        const raw = await this.redis.getClient().get(`app:health:${app.appId}`);
        if (raw) {
          const parsed = JSON.parse(raw) as AppHealthResult;
          this.cache.set(app.id, parsed);
          this.cache.set(app.appId, parsed);
          return parsed;
        }
      } catch {
        // Fall back to live probe
      }
    }

    const fresh = await probeAppHealth(app);
    this.cache.set(app.id, fresh);
    this.cache.set(app.appId, fresh);
    return fresh;
  }
}
