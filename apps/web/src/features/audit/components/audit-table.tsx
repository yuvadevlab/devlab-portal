/**
 * @file apps/web/src/features/audit/components/audit-table.tsx
 * @description Immutable security audit ledger table with severity badges and inspection trigger.
 * @module @devlab/portal-web/features/audit/components/audit-table
 */

import React, { useState } from "react";
import { Eye, Terminal } from "lucide-react";
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
      <div className="border-border border-b pb-5">
        <h2 className="text-foreground text-xl font-bold tracking-tight">
          {UI_COPY.AUDIT.HEADER.TITLE}
        </h2>
        <p className="text-muted-foreground mt-1 text-xs">{UI_COPY.AUDIT.HEADER.DESCRIPTION}</p>
      </div>

      {/* Audit Log Table */}
      {logs.length > 0 ? (
        <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-border bg-background/75 text-muted-foreground border-b font-mono text-[10px] uppercase">
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
              <tbody className="divide-border divide-y font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-background/40 transition-colors">
                    {/* Timestamp */}
                    <td className="text-muted-foreground px-4 py-3 whitespace-nowrap">
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
                    <td className="text-foreground px-4 py-3">{log.actor?.email || log.actorId}</td>

                    {/* Target */}
                    <td className="text-muted-foreground px-4 py-3">
                      {log.targetType}: {log.targetId.slice(0, 10)}...
                    </td>

                    {/* Details Snippet */}
                    <td className="text-muted-foreground max-w-xs truncate px-4 py-3">
                      {log.metadata ? JSON.stringify(log.metadata) : "-"}
                    </td>

                    {/* Inspect Payload Button */}
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                        className="text-primary hover:bg-primary/10 h-7 px-2 text-xs"
                      >
                        <Eye className="mr-1 size-3.5" />
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
        <div className="border-border bg-card/40 flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
          <div className="bg-background border-border text-muted-foreground mb-3 flex size-12 items-center justify-center rounded-full border">
            <Terminal className="size-6" />
          </div>
          <h4 className="text-foreground text-sm font-semibold">
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
