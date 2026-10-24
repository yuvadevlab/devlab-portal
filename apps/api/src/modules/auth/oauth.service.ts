/**
 * @file apps/api/src/modules/auth/oauth.service.ts
 * @description OAuth2 authorization code handler and PKCE token exchange service.
 * @module @devlab/portal-api/auth
 */

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";
import { KeypairService } from "./keys/keypair.service";
import { AuthorizeDto, TokenDto } from "./dto/auth.dto";
import { Logger } from "@yuva-devlab/logger";
import { UserRole, AppAccessScope } from "../../common/constants/enums";
import { isValidUuid } from "@yuva-devlab/regex";

@Injectable()
export class OAuthService {
  private readonly logger = new Logger("OAuthService");

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly keypairService: KeypairService,
  ) {}

  /**
   * Generates authorization code for OIDC PKCE flow.
   */
  async authorize(dto: AuthorizeDto, userId: string) {
    const app = await this.prisma.registeredApp.findFirst({
      where: isValidUuid(dto.client_id)
        ? { OR: [{ appId: dto.client_id }, { id: dto.client_id }] }
        : { appId: dto.client_id },
    });

    if (!app || !app.isActive) {
      throw new NotFoundException(`Application ${dto.client_id} not found or inactive`);
    }

    const isAllowedCallback = app.callbackUrls.includes(dto.redirect_uri);
    if (!isAllowedCallback) {
      throw new BadRequestException(`Redirect URI ${dto.redirect_uri} is not registered`);
    }

    // Verify user identity and app-specific entitlements
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException("User is inactive or not found");
    }

    // Super admins and administrators inherit global access across all ecosystem applications
    const isPrivileged = user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;
    // Standard members must be explicitly assigned to the requesting app or have wildcard access
    const hasAppAccess =
      isPrivileged ||
      user.allowedApps.includes(app.appId) ||
      user.allowedApps.includes(AppAccessScope.ALL);

    if (!hasAppAccess) {
      this.logger.warn(
        `[authorize] Access denied for user ${user.id} (${user.email}) to app ${app.appId}`,
      );
      throw new ForbiddenException(
        `Access denied: You do not have permissions to access ${app.name || app.appId}. Contact your administrator.`,
      );
    }

    const code = `dlc_${crypto.randomBytes(24).toString("hex")}`;
    const codePayload = JSON.stringify({
      userId,
      appId: app.appId,
      redirectUri: dto.redirect_uri,
      codeChallenge: dto.code_challenge,
      codeChallengeMethod: dto.code_challenge_method || "S256",
    });

    await this.redis.getClient().set(`oauth:code:${code}`, codePayload, "EX", 300);

    const redirect = new URL(dto.redirect_uri);
    redirect.searchParams.set("code", code);
    if (dto.state) {
      redirect.searchParams.set("state", dto.state);
    }

    return { code, redirectUrl: redirect.toString() };
  }

  /**
   * Exchanges authorization code or client credentials for RS256 tokens.
   */
  async exchangeToken(dto: TokenDto) {
    if (dto.grant_type === "authorization_code") {
      return this.handleAuthorizationCode(dto);
    }
    if (dto.grant_type === "client_credentials") {
      return this.handleClientCredentials(dto);
    }
    throw new BadRequestException(`Unsupported grant_type: ${dto.grant_type}`);
  }

  private async handleAuthorizationCode(dto: TokenDto) {
    if (!dto.code) {
      throw new BadRequestException("Authorization code is required");
    }

    const key = `oauth:code:${dto.code}`;
    const cached = await this.redis.getClient().get(key);
    if (!cached) {
      throw new UnauthorizedException("Authorization code expired or invalid");
    }

    await this.redis.getClient().del(key);
    const data = JSON.parse(cached);

    if (dto.redirect_uri && dto.redirect_uri !== data.redirectUri) {
      throw new BadRequestException("Redirect URI mismatch");
    }

    if (data.codeChallenge) {
      if (!dto.code_verifier) {
        throw new BadRequestException("code_verifier required for PKCE exchange");
      }
      const hashed = crypto.createHash("sha256").update(dto.code_verifier).digest("base64url");
      if (hashed !== data.codeChallenge && dto.code_verifier !== data.codeChallenge) {
        throw new UnauthorizedException("PKCE verification failed");
      }
    }

    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
      include: { tenant: true },
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException("User associated with code is inactive or missing");
    }

    const accessToken = await this.keypairService.signJwt(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenant_id: user.tenantId,
        tenant_slug: user.tenant?.slug,
        tenant_name: user.tenant?.name,
        appId: data.appId,
        apps: user.allowedApps,
      },
      { expiresIn: "1h", subject: user.id, audience: data.appId },
    );

    return {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: 3600,
      scope: "openid profile email",
    };
  }

  private async handleClientCredentials(dto: TokenDto) {
    if (!dto.client_id || !dto.client_secret) {
      throw new BadRequestException("client_id and client_secret required");
    }

    const app = await this.prisma.registeredApp.findFirst({
      where: isValidUuid(dto.client_id)
        ? { OR: [{ appId: dto.client_id }, { id: dto.client_id }] }
        : { appId: dto.client_id },
    });

    if (!app || !app.isActive) {
      throw new UnauthorizedException("Invalid client credentials or app disabled");
    }

    const isValid = await bcrypt.compare(dto.client_secret, app.clientSecretHash);
    if (!isValid) {
      throw new UnauthorizedException("Invalid client credentials");
    }

    const token = await this.keypairService.signJwt(
      {
        sub: app.id,
        appId: app.appId,
        type: "client_credentials",
      },
      { expiresIn: "1h", subject: app.id, audience: app.appId },
    );

    return {
      access_token: token,
      token_type: "Bearer",
      expires_in: 3600,
    };
  }
}
