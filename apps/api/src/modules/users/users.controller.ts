/**
 * @file apps/api/src/modules/users/users.controller.ts
 * @description REST endpoints for team member querying and invitations.
 * @module @devlab/portal-api/users
 */

import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "./users.service.js";
import { AuthGuard } from "../auth/auth.guard.js";
import { CreateUserDto } from "./dto/user.dto.js";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";

@Controller("api/v1/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Lists all users in the organization.
   */
  @Get()
  @UseGuards(AuthGuard)
  async listUsers() {
    return this.usersService.listUsers();
  }

  /**
   * Invites a new team member.
   */
  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserDto, @CurrentUser() user: { sub: string }) {
    if (!user?.sub) {
      throw new UnauthorizedException("Authenticated user identifier is required");
    }
    return this.usersService.createUser(dto, user.sub);
  }
}
