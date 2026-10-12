/**
 * @file apps/api/src/modules/apps/apps.module.ts
 * @description Module encapsulating application catalog, kill-switch controllers, and GraphQL resolvers.
 * @module @devlab/portal-api/apps
 */

import { Module } from "@nestjs/common";
import { AppsService } from "./apps.service";
import { AppsController } from "./apps.controller";
import { AppsResolver } from "./apps.resolver";
import { AuthModule } from "../auth/auth.module";
import { WebsocketModule } from "../websocket/websocket.module";

@Module({
  imports: [AuthModule, WebsocketModule],
  controllers: [AppsController],
  providers: [AppsService, AppsResolver],
  exports: [AppsService],
})
export class AppsModule {}
