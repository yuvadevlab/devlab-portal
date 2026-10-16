/**
 * @file apps/web/src/features/dashboard/hooks/use-dashboard-actions.ts
 * @description Encapsulated dashboard mutation action handlers with toast.promise feedback.
 * Adheres strictly to Sonner promise toast standard across FinAI and OrchestrAI.
 * @module @devlab/portal-web/features/dashboard/hooks/use-dashboard-actions
 */

import { toast } from "@yuva-devlab/ui";
import {
  useCreateAppMutation,
  useUpdateAppSettingsMutation,
  useToggleKillSwitchMutation,
} from "@/features/apps/api";
import { useRevokeApiKeyMutation } from "@/features/iam/api";
import { useCreateTenantMutation } from "@/features/dashboard/api";
import type { RegisteredApp, CreateAppPayload, UpdateAppSettingsPayload } from "@/lib/api-client";

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
    toast.promise(promise, {
      loading: `Provisioning workspace "${name}"...`,
      success: (newTenant) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("devlab_active_tenant_id", newTenant.id);
        }
        return `Workspace tenant "${name}" created successfully`;
      },
      error: (err: unknown) => (err instanceof Error ? err.message : "Failed to create tenant"),
    });
    await promise;
  };

  const handleRevokeKey = async (id: string): Promise<void> => {
    const promise = revokeApiKey.mutateAsync(id);
    toast.promise(promise, {
      loading: "Revoking API key...",
      success: "API key revoked successfully",
      error: (err: unknown) => (err instanceof Error ? err.message : "Failed to revoke API key"),
    });
    await promise;
  };

  const handleCreateApp = async (payload: CreateAppPayload): Promise<{ clientSecret: string }> => {
    const promise = createApp.mutateAsync(payload);
    toast.promise(promise, {
      loading: `Registering application "${payload.name}"...`,
      success: `Application "${payload.name}" registered successfully`,
      error: (err: unknown) =>
        err instanceof Error ? err.message : "Failed to register application",
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
    toast.promise(promise, {
      loading: `Updating settings for "${appName}"...`,
      success: `Settings updated for "${appName}"`,
      error: (err: unknown) => (err instanceof Error ? err.message : "Failed to update settings"),
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
    toast.promise(promise, {
      loading: nextState
        ? `Activating application "${appName}"...`
        : `Engaging kill-switch for "${appName}"...`,
      success: nextState
        ? `Application "${appName}" activated`
        : `Application "${appName}" deactivated (kill-switch engaged)`,
      error: (err: unknown) =>
        err instanceof Error ? err.message : "Failed to toggle kill switch",
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
