"use client";

/**
 * @file apps/web/src/features/dashboard/api/get-navigation.ts
 * @description TanStack Query hook and SSR prefetch helper for dynamic platform navigation menus.
 * @module @devlab/portal-web/features/dashboard/api
 */

import { useQuery, type QueryClient } from "@tanstack/react-query";
import { api, type NavigationItem } from "@/lib/api-client";
import { serverFetch } from "@/lib/server-fetch";
import { API_ROUTES } from "@/lib/constants/routes";

/** Query key factory for dynamic platform navigation configuration */
export const navigationQueryKey = () => ["platform", "navigation"] as const;

/**
 * React hook querying enabled navigation menus and tabs from the database.
 */
export function useNavigationQuery() {
  return useQuery<NavigationItem[]>({
    queryKey: navigationQueryKey(),
    queryFn: () => api.getNavigation(),
    staleTime: 60_000,
  });
}

/**
 * Server-side prefetch helper for Next.js SSR page hydration.
 *
 * @param queryClient Active server QueryClient instance
 */
export async function prefetchNavigation(queryClient: QueryClient): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: navigationQueryKey(),
    queryFn: () => serverFetch<NavigationItem[]>(API_ROUTES.PLATFORM_NAVIGATION),
  });
}
