/**
 * @file apps/web/src/features/apps/api/supervisor-actions.ts
 * @description React Query mutation hooks for process supervisor lifecycle and IDE launch.
 * @module @devlab/portal-web/features/apps/api/supervisor-actions
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supervisorFetch, supervisorQueryKeys } from "./supervisor-client";
import { appsQueryKey } from "./get-apps";
import type {
  ProcessStatus,
  RegisterProcessPayload,
  ExecutionMode,
  SupportedIde,
  OpenIdeResult,
  PathValidationResult,
} from "../types/supervisor";

/**
 * Mutation hook to register a new process under a tenant.
 */
export function useRegisterProcessMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterProcessPayload) =>
      supervisorFetch<{ success: boolean; appId: string }>("/api/v1/supervisor/register", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: supervisorQueryKeys.allStatuses(payload.tenantId),
      });
      queryClient.invalidateQueries({ queryKey: supervisorQueryKeys.allStatuses() });
    },
  });
}

/**
 * Mutation hook to unregister a process.
 */
export function useUnregisterProcessMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appId, tenantId }: { appId: string; tenantId?: string }) => {
      const query = tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : "";
      return supervisorFetch<{ success: boolean; appId: string }>(
        `/api/v1/supervisor/${appId}${query}`,
        { method: "DELETE" },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supervisor"] });
    },
  });
}

/**
 * Mutation hook to start a process with mode and dependency options.
 */
export function useStartProcessMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      appId,
      tenantId,
      mode,
      cascade,
    }: {
      appId: string;
      tenantId?: string;
      mode?: ExecutionMode;
      cascade?: boolean;
    }) => {
      const params = new URLSearchParams();
      if (tenantId) params.set("tenantId", tenantId);
      if (mode) params.set("mode", mode);
      if (cascade) params.set("cascade", "true");
      const qs = params.toString() ? `?${params.toString()}` : "";
      return supervisorFetch<ProcessStatus>(`/api/v1/supervisor/start/${appId}${qs}`, {
        method: "POST",
      });
    },
    onSuccess: (_, { appId, tenantId }) => {
      queryClient.invalidateQueries({ queryKey: appsQueryKey() });
      queryClient.invalidateQueries({ queryKey: supervisorQueryKeys.allStatuses(tenantId) });
      queryClient.invalidateQueries({ queryKey: supervisorQueryKeys.status(appId, tenantId) });
      queryClient.invalidateQueries({
        queryKey: supervisorQueryKeys.dependencies(appId, tenantId),
      });
      queryClient.invalidateQueries({ queryKey: ["supervisor", "logs", appId] });
    },
  });
}

/**
 * Mutation hook to stop a process.
 */
export function useStopProcessMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appId, tenantId }: { appId: string; tenantId?: string }) => {
      const query = tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : "";
      return supervisorFetch<ProcessStatus>(`/api/v1/supervisor/stop/${appId}${query}`, {
        method: "POST",
      });
    },
    onSuccess: (_, { appId, tenantId }) => {
      queryClient.invalidateQueries({ queryKey: appsQueryKey() });
      queryClient.invalidateQueries({ queryKey: supervisorQueryKeys.allStatuses(tenantId) });
      queryClient.invalidateQueries({ queryKey: supervisorQueryKeys.status(appId, tenantId) });
      queryClient.invalidateQueries({
        queryKey: supervisorQueryKeys.dependencies(appId, tenantId),
      });
      queryClient.invalidateQueries({ queryKey: ["supervisor", "logs", appId] });
    },
  });
}

/**
 * Mutation hook to restart a process with optional execution mode.
 */
export function useRestartProcessMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      appId,
      tenantId,
      mode,
    }: {
      appId: string;
      tenantId?: string;
      mode?: ExecutionMode;
    }) => {
      const params = new URLSearchParams();
      if (tenantId) params.set("tenantId", tenantId);
      if (mode) params.set("mode", mode);
      const qs = params.toString() ? `?${params.toString()}` : "";
      return supervisorFetch<ProcessStatus>(`/api/v1/supervisor/restart/${appId}${qs}`, {
        method: "POST",
      });
    },
    onSuccess: (_, { appId, tenantId }) => {
      queryClient.invalidateQueries({ queryKey: appsQueryKey() });
      queryClient.invalidateQueries({ queryKey: supervisorQueryKeys.allStatuses(tenantId) });
      queryClient.invalidateQueries({ queryKey: supervisorQueryKeys.status(appId, tenantId) });
      queryClient.invalidateQueries({
        queryKey: supervisorQueryKeys.dependencies(appId, tenantId),
      });
      queryClient.invalidateQueries({ queryKey: ["supervisor", "logs", appId] });
    },
  });
}

/**
 * Mutation hook to run an on-demand production build for an app.
 */
export function useBuildProcessMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appId, tenantId }: { appId: string; tenantId?: string }) => {
      const query = tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : "";
      return supervisorFetch<{ success: boolean; exitCode: number }>(
        `/api/v1/supervisor/build/${appId}${query}`,
        { method: "POST" },
      );
    },
    onSuccess: (_, { appId }) => {
      queryClient.invalidateQueries({ queryKey: ["supervisor", "logs", appId] });
    },
  });
}

/**
 * Mutation hook to launch a host IDE targeting an app's working directory.
 */
export function useOpenIdeMutation() {
  return useMutation({
    mutationFn: ({
      appId,
      ide,
      tenantId,
    }: {
      appId: string;
      ide?: SupportedIde;
      tenantId?: string;
    }) => {
      const query = tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : "";
      return supervisorFetch<OpenIdeResult>(`/api/v1/supervisor/open-ide/${appId}${query}`, {
        method: "POST",
        body: JSON.stringify({ ide }),
      });
    },
  });
}

/**
 * Mutation hook to validate a filesystem directory path on the host.
 */
export function useValidatePathMutation() {
  return useMutation({
    mutationFn: (payload: { path: string }) =>
      supervisorFetch<PathValidationResult>("/api/v1/supervisor/validate-path", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
}
