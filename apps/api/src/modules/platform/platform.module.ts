/**
 * @file apps/api/src/modules/platform/platform.module.ts
 * @description NestJS module binding platform configuration controller and services.
 * @module @devlab/portal-api/platform
 */

import { Module } from "@nestjs/common";
import { PlatformController } from "./platform.controller.js";
import { PlatformService } from "./platform.service.js";

@Module({
  controllers: [PlatformController],
  providers: [PlatformService],
  exports: [PlatformService],
})
export class PlatformModule {}
