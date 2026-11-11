/**
 * @file apps/api/src/modules/supervisor/supervisor-host.ts
 * @description Helpers for managing the DevLab Portal Platform Core host status and safeguards.
 * @module @devlab/portal-api/supervisor
 */

import { ForbiddenException } from "@nestjs/common";
import {
  PortProber,
  ProcessState,
  ExecutionMode,
  ProcessSupervisor,
  type ProcessStatus,
  type DependencyStatus,
  type PortStatus,
  type AppProcessConfig,
} from "@yuva-devlab/supervisor";
import type { Logger } from "@yuva-devlab/logger";
import { isPortalCoreApp } from "./supervisor.constants";

/**
 * Builds the live ProcessStatus snapshot representing the active DevLab Portal host server.
 */
export async function buildPortalCoreStatus(): Promise<ProcessStatus> {
  const ports = [3000, 4000];
  const portStatuses = await PortProber.checkPorts(ports);
  return {
    appId: "devlab-portal",
    state: ProcessState.RUNNING,
    mode: ExecutionMode.DEV,
    pid: process.pid,
    pgid: null,
    exitCode: null,
    startedAt: new Date(Date.now() - process.uptime() * 1000).toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    ports,
    portStatuses,
    dependencyStatuses: [],
    error: null,
  };
}

/**
 * Normalizes dependency statuses to ensure DevLab Portal is reported as live Platform Core.
 */
export function normalizePortalDependency(dep: DependencyStatus): DependencyStatus {
  if (dep.appId === "devlab-portal") {
    return {
      ...dep,
      name: "DevLab Portal",
      running: true,
      state: ProcessState.RUNNING,
      healthy: true,
      boundPorts: dep.boundPorts && dep.boundPorts.length > 0 ? dep.boundPorts : [3000, 4000],
    };
  }
  return dep;
}

/**
 * Prevents process supervisor lifecycle actions from terminating the parent host server.
 */
export function assertNotPortalCore(appId: string, action: string): void {
  if (appId === "devlab-portal") {
    throw new ForbiddenException(
      `Cannot ${action} DevLab Portal Platform Core via process supervisor (host application)`,
    );
  }
}

/**
 * Cascade-starts unstarted prerequisite dependencies for a given application.
 */
export async function cascadeStartPrerequisites(
  supervisor: ProcessSupervisor,
  ensureRegistered: (id: string) => Promise<unknown>,
  dependsOn?: readonly string[],
  mode?: ExecutionMode,
  logger?: Logger,
): Promise<void> {
  if (!dependsOn || dependsOn.length === 0) return;
  for (const depId of dependsOn) {
    if (isPortalCoreApp(depId)) continue;
    await ensureRegistered(depId);
    const depStatus = await supervisor.getStatus(depId);
    if (depStatus.state !== ProcessState.RUNNING) {
      logger?.info(`[cascadeStart] Starting prerequisite app: ${depId}`);
      await supervisor.start(depId, mode);
    }
  }
}

/**
 * Probes configured or explicit ports across registered applications.
 */
export async function probeConfiguredPorts(
  configs: AppProcessConfig[],
  ports?: readonly number[],
): Promise<PortStatus[]> {
  if (ports && ports.length > 0) return PortProber.checkPorts(ports);
  const targetPorts = Array.from(new Set(configs.flatMap((c) => c.ports || [])));
  return targetPorts.length === 0 ? [] : PortProber.checkPorts(targetPorts);
}
