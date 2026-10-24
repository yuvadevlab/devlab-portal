/**
 * @file apps/web/src/features/iam/index.ts
 * @description Centralized barrel exporting IAM feature components, API hooks, and types.
 * @module @devlab/portal-web/features/iam
 */

export * from "./types";
export * from "./api";
export { IamMetrics } from "./components/iam-metrics";
export { ApiKeysTable } from "./components/api-keys-table";
export { ApiKeyModal } from "./components/api-key-modal";
export { ApiKeyRevealPane } from "./components/api-key-reveal-pane";

export { IamView } from "./components/iam-view";
