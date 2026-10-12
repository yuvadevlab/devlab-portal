/**
 * @file apps/web/src/features/audit/api/get-audit-logs.ts
 * @description TanStack Query hook and SSR prefetch helper for the immutable security audit ledger.
 * @module @devlab/portal-web/features/audit/api/get-audit-logs
 */

import { useQuery, type QueryClient, type UseQueryResult } from "@tanstack/react-query";
import { api, type AuditLog } from "@/lib/api-client";
import { serverFetch } from "@/lib/server-fetch";
import { API_ROUTES } from "@/lib/constants/routes";

/** Canonical query key for security audit logs */
export const auditLogsQueryKey = (limit = 100): readonly ["audit-logs", number] =>
  ["audit-logs", limit] as const;

/**
 * Client-side React hook subscribing to audit logs.
 *
 * @param limit Optional maximum number of logs to retrieve
 */
export function useAuditLogsQuery(limit = 100): UseQueryResult<AuditLog[], Error> {
  return useQuery<AuditLog[], Error>({
    queryKey: auditLogsQueryKey(limit),
    queryFn: () => api.getAuditLogs(limit),
  });
}

/**
 * Server-side prefetch helper for Next.js SSR page hydration.
 *
 * @param queryClient Active server QueryClient instance
 * @param limit Optional maximum number of logs to prefetch
 */
export async function prefetchAuditLogs(
  queryClient: QueryClient,
  limit = 100,
  token?: string,
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: auditLogsQueryKey(limit),
    queryFn: () => serverFetch<AuditLog[]>(`${API_ROUTES.AUDIT_LOGS}?limit=${limit}`, token),
  });
}
