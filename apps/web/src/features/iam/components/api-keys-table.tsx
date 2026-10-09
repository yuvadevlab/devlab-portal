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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
            {UI_COPY.IAM.HEADER.TITLE}
          </h2>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            {UI_COPY.IAM.HEADER.DESCRIPTION}
          </p>
        </div>
        <Button
          onClick={onOpenCreateModal}
          className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 font-medium text-xs h-9 px-4 shrink-0 shadow-sm"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          {UI_COPY.IAM.HEADER.CREATE_BTN}
        </Button>
      </div>

      {/* Table Container */}
      {keys.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border)] bg-[var(--background)]/75 text-[var(--muted-foreground)] uppercase font-mono text-[10px]">
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
              <tbody className="divide-y divide-[var(--border)]">
                {keys.map((k) => (
                  <tr key={k.id} className="hover:bg-[var(--background)]/40 transition-colors">
                    {/* Name */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Key className="h-3.5 w-3.5 text-[var(--primary)] shrink-0" />
                        <span className="font-semibold text-[var(--foreground)]">{k.name}</span>
                      </div>
                    </td>

                    {/* Key Prefix preview */}
                    <td className="px-4 py-3.5 font-mono text-[11px] text-[var(--muted-foreground)]">
                      <div className="flex items-center gap-1">
                        <span>{k.keyPrefix}</span>
                        <CopyButton textToCopy={k.keyPrefix} />
                      </div>
                    </td>

                    {/* Scopes Badges */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {k.scopes.map((scope) => (
                          <Badge
                            key={scope}
                            variant="outline"
                            className="text-[10px] font-mono border-[var(--border)] text-[var(--foreground)]"
                          >
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </td>

                    {/* Rate Limit */}
                    <td className="px-4 py-3.5 font-mono text-[11px] text-[var(--foreground)]">
                      {k.rateLimitRpm} rpm
                    </td>

                    {/* Created Date */}
                    <td className="px-4 py-3.5 font-mono text-[11px] text-[var(--muted-foreground)]">
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
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
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
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] p-12 text-center bg-[var(--card)]/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)] mb-3">
            <Key className="h-6 w-6" />
          </div>
          <h4 className="font-semibold text-sm text-[var(--foreground)]">
            {UI_COPY.IAM.TABLE.EMPTY_TEXT}
          </h4>
        </div>
      )}
    </div>
  );
};
