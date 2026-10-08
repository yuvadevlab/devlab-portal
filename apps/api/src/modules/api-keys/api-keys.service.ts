/**
 * @file apps/api/src/modules/api-keys/api-keys.service.ts
 * @description Manages generation, SHA-256 storage, Redis caching, and verification of scoped API keys.
 * @module @devlab/portal-api/api-keys
 */

import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import crypto from "node:crypto";
import { PrismaService } from "../../prisma/prisma.service.js";
import { RedisService } from "../redis/redis.service.js";
import { CreateApiKeyDto } from "./dto/api-key.dto.js";
import { Logger } from "@yuva-devlab/logger";

@Injectable()
export class ApiKeysService {
  private readonly logger = new Logger("ApiKeysService");

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Generates a new high-entropy API key, stores SHA-256 hash, and returns raw key once.
   */
  async createApiKey(userId: string, dto: CreateApiKeyDto) {
    const app = await this.prisma.registeredApp.findFirst({
      where: { OR: [{ id: dto.appId }, { appId: dto.appId }] },
    });

    if (!app) {
      throw new NotFoundException(`Registered app '${dto.appId}' not found`);
    }

    const env = process.env.NODE_ENV === "production" ? "live" : "dev";
    const randomEntropy = crypto.randomBytes(24).toString("hex");
    const rawKey = `dlk_${env}_${randomEntropy}`;
    const keyPrefix = `dlk_${env}_${randomEntropy.slice(0, 6)}...`;
    const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");

    const record = await this.prisma.apiKey.create({
      data: {
        name: dto.name,
        keyPrefix,
        keyHash,
        appId: app.id,
        userId,
        scopes: dto.scopes,
        rateLimitRpm: dto.rateLimitRpm ?? 600,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });

    // Record audit event
    await this.prisma.auditLog.create({
      data: {
        action: "API_KEY_CREATED",
        actorId: userId,
        targetType: "api_key",
        targetId: record.id,
        metadata: { name: record.name, appId: app.appId, scopes: record.scopes },
      },
    });

    this.logger.info(`Created API key '${record.name}' for app '${app.name}'`);

    return {
      ...record,
      rawKey,
    };
  }

  /**
   * Retrieves all non-revoked API keys, optionally filtered by application.
   */
  async listApiKeys(appId?: string) {
    return this.prisma.apiKey.findMany({
      where: {
        ...(appId ? { app: { OR: [{ id: appId }, { appId }] } } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Revokes an existing API key and evicts any active cache.
   */
  async revokeApiKey(id: string, actorId: string) {
    const key = await this.prisma.apiKey.findUnique({ where: { id } });
    if (!key) {
      throw new NotFoundException(`API key '${id}' not found`);
    }

    const updated = await this.prisma.apiKey.update({
      where: { id },
      data: { isRevoked: true },
    });

    // Evict from Redis
    await this.redis.getClient().del(`api_key:${key.keyHash}`);

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        action: "API_KEY_REVOKED",
        actorId,
        targetType: "api_key",
        targetId: id,
        metadata: { name: key.name },
      },
    });

    this.logger.info(`Revoked API key '${key.name}' (${id})`);
    return updated;
  }

  /**
   * Validates raw API key with Redis caching layer.
   */
  async validateApiKey(rawKey: string) {
    if (!rawKey || !rawKey.startsWith("dlk_")) {
      return { valid: false, reason: "Malformed API key format" };
    }

    const keyHash = crypto.createHash("sha256").update(rawKey.trim()).digest("hex");
    const cacheKey = `api_key:${keyHash}`;

    // 1. Check Redis cache
    const cached = await this.redis.getClient().get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // 2. Query Database
    const record = await this.prisma.apiKey.findUnique({
      where: { keyHash },
      include: { app: true },
    });

    if (!record) {
      return { valid: false, reason: "API key does not exist" };
    }

    if (record.isRevoked) {
      return { valid: false, reason: "API key has been revoked" };
    }

    if (record.expiresAt && new Date() > record.expiresAt) {
      return { valid: false, reason: "API key has expired" };
    }

    if (!record.app.isActive) {
      return { valid: false, reason: `Target app '${record.app.name}' is currently deactivated` };
    }

    // Update last used asynchronously
    void this.prisma.apiKey.update({
      where: { id: record.id },
      data: { lastUsedAt: new Date() },
    });

    const result = {
      valid: true,
      keyId: record.id,
      name: record.name,
      appId: record.app.appId,
      appName: record.app.name,
      scopes: record.scopes,
      rateLimitRpm: record.rateLimitRpm,
    };

    // Cache valid key for 300 seconds (5 min)
    await this.redis.getClient().set(cacheKey, JSON.stringify(result), "EX", 300);

    return result;
  }
}
