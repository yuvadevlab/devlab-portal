/**
 * @file apps/api/src/modules/users/users.service.ts
 * @description User management and RBAC service.
 * @module @devlab/portal-api/users
 */

import { Injectable, ConflictException, ForbiddenException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaService } from "../../prisma/prisma.service";
import crypto from "crypto";
import { CreateUserDto, UserRoleEnum } from "./dto/user.dto";
import { UserRole, AuditAction, AuditTargetType } from "../../common/constants/enums";
import { buildResetPasswordUrl } from "../../common/constants/routes";
import { RedisService } from "../redis/redis.service";
import { Logger } from "@yuva-devlab/logger";

@Injectable()
export class UsersService {
  private readonly logger = new Logger("UsersService");

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Retrieves all users for team management.
   */
  async listUsers(user?: { sub: string; role?: string; tenant_id?: string }) {
    const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
    const tenantId = user?.tenant_id;

    const where: Prisma.UserWhereInput = {};
    if (!isSuperAdmin) {
      if (tenantId) {
        where.tenantId = tenantId;
      } else if (user?.sub) {
        where.id = user.sub;
      } else {
        return [];
      }
    }

    return this.prisma.user.findMany({
      where,
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
  async createUser(dto: CreateUserDto, actor: { sub: string; role?: string; tenant_id?: string }) {
    const isSuperAdmin = actor.role === UserRole.SUPER_ADMIN;
    const isAdmin = actor.role === UserRole.ADMIN;
    if (!isSuperAdmin && !isAdmin) {
      throw new ForbiddenException("Only organization administrators can invite new members");
    }

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
        role:
          (dto.role as unknown as UserRoleEnum) || (UserRole.DEVELOPER as unknown as UserRoleEnum),
        passwordHash,
        isActive: true,
        tenantId: actor.tenant_id ?? null,
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
        action: AuditAction.USER_INVITED,
        actorId: actor.sub,
        targetType: AuditTargetType.USER,
        targetId: user.id,
        metadata: { email: user.email, role: user.role, tenantId: actor.tenant_id },
      },
    });

    this.logger.info(
      `User "${user.email}" created with role "${user.role}" by actor "${actor.sub}" in tenant "${actor.tenant_id ?? "none"}"`,
    );

    // In dev / local environment, issue one-time onboarding link for UI display
    const inviteToken = crypto.randomBytes(32).toString("hex");
    await this.redis.getClient().set(`auth:reset:${inviteToken}`, user.id, "EX", 86400 * 7);
    const inviteUrl = buildResetPasswordUrl({ token: inviteToken, welcome: true });

    return {
      ...user,
      inviteToken,
      inviteUrl,
    };
  }
}
