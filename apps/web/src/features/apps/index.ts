/**
 * @file apps/web/src/features/apps/index.ts
 * @description Centralized barrel exporting apps feature components, API hooks, and types.
 * @module @devlab/portal-web/features/apps
 */

export * from "./types";
export * from "./api";
export { AppCard } from "./components/app-card";
export { AppGrid } from "./components/app-grid";
export { AppMetrics } from "./components/app-metrics";
export { AppSettingsDrawer } from "./components/app-settings-drawer";
export { KillSwitchModal } from "./components/kill-switch-modal";
export { RegisterAppModal } from "./components/register-wizard/register-app-modal";
