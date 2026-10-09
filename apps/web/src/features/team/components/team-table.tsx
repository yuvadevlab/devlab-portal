/**
 * @file apps/web/src/features/team/components/team-table.tsx
 * @description Organization members and RBAC role assignments table.
 * @module @devlab/portal-web/features/team/components/team-table
 */

import React from "react";
import { Users, Plus, ShieldCheck } from "lucide-react";
import { Badge, Button } from "@yuva-devlab/ui";
import { UI_COPY } from "../../../lib/ui-copy/index";
import { UserRole } from "../../../lib/constants/enums";
import type { UserMember } from "../types";

interface TeamTableProps {
  members: UserMember[];
  onOpenInviteModal: () => void;
}

export const TeamTable: React.FC<TeamTableProps> = ({ members, onOpenInviteModal }) => {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      case UserRole.ADMIN:
        return "bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20";
      case UserRole.DEVELOPER:
        return "bg-sky-500/10 text-sky-400 border border-sky-500/20";
      default:
        return "bg-slate-500/10 text-slate-300 border border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
            {UI_COPY.TEAM.HEADER.TITLE}
          </h2>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            {UI_COPY.TEAM.HEADER.DESCRIPTION}
          </p>
        </div>
        <Button
          onClick={onOpenInviteModal}
          className="bg-primary text-primary-foreground hover:opacity-90 font-medium text-xs h-9 px-4 shrink-0 shadow-sm"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          {UI_COPY.TEAM.HEADER.INVITE_BTN}
        </Button>
      </div>

      {/* Table */}
      {members.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-(--background)/75 text-muted-foreground uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.TEAM.TABLE.MEMBER}</th>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.TEAM.TABLE.EMAIL}</th>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.TEAM.TABLE.ROLE}</th>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.TEAM.TABLE.STATUS}</th>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.TEAM.TABLE.JOINED}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-(--background)/40 transition-colors">
                    {/* Member */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-(--primary)/15 text-(--primary) font-bold text-xs">
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-foreground">{m.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3.5 font-mono text-[11px] text-muted-foreground">
                      {m.email}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-mono font-semibold ${getRoleBadgeVariant(m.role)}`}
                      >
                        {m.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                        <ShieldCheck className="h-3 w-3" />
                        {UI_COPY.COMMON.STATUS.ACTIVE}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-3.5 font-mono text-[11px] text-[var(--muted-foreground)]">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] p-12 text-center bg-[var(--card)]/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)] mb-3">
            <Users className="h-6 w-6" />
          </div>
          <h4 className="font-semibold text-sm text-[var(--foreground)]">
            {UI_COPY.TEAM.TABLE.EMPTY_TEXT}
          </h4>
        </div>
      )}
    </div>
  );
};
