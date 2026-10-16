/**
 * @file apps/api/src/app.module.ts
 * @description Root module binding Apollo GraphQL, Prisma, Redis, OIDC, App Registry, and WebSocket gateway.
 * @module @devlab/portal-api
 */

import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { PrismaModule } from "./prisma/prisma.module";
import { RedisModule } from "./modules/redis/redis.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AppsModule } from "./modules/apps/apps.module";
import { ApiKeysModule } from "./modules/api-keys/api-keys.module";
import { AuditModule } from "./modules/audit/audit.module";
import { WebsocketModule } from "./modules/websocket/websocket.module";
import { UsersModule } from "./modules/users/users.module";
import { PlatformModule } from "./modules/platform/platform.module";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      subscriptions: {
        "graphql-ws": true,
      },
      playground: true,
      context: ({ req, res }: { req: unknown; res: unknown }) => ({ req, res }),
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    AppsModule,
    ApiKeysModule,
    AuditModule,
    WebsocketModule,
    UsersModule,
    PlatformModule,
  ],
})
export class AppModule {}
