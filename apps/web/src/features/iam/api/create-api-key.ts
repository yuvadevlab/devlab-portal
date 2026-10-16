/**
 * @file apps/web/src/features/iam/api/create-api-key.ts
 * @description TanStack Mutation hook for generating new scoped IAM API credentials.
 * @module @devlab/portal-web/features/iam/api/create-api-key
 */

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { api, type ApiKey } from "@/lib/api-client";
import { apiKeysQueryKey } from "./get-api-keys";

interface CreateApiKeyVariables {
  name: string;
  appId: string;
  scopes: string[];
  rateLimitRpm?: number;
  expiresAt?: string;
}

/**
 * Mutation hook for provisioning new scoped API keys and receiving raw plaintext tokens.
 */
export function useCreateApiKeyMutation(): UseMutationResult<
  ApiKey & { rawKey: string },
  Error,
  CreateApiKeyVariables
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: CreateApiKeyVariables) => api.createApiKey(variables),
    onSuccess: () => {
      // Invalidate API keys query cache immediately
      queryClient.invalidateQueries({ queryKey: apiKeysQueryKey() });
    },
  });
}

export { useCreateApiKeyMutation as useCreateApiKey };
