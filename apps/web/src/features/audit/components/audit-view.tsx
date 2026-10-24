"use client";

/**
 * @file apps/web/src/features/audit/components/audit-view.tsx
 * @description Dedicated client view component for Audit Ledger and Security events.
 * @module @devlab/portal-web/features/audit/components
 */

import React from "react";
import { AuditMetrics } from "./audit-metrics";
import { AuditTable } from "./audit-table";
import { useAuditLogsQuery } from "@/features/audit/api";

export function AuditView(): React.JSX.Element {
  const { data: logs = [] } = useAuditLogsQuery();

  return (
    <>
      <AuditMetrics logs={logs} />
      <AuditTable logs={logs} />
    </>
  );
}
