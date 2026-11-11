/**
 * @file apps/api/src/modules/apps/apps-health-checker.ts
 * @description Concurrently probes application health endpoints and returns latency and health status.
 * @module @devlab/portal-api/apps
 */

import { AppStatus } from "../../common/constants/enums";

export interface AppHealthResult {
  latencyMs: number;
  healthStatus: AppStatus;
}

/**
 * Probes the HTTP health endpoint for a registered application.
 */
export async function probeAppHealth(app: {
  isActive: boolean;
  healthUrl?: string | null;
}): Promise<AppHealthResult> {
  if (!app.isActive) {
    return { latencyMs: 0, healthStatus: AppStatus.MAINTENANCE };
  }
  if (!app.healthUrl) {
    return { latencyMs: 0, healthStatus: AppStatus.UNKNOWN };
  }

  const start = Date.now();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    const response = await fetch(app.healthUrl, { signal: controller.signal });
    clearTimeout(timer);
    return {
      latencyMs: Date.now() - start,
      healthStatus: response.ok ? AppStatus.HEALTHY : AppStatus.DEGRADED,
    };
  } catch {
    return { latencyMs: -1, healthStatus: AppStatus.UNREACHABLE };
  }
}
