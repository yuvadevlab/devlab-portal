/**
 * @file apps/web/src/features/dashboard/api/get-telemetry.ts
 * @description TanStack Query hook querying live platform telemetry and Redis health.
 * @module @devlab/portal-web/features/dashboard/api/get-telemetry
 */

import { useQuery, type QueryClient, type UseQueryResult } from "@tanstack/react-query";
import { api, type SystemTelemetry } from "@/lib/api-client";
import { serverFetch } from "@/lib/server-fetch";
import { API_ROUTES } from "@/lib/constants/routes";

/** Canonical query key for live platform telemetry */
export const telemetryQueryKey = (): readonly ["platform-telemetry"] =>
  ["platform-telemetry"] as const;

/**
 * Client-side React hook querying live cluster telemetry and Redis pub/sub health.
 */
export function useTelemetryQuery(): UseQueryResult<SystemTelemetry, Error> {
  return useQuery<SystemTelemetry, Error>({
    queryKey: telemetryQueryKey(),
    queryFn: () => api.getTelemetry(),
    refetchInterval: 10_000,
    staleTime: 5_000,
  });
}

/**
 * Server-side prefetch helper for Next.js SSR page hydration.
 *
 * @param queryClient Active server QueryClient instance
 * @param token Optional bearer token for server authorization
 */
export async function prefetchTelemetry(queryClient: QueryClient): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: telemetryQueryKey(),
    queryFn: () => serverFetch<SystemTelemetry>(API_ROUTES.PLATFORM_TELEMETRY),
  });
}
