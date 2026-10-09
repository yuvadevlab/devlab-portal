/**
 * @file apps/web/src/features/audit/components/audit-table.tsx
 * @description Immutable security audit ledger table with severity badges and inspection trigger.
 * @module @devlab/portal-web/features/audit/components/audit-table
 */

import React, { useState } from "react";
import { ShieldAlert, Eye, Terminal } from "lucide-react";
import { Button } from "@yuva-devlab/ui";
import { UI_COPY } from "../../../lib/ui-copy/index";
import { AuditAction } from "../../../lib/constants/enums";
import { AuditInspectorDrawer } from "./audit-inspector-drawer";
import type { AuditLog } from "../types";

interface AuditTableProps {
  logs: AuditLog[];
}

export const AuditTable: React.FC<AuditTableProps> = ({ logs }) => {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case AuditAction.APP_ACTIVATED:
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case AuditAction.APP_DEACTIVATED:
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      case AuditAction.API_KEY_REVOKED:
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case AuditAction.APP_REGISTERED:
      case AuditAction.USER_INVITED:
        return "bg-sky-500/10 text-sky-400 border border-sky-500/20";
      default:
        return "bg-slate-500/10 text-slate-300 border border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-[var(--border)] pb-5">
        <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
          {UI_COPY.AUDIT.HEADER.TITLE}
        </h2>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          {UI_COPY.AUDIT.HEADER.DESCRIPTION}
        </p>
      </div>

      {/* Audit Log Table */}
      {logs.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border)] bg-[var(--background)]/75 text-[var(--muted-foreground)] uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.AUDIT.TABLE.TIMESTAMP}</th>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.AUDIT.TABLE.ACTION}</th>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.AUDIT.TABLE.ACTOR}</th>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.AUDIT.TABLE.TARGET}</th>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.AUDIT.TABLE.DETAILS}</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    {UI_COPY.AUDIT.TABLE.ACTIONS}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--background)]/40 transition-colors">
                    {/* Timestamp */}
                    <td className="px-4 py-3 text-[var(--muted-foreground)] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>

                    {/* Action Badge */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold ${getActionBadgeClass(log.action)}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    {/* Actor */}
                    <td className="px-4 py-3 text-[var(--foreground)]">
                      {log.actor?.email || log.actorId}
                    </td>

                    {/* Target */}
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">
                      {log.targetType}: {log.targetId.slice(0, 10)}...
                    </td>

                    {/* Details Snippet */}
                    <td className="px-4 py-3 text-[var(--muted-foreground)] max-w-xs truncate">
                      {log.metadata ? JSON.stringify(log.metadata) : "-"}
                    </td>

                    {/* Inspect Payload Button */}
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                        className="h-7 px-2 text-xs text-[var(--primary)] hover:bg-[var(--primary)]/10"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        {UI_COPY.COMMON.ACTIONS.INSPECT}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] p-12 text-center bg-[var(--card)]/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)] mb-3">
            <Terminal className="h-6 w-6" />
          </div>
          <h4 className="font-semibold text-sm text-[var(--foreground)]">
            {UI_COPY.AUDIT.TABLE.EMPTY_TEXT}
          </h4>
        </div>
      )}

      {/* Slide-out JSON Inspector */}
      <AuditInspectorDrawer
        log={selectedLog}
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
};
