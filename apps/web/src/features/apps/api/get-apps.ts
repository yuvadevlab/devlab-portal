/**
 * @file apps/web/src/features/apps/api/get-apps.ts
 * @description TanStack Query hook and SSR prefetch helper for registered microservices.
 * @module @devlab/portal-web/features/apps/api/get-apps
 */

import { useQuery, type QueryClient, type UseQueryResult } from "@tanstack/react-query";
import { api, type RegisteredApp } from "@/lib/api-client";
import { serverFetch } from "@/lib/server-fetch";
import { API_ROUTES } from "@/lib/constants/routes";

/** Canonical query key for registered application catalog */
export const appsQueryKey = (): readonly ["apps"] => ["apps"] as const;

/**
 * Client-side React hook subscribing to registered apps.
 */
export function useAppsQuery(): UseQueryResult<RegisteredApp[], Error> {
  return useQuery<RegisteredApp[], Error>({
    queryKey: appsQueryKey(),
    queryFn: () => api.getApps(),
  });
}

/**
 * Server-side prefetch helper for Next.js SSR page hydration.
 *
 * @param queryClient Active server QueryClient instance
 */
export async function prefetchApps(queryClient: QueryClient, token?: string): Promise<void> {
  await queryClient
    .query({
      queryKey: appsQueryKey(),
      queryFn: () => serverFetch<RegisteredApp[]>(API_ROUTES.APPS, token),
    })
    .catch(() => {});
}
