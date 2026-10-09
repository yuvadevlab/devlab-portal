/**
 * @file apps/web/src/features/iam/components/api-keys-table.tsx
 * @description Tabular view of active and revoked scoped API keys with prefix previews.
 * Consumes @yuva-devlab/ui Badge, Button, and CopyButton primitives.
 * @module @devlab/portal-web/features/iam/components/api-keys-table
 */

import React from "react";
import { Key, Plus, Trash2, ShieldCheck, Ban } from "lucide-react";
import { Badge, Button, CopyButton } from "@yuva-devlab/ui";
import { UI_COPY } from "../../../lib/ui-copy/index";
import type { ApiKey } from "../types";

interface ApiKeysTableProps {
  keys: ApiKey[];
  onOpenCreateModal: () => void;
  onRevokeKey: (id: string) => Promise<void>;
}

export const ApiKeysTable: React.FC<ApiKeysTableProps> = ({
  keys,
  onOpenCreateModal,
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
          onClick={onOpenCreateModal}
          className="bg-primary text-primary-foreground h-9 shrink-0 px-4 text-xs font-medium shadow-sm hover:opacity-90"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          {UI_COPY.IAM.HEADER.CREATE_BTN}
        </Button>
      </div>

      {/* Table Container */}
      {keys.length > 0 ? (
        <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-border bg-background/75 text-muted-foreground border-b font-mono text-[10px] uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.IAM.TABLE.NAME}</th>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.IAM.TABLE.PREFIX}</th>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.IAM.TABLE.SCOPES}</th>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.IAM.TABLE.RATE_LIMIT}</th>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.IAM.TABLE.CREATED}</th>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.IAM.TABLE.STATUS}</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    {UI_COPY.IAM.TABLE.ACTIONS}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {keys.map((k) => (
                  <tr key={k.id} className="hover:bg-background/40 transition-colors">
                    {/* Name */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Key className="text-primary h-3.5 w-3.5 shrink-0" />
                        <span className="text-foreground font-semibold">{k.name}</span>
                      </div>
                    </td>

                    {/* Key Prefix preview */}
                    <td className="text-muted-foreground px-4 py-3.5 font-mono text-[11px]">
                      <div className="flex items-center gap-1">
                        <span>{k.keyPrefix}</span>
                        <CopyButton textToCopy={k.keyPrefix} />
                      </div>
                    </td>

                    {/* Scopes Badges */}
                    <td className="px-4 py-3.5">
                      <div className="flex max-w-xs flex-wrap gap-1">
                        {k.scopes.map((scope) => (
                          <Badge
                            key={scope}
                            variant="outline"
                            className="border-border text-foreground font-mono text-[10px]"
                          >
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </td>

                    {/* Rate Limit */}
                    <td className="text-foreground px-4 py-3.5 font-mono text-[11px]">
                      {k.rateLimitRpm} rpm
                    </td>

                    {/* Created Date */}
                    <td className="text-muted-foreground px-4 py-3.5 font-mono text-[11px]">
                      {new Date(k.createdAt).toLocaleDateString()}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3.5">
                      {k.isRevoked ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                          <Ban className="h-3 w-3" />
                          {UI_COPY.COMMON.STATUS.REVOKED}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                          <ShieldCheck className="h-3 w-3" />
                          {UI_COPY.COMMON.STATUS.ACTIVE}
                        </span>
                      )}
                    </td>

                    {/* Revoke action */}
                    <td className="px-4 py-3.5 text-right">
                      {!k.isRevoked && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRevokeKey(k.id)}
                          className="h-7 px-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" />
                          {UI_COPY.COMMON.ACTIONS.REVOKE}
                        </Button>
                      )}
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
          <div className="bg-background border-border text-muted-foreground mb-3 flex h-12 w-12 items-center justify-center rounded-full border">
            <Key className="h-6 w-6" />
          </div>
          <h4 className="text-foreground text-sm font-semibold">{UI_COPY.IAM.TABLE.EMPTY_TEXT}</h4>
        </div>
      )}
    </div>
  );
};
