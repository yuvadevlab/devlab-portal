"use client";

/**
 * @file apps/web/src/features/team/components/team-table.tsx
 * @description Organization members and RBAC role assignments table with hierarchy viewer.
 * Fully built with @yuva-devlab/ui Table and Button components.
 * @module @devlab/portal-web/features/team/components/team-table
 */

import React, { useState } from "react";
import { UserPlus, Trash2, Search } from "lucide-react";
import {
  Button,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
} from "@yuva-devlab/ui";
import { Heading } from "@/components/layout";
import { RoleHierarchy } from "./role-hierarchy";
import { UI_COPY } from "@/lib/ui-copy";
import type { UserMember } from "@/features/team/types";

interface TeamTableProps {
  members: UserMember[];
  onOpenInviteModal: () => void;
}

export const TeamTable: React.FC<TeamTableProps> = ({ members, onOpenInviteModal }) => {
  const [search, setSearch] = useState("");

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()),
  );

  const getInitials = (name: string, email: string): string => {
    if (name.trim()) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2 && parts[0] && parts[1]) {
        return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <Heading title={UI_COPY.TEAM.HEADER.TITLE} description={UI_COPY.TEAM.HEADER.DESCRIPTION}>
        <Button onClick={onOpenInviteModal}>
          <UserPlus className="mr-1.5 size-4" />
          {UI_COPY.TEAM.HEADER.INVITE_BTN}
        </Button>
      </Heading>

      <RoleHierarchy />

      {/* Toolbar */}
      <div className="app-toolbar">
        <div className="search-field">
          <Search className="size-3.5" />
          <input
            placeholder="Search team members…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search team members"
          />
        </div>
        <span className="text-muted-foreground text-xs whitespace-nowrap">
          {filteredMembers.length} members
        </span>
      </div>

      {/* Members Table */}
      <div className="table-wrap">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((m) => {
              const isSelf = m.email.includes("admin@") || m.email.includes("yuvaraj@");
              return (
                <TableRow key={m.id}>
                  {/* Member identity */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="avatar">{getInitials(m.name, m.email)}</span>
                      <div>
                        <div className="text-foreground flex items-center text-xs font-semibold">
                          {m.name}
                          {isSelf && <span className="tag ml-2 py-0!">You</span>}
                        </div>
                        <div className="text-muted-foreground mt-0.5 font-mono text-[11px]">
                          {m.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    <select
                      className="filter-select h-8 py-1 text-xs"
                      disabled={isSelf}
                      value={m.role}
                      aria-label={`Role for ${m.name}`}
                      onChange={() => {}}
                    >
                      <option value="super_admin">super_admin</option>
                      <option value="admin">admin</option>
                      <option value="developer">developer</option>
                      <option value="operator">operator</option>
                      <option value="read_only">read_only</option>
                    </select>
                  </TableCell>

                  {/* Status toggle */}
                  <TableCell>
                    <label className="flex cursor-pointer items-center gap-2 text-xs">
                      <Checkbox
                        checked={m.isActive}
                        disabled={isSelf}
                        onCheckedChange={() => {}}
                        aria-label={`Active status for ${m.name}`}
                      />
                      <span className={m.isActive ? "text-success" : "text-muted-foreground"}>
                        {m.isActive ? "Active" : "Disabled"}
                      </span>
                    </label>
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isSelf}
                      aria-label={`Remove ${m.name}`}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredMembers.length === 0 && (
          <div className="empty-state">No team members match your search.</div>
        )}
      </div>
    </>
  );
};
