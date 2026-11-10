/**
 * @file apps/api/src/modules/api-keys/api-keys.resolver.ts
 * @description GraphQL resolver providing queries and mutations for API key administration.
 * @module @devlab/portal-api/api-keys
 */

import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards, UnauthorizedException } from "@nestjs/common";
import { ApiKeysService } from "./api-keys.service";
import { AuthGuard } from "../auth/auth.guard";
import { ApiKeyType, ApiKeyWithSecretType, CreateApiKeyDto } from "./dto/api-key.dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Logger } from "@yuva-devlab/logger";

@Resolver(() => ApiKeyType)
export class ApiKeysResolver {
  private readonly logger = new Logger("ApiKeysResolver");

  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Query(() => [ApiKeyType], { name: "apiKeys" })
  @UseGuards(AuthGuard)
  async getApiKeys(
    @CurrentUser() user: { sub: string; role?: string; tenant_id?: string },
    @Args("appId", { type: () => String, nullable: true }) appId?: string,
  ) {
    this.logger.info(`[getApiKeys] GraphQL query for apiKeys by actor=${user?.sub}`);
    return this.apiKeysService.listApiKeys(appId, user);
  }

  @Mutation(() => ApiKeyWithSecretType, { name: "createApiKey" })
  @UseGuards(AuthGuard)
  async createApiKey(@CurrentUser() user: { sub: string }, @Args("input") input: CreateApiKeyDto) {
    if (!user?.sub) {
      throw new UnauthorizedException("Authenticated user identifier is required");
    }
    this.logger.info(
      `[createApiKey] GraphQL mutation for app="${input.appId}" by actor=${user.sub}`,
    );
    return this.apiKeysService.createApiKey(user.sub, input);
  }

  @Mutation(() => Boolean, { name: "revokeApiKey" })
  @UseGuards(AuthGuard)
  async revokeApiKey(
    @CurrentUser() user: { sub: string; role?: string; tenant_id?: string },
    @Args("id") id: string,
  ) {
    if (!user?.sub) {
      throw new UnauthorizedException("Authenticated user identifier is required");
    }
    this.logger.info(`[revokeApiKey] GraphQL mutation to revoke key="${id}" by actor=${user.sub}`);
    await this.apiKeysService.revokeApiKey(id, user.sub, user);
    return true;
  }
}
