/**
 * @file apps/web/src/features/iam/api/revoke-api-key.ts
 * @description TanStack Mutation hook for immediately revoking an IAM API credential.
 * @module @devlab/portal-web/features/iam/api/revoke-api-key
 */

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { api, type ApiKey } from "@/lib/api-client";
import { apiKeysQueryKey } from "./get-api-keys";

/**
 * Mutation hook for revoking an active API key.
 */
export function useRevokeApiKeyMutation(): UseMutationResult<ApiKey, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.revokeApiKey(id),
    onSuccess: () => {
      // Invalidate API keys query cache
      queryClient.invalidateQueries({ queryKey: apiKeysQueryKey() });
    },
  });
}

export { useRevokeApiKeyMutation as useRevokeApiKey };
