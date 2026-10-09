/**
 * @file apps/api/src/modules/users/users.service.ts
 * @description User management and RBAC service.
 * @module @devlab/portal-api/users
 */

import { Injectable, ConflictException } from "@nestjs/common";
import bcrypt from "bcryptjs";
import { PrismaService } from "../../prisma/prisma.service.js";
import { CreateUserDto, UserRoleEnum } from "./dto/user.dto.js";
import { Logger } from "@yuva-devlab/logger";

@Injectable()
export class UsersService {
  private readonly logger = new Logger("UsersService");

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all users for team management.
   */
  async listUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  /**
   * Creates or invites a new team member.
   */
  async createUser(dto: CreateUserDto, actorId: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (existing) {
      throw new ConflictException(`User with email "${dto.email}" already exists`);
    }

    const tempPassword = "DevLab@TempPassword2026!";
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        name: dto.name,
        role: (dto.role as unknown as UserRoleEnum) || UserRoleEnum.DEVELOPER,
        passwordHash,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: "USER_INVITED",
        actorId,
        targetType: "user",
        targetId: user.id,
        metadata: { email: user.email, role: user.role },
      },
    });

    this.logger.info(`User "${user.email}" created with role "${user.role}" by actor "${actorId}"`);
    return user;
  }
}
