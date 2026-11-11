/**
 * @file apps/api/src/modules/apps/apps-update.helper.ts
 * @description Helper mapping application settings mutations for Prisma updates.
 * @module @devlab/portal-api/apps
 */

import type { AppEnvironment, Prisma, RegisteredApp } from "@prisma/client";
import type { UpdateAppSettingsDto } from "./dto/app.dto";

/**
 * Builds the Prisma update payload merging partial DTO changes with current record state.
 */
export function buildAppUpdateData(
  app: RegisteredApp,
  dto: UpdateAppSettingsDto,
): Prisma.RegisteredAppUpdateInput {
  return {
    appId: dto.appId ?? app.appId,
    name: dto.name ?? app.name,
    slug: dto.slug ?? app.slug,
    description: dto.description !== undefined ? dto.description : app.description,
    iconUrl: dto.iconUrl !== undefined ? dto.iconUrl : app.iconUrl,
    originUrl: dto.originUrl ?? app.originUrl,
    apiUrl: dto.apiUrl !== undefined ? dto.apiUrl : app.apiUrl,
    callbackUrls: dto.callbackUrls ?? app.callbackUrls,
    healthUrl: dto.healthUrl ?? app.healthUrl,
    environment: dto.environment ? (dto.environment as AppEnvironment) : app.environment,
    themeColor: dto.themeColor !== undefined ? dto.themeColor : app.themeColor,
    maintenanceNote: dto.maintenanceNote !== undefined ? dto.maintenanceNote : app.maintenanceNote,
    workingDir: dto.workingDir !== undefined ? dto.workingDir : app.workingDir,
    devCommand: dto.devCommand !== undefined ? dto.devCommand : app.devCommand,
    buildCommand: dto.buildCommand !== undefined ? dto.buildCommand : app.buildCommand,
    startCommand: dto.startCommand !== undefined ? dto.startCommand : app.startCommand,
    envVars:
      dto.envVars !== undefined
        ? JSON.parse(JSON.stringify(dto.envVars))
        : (app.envVars as Prisma.InputJsonValue | undefined),
    dependsOn: dto.dependsOn !== undefined ? dto.dependsOn : app.dependsOn,
  };
}
