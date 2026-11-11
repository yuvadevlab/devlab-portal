/**
 * @file apps/api/src/modules/health/health.module.ts
 * @description Health check probe module.
 * @module @devlab/portal-api/health
 */

import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [HealthController],
})
export class HealthModule {}
