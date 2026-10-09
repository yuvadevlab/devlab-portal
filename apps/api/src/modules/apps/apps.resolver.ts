/**
 * @file apps/api/src/modules/apps/apps.resolver.ts
 * @description GraphQL resolver providing queries and real-time subscriptions for application status.
 * @module @devlab/portal-api/apps
 */

import { Resolver, Query, Mutation, Subscription, Args } from "@nestjs/graphql";
import { UseGuards, UnauthorizedException } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { AppsService } from "./apps.service.js";
import { AuthGuard } from "../auth/auth.guard.js";
import { RegisteredAppType, UpdateAppStatusDto, AppStatusChangedPayload } from "./dto/app.dto.js";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";

export const appsPubSub = new PubSub();
const APP_STATUS_CHANGED_TOPIC = "appStatusChanged";

@Resolver(() => RegisteredAppType)
export class AppsResolver {
  constructor(private readonly appsService: AppsService) {}

  @Query(() => [RegisteredAppType], { name: "apps" })
  async getApps() {
    return this.appsService.listApps();
  }

  @Query(() => RegisteredAppType, { name: "app", nullable: true })
  async getApp(@Args("id") id: string) {
    return this.appsService.getApp(id);
  }

  @Mutation(() => RegisteredAppType, { name: "updateAppStatus" })
  @UseGuards(AuthGuard)
  async updateAppStatus(
    @Args("id") id: string,
    @Args("input") input: UpdateAppStatusDto,
    @CurrentUser() user: { sub: string },
  ) {
    if (!user?.sub) {
      throw new UnauthorizedException("Authenticated user identifier is required");
    }

    const updated = await this.appsService.updateAppStatus(id, input, user.sub);

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

  @Subscription(() => AppStatusChangedPayload, {
    name: "appStatusChanged",
  })
  appStatusChanged() {
    return appsPubSub.asyncIterableIterator(APP_STATUS_CHANGED_TOPIC);
  }
}
