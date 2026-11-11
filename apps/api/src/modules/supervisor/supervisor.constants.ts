/**
 * @file apps/api/src/modules/supervisor/supervisor.constants.ts
 * @description Centralized process supervisor constants, path resolvers, and dynamic config builders.
 * @module @devlab/portal-api/supervisor
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { ExecutionMode, type AppProcessConfig } from "@yuva-devlab/supervisor";
import { AppEnvironment } from "../../common/constants/enums";

/**
 * Resolves the parent repository root directory containing ecosystem apps.
 */
export function getEcosystemRoot(): string {
  if (process.env.DEVLAB_ECOSYSTEM_ROOT) {
    return process.env.DEVLAB_ECOSYSTEM_ROOT;
  }
  let curr = process.cwd();
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(curr, "finai")) && fs.existsSync(path.join(curr, "orchestrai"))) {
      return curr;
    }
    curr = path.dirname(curr);
  }
  return path.resolve(process.cwd(), "../..");
}

/**
 * Resolves and normalizes application working directory supporting absolute paths and tildes.
 */
export function resolveWorkingDirectory(
  configuredDir?: string | null,
  fallbackSlug?: string | null,
): string {
  const root = getEcosystemRoot();
  if (configuredDir && configuredDir.trim()) {
    let raw = configuredDir.trim();
    if (raw.startsWith("~")) {
      raw = path.join(os.homedir(), raw.slice(1));
    }
    if (path.isAbsolute(raw)) {
      return path.normalize(raw);
    }
    return path.normalize(path.join(root, raw));
  }

  const candidateDirs = [
    path.join(root, fallbackSlug || ""),
    path.join(root, fallbackSlug?.toLowerCase().replace(/\s+/g, "-") || ""),
    root,
  ];
  for (const dir of candidateDirs) {
    if (dir && fs.existsSync(dir)) return dir;
  }
  return root;
}

/**
 * Interface describing registered application records from the database.
 */
export interface RegisteredAppEntity {
  appId: string;
  name: string;
  slug?: string | null;
  originUrl?: string | null;
  apiUrl?: string | null;
  healthUrl?: string | null;
  tenantId?: string | null;
  workingDir?: string | null;
  devCommand?: string | null;
  buildCommand?: string | null;
  startCommand?: string | null;
  envVars?: unknown;
  dependsOn?: string[] | null;
  environment?: string | null;
}

/**
 * Dynamically resolves an AppProcessConfig from a database application record.
 */
export function resolveAppProcessConfig(app: RegisteredAppEntity): AppProcessConfig {
  const workingDir = resolveWorkingDirectory(app.workingDir, app.slug || app.appId);

  const ports: number[] = [];
  for (const urlStr of [app.originUrl, app.apiUrl, app.healthUrl]) {
    if (!urlStr) continue;
    try {
      const port = parseInt(new URL(urlStr).port, 10);
      if (port && !ports.includes(port)) {
        ports.push(port);
      }
    } catch {
      // Ignore unparseable URLs
    }
  }

  const isProd = app.environment === AppEnvironment.PRODUCTION;
  const devCmd = app.devCommand || "pnpm dev";
  const startCmd = app.startCommand || "pnpm start";
  const buildCmd = app.buildCommand || "pnpm build";
  const defaultCommand = isProd ? startCmd : devCmd;

  const envRecord: Record<string, string> = {};
  if (app.envVars && typeof app.envVars === "object") {
    for (const [k, v] of Object.entries(app.envVars)) {
      if (v !== undefined && v !== null) envRecord[k] = String(v);
    }
  }

  return {
    appId: app.appId,
    name: app.name,
    workingDir,
    command: defaultCommand,
    executionMode: isProd ? ExecutionMode.PROD : ExecutionMode.DEV,
    devCommand: devCmd,
    startCommand: startCmd,
    buildCommand: buildCmd,
    dependsOn: app.dependsOn || [],
    env: envRecord,
    ports,
    healthUrl: app.healthUrl || undefined,
    readinessTimeoutMs: 25000,
    autoRestartOnCrash: false,
  };
}

/**
 * Built-in AppProcessConfig representing the DevLab Portal Platform Core host.
 */
export const DEVLAB_PORTAL_CORE_CONFIG: AppProcessConfig = {
  appId: "devlab-portal",
  name: "DevLab Portal",
  workingDir: path.resolve(getEcosystemRoot(), "devlab-portal"),
  command: "pnpm dev",
  executionMode: ExecutionMode.DEV,
  devCommand: "pnpm dev",
  startCommand: "pnpm start",
  buildCommand: "pnpm build",
  dependsOn: [],
  env: {},
  ports: [3000, 4000],
  healthUrl: "http://localhost:4000/api/v1/health",
  readinessTimeoutMs: 25000,
  autoRestartOnCrash: false,
};

/**
 * Checks whether an appId corresponds to the DevLab Platform Core host.
 */
export function isPortalCoreApp(appId: string): boolean {
  return appId === "devlab-portal";
}
