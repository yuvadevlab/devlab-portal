/**
 * @file apps/web/src/lib/ui-copy/dashboard.ts
 * @description Centralized feedback messages for dashboard mutations.
 * @module @devlab/portal-web/ui-copy/dashboard
 */

export const DASHBOARD_COPY = {
  ACTIONS: {
    CREATE_TENANT_LOADING: (name: string) => `Provisioning workspace "${name}"...`,
    CREATE_TENANT_SUCCESS: (name: string) => `Workspace tenant "${name}" created successfully`,
    CREATE_TENANT_FAILURE: "Failed to create tenant",
    REVOKE_KEY_LOADING: "Revoking API key...",
    REVOKE_KEY_SUCCESS: "API key revoked successfully",
    REVOKE_KEY_FAILURE: "Failed to revoke API key",
    REGISTER_APP_LOADING: (name: string) => `Registering application "${name}"...`,
    REGISTER_APP_SUCCESS: (name: string) => `Application "${name}" registered successfully`,
    REGISTER_APP_FAILURE: "Failed to register application",
    UPDATE_SETTINGS_LOADING: (name: string) => `Updating settings for "${name}"...`,
    UPDATE_SETTINGS_SUCCESS: (name: string) => `Settings updated for "${name}"`,
    UPDATE_SETTINGS_FAILURE: "Failed to update settings",
    ACTIVATE_APP_LOADING: (name: string) => `Activating application "${name}"...`,
    KILL_SWITCH_LOADING: (name: string) => `Engaging kill-switch for "${name}"...`,
    ACTIVATE_APP_SUCCESS: (name: string) => `Application "${name}" activated`,
    KILL_SWITCH_SUCCESS: (name: string) =>
      `Application "${name}" deactivated (kill-switch engaged)`,
    KILL_SWITCH_FAILURE: "Failed to toggle kill switch",
  },
} as const;
