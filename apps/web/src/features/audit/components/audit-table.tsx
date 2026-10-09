"use client";

/**
 * @file apps/web/src/features/audit/components/audit-table.tsx
 * @description Immutable security audit ledger table with severity badges and inspection trigger.
 * Fully built with @yuva-devlab/ui Table, Button, and Drawer components.
 * @module @devlab/portal-web/features/audit/components/audit-table
 */

import React, { useState } from "react";
import { Eye, Terminal } from "lucide-react";
import {
  Button,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@yuva-devlab/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { AuditAction } from "@/lib/constants";
import { AuditInspectorDrawer } from "./audit-inspector-drawer";
import type { AuditLog } from "@/features/audit/types";

interface AuditTableProps {
  logs: AuditLog[];
}

export const AuditTable: React.FC<AuditTableProps> = ({ logs }) => {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case AuditAction.APP_ACTIVATED:
        return "bg-success/10 text-success border border-success/20";
      case AuditAction.APP_DEACTIVATED:
        return "bg-destructive/10 text-destructive border border-destructive/20";
      case AuditAction.API_KEY_REVOKED:
        return "bg-warning/10 text-warning border border-warning/20";
      case AuditAction.APP_REGISTERED:
      case AuditAction.USER_INVITED:
        return "bg-info/10 text-info border border-info/20";
      default:
        return "bg-muted text-muted-foreground border border-border";
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
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-background/75 text-muted-foreground font-mono text-[10px] uppercase">
                <TableHead className="px-4 py-3 font-semibold">
                  {UI_COPY.AUDIT.TABLE.TIMESTAMP}
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  {UI_COPY.AUDIT.TABLE.ACTION}
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  {UI_COPY.AUDIT.TABLE.ACTOR}
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  {UI_COPY.AUDIT.TABLE.TARGET}
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  {UI_COPY.AUDIT.TABLE.DETAILS}
                </TableHead>
                <TableHead className="px-4 py-3 text-right font-semibold">
                  {UI_COPY.AUDIT.TABLE.ACTIONS}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-border divide-y font-mono text-[11px]">
              {logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-background/40 transition-colors">
                  {/* Timestamp */}
                  <TableCell className="text-muted-foreground px-4 py-3 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>

                  {/* Action Badge */}
                  <TableCell className="px-4 py-3">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold ${getActionBadgeClass(log.action)}`}
                    >
                      {log.action}
                    </span>
                  </TableCell>

                  {/* Actor */}
                  <TableCell className="text-foreground px-4 py-3">
                    {log.actor?.email || log.actorId}
                  </TableCell>

                  {/* Target */}
                  <TableCell className="text-muted-foreground px-4 py-3">
                    {log.targetType}: {log.targetId.slice(0, 10)}...
                  </TableCell>

                  {/* Details Snippet */}
                  <TableCell className="text-muted-foreground max-w-xs truncate px-4 py-3">
                    {log.metadata ? JSON.stringify(log.metadata) : "-"}
                  </TableCell>

                  {/* Inspect Payload Button */}
                  <TableCell className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                      className="text-primary hover:bg-primary/10 h-7 px-2 text-xs"
                    >
                      <Eye className="mr-1 size-3.5" />
                      {UI_COPY.COMMON.ACTIONS.INSPECT}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
