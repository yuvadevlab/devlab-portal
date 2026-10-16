/**
 * @file apps/api/src/modules/auth/auth.service.ts
 * @description OIDC token issuer, user authentication, and registration handler.
 * @module @devlab/portal-api/auth
 */

import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";
import { KeypairService } from "./keys/keypair.service";
import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto } from "./dto/auth.dto";
import { UserRole } from "../../common/constants/enums";
import { buildResetPasswordUrl } from "../../common/constants/routes";
import { Logger } from "@yuva-devlab/logger";

@Injectable()
export class AuthService {
  private readonly logger = new Logger("AuthService");

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly keypairService: KeypairService,
  ) {}

  /**
   * Validates user credentials and returns active user record with tenant context.
   */
  async validateUser(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
      include: { tenant: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException("Invalid credentials or account deactivated");
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return user;
  }

  /**
   * Issues RS256 access token for authenticated portal user with tenant claims.
   */
  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    const token = await this.keypairService.signJwt(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenant_id: user.tenantId,
        tenant_slug: user.tenant?.slug,
        tenant_name: user.tenant?.name,
        type: "user_session",
      },
      { expiresIn: "8h", subject: user.id },
    );

    return {
      accessToken: token,
      tokenType: "Bearer",
      expiresIn: 28800,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
        tenantSlug: user.tenant?.slug,
        tenantName: user.tenant?.name,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  /**
   * Registers a new user into the active workspace tenant.
   */
  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new BadRequestException("An account with this email already exists");
    }

    let tenantId = dto.tenantId;
    if (!tenantId) {
      const defaultTenant = await this.prisma.tenant.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      });
      tenantId = defaultTenant?.id;
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email,
        passwordHash,
        role: UserRole.DEVELOPER,
        isActive: true,
        tenantId,
      },
      include: { tenant: true },
    });

    const token = await this.keypairService.signJwt(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenant_id: user.tenantId,
        tenant_slug: user.tenant?.slug,
        tenant_name: user.tenant?.name,
        type: "user_session",
      },
      { expiresIn: "8h", subject: user.id },
    );

    return {
      accessToken: token,
      tokenType: "Bearer",
      expiresIn: 28800,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
        tenantSlug: user.tenant?.slug,
        tenantName: user.tenant?.name,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  /**
   * Generates a 15-minute password reset recovery token stored in Redis.
   */
  async forgotPassword(dto: ForgotPasswordDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.isActive) {
      return { success: true, message: "If an account exists, a reset link will be sent." };
    }

    const token = crypto.randomBytes(32).toString("hex");
    await this.redis.getClient().set(`auth:reset:${token}`, user.id, "EX", 900);
    this.logger.log(`Password reset token issued for user ${user.id}`);

    const isDev = process.env.NODE_ENV !== "production";
    const resetUrl = buildResetPasswordUrl({ token });

    return {
      success: true,
      message: "If an account exists, a reset link will be sent.",
      resetToken: isDev ? token : undefined,
      resetUrl: isDev ? resetUrl : undefined,
    };
  }

  /**
   * Resets password using valid one-time token from Redis.
   */
  async resetPassword(dto: ResetPasswordDto) {
    const key = `auth:reset:${dto.token}`;
    const userId = await this.redis.getClient().get(key);
    if (!userId) {
      throw new BadRequestException("Password reset link is invalid or has expired");
    }

    await this.redis.getClient().del(key);
    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { success: true, message: "Password updated successfully" };
  }

  /**
   * Retrieves active user by primary ID with tenant context.
   */
  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        tenantId: true,
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        avatarUrl: true,
        isActive: true,
        createdAt: true,
      },
    });
  }
}
