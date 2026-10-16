/**
 * @file apps/api/src/modules/users/users.module.ts
 * @description Module encapsulating user management and team controllers.
 * @module @devlab/portal-api/users
 */

import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { AuthModule } from "../auth/auth.module";
import { RedisModule } from "../redis/redis.module";

@Module({
  imports: [AuthModule, RedisModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
