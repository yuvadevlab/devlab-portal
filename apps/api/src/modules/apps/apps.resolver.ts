/**
 * @file apps/api/src/modules/apps/apps.resolver.ts
 * @description GraphQL resolver providing queries and real-time subscriptions for application status.
 * @module @devlab/portal-api/apps
 */

import { Resolver, Query, Mutation, Subscription, Args } from "@nestjs/graphql";
import { UseGuards, UnauthorizedException } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { AppsService } from "./apps.service";
import { AuthGuard } from "../auth/auth.guard";
import {
  RegisteredAppType,
  UpdateAppStatusDto,
  UpdateAppSettingsDto,
  AppStatusChangedPayload,
} from "./dto/app.dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

export const appsPubSub = new PubSub();
const APP_STATUS_CHANGED_TOPIC = "appStatusChanged";

@Resolver(() => RegisteredAppType)
export class AppsResolver {
  constructor(private readonly appsService: AppsService) {}

  @Query(() => [RegisteredAppType], { name: "apps" })
  @UseGuards(AuthGuard)
  async getApps(@CurrentUser() user: { sub: string; role?: string; tenant_id?: string }) {
    return this.appsService.listApps(user);
  }

  @Query(() => RegisteredAppType, { name: "app", nullable: true })
  @UseGuards(AuthGuard)
  async getApp(
    @Args("id") id: string,
    @CurrentUser() user: { sub: string; role?: string; tenant_id?: string },
  ) {
    return this.appsService.getApp(id, user);
  }

  @Mutation(() => RegisteredAppType, { name: "updateAppStatus" })
  @UseGuards(AuthGuard)
  async updateAppStatus(
    @Args("id") id: string,
    @Args("input") input: UpdateAppStatusDto,
    @CurrentUser() user: { sub: string; role?: string; tenant_id?: string },
  ) {
    if (!user?.sub) {
      throw new UnauthorizedException("Authenticated user identifier is required");
    }

    const updated = await this.appsService.updateAppStatus(id, input, user);

    await appsPubSub.publish(APP_STATUS_CHANGED_TOPIC, {
      appStatusChanged: {
        appId: updated.appId,
        name: updated.name,
        isActive: updated.isActive,
        maintenanceNote: updated.maintenanceNote,
        updatedAt: updated.updatedAt,
      },
    });

    return updated;
  }

  /**
   * Updates application operational configuration, URLs, and metadata.
   *
   * @param id - Application UUID or appId
   * @param input - Target application configuration fields
   * @param user - Current authenticated principal
   */
  @Mutation(() => RegisteredAppType, { name: "updateAppSettings" })
  @UseGuards(AuthGuard)
  async updateAppSettings(
    @Args("id") id: string,
    @Args("input") input: UpdateAppSettingsDto,
    @CurrentUser() user: { sub: string; role?: string; tenant_id?: string },
  ) {
    if (!user?.sub) {
      throw new UnauthorizedException("Authenticated user identifier is required");
    }

    return this.appsService.updateAppSettings(id, input, user);
  }

  @Subscription(() => AppStatusChangedPayload, {
    name: "appStatusChanged",
  })
  appStatusChanged() {
    return appsPubSub.asyncIterableIterator(APP_STATUS_CHANGED_TOPIC);
  }
}
