/**
 * @file apps/web/src/features/apps/types.ts
 * @description Types, filter contracts, and wizard interfaces for Ecosystem Apps.
 * @module @devlab/portal-web/features/apps/types
 */

import { AppEnvironment } from "@/lib/constants";
import type { RegisteredApp, CreateAppPayload, UpdateAppSettingsPayload } from "@/lib/api-client";

export type { RegisteredApp, CreateAppPayload, UpdateAppSettingsPayload };
export {
  ProcessState,
  ProcessStateEnum,
  ExecutionMode,
  ExecutionModeEnum,
  SupportedIde,
  SupportedIdeEnum,
} from "./types/supervisor";
export type {
  ProcessLogLevel,
  ProcessLogStream,
  ProcessLogEntry,
  PortStatus,
  ProcessStatus,
  DependencyStatus,
  OpenIdePayload,
  OpenIdeResult,
  PathValidationResult,
  RegisterProcessPayload,
} from "./types/supervisor";

export interface AppFilterState {
  searchQuery: string;
  environmentFilter: AppEnvironment | "all";
}

export interface RegisterWizardFormState {
  name: string;
  appId: string;
  slug: string;
  description: string;
  environment: AppEnvironment;
  originUrl: string;
  apiUrl: string;
  healthUrl: string;
  callbackUrls: string;
  themeColor: string;
  iconUrl: string;
  maintenanceNote: string;
  generatedSecret?: string;
  workingDir?: string;
  devCommand?: string;
  buildCommand?: string;
  startCommand?: string;
  dependsOn?: string[];
}
