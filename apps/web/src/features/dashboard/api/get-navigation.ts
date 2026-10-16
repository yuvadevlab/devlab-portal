/**
 * @file apps/web/src/features/dashboard/api/get-navigation.ts
 * @description TanStack Query hook fetching dynamic platform navigation menus from database.
 * Adheres strictly to Rule 8 (server-driven configuration standard).
 * @module @devlab/portal-web/features/dashboard/api
 */

import { useQuery } from "@tanstack/react-query";
import { api, type NavigationItem } from "@/lib/api-client";

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
