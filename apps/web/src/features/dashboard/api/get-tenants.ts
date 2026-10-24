/**
 * @file apps/web/src/features/dashboard/api/get-tenants.ts
 * @description TanStack Query hook and SSR prefetch helper for platform workspace tenants.
 * @module @devlab/portal-web/features/dashboard/api/get-tenants
 */

import { useQuery, type QueryClient, type UseQueryResult } from "@tanstack/react-query";
import { api, type Tenant } from "@/lib/api-client";
import { serverFetch } from "@/lib/server-fetch";
import { API_ROUTES } from "@/lib/constants/routes";

/** Canonical query key for platform tenants list */
export const tenantsQueryKey = (): readonly ["platform-tenants"] => ["platform-tenants"] as const;

/**
 * Client-side React hook querying active platform tenants from the database.
 */
export function useTenantsQuery(): UseQueryResult<Tenant[], Error> {
  return useQuery<Tenant[], Error>({
    queryKey: tenantsQueryKey(),
    queryFn: () => api.getTenants(),
    staleTime: 60_000,
  });
}

/**
 * Server-side prefetch helper for Next.js SSR page hydration.
 *
 * @param queryClient Active server QueryClient instance
 * @param token Optional bearer token for server authorization
 */
export async function prefetchTenants(queryClient: QueryClient): Promise<void> {
  await queryClient
    .query({
      queryKey: tenantsQueryKey(),
      queryFn: () => serverFetch<Tenant[]>(API_ROUTES.PLATFORM_TENANTS),
    })
    .catch(() => {});
}
