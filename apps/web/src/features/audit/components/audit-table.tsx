"use client";

/**
 * @file apps/web/src/features/audit/components/audit-table.tsx
 * @description Immutable security audit ledger table with forensic inspection and JSON export.
 * Fully built with @devlab-portal/ui Table, Input, Select, Button, and Drawer components.
 * @module @devlab/portal-web/features/audit/components/audit-table
 */

import React, { useState } from "react";
import { Download, ShieldCheck, ArrowUpRight, Search } from "lucide-react";
import {
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@devlab-portal/ui";
import { Heading } from "@devlab-portal/ui";
import { AuditMetrics } from "./audit-metrics";
import { AuditInspectorDrawer } from "./audit-inspector-drawer";
import { UI_COPY } from "@/lib/ui-copy";
import { AuditAction } from "@/lib/constants/enums";
import type { AuditLog } from "@/features/audit/types";

interface AuditTableProps {
  logs: AuditLog[];
}

export const AuditTable: React.FC<AuditTableProps> = ({ logs }) => {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>(UI_COPY.COMMON.FILTERS.ALL);
  const [dateFilter, setDateFilter] = useState("");

  const standardActions = [
    "key.created",
    "app.registered",
    "role.updated",
    "key.rotated",
    "killswitch.activated",
    AuditAction.APP_REGISTERED,
    AuditAction.APP_ACTIVATED,
    AuditAction.APP_DEACTIVATED,
    AuditAction.API_KEY_CREATED,
    AuditAction.API_KEY_REVOKED,
    AuditAction.USER_INVITED,
  ];
  const actions = Array.from(new Set([...logs.map((l) => l.action), ...standardActions])).filter(
    Boolean,
  );

  const filteredLogs = logs.filter((l) => {
    const matchesAction = actionFilter === UI_COPY.COMMON.FILTERS.ALL || l.action === actionFilter;
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
    anchor.download = UI_COPY.AUDIT.HEADER.EXPORT_FILENAME;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Heading
        title={UI_COPY.AUDIT.HEADER.TITLE}
        description={UI_COPY.AUDIT.HEADER.DESCRIPTION}
        eyebrowLabel={UI_COPY.COMMON.HEADER.WORKSPACE}
      >
        <Button variant="outline" onClick={exportLedger} className="export-ledger-btn">
          <Download className="button-icon-prefix" />
          {UI_COPY.AUDIT.HEADER.EXPORT_BTN}
        </Button>
      </Heading>

      <AuditMetrics logs={logs} />

      {/* Toolbar */}
      <div className="app-toolbar">
        <div className="search-field">
          <Search className="search-field-icon" />
          <Input
            placeholder={UI_COPY.AUDIT.TOOLBAR.SEARCH_PLACEHOLDER}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={UI_COPY.AUDIT.TOOLBAR.SEARCH_PLACEHOLDER}
            className="app-search-input"
          />
        </div>

        <div className="audit-toolbar-filters">
          <div className="filter-select-wrap filter-select-action">
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="filter-select-trigger">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="filter-select-content">
                <SelectItem value={UI_COPY.COMMON.FILTERS.ALL}>
                  {UI_COPY.AUDIT.TOOLBAR.ALL_ACTIONS}
                </SelectItem>
                {actions.map((act) => (
                  <SelectItem key={act} value={act}>
                    {act}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            type="date"
            className="audit-date-input"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            onClick={(e) => {
              try {
                e.currentTarget.showPicker?.();
              } catch {
                // Ignore fallback
              }
            }}
            aria-label={UI_COPY.AUDIT.TOOLBAR.DATE_ARIA}
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="table-wrap">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{UI_COPY.AUDIT.TABLE.TIMESTAMP}</TableHead>
              <TableHead>{UI_COPY.AUDIT.TABLE.ACTION}</TableHead>
              <TableHead>{UI_COPY.AUDIT.TABLE.ACTOR}</TableHead>
              <TableHead>{UI_COPY.AUDIT.TABLE.TARGET_ENTITY}</TableHead>
              <TableHead>{UI_COPY.AUDIT.TABLE.IP_ADDRESS}</TableHead>
              <TableHead className="cell-actions" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => {
              const isKillswitch =
                log.action.includes("kill") || log.action.includes("deactivated");
              return (
                <TableRow key={log.id}>
                  <TableCell className="cell-timestamp">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className={`tag ${isKillswitch ? "tag-destructive" : "tag-primary"}`}>
                      <ShieldCheck className="tag-icon" />
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="cell-actor">{log.actor?.email || log.actorId}</TableCell>
                  <TableCell className="cell-target">
                    {log.targetType}: {log.targetId.slice(0, 8)}…
                  </TableCell>
                  <TableCell className="cell-ip">192.168.1.24</TableCell>
                  <TableCell className="cell-actions">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                      className="inspect-btn"
                    >
                      {UI_COPY.AUDIT.TABLE.INSPECT}
                      <ArrowUpRight className="inspect-btn-icon" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredLogs.length === 0 && (
          <div className="empty-state">{UI_COPY.AUDIT.TABLE.EMPTY_TEXT}</div>
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
