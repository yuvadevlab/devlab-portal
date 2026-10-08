/**
 * @file apps/api/src/modules/websocket/websocket.module.ts
 * @description Module encapsulating WebSocket events gateway and real-time pubsub infrastructure.
 * @module @devlab/portal-api/websocket
 */

import { Module } from "@nestjs/common";
import { EventsGateway } from "./events.gateway.js";

@Module({
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class WebsocketModule {}
