/**
 * @file apps/api/src/modules/platform/platform-app-status.service.ts
 * @description Evaluates operational lifecycle and kill-switch status for registered ecosystem applications.
 * @module @devlab/portal-api/platform
 */

import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Logger } from "@yuva-devlab/logger";

/**
 * UUID validation regex for PostgreSQL UUID columns.
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Operational application lifecycle status response.
 */
export interface AppLifecycleStatusResponse {
  readonly appId: string;
  readonly name: string;
  readonly status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  readonly isActive: boolean;
  readonly maintenanceNote: string | null;
  readonly environment: string;
}

@Injectable()
export class PlatformAppStatusService {
  private readonly logger = new Logger("PlatformAppStatusService");

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves operational kill-switch and lifecycle status for an application.
   * Tolerates canonical slug, prefixed identifier, or raw appId lookups.
   *
   * @param idOrAppId - Application identifier (e.g. "logs", "devlab-logs", "finai")
   * @returns Lifecycle status snapshot
   */
  async getAppStatus(idOrAppId: string): Promise<AppLifecycleStatusResponse> {
    const raw = idOrAppId.trim();
    const normalized = raw.toLowerCase();
    const stripped = normalized.replace(/^devlab-/, "");
    const prefixed = `devlab-${stripped}`;

    this.logger.debug(`Resolving platform app status for query: "${idOrAppId}"`);

    const orConditions: Array<{
      id?: string;
      appId?: string;
      slug?: string;
    }> = [
      { appId: normalized },
      { appId: prefixed },
      { appId: stripped },
      { slug: normalized },
      { slug: prefixed },
      { slug: stripped },
    ];

    // Only query UUID column if input is a syntactically valid UUID string
    if (UUID_REGEX.test(raw)) {
      orConditions.push({ id: raw });
    }

    const app = await this.prisma.registeredApp.findFirst({
      where: { OR: orConditions },
    });

    if (!app) {
      this.logger.warn(`Application "${idOrAppId}" not registered in platform catalog`);
      throw new NotFoundException(`Application "${idOrAppId}" not registered`);
    }

    // Determine lifecycle status: inactive takes precedence, maintenance if note present
    const status = !app.isActive ? (app.maintenanceNote ? "MAINTENANCE" : "INACTIVE") : "ACTIVE";

    return {
      appId: app.appId,
      name: app.name,
      status,
      isActive: app.isActive,
      maintenanceNote: app.maintenanceNote,
      environment: app.environment,
    };
  }
}
