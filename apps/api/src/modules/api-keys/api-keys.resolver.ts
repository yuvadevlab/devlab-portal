/**
 * @file apps/api/src/modules/api-keys/api-keys.resolver.ts
 * @description GraphQL resolver providing queries and mutations for API key administration.
 * @module @devlab/portal-api/api-keys
 */

import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ApiKeysService } from "./api-keys.service.js";
import { AuthGuard } from "../auth/auth.guard.js";
import { ApiKeyType, ApiKeyWithSecretType, CreateApiKeyDto } from "./dto/api-key.dto.js";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";

@Resolver(() => ApiKeyType)
export class ApiKeysResolver {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Query(() => [ApiKeyType], { name: "apiKeys" })
  @UseGuards(AuthGuard)
  async getApiKeys(@Args("appId", { type: () => String, nullable: true }) appId?: string) {
    return this.apiKeysService.listApiKeys(appId);
  }

  @Mutation(() => ApiKeyWithSecretType, { name: "createApiKey" })
  @UseGuards(AuthGuard)
  async createApiKey(@CurrentUser() user: { sub: string }, @Args("input") input: CreateApiKeyDto) {
    return this.apiKeysService.createApiKey(user?.sub || "cmuzm86p00000sxyr2ct88hws", input);
  }

  @Mutation(() => Boolean, { name: "revokeApiKey" })
  @UseGuards(AuthGuard)
  async revokeApiKey(@CurrentUser() user: { sub: string }, @Args("id") id: string) {
    await this.apiKeysService.revokeApiKey(id, user?.sub || "cmuzm86p00000sxyr2ct88hws");
    return true;
  }
}
