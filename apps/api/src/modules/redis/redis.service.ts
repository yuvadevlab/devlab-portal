/**
 * @file apps/api/src/modules/redis/redis.service.ts
 * @description NestJS Redis service providing shared command, pub, and sub instances.
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

  /**
   * Initializes Redis command, publisher, and subscriber connections.
   */
  async onModuleInit(): Promise<void> {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    this.logger.info(`Connecting to Redis at ${redisUrl}...`);

    this.client = new Redis(redisUrl, { lazyConnect: true, maxRetriesPerRequest: 3 });
    this.publisher = new Redis(redisUrl, { lazyConnect: true, maxRetriesPerRequest: 3 });
    this.subscriber = new Redis(redisUrl, { lazyConnect: true, maxRetriesPerRequest: 3 });

    try {
      await Promise.all([
        this.client.connect(),
        this.publisher.connect(),
        this.subscriber.connect(),
      ]);
      this.logger.info("Connected to Redis successfully.");
    } catch (error) {
      this.logger.error("Failed to connect to Redis during bootstrap", error);
      throw error;
    }
  }

  /**
   * Gracefully terminates all active Redis connections.
   */
  async onModuleDestroy(): Promise<void> {
    this.logger.info("Disconnecting Redis clients...");
    await Promise.all([this.client?.quit(), this.publisher?.quit(), this.subscriber?.quit()]);
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
   * Publishes message to a Redis topic.
   */
  async publish(channel: string, message: string): Promise<number> {
    return this.publisher.publish(channel, message);
  }
}
