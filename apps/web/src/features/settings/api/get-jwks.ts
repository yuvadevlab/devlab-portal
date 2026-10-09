/**
 * @file apps/web/src/features/settings/api/get-jwks.ts
 * @description TanStack Query hook and SSR prefetch helper for the public JWKS key set.
 * @module @devlab/portal-web/features/settings/api/get-jwks
 */

import { useQuery, type QueryClient, type UseQueryResult } from "@tanstack/react-query";
import { api, type JwksData } from "@/lib/api-client";
import { serverFetch } from "@/lib/server-fetch";
import { API_ROUTES } from "@/lib/constants/routes";

/** Canonical query key for public JWKS key set */
export const jwksQueryKey = (): readonly ["jwks"] => ["jwks"] as const;

/**
 * Client-side React hook subscribing to public JWKS keys.
 */
export function useJwksQuery(): UseQueryResult<JwksData, Error> {
  return useQuery<JwksData, Error>({
    queryKey: jwksQueryKey(),
    queryFn: () => api.getJwks(),
  });
}

/**
 * Server-side prefetch helper for Next.js SSR page hydration.
 *
 * @param queryClient Active server QueryClient instance
 */
export async function prefetchJwks(queryClient: QueryClient): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: jwksQueryKey(),
    queryFn: () => serverFetch<JwksData>(API_ROUTES.JWKS),
  });
}
