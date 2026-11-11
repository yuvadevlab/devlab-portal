/**
 * @file apps/api/src/modules/supervisor/supervisor-guards.ts
 * @description Authorization, tenant boundary, and kill-switch assertion guards for processes.
 * @module @devlab/portal-api/supervisor
 */

import { ForbiddenException } from "@nestjs/common";
import type { PrismaService } from "../../prisma/prisma.service";
import type { Logger } from "@yuva-devlab/logger";

/**
 * Asserts that the request tenant matches the application's assigned tenant.
 */
export function assertTenantAccess(
  appTenants: Map<string, string>,
  appId: string,
  tenantId?: string,
  logger?: Logger,
): void {
  if (tenantId && appTenants.has(appId) && appTenants.get(appId) !== tenantId) {
    logger?.warn(`[assertTenantAccess] Forbidden tenant access to "${appId}" for "${tenantId}"`);
    throw new ForbiddenException(`App process "${appId}" does not belong to tenant "${tenantId}"`);
  }
}

/**
 * Asserts that the target application has not been deactivated via platform kill-switch.
 */
export async function assertAppActive(
  prisma: PrismaService,
  appId: string,
  logger?: Logger,
): Promise<void> {
  const app = await prisma.registeredApp.findUnique({
    where: { appId },
    select: { isActive: true, name: true, maintenanceNote: true },
  });
  if (app && !app.isActive) {
    logger?.warn(
      `[assertAppActive] Rejected execution for "${appId}": Deactivated via kill-switch`,
    );
    throw new ForbiddenException(
      `Application "${app.name || appId}" is deactivated via Platform Kill-Switch${
        app.maintenanceNote ? ` (${app.maintenanceNote})` : ""
      }. Reactivate in Applications catalog to run.`,
    );
  }
}
