/**
 * @file apps/web/src/features/apps/api/toggle-kill-switch.ts
 * @description TanStack Mutation hook for engaging or restoring the microservice kill-switch rail.
 * @module @devlab/portal-web/features/apps/api/toggle-kill-switch
 */

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { api, type RegisteredApp } from "@/lib/api-client";
import { appsQueryKey } from "./get-apps";

interface ToggleKillSwitchVariables {
  id: string;
  nextState: boolean;
  maintenanceNote?: string;
}

/**
 * Mutation hook for triggering or releasing microservice kill-switch states.
 */
export function useToggleKillSwitchMutation(): UseMutationResult<
  RegisteredApp,
  Error,
  ToggleKillSwitchVariables
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, nextState, maintenanceNote }: ToggleKillSwitchVariables) =>
      api.updateAppStatus(id, nextState, maintenanceNote),
    onSuccess: () => {
      // Invalidate apps query cache so UI reflects instant online/offline state
      queryClient.invalidateQueries({ queryKey: appsQueryKey() });
    },
  });
}

export { useToggleKillSwitchMutation as useToggleKillSwitch };
