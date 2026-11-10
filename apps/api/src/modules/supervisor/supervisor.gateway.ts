/**
 * @file apps/api/src/modules/supervisor/supervisor.gateway.ts
 * @description WebSocket gateway broadcasting live process state changes and log streaming.
 * @module @devlab/portal-api/supervisor
 */

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { SupervisorService } from "./supervisor.service";
import type { ProcessStatus, ProcessLogEntry } from "@yuva-devlab/supervisor";
import { Logger } from "@yuva-devlab/logger";

@Injectable()
@WebSocketGateway({
  cors: { origin: "*" },
  path: "/supervisor-events",
})
export class SupervisorGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  private readonly logger = new Logger("SupervisorGateway");

  @WebSocketServer()
  server!: Server;

  constructor(private readonly supervisorService: SupervisorService) {}

  afterInit() {
    this.logger.info("Supervisor WebSocket Gateway initialized at /supervisor-events");
  }

  handleConnection(client: Socket) {
    this.logger.debug(`Supervisor WS client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Supervisor WS client disconnected: ${client.id}`);
  }

  /**
   * Attaches listeners to supervisor events and relays to Socket.IO clients.
   */
  onModuleInit(): void {
    this.supervisorService.onStateChange((status: ProcessStatus) => {
      if (this.server) {
        this.server.emit("supervisor:state", status);
        this.server.to(`process:${status.appId}`).emit("process:state", status);
      }
    });

    this.supervisorService.onLog((entry: ProcessLogEntry) => {
      if (this.server) {
        this.server.to(`process:${entry.appId}`).emit("process:log", entry);
        this.server.emit("supervisor:log", entry);
      }
    });
  }

  /**
   * Allows clients to subscribe to specific process log streams.
   */
  @SubscribeMessage("subscribe:logs")
  handleSubscribeLogs(@ConnectedSocket() client: Socket, @MessageBody() data: { appId: string }) {
    if (data?.appId) {
      const room = `process:${data.appId}`;
      client.join(room);
      this.logger.debug(`Client ${client.id} joined room ${room}`);
      return { status: "subscribed", appId: data.appId };
    }
    return { status: "error", message: "Missing appId" };
  }

  /**
   * Allows clients to unsubscribe from specific process log streams.
   */
  @SubscribeMessage("unsubscribe:logs")
  handleUnsubscribeLogs(@ConnectedSocket() client: Socket, @MessageBody() data: { appId: string }) {
    if (data?.appId) {
      const room = `process:${data.appId}`;
      client.leave(room);
      this.logger.debug(`Client ${client.id} left room ${room}`);
      return { status: "unsubscribed", appId: data.appId };
    }
    return { status: "error", message: "Missing appId" };
  }
}
