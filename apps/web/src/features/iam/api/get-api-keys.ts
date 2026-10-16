/**
 * @file apps/web/src/features/iam/api/get-api-keys.ts
 * @description TanStack Query hook and SSR prefetch helper for scoped IAM API keys.
 * @module @devlab/portal-web/features/iam/api/get-api-keys
 */

import { useQuery, type QueryClient, type UseQueryResult } from "@tanstack/react-query";
import { api, type ApiKey } from "@/lib/api-client";
import { serverFetch } from "@/lib/server-fetch";
import { API_ROUTES } from "@/lib/constants/routes";

/** Canonical query key for scoped IAM API keys */
export const apiKeysQueryKey = (): readonly ["api-keys"] => ["api-keys"] as const;

/**
 * Client-side React hook subscribing to IAM API keys.
 */
export function useApiKeysQuery(): UseQueryResult<ApiKey[], Error> {
  return useQuery<ApiKey[], Error>({
    queryKey: apiKeysQueryKey(),
    queryFn: () => api.getApiKeys(),
  });
}

/**
 * Server-side prefetch helper for Next.js SSR page hydration.
 *
 * @param queryClient Active server QueryClient instance
 */
export async function prefetchApiKeys(queryClient: QueryClient, token?: string): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: apiKeysQueryKey(),
    queryFn: () => serverFetch<ApiKey[]>(API_ROUTES.API_KEYS, token),
  });
}
