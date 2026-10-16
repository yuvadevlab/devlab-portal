/**
 * @file apps/web/src/features/apps/api/update-app-settings.ts
 * @description TanStack Mutation hook for patching application origins, callbacks, and endpoints.
 * @module @devlab/portal-web/features/apps/api/update-app-settings
 */

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { api, type RegisteredApp, type UpdateAppSettingsPayload } from "@/lib/api-client";
import { appsQueryKey } from "./get-apps";

interface UpdateAppSettingsVariables {
  id: string;
  payload: UpdateAppSettingsPayload;
}

/**
 * Mutation hook for updating microservice networking and OAuth settings.
 */
export function useUpdateAppSettingsMutation(): UseMutationResult<
  RegisteredApp,
  Error,
  UpdateAppSettingsVariables
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateAppSettingsVariables) => api.updateAppSettings(id, payload),
    onSuccess: () => {
      // Invalidate apps query cache so UI reflects updated routes
      queryClient.invalidateQueries({ queryKey: appsQueryKey() });
    },
  });
}

export { useUpdateAppSettingsMutation as useUpdateAppSettings };
