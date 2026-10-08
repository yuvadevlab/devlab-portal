/**
 * @file apps/api/src/modules/apps/apps.module.ts
 * @description Module encapsulating application catalog, kill-switch controllers, and GraphQL resolvers.
 * @module @devlab/portal-api/apps
 */

import { Module } from "@nestjs/common";
import { AppsService } from "./apps.service.js";
import { AppsController } from "./apps.controller.js";
import { AppsResolver } from "./apps.resolver.js";
import { AuthModule } from "../auth/auth.module.js";
import { WebsocketModule } from "../websocket/websocket.module.js";

@Module({
  imports: [AuthModule, WebsocketModule],
  controllers: [AppsController],
  providers: [AppsService, AppsResolver],
  exports: [AppsService],
})
export class AppsModule {}
