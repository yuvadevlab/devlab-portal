/**
 * @file apps/api/src/modules/users/users.module.ts
 * @description Module encapsulating user management and team controllers.
 * @module @devlab/portal-api/users
 */

import { Module } from "@nestjs/common";
import { UsersService } from "./users.service.js";
import { UsersController } from "./users.controller.js";
import { AuthModule } from "../auth/auth.module.js";

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
