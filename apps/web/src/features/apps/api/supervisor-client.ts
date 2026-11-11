/**
 * @file apps/web/src/features/apps/api/supervisor-client.ts
 * @description React Query query hooks and fetch client for process supervisor telemetry.
 * @module @devlab/portal-web/features/apps/api/supervisor-client
 */

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { API_BASE_URL, getAuthToken } from "@/lib/api-client";
import type {
  ProcessStatus,
  ProcessLogEntry,
  PortStatus,
  DependencyStatus,
} from "../types/supervisor";

/** Canonical query keys for supervisor operations */
export const supervisorQueryKeys = {
  allStatuses: (tenantId?: string) => ["supervisor", "statuses", tenantId ?? "all"] as const,
  status: (appId: string, tenantId?: string) =>
    ["supervisor", "status", appId, tenantId ?? "all"] as const,
  logs: (appId: string, limit?: number, tenantId?: string) =>
    ["supervisor", "logs", appId, limit, tenantId ?? "all"] as const,
  ports: (tenantId?: string) => ["supervisor", "ports", tenantId ?? "all"] as const,
  dependencies: (appId: string, tenantId?: string) =>
    ["supervisor", "dependencies", appId, tenantId ?? "all"] as const,
};

/**
 * Standard authenticated fetch helper for supervisor API requests.
 */
export async function supervisorFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Supervisor API error: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Hook querying status for supervised processes, optionally scoped to a tenant.
 */
export function useSupervisorStatusesQuery(
  tenantId?: string,
): UseQueryResult<ProcessStatus[], Error> {
  const query = tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : "";
  return useQuery<ProcessStatus[], Error>({
    queryKey: supervisorQueryKeys.allStatuses(tenantId),
    queryFn: () => supervisorFetch<ProcessStatus[]>(`/api/v1/supervisor/status${query}`),
    refetchInterval: 5000,
  });
}

/**
 * Hook querying status for a single application process.
 */
export function useSupervisorStatusQuery(
  appId: string,
  tenantId?: string,
  options?: { enabled?: boolean; refetchInterval?: number | false },
): UseQueryResult<ProcessStatus, Error> {
  const query = tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : "";
  const isEnabled = Boolean(appId) && (options?.enabled ?? true);
  return useQuery<ProcessStatus, Error>({
    queryKey: supervisorQueryKeys.status(appId, tenantId),
    queryFn: () => supervisorFetch<ProcessStatus>(`/api/v1/supervisor/status/${appId}${query}`),
    enabled: isEnabled,
    refetchInterval: options?.refetchInterval ?? false,
    retry: 1,
  });
}

/**
 * Hook querying buffered logs for a process.
 */
export function useSupervisorLogsQuery(
  appId: string,
  limit = 200,
  tenantId?: string,
  options?: { enabled?: boolean; refetchInterval?: number | false },
): UseQueryResult<ProcessLogEntry[], Error> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (tenantId) params.set("tenantId", tenantId);
  const isEnabled = Boolean(appId) && (options?.enabled ?? true);
  return useQuery<ProcessLogEntry[], Error>({
    queryKey: supervisorQueryKeys.logs(appId, limit, tenantId),
    queryFn: () =>
      supervisorFetch<ProcessLogEntry[]>(`/api/v1/supervisor/logs/${appId}?${params.toString()}`),
    enabled: isEnabled,
    refetchInterval: options?.refetchInterval ?? false,
    retry: 1,
  });
}

/**
 * Hook probing port occupancy across services.
 */
export function useSupervisorPortsQuery(tenantId?: string): UseQueryResult<PortStatus[], Error> {
  const query = tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : "";
  return useQuery<PortStatus[], Error>({
    queryKey: supervisorQueryKeys.ports(tenantId),
    queryFn: () => supervisorFetch<PortStatus[]>(`/api/v1/supervisor/ports${query}`),
    refetchInterval: 10000,
  });
}

/**
 * Hook querying status of prerequisite dependencies for an application.
 */
export function useSupervisorDependenciesQuery(
  appId: string,
  tenantId?: string,
  options?: { enabled?: boolean; refetchInterval?: number | false },
): UseQueryResult<DependencyStatus[], Error> {
  const query = tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : "";
  const isEnabled = Boolean(appId) && (options?.enabled ?? true);
  return useQuery<DependencyStatus[], Error>({
    queryKey: supervisorQueryKeys.dependencies(appId, tenantId),
    queryFn: () =>
      supervisorFetch<DependencyStatus[]>(`/api/v1/supervisor/dependencies/${appId}${query}`),
    enabled: isEnabled,
    refetchInterval: options?.refetchInterval ?? 5000,
    retry: 1,
  });
}
