/**
 * @file apps/web/src/features/audit/api/index.ts
 * @description Centralized barrel exporting TanStack Query hooks for security audit.
 * @module @devlab/portal-web/features/audit/api
 */

export { auditLogsQueryKey, useAuditLogsQuery, prefetchAuditLogs } from "./get-audit-logs";
