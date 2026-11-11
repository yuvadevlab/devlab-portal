/**
 * @file apps/api/src/modules/supervisor/supervisor.module.ts
 * @description NestJS module configuring process supervision controllers, service, and gateway.
 * @module @devlab/portal-api/supervisor
 */

import { Module } from "@nestjs/common";
import { SupervisorService } from "./supervisor.service";
import { SupervisorController } from "./supervisor.controller";
import { SupervisorGateway } from "./supervisor.gateway";

@Module({
  controllers: [SupervisorController],
  providers: [SupervisorService, SupervisorGateway],
  exports: [SupervisorService],
})
export class SupervisorModule {}
