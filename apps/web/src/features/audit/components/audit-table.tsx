"use client";

/**
 * @file apps/web/src/features/audit/components/audit-table.tsx
 * @description Immutable security audit ledger table with forensic inspection and JSON export.
 * Fully built with @yuva-devlab/ui Table, Button, and Drawer components.
 * @module @devlab/portal-web/features/audit/components/audit-table
 */

import React, { useState } from "react";
import { Download, ShieldCheck, ArrowUpRight, Search } from "lucide-react";
import {
  Button,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@yuva-devlab/ui";
import { Heading } from "@/components/layout";
import { AuditMetrics } from "./audit-metrics";
import { AuditInspectorDrawer } from "./audit-inspector-drawer";
import { UI_COPY } from "@/lib/ui-copy";
import type { AuditLog } from "@/features/audit/types";

interface AuditTableProps {
  logs: AuditLog[];
}

export const AuditTable: React.FC<AuditTableProps> = ({ logs }) => {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const actions = Array.from(new Set(logs.map((l) => l.action)));

  const filteredLogs = logs.filter((l) => {
    const matchesAction = actionFilter === "All" || l.action === actionFilter;
    const matchesSearch =
      (l.actor?.email || l.actorId).toLowerCase().includes(search.toLowerCase()) ||
      l.targetId.toLowerCase().includes(search.toLowerCase()) ||
      l.targetType.toLowerCase().includes(search.toLowerCase());

    const matchesDate =
      !dateFilter || new Date(l.createdAt).toISOString().slice(0, 10) === dateFilter;

    return matchesAction && matchesSearch && matchesDate;
  });

  const exportLedger = () => {
    const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "devlab-audit-ledger.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Heading title={UI_COPY.AUDIT.HEADER.TITLE} description={UI_COPY.AUDIT.HEADER.DESCRIPTION}>
        <Button variant="outline" onClick={exportLedger} className="gap-1.5">
          <Download className="size-4" />
          Export ledger
        </Button>
      </Heading>

      <AuditMetrics logs={logs} />

      {/* Toolbar */}
      <div className="app-toolbar">
        <div className="search-field">
          <Search className="size-3.5" />
          <input
            placeholder="Search actor or target…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search audit events"
          />
        </div>

        <div className="flex gap-2.5">
          <select
            className="filter-select text-xs"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            aria-label="Filter action type"
          >
            <option value="All">All action types</option>
            {actions.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="filter-select text-xs"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            aria-label="Filter event date"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="table-wrap">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Target entity</TableHead>
              <TableHead>IP address</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => {
              const isKillswitch =
                log.action.includes("kill") || log.action.includes("deactivated");
              return (
                <TableRow key={log.id}>
                  <TableCell className="text-muted-foreground text-[11px] whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className={`tag ${isKillswitch ? "text-destructive" : "text-primary"}`}>
                      <ShieldCheck className="size-3" />
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="text-foreground text-xs font-medium">
                    {log.actor?.email || log.actorId}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {log.targetType}: {log.targetId.slice(0, 8)}…
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-[11px]">
                    192.168.1.24
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                      className="gap-1 text-xs"
                    >
                      Inspect
                      <ArrowUpRight className="size-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredLogs.length === 0 && (
          <div className="empty-state">No events match your filters.</div>
        )}
      </div>

      {/* Slide-out JSON Inspector */}
      <AuditInspectorDrawer
        log={selectedLog}
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
      />
    </>
  );
};
