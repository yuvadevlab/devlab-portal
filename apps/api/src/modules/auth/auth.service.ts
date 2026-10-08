/**
 * @file apps/api/src/modules/auth/auth.service.ts
 * @description OIDC token issuer, user authentication, and OAuth2 authorization code handler.
 * @module @devlab/portal-api/auth
 */

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { PrismaService } from "../../prisma/prisma.service.js";
import { RedisService } from "../redis/redis.service.js";
import { KeypairService } from "./keys/keypair.service.js";
import { LoginDto, AuthorizeDto, TokenDto } from "./dto/auth.dto.js";
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
   * Validates user credentials and returns active user record.
   */
  async validateUser(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
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
   * Issues RS256 access token for authenticated portal user.
   */
  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    const token = await this.keypairService.signJwt(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
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
        avatarUrl: user.avatarUrl,
      },
    };
  }

  /**
   * Generates authorization code for OIDC PKCE flow.
   */
  async authorize(dto: AuthorizeDto, userId: string) {
    const app = await this.prisma.registeredApp.findFirst({
      where: { OR: [{ appId: dto.client_id }, { id: dto.client_id }] },
    });

    if (!app || !app.isActive) {
      throw new NotFoundException(`Application '${dto.client_id}' not found or inactive`);
    }

    // Verify redirect URI is in allowed callback list
    const isAllowedCallback = app.callbackUrls.includes(dto.redirect_uri);
    if (!isAllowedCallback) {
      throw new BadRequestException(`Redirect URI '${dto.redirect_uri}' is not registered`);
    }

    const code = `dlc_${crypto.randomBytes(24).toString("hex")}`;
    const codePayload = JSON.stringify({
      userId,
      appId: app.appId,
      redirectUri: dto.redirect_uri,
      codeChallenge: dto.code_challenge,
      codeChallengeMethod: dto.code_challenge_method || "S256",
    });

    // Cache code in Redis with 5 minute TTL
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
    throw new BadRequestException(`Unsupported grant_type: '${dto.grant_type}'`);
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

    // Delete one-time code immediately
    await this.redis.getClient().del(key);
    const data = JSON.parse(cached);

    if (dto.redirect_uri && dto.redirect_uri !== data.redirectUri) {
      throw new BadRequestException("Redirect URI mismatch");
    }

    // PKCE verification if challenge was supplied
    if (data.codeChallenge) {
      if (!dto.code_verifier) {
        throw new BadRequestException("code_verifier required for PKCE exchange");
      }
      const hashed = crypto.createHash("sha256").update(dto.code_verifier).digest("base64url");
      if (hashed !== data.codeChallenge && dto.code_verifier !== data.codeChallenge) {
        throw new UnauthorizedException("PKCE verification failed");
      }
    }

    const user = await this.prisma.user.findUnique({ where: { id: data.userId } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException("User associated with code is inactive or missing");
    }

    const accessToken = await this.keypairService.signJwt(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        appId: data.appId,
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
      where: { OR: [{ appId: dto.client_id }, { id: dto.client_id }] },
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

  /** Retrieves user by primary ID */
  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, avatarUrl: true, isActive: true },
    });
  }
}
