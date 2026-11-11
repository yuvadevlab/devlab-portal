/**
 * @file apps/web/src/features/apps/api/supervisor.ts
 * @description Centralized barrel exporting React Query hooks and client for process supervisor operations.
 * @module @devlab/portal-web/features/apps/api/supervisor
 */

export {
  supervisorQueryKeys,
  supervisorFetch,
  useSupervisorStatusesQuery,
  useSupervisorStatusQuery,
  useSupervisorLogsQuery,
  useSupervisorPortsQuery,
  useSupervisorDependenciesQuery,
} from "./supervisor-client";

export {
  useRegisterProcessMutation,
  useUnregisterProcessMutation,
  useStartProcessMutation,
  useStopProcessMutation,
  useRestartProcessMutation,
  useBuildProcessMutation,
  useOpenIdeMutation,
  useValidatePathMutation,
} from "./supervisor-actions";
