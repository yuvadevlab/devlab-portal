/**
 * @file apps/api/src/modules/redis/redis.service.ts
 * @description NestJS Redis service providing shared command, pub, and sub instances with resilient degraded-mode fallback.
 * @module @devlab/portal-api/redis
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Redis } from "ioredis";
import { Logger } from "@yuva-devlab/logger";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger("RedisService");
  private client!: Redis;
  private publisher!: Redis;
  private subscriber!: Redis;
  private isConnected = false;

  /**
   * Initializes Redis command, publisher, and subscriber connections with degraded mode fallback.
   */
  async onModuleInit(): Promise<void> {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    this.logger.info(`Connecting to Redis at ${redisUrl}...`);

    const options = {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      retryStrategy: (times: number) => {
        if (times > 3) return null;
        return Math.min(times * 500, 2000);
      },
    };

    this.client = new Redis(redisUrl, options);
    this.publisher = new Redis(redisUrl, options);
    this.subscriber = new Redis(redisUrl, options);

    const errorHandler = (role: string) => (err: Error) => {
      this.logger.warn(`Redis ${role} client error: ${err.message}`);
    };
    this.client.on("error", errorHandler("command"));
    this.publisher.on("error", errorHandler("publisher"));
    this.subscriber.on("error", errorHandler("subscriber"));

    try {
      await Promise.all([
        this.client.connect(),
        this.publisher.connect(),
        this.subscriber.connect(),
      ]);
      this.isConnected = true;
      this.logger.info("Connected to Redis successfully.");
    } catch (error) {
      this.isConnected = false;
      this.logger.warn(
        `Redis connection failed during bootstrap (${error instanceof Error ? error.message : String(error)}). Operating in DEGRADED mode.`,
      );
    }
  }

  /**
   * Gracefully terminates all active Redis connections.
   */
  async onModuleDestroy(): Promise<void> {
    this.logger.info("Disconnecting Redis clients...");
    const safeQuit = async (client?: Redis) => {
      if (client && (client.status === "ready" || client.status === "connecting")) {
        try {
          await client.quit();
        } catch {
          client.disconnect();
        }
      }
    };
    await Promise.all([safeQuit(this.client), safeQuit(this.publisher), safeQuit(this.subscriber)]);
  }

  /** Returns whether Redis is actively reachable. */
  isAvailable(): boolean {
    return this.isConnected && this.client?.status === "ready";
  }

  /** Returns standard command execution Redis client. */
  getClient(): Redis {
    return this.client;
  }

  /** Returns dedicated pub client. */
  getPublisher(): Redis {
    return this.publisher;
  }

  /** Returns dedicated sub client. */
  getSubscriber(): Redis {
    return this.subscriber;
  }

  /**
   * Resiliently publishes a message to a Redis topic.
   */
  async publish(channel: string, message: string): Promise<number> {
    if (!this.isAvailable()) {
      this.logger.warn(`[publish] Redis unavailable — skipped publishing to "${channel}"`);
      return 0;
    }
    return this.publisher.publish(channel, message);
  }
}
