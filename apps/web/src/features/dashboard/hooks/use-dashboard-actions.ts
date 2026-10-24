/**
 * @file apps/web/src/features/dashboard/hooks/use-dashboard-actions.ts
 * @description Encapsulated dashboard mutation action handlers with toast.promise feedback.
 * Adheres strictly to Sonner promise toast standard across FinAI and OrchestrAI.
 * @module @devlab/portal-web/features/dashboard/hooks/use-dashboard-actions
 */

import { toast } from "@devlab-portal/ui";
import {
  useCreateAppMutation,
  useUpdateAppSettingsMutation,
  useToggleKillSwitchMutation,
} from "@/features/apps/api";
import { useRevokeApiKeyMutation } from "@/features/iam/api";
import { useCreateTenantMutation } from "@/features/dashboard/api";
import type { RegisteredApp, CreateAppPayload, UpdateAppSettingsPayload } from "@/lib/api-client";
import { UI_COPY } from "@/lib/ui-copy";

export interface UseDashboardActionsReturn {
  handleCreateTenant: (name: string) => Promise<void>;
  handleRevokeKey: (id: string) => Promise<void>;
  handleCreateApp: (payload: CreateAppPayload) => Promise<{ clientSecret: string }>;
  handleUpdateAppSettings: (id: string, payload: UpdateAppSettingsPayload) => Promise<void>;
  handleToggleKillSwitch: (id: string, nextState: boolean, note?: string) => Promise<void>;
}

/**
 * Custom hook encapsulating dashboard mutation actions with Sonner promise toasts.
 */
export function useDashboardActions(apps: RegisteredApp[]): UseDashboardActionsReturn {
  const createApp = useCreateAppMutation();
  const updateAppSettings = useUpdateAppSettingsMutation();
  const toggleKillSwitch = useToggleKillSwitchMutation();
  const revokeApiKey = useRevokeApiKeyMutation();
  const createTenantMutation = useCreateTenantMutation();

  const handleCreateTenant = async (name: string): Promise<void> => {
    const promise = createTenantMutation.mutateAsync({ name });
    const copy = UI_COPY.DASHBOARD.ACTIONS;
    toast.promise(promise, {
      loading: copy.CREATE_TENANT_LOADING(name),
      success: (newTenant) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("devlab_active_tenant_id", newTenant.id);
        }
        return copy.CREATE_TENANT_SUCCESS(name);
      },
      error: (err: unknown) => (err instanceof Error ? err.message : copy.CREATE_TENANT_FAILURE),
    });
    await promise;
  };

  const handleRevokeKey = async (id: string): Promise<void> => {
    const promise = revokeApiKey.mutateAsync(id);
    const copy = UI_COPY.DASHBOARD.ACTIONS;
    toast.promise(promise, {
      loading: copy.REVOKE_KEY_LOADING,
      success: copy.REVOKE_KEY_SUCCESS,
      error: (err: unknown) => (err instanceof Error ? err.message : copy.REVOKE_KEY_FAILURE),
    });
    await promise;
  };

  const handleCreateApp = async (payload: CreateAppPayload): Promise<{ clientSecret: string }> => {
    const promise = createApp.mutateAsync(payload);
    const copy = UI_COPY.DASHBOARD.ACTIONS;
    toast.promise(promise, {
      loading: copy.REGISTER_APP_LOADING(payload.name),
      success: copy.REGISTER_APP_SUCCESS(payload.name),
      error: (err: unknown) => (err instanceof Error ? err.message : copy.REGISTER_APP_FAILURE),
    });
    return promise;
  };

  const handleUpdateAppSettings = async (
    id: string,
    payload: UpdateAppSettingsPayload,
  ): Promise<void> => {
    const target = apps.find((a) => a.id === id);
    const appName = target?.name || id;
    const promise = updateAppSettings.mutateAsync({ id, payload });
    const copy = UI_COPY.DASHBOARD.ACTIONS;
    toast.promise(promise, {
      loading: copy.UPDATE_SETTINGS_LOADING(appName),
      success: copy.UPDATE_SETTINGS_SUCCESS(appName),
      error: (err: unknown) => (err instanceof Error ? err.message : copy.UPDATE_SETTINGS_FAILURE),
    });
    await promise;
  };

  const handleToggleKillSwitch = async (
    id: string,
    nextState: boolean,
    note?: string,
  ): Promise<void> => {
    const target = apps.find((a) => a.id === id);
    const appName = target?.name || id;
    const promise = toggleKillSwitch.mutateAsync({ id, nextState, maintenanceNote: note });
    const copy = UI_COPY.DASHBOARD.ACTIONS;
    toast.promise(promise, {
      loading: nextState ? copy.ACTIVATE_APP_LOADING(appName) : copy.KILL_SWITCH_LOADING(appName),
      success: nextState ? copy.ACTIVATE_APP_SUCCESS(appName) : copy.KILL_SWITCH_SUCCESS(appName),
      error: (err: unknown) => (err instanceof Error ? err.message : copy.KILL_SWITCH_FAILURE),
    });
    await promise;
  };

  return {
    handleCreateTenant,
    handleRevokeKey,
    handleCreateApp,
    handleUpdateAppSettings,
    handleToggleKillSwitch,
  };
}
