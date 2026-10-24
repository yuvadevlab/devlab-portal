"use client";

/**
 * @file apps/web/src/features/audit/components/audit-view.tsx
 * @description Dedicated client view component for Audit Ledger and Security events.
 * @module @devlab/portal-web/features/audit/components
 */

import React from "react";
import { AuditTable } from "./audit-table";
import { useAuditLogsQuery } from "@/features/audit/api";

export function AuditView(): React.JSX.Element {
  const { data: logs = [] } = useAuditLogsQuery();

  return <AuditTable logs={logs} />;
}
