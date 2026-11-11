/**
 * @file apps/web/src/features/apps/types/supervisor.ts
 * @description Type definitions for process supervisor control, port inspection, IDE launch, and streaming logs.
 * @module @devlab/portal-web/features/apps/types/supervisor
 */

/**
 * Operational lifecycle states for a managed application process.
 */
export enum ProcessStateEnum {
  STOPPED = "STOPPED",
  STARTING = "STARTING",
  RUNNING = "RUNNING",
  STOPPING = "STOPPING",
  CRASHED = "CRASHED",
}
export type ProcessState = `${ProcessStateEnum}`;
export const ProcessState = ProcessStateEnum;

/**
 * Execution environment mode (development with live reload vs compiled production).
 */
export enum ExecutionModeEnum {
  DEV = "dev",
  PROD = "prod",
}
export type ExecutionMode = `${ExecutionModeEnum}`;
export const ExecutionMode = ExecutionModeEnum;

/**
 * Supported desktop IDE targets for one-click repository opening.
 */
export enum SupportedIdeEnum {
  ANTIGRAVITY = "antigravity",
  VSCODE = "vscode",
}
export type SupportedIde = `${SupportedIdeEnum}`;
export const SupportedIde = SupportedIdeEnum;

/**
 * Dependency health and readiness snapshot for prerequisite services.
 */
export interface DependencyStatus {
  readonly appId: string;
  readonly name: string;
  readonly running: boolean;
  readonly state: ProcessState;
  readonly healthUrl?: string;
  readonly healthy: boolean;
}

/**
 * Log severity levels extracted from stream output.
 */
export enum ProcessLogLevelEnum {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  DEBUG = "debug",
}
export type ProcessLogLevel = `${ProcessLogLevelEnum}`;
export const ProcessLogLevel = ProcessLogLevelEnum;

/**
 * Stream origin for process output.
 */
export enum ProcessLogStreamEnum {
  STDOUT = "stdout",
  STDERR = "stderr",
  SYSTEM = "system",
}
export type ProcessLogStream = `${ProcessLogStreamEnum}`;
export const ProcessLogStream = ProcessLogStreamEnum;

/**
 * Structured log record captured from a managed process.
 */
export interface ProcessLogEntry {
  readonly id: string;
  readonly appId: string;
  readonly timestamp: string;
  readonly level: ProcessLogLevel;
  readonly message: string;
  readonly raw: string;
  readonly stream: ProcessLogStream;
}

/**
 * TCP port occupancy snapshot.
 */
export interface PortStatus {
  readonly port: number;
  readonly inUse: boolean;
  readonly pid: number | null;
}

/**
 * Runtime telemetry and operational status snapshot of a managed process.
 */
export interface ProcessStatus {
  readonly appId: string;
  readonly state: ProcessState;
  readonly mode?: ExecutionMode;
  readonly pid: number | null;
  readonly pgid: number | null;
  readonly exitCode: number | null;
  readonly startedAt: string | null;
  readonly uptimeSeconds: number;
  readonly ports: readonly number[];
  readonly portStatuses: readonly PortStatus[];
  readonly dependencyStatuses?: readonly DependencyStatus[];
  readonly error: string | null;
}

/**
 * Registration payload for dynamic tenant process onboarding.
 */
export interface RegisterProcessPayload {
  readonly appId: string;
  readonly name?: string;
  readonly workingDir: string;
  readonly command: string;
  readonly args?: string[];
  readonly devCommand?: string;
  readonly buildCommand?: string;
  readonly startCommand?: string;
  readonly dependsOn?: string[];
  readonly env?: Record<string, string>;
  readonly ports?: number[];
  readonly healthUrl?: string;
  readonly readinessTimeoutMs?: number;
  readonly autoRestartOnCrash?: boolean;
  readonly tenantId?: string;
}

/**
 * Payload to launch an IDE on the host system.
 */
export interface OpenIdePayload {
  readonly ide?: SupportedIde;
  readonly path?: string;
}

/**
 * Result returned when launching an IDE.
 */
export interface OpenIdeResult {
  readonly success: boolean;
  readonly launched: boolean;
  readonly ide: string;
  readonly workingDir?: string;
  readonly message?: string;
  readonly deepLinkUrl?: string;
  readonly deepLink?: string;
  readonly hostSpawned?: boolean;
  readonly error?: string;
}

/**
 * Result returned when validating a host filesystem directory path.
 */
export interface PathValidationResult {
  readonly exists: boolean;
  readonly isDirectory: boolean;
  readonly resolvedPath: string;
  readonly message?: string;
}
