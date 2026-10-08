/**
 * @file apps/api/src/prisma/prisma.service.ts
 * @description NestJS lifecycle service managing PostgreSQL connection pool and Prisma 7 client.
 * @module @devlab/portal-api/prisma
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { Logger } from "@yuva-devlab/logger";
import { createRequire } from "node:module";
import type { PrismaClient as PrismaClientType } from "@prisma/client";

const require = createRequire(import.meta.url);
const { PrismaClient: BasePrismaClient } = require("@prisma/client");

@Injectable()
export class PrismaService
  extends (BasePrismaClient as new (args: unknown) => PrismaClientType)
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger("PrismaService");
  private readonly pool: pg.Pool;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is required for PrismaService");
    }

    const pool = new pg.Pool({
      connectionString: databaseUrl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.pool = pool;
  }

  /**
   * Initializes PostgreSQL connection and verifies database connectivity on module boot.
   */
  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.info("Successfully connected to PostgreSQL database via pg driver adapter.");
    } catch (error) {
      this.logger.error("Failed to connect to PostgreSQL database during initialization", error);
      throw error;
    }
  }

  /**
   * Gracefully drains database connection pool on application shutdown.
   */
  async onModuleDestroy(): Promise<void> {
    this.logger.info("Draining PostgreSQL connection pool and disconnecting PrismaClient...");
    await this.$disconnect();
    await this.pool.end();
  }
}
