"use client";

/**
 * @file apps/web/src/features/iam/components/api-keys-table.tsx
 * @description Tabular view of active and revoked scoped API keys with prefix previews.
 * Fully built with @yuva-devlab/ui Table, Badge, Button, and CopyButton primitives.
 * @module @devlab/portal-web/features/iam/components/api-keys-table
 */

import React from "react";
import { Key, Plus, Trash2, ShieldCheck, Ban } from "lucide-react";
import {
  Badge,
  Button,
  CopyButton,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@yuva-devlab/ui";
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
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-foreground text-xl font-bold tracking-tight">
            {UI_COPY.IAM.HEADER.TITLE}
          </h2>
          <p className="text-muted-foreground mt-1 text-xs">{UI_COPY.IAM.HEADER.DESCRIPTION}</p>
        </div>
        <Button
          onClick={onOpenGenerateModal}
          className="bg-primary text-primary-foreground h-9 shrink-0 px-4 text-xs font-medium shadow-sm hover:opacity-90"
        >
          <Plus className="mr-1.5 size-4" />
          {UI_COPY.IAM.HEADER.CREATE_BTN}
        </Button>
      </div>

      {/* Keys Table */}
      {apiKeys.length > 0 ? (
        <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-background/75 text-muted-foreground font-mono text-[10px] uppercase">
                <TableHead className="px-4 py-3 font-semibold">{UI_COPY.IAM.TABLE.NAME}</TableHead>
                <TableHead className="px-4 py-3 font-semibold">{UI_COPY.IAM.TABLE.APP}</TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  {UI_COPY.IAM.TABLE.PREFIX}
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  {UI_COPY.IAM.TABLE.SCOPES}
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  {UI_COPY.IAM.TABLE.RATE_LIMIT}
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  {UI_COPY.IAM.TABLE.CREATED}
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  {UI_COPY.IAM.TABLE.STATUS}
                </TableHead>
                <TableHead className="px-4 py-3 text-right font-semibold">
                  {UI_COPY.IAM.TABLE.ACTIONS}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-border divide-y">
              {apiKeys.map((k) => (
                <TableRow key={k.id} className="hover:bg-background/40 transition-colors">
                  {/* Name */}
                  <TableCell className="text-foreground px-4 py-3.5 font-semibold">
                    {k.name}
                  </TableCell>

                  {/* App badge */}
                  <TableCell className="px-4 py-3.5">
                    <span className="text-muted-foreground font-mono text-xs">{k.appId}</span>
                  </TableCell>

                  {/* Prefix Preview */}
                  <TableCell className="px-4 py-3.5 font-mono text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-foreground">{k.keyPrefix}...</span>
                      <CopyButton textToCopy={k.keyPrefix} />
                    </div>
                  </TableCell>

                  {/* Scopes */}
                  <TableCell className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {k.scopes.map((scope) => (
                        <Badge
                          key={scope}
                          variant="secondary"
                          className="bg-primary/10 text-primary border-primary/20 font-mono text-[9px]"
                        >
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  {/* Rate Limit */}
                  <TableCell className="text-foreground px-4 py-3.5 font-mono text-[11px]">
                    {k.rateLimitRpm} rpm
                  </TableCell>

                  {/* Created Date */}
                  <TableCell className="text-muted-foreground px-4 py-3.5 font-mono text-[11px]">
                    {new Date(k.createdAt).toLocaleDateString()}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="px-4 py-3.5">
                    {k.isRevoked ? (
                      <span className="bg-destructive/10 text-destructive inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold">
                        <Ban className="size-3" />
                        {UI_COPY.COMMON.STATUS.REVOKED}
                      </span>
                    ) : (
                      <span className="bg-success/10 text-success inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold">
                        <ShieldCheck className="size-3" />
                        {UI_COPY.COMMON.STATUS.ACTIVE}
                      </span>
                    )}
                  </TableCell>

                  {/* Revoke action */}
                  <TableCell className="px-4 py-3.5 text-right">
                    {!k.isRevoked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRevokeKey(k.id)}
                        className="text-destructive hover:bg-destructive/10 h-7 px-2 text-xs"
                      >
                        <Trash2 className="mr-1 size-3.5" />
                        {UI_COPY.COMMON.ACTIONS.REVOKE}
                      </Button>
                    )}
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
            <Key className="size-6" />
          </div>
          <h4 className="text-foreground text-sm font-semibold">{UI_COPY.IAM.TABLE.EMPTY_TEXT}</h4>
        </div>
      )}
    </div>
  );
};
