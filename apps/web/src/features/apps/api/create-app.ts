/**
 * @file apps/web/src/features/apps/api/create-app.ts
 * @description TanStack Mutation hook for registering new microservices into DevLab.
 * @module @devlab/portal-web/features/apps/api/create-app
 */

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { api, type CreateAppPayload } from "@/lib/api-client";
import { appsQueryKey } from "./get-apps";

/**
 * Mutation hook for registering new ecosystem applications and receiving client secrets.
 */
export function useCreateAppMutation(): UseMutationResult<
  { clientSecret: string },
  Error,
  CreateAppPayload
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAppPayload) => api.createApp(payload),
    onSuccess: () => {
      // Invalidate apps cache to reflect new service immediately
      queryClient.invalidateQueries({ queryKey: appsQueryKey() });
    },
  });
}

export { useCreateAppMutation as useCreateApp };
