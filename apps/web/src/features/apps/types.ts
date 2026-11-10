/**
 * @file apps/web/src/features/apps/types.ts
 * @description Types, filter contracts, and wizard interfaces for Ecosystem Apps.
 * @module @devlab/portal-web/features/apps/types
 */

import { AppEnvironment } from "@/lib/constants";
import type { RegisteredApp, CreateAppPayload, UpdateAppSettingsPayload } from "@/lib/api-client";

export type { RegisteredApp, CreateAppPayload, UpdateAppSettingsPayload };
export type {
  ProcessState,
  ProcessLogLevel,
  ProcessLogStream,
  ProcessLogEntry,
  PortStatus,
  ProcessStatus,
  ExecutionMode,
  SupportedIde,
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
  healthUrl: string;
  callbackUrls: string;
  generatedSecret?: string;
  workingDir?: string;
  devCommand?: string;
  buildCommand?: string;
  startCommand?: string;
  dependsOn?: string[];
}
