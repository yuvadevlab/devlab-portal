/**
 * @file apps/web/src/features/team/components/team-table.tsx
 * @description Organization members and RBAC role assignments table.
 * @module @devlab/portal-web/features/team/components/team-table
 */

import React from "react";
import { Users, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@yuva-devlab/ui";
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
        return "bg-primary/10 text-primary border border-primary/20";
      case UserRole.DEVELOPER:
        return "bg-sky-500/10 text-sky-400 border border-sky-500/20";
      default:
        return "bg-slate-500/10 text-slate-300 border border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-foreground text-xl font-bold tracking-tight">
            {UI_COPY.TEAM.HEADER.TITLE}
          </h2>
          <p className="text-muted-foreground mt-1 text-xs">{UI_COPY.TEAM.HEADER.DESCRIPTION}</p>
        </div>
        <Button
          onClick={onOpenInviteModal}
          className="bg-primary text-primary-foreground h-9 shrink-0 px-4 text-xs font-medium shadow-sm hover:opacity-90"
        >
          <Plus className="mr-1.5 size-4" />
          {UI_COPY.TEAM.HEADER.INVITE_BTN}
        </Button>
      </div>

      {/* Table */}
      {members.length > 0 ? (
        <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-border bg-background/75 text-muted-foreground border-b font-mono text-[10px] uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.TEAM.TABLE.MEMBER}</th>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.TEAM.TABLE.EMAIL}</th>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.TEAM.TABLE.ROLE}</th>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.TEAM.TABLE.STATUS}</th>
                  <th className="px-4 py-3 font-semibold">{UI_COPY.TEAM.TABLE.JOINED}</th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-background/40 transition-colors">
                    {/* Member */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-primary/15 text-primary flex size-7 items-center justify-center rounded-full text-xs font-bold">
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-foreground font-semibold">{m.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="text-muted-foreground px-4 py-3.5 font-mono text-[11px]">
                      {m.email}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold ${getRoleBadgeVariant(m.role)}`}
                      >
                        {m.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                        <ShieldCheck className="size-3" />
                        {UI_COPY.COMMON.STATUS.ACTIVE}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="text-muted-foreground px-4 py-3.5 font-mono text-[11px]">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="border-border bg-card/40 flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
          <div className="bg-background border-border text-muted-foreground mb-3 flex size-12 items-center justify-center rounded-full border">
            <Users className="size-6" />
          </div>
          <h4 className="text-foreground text-sm font-semibold">{UI_COPY.TEAM.TABLE.EMPTY_TEXT}</h4>
        </div>
      )}
    </div>
  );
};
