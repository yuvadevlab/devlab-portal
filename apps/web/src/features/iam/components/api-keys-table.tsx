"use client";

/**
 * @file apps/web/src/features/iam/components/api-keys-table.tsx
 * @description Tabular view of scoped machine-to-machine credentials with search and filtering.
 * Fully built with @devlab-portal/ui Table, Input, Select, and Button primitives.
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
} from "@devlab-portal/ui";
import { Heading } from "@devlab-portal/ui";
import { IamMetrics } from "./iam-metrics";
import { UI_COPY } from "@/lib/ui-copy";
import type { ApiKey } from "@/features/iam/types";
import type { RegisteredApp } from "@/lib/api-client";
import { useAppsQuery } from "@/features/apps/api";

export interface ApiKeysTableProps {
  apiKeys: ApiKey[];
  apps?: RegisteredApp[];
  onOpenGenerateModal: () => void;
  onRevokeKey: (id: string) => Promise<void>;
}

export const ApiKeysTable: React.FC<ApiKeysTableProps> = ({
  apiKeys,
  apps: propApps,
  onOpenGenerateModal,
  onRevokeKey,
}) => {
  const [search, setSearch] = useState("");

  const { data: queriedApps = [] } = useAppsQuery();
  const resolvedApps = propApps && propApps.length > 0 ? propApps : queriedApps;

  /**
   * Resolves raw application identifier to friendly registered application name.
   *
   * @param appId - Registered application identifier or database UUID
   * @returns Friendly application display name
   */
  const getAppName = (appId: string): string => {
    const matched = resolvedApps.find((a) => a.appId === appId || a.id === appId);
    return matched ? matched.name : appId;
  };
  const [selectedApp, setSelectedApp] = useState<string>(UI_COPY.COMMON.FILTERS.ALL);

  const appsInKeys = Array.from(new Set(apiKeys.map((k) => k.appId)));

  const filteredKeys = apiKeys.filter((k) => {
    const matchesApp = selectedApp === UI_COPY.COMMON.FILTERS.ALL || k.appId === selectedApp;
    const matchesSearch =
      k.name.toLowerCase().includes(search.toLowerCase()) ||
      k.keyPrefix.toLowerCase().includes(search.toLowerCase());
    return matchesApp && matchesSearch;
  });

  return (
    <>
      <Heading
        title={UI_COPY.IAM.HEADER.TITLE}
        description={UI_COPY.IAM.HEADER.DESCRIPTION}
        eyebrowLabel={UI_COPY.COMMON.HEADER.WORKSPACE}
      >
        <Button onClick={onOpenGenerateModal}>
          <Plus className="button-icon-prefix" />
          {UI_COPY.IAM.HEADER.CREATE_BTN}
        </Button>
      </Heading>

      <IamMetrics apiKeys={apiKeys} />

      {/* Toolbar */}
      <div className="app-toolbar">
        <div className="search-field">
          <Search className="search-field-icon" />
          <Input
            placeholder={UI_COPY.IAM.TOOLBAR.SEARCH_PLACEHOLDER}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={UI_COPY.IAM.TOOLBAR.SEARCH_PLACEHOLDER}
            className="app-search-input"
          />
        </div>

        <div className="filter-select-wrap">
          <Select value={selectedApp} onValueChange={setSelectedApp}>
            <SelectTrigger className="filter-select-trigger">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="filter-select-content">
              <SelectItem value={UI_COPY.COMMON.FILTERS.ALL}>
                {UI_COPY.IAM.TOOLBAR.ALL_APPLICATIONS}
              </SelectItem>
              {appsInKeys.map((appId) => (
                <SelectItem key={appId} value={appId}>
                  {getAppName(appId)}
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
              <TableHead className="cell-actions">{UI_COPY.IAM.TABLE.ACTIONS}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredKeys.map((k) => (
              <TableRow key={k.id}>
                <TableCell>
                  <div className="table-cell-title-wrap">
                    <KeyRound className="cell-icon" />
                    {k.name}
                  </div>
                </TableCell>
                <TableCell className="cell-mono-muted">{getAppName(k.appId)}</TableCell>
                <TableCell>
                  <code className="cell-code-muted">{k.keyPrefix}…</code>
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
                <TableCell className="cell-mono">
                  {k.rateLimitRpm.toLocaleString()}{" "}
                  <span className="cell-unit">{UI_COPY.IAM.TABLE.RPM}</span>
                </TableCell>
                <TableCell className="cell-date">
                  {new Date(k.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span className={`status ${k.isRevoked ? "suspended" : ""}`}>
                    <span className="status-dot" />
                    {k.isRevoked ? UI_COPY.COMMON.STATUS.REVOKED : UI_COPY.COMMON.STATUS.ACTIVE}
                  </span>
                </TableCell>
                <TableCell className="cell-actions">
                  <div className="cell-action-buttons">
                    <Button
                      size="icon"
                      variant="ghost"
                      title={`${UI_COPY.COMMON.ACTIONS.REFRESH} ${k.name}`}
                      aria-label={`${UI_COPY.COMMON.ACTIONS.REFRESH} ${k.name}`}
                      disabled={k.isRevoked}
                    >
                      <RefreshCw className="btn-icon-xs" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="cell-action-destructive"
                      title={`${UI_COPY.COMMON.ACTIONS.REVOKE} ${k.name}`}
                      aria-label={`${UI_COPY.COMMON.ACTIONS.REVOKE} ${k.name}`}
                      disabled={k.isRevoked}
                      onClick={() => onRevokeKey(k.id)}
                    >
                      <Ban className="cell-action-icon-danger" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredKeys.length === 0 && <p className="empty-state">{UI_COPY.IAM.TABLE.EMPTY_TEXT}</p>}
      </div>

      <div className="table-footer-info">
        {filteredKeys.length} {UI_COPY.IAM.TABLE.FOOTER_INFO}
      </div>
    </>
  );
};
