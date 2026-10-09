"use client";

/**
 * @file apps/web/src/features/team/components/team-table.tsx
 * @description Organization members and RBAC role assignments table with hierarchy viewer.
 * Fully built with @yuva-devlab/ui Table, Input, Select, Checkbox, Label, and Button components.
 * @module @devlab/portal-web/features/team/components/team-table
 */

import React, { useState } from "react";
import { UserPlus, Trash2, Search } from "lucide-react";
import {
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
  Label,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@yuva-devlab/ui";
import { Heading } from "@/components/layout";
import { RoleHierarchy } from "./role-hierarchy";
import { UI_COPY } from "@/lib/ui-copy";
import { UserRole } from "@/lib/constants/enums";
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
          <Input
            placeholder={UI_COPY.TEAM.TOOLBAR.SEARCH_PLACEHOLDER}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={UI_COPY.TEAM.TOOLBAR.SEARCH_PLACEHOLDER}
            className="bg-card border-border h-9 w-72 pl-9 text-xs"
          />
        </div>
        <span className="text-muted-foreground text-xs whitespace-nowrap">
          {filteredMembers.length} {UI_COPY.TEAM.TOOLBAR.MEMBERS_SUFFIX}
        </span>
      </div>

      {/* Members Table */}
      <div className="table-wrap">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{UI_COPY.TEAM.TABLE.MEMBER}</TableHead>
              <TableHead>{UI_COPY.TEAM.TABLE.ROLE}</TableHead>
              <TableHead>{UI_COPY.TEAM.TABLE.STATUS}</TableHead>
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
                          {isSelf && (
                            <span className="tag ml-2 py-0!">{UI_COPY.TEAM.TABLE.YOU_TAG}</span>
                          )}
                        </div>
                        <div className="text-muted-foreground mt-0.5 font-mono text-[11px]">
                          {m.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    <div className="w-36">
                      <Select value={m.role} disabled={isSelf} onValueChange={() => {}}>
                        <SelectTrigger className="bg-secondary h-8 font-mono text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={UserRole.SUPER_ADMIN}>
                            {UserRole.SUPER_ADMIN}
                          </SelectItem>
                          <SelectItem value={UserRole.ADMIN}>{UserRole.ADMIN}</SelectItem>
                          <SelectItem value={UserRole.DEVELOPER}>{UserRole.DEVELOPER}</SelectItem>
                          <SelectItem value={UserRole.OPERATOR}>{UserRole.OPERATOR}</SelectItem>
                          <SelectItem value={UserRole.READ_ONLY}>{UserRole.READ_ONLY}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>

                  {/* Status toggle */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`status-${m.id}`}
                        checked={m.isActive}
                        disabled={isSelf}
                        onCheckedChange={() => {}}
                        aria-label={`Status for ${m.name}`}
                      />
                      <Label
                        htmlFor={`status-${m.id}`}
                        className={`cursor-pointer text-xs font-normal ${
                          m.isActive ? "text-success" : "text-muted-foreground"
                        }`}
                      >
                        {m.isActive ? UI_COPY.TEAM.TABLE.ACTIVE : UI_COPY.TEAM.TABLE.DISABLED}
                      </Label>
                    </div>
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
                      <Trash2 className="text-destructive size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredMembers.length === 0 && (
          <div className="empty-state">{UI_COPY.TEAM.TABLE.EMPTY_TEXT}</div>
        )}
      </div>
    </>
  );
};
