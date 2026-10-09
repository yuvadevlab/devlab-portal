/**
 * @file apps/web/src/features/apps/api/index.ts
 * @description Centralized barrel exporting TanStack Query hooks for applications.
 * @module @devlab/portal-web/features/apps/api
 */

export { appsQueryKey, useAppsQuery, prefetchApps } from "./get-apps";
export { useCreateAppMutation, useCreateApp } from "./create-app";
export { useUpdateAppSettingsMutation, useUpdateAppSettings } from "./update-app-settings";
export { useToggleKillSwitchMutation, useToggleKillSwitch } from "./toggle-kill-switch";
