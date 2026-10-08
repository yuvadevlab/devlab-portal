/**
 * @file apps/api/src/modules/websocket/events.gateway.ts
 * @description WebSocket gateway broadcasting real-time application health pings and kill-switch state events.
 * @module @devlab/portal-api/websocket
 */

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { RedisService } from "../redis/redis.service.js";
import { Logger } from "@yuva-devlab/logger";

@Injectable()
@WebSocketGateway({
  cors: { origin: "*" },
  path: "/events",
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  private readonly logger = new Logger("EventsGateway");

  @WebSocketServer()
  server!: Server;

  constructor(private readonly redis: RedisService) {}

  afterInit() {
    this.logger.info("Socket.IO Events Gateway initialized at /events");
  }

  handleConnection(client: Socket) {
    this.logger.info(`WebSocket client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.info(`WebSocket client disconnected: ${client.id}`);
  }

  /**
   * Subscribes to Redis Pub/Sub topic to relay distributed state updates to connected browsers.
   */
  async onModuleInit(): Promise<void> {
    const subscriber = this.redis.getSubscriber();
    await subscriber.subscribe("app.state.changed", (err) => {
      if (err) {
        this.logger.error("Failed to subscribe to 'app.state.changed' Redis channel", err);
      } else {
        this.logger.info("Subscribed to Redis channel: 'app.state.changed'");
      }
    });

    subscriber.on("message", (channel, message) => {
      if (channel === "app.state.changed") {
        try {
          const payload = JSON.parse(message);
          this.server?.emit("app.state.changed", payload);
          this.logger.info(
            `Broadcasted app.state.changed event for '${payload.appId}' to Web clients`,
          );
        } catch (err) {
          this.logger.error("Failed to parse app.state.changed message", err);
        }
      }
    });
  }

  /**
   * Directly broadcasts state changed event over WebSocket channel.
   */
  broadcastAppStateChanged(payload: Record<string, unknown>) {
    if (this.server) {
      this.server.emit("app.state.changed", payload);
    }
  }
}
