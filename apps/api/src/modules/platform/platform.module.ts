/**
 * @file apps/api/src/modules/platform/platform.module.ts
 * @description NestJS module binding platform configuration controller and services.
 * @module @devlab/portal-api/platform
 */

import { Module } from "@nestjs/common";
import { PlatformController } from "./platform.controller";
import { PlatformService } from "./platform.service";
import { PlatformAppStatusService } from "./platform-app-status.service";
import { RedisModule } from "../redis/redis.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [RedisModule, AuthModule],
  controllers: [PlatformController],
  providers: [PlatformService, PlatformAppStatusService],
  exports: [PlatformService, PlatformAppStatusService],
})
export class PlatformModule {}
