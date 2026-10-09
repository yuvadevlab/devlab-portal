"use client";

/**
 * @file apps/web/src/features/iam/components/api-keys-table.tsx
 * @description Tabular view of scoped machine-to-machine credentials with search and filtering.
 * Fully built with @yuva-devlab/ui Table, Input, Select, and Button primitives.
 * @module @devlab/portal-web/features/iam/components/api-keys-table
 */

import React, { useState } from "react";
import { Plus, KeyRound, RefreshCw, Ban, Search } from "lucide-react";
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
} from "@yuva-devlab/ui";
import { Heading } from "@/components/layout";
import { IamMetrics } from "./iam-metrics";
import { UI_COPY } from "@/lib/ui-copy";
import type { ApiKey } from "@/features/iam/types";

interface ApiKeysTableProps {
  apiKeys: ApiKey[];
  onOpenGenerateModal: () => void;
  onRevokeKey: (id: string) => Promise<void>;
}

export const ApiKeysTable: React.FC<ApiKeysTableProps> = ({
  apiKeys,
  onOpenGenerateModal,
  onRevokeKey,
}) => {
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState("All");

  const appsInKeys = Array.from(new Set(apiKeys.map((k) => k.appId)));

  const filteredKeys = apiKeys.filter((k) => {
    const matchesApp = selectedApp === "All" || k.appId === selectedApp;
    const matchesSearch =
      k.name.toLowerCase().includes(search.toLowerCase()) ||
      k.keyPrefix.toLowerCase().includes(search.toLowerCase());
    return matchesApp && matchesSearch;
  });

  return (
    <>
      <Heading title={UI_COPY.IAM.HEADER.TITLE} description={UI_COPY.IAM.HEADER.DESCRIPTION}>
        <Button onClick={onOpenGenerateModal}>
          <Plus className="mr-1.5 size-4" />
          {UI_COPY.IAM.HEADER.CREATE_BTN}
        </Button>
      </Heading>

      <IamMetrics apiKeys={apiKeys} />

      {/* Toolbar */}
      <div className="app-toolbar">
        <div className="search-field">
          <Search className="size-3.5" />
          <Input
            placeholder={UI_COPY.IAM.TOOLBAR.SEARCH_PLACEHOLDER}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={UI_COPY.IAM.TOOLBAR.SEARCH_PLACEHOLDER}
            className="bg-card border-border h-9 w-72 pl-9 text-xs"
          />
        </div>

        <div className="w-48">
          <Select value={selectedApp} onValueChange={setSelectedApp}>
            <SelectTrigger className="bg-card border-border h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">{UI_COPY.IAM.TOOLBAR.ALL_APPLICATIONS}</SelectItem>
              {appsInKeys.map((appId) => (
                <SelectItem key={appId} value={appId}>
                  {appId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{UI_COPY.IAM.TABLE.NAME}</TableHead>
              <TableHead>{UI_COPY.IAM.TABLE.APP}</TableHead>
              <TableHead>{UI_COPY.IAM.TABLE.PREFIX}</TableHead>
              <TableHead>{UI_COPY.IAM.TABLE.SCOPES}</TableHead>
              <TableHead>{UI_COPY.IAM.TABLE.RATE_LIMIT}</TableHead>
              <TableHead>{UI_COPY.IAM.TABLE.LAST_USED}</TableHead>
              <TableHead>{UI_COPY.IAM.TABLE.STATUS}</TableHead>
              <TableHead className="text-right">{UI_COPY.IAM.TABLE.ACTIONS}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredKeys.map((k) => (
              <TableRow key={k.id}>
                <TableCell>
                  <div className="flex items-center gap-2 font-medium">
                    <KeyRound className="text-muted-foreground size-3.5" />
                    {k.name}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">{k.appId}</TableCell>
                <TableCell>
                  <code className="text-muted-foreground font-mono text-[11px]">
                    {k.keyPrefix}…
                  </code>
                </TableCell>
                <TableCell>
                  <div className="scope-list">
                    {k.scopes.map((s) => (
                      <span className="tag" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {k.rateLimitRpm.toLocaleString()}{" "}
                  <span className="text-muted-foreground font-sans text-[10px]">
                    {UI_COPY.IAM.TABLE.RPM}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {new Date(k.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span className={`status ${k.isRevoked ? "suspended" : ""}`}>
                    <span className="status-dot" />
                    {k.isRevoked ? UI_COPY.COMMON.STATUS.REVOKED : UI_COPY.COMMON.STATUS.ACTIVE}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      title={`${UI_COPY.COMMON.ACTIONS.REFRESH} ${k.name}`}
                      aria-label={`${UI_COPY.COMMON.ACTIONS.REFRESH} ${k.name}`}
                      disabled={k.isRevoked}
                    >
                      <RefreshCw className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                      title={`${UI_COPY.COMMON.ACTIONS.REVOKE} ${k.name}`}
                      aria-label={`${UI_COPY.COMMON.ACTIONS.REVOKE} ${k.name}`}
                      disabled={k.isRevoked}
                      onClick={() => onRevokeKey(k.id)}
                    >
                      <Ban className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredKeys.length === 0 && <p className="empty-state">{UI_COPY.IAM.TABLE.EMPTY_TEXT}</p>}
      </div>

      <div className="text-muted-foreground mt-4 text-xs">
        {filteredKeys.length} {UI_COPY.IAM.TABLE.FOOTER_INFO}
      </div>
    </>
  );
};
