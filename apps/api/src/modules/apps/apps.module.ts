/**
 * @file apps/api/src/modules/apps/apps.module.ts
 * @description Module encapsulating application catalog, kill-switch controllers, and GraphQL resolvers.
 * @module @devlab/portal-api/apps
 */

import { Module } from "@nestjs/common";
import { AppsService } from "./apps.service";
import { AppsHealthService } from "./apps-health.service";
import { AppsController } from "./apps.controller";
import { AppsResolver } from "./apps.resolver";
import { AuthModule } from "../auth/auth.module";
import { WebsocketModule } from "../websocket/websocket.module";
import { SupervisorModule } from "../supervisor/supervisor.module";

@Module({
  imports: [AuthModule, WebsocketModule, SupervisorModule],
  controllers: [AppsController],
  providers: [AppsService, AppsHealthService, AppsResolver],
  exports: [AppsService, AppsHealthService],
})
export class AppsModule {}
