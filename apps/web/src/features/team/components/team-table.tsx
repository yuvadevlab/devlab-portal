"use client";

/**
 * @file apps/web/src/features/team/components/team-table.tsx
 * @description Organization members and RBAC role assignments table with hierarchy viewer.
 * Fully built with @devlab-portal/ui Table, Input, Select, Checkbox, Label, and Button components.
 * @module @devlab/portal-web/features/team/components/team-table
 */

import React, { useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";
import {
  Button,
  SearchInput,
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
} from "@devlab-portal/ui";
import { Heading } from "@devlab-portal/ui";
import { RoleHierarchy } from "./role-hierarchy";
import { UI_COPY } from "@/lib/ui-copy";
import { UserRole, AppAccessScope } from "@/lib/constants/enums";
import type { RegisteredApp } from "@/lib/api-client";
import { useAppsQuery } from "@/features/apps/api";
import type { UserMember } from "@/features/team/types";

/**
 * Properties required to render the {@link TeamTable} roster.
 */
export interface TeamTableProps {
  /** Array of active organization team members */
  members: UserMember[];
  /** Optional ecosystem applications catalog */
  apps?: RegisteredApp[];
  /** Callback opening the member invitation modal */
  onOpenInviteModal: () => void;
}

/**
 * Displays the team member roster with search filtering, RBAC role assignments,
 * authorized application badges, and activation status toggles.
 *
 * @param props - Component configuration satisfying {@link TeamTableProps}
 * @returns React element rendering team table
 */
export const TeamTable: React.FC<TeamTableProps> = ({
  members,
  apps: propApps,
  onOpenInviteModal,
}) => {
  const [search, setSearch] = useState("");

  const { data: queriedApps = [] } = useAppsQuery();
  const resolvedApps = propApps && propApps.length > 0 ? propApps : queriedApps;

  /**
   * Resolves application identifier to user-friendly display name.
   *
   * @param appId - Registered application identifier or wildcard
   * @returns User-friendly application display name
   */
  const getAppName = (appId: string): string => {
    if (appId === AppAccessScope.ALL) {
      return UI_COPY.COMMON.MEMBER.ALL_APPLICATIONS;
    }
    const matched = resolvedApps.find((a) => a.appId === appId || a.id === appId);
    return matched ? matched.name : appId;
  };

  /**
   * Filter members by matching name, email, or role against search query.
   */
  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()),
  );

  /**
   * Generates two-letter uppercase avatar initials from display name or email.
   *
   * @param name - Member display name
   * @param email - Member corporate email
   * @returns Two-character avatar string
   */
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
      <Heading
        title={UI_COPY.TEAM.HEADER.TITLE}
        description={UI_COPY.TEAM.HEADER.DESCRIPTION}
        eyebrowLabel={UI_COPY.COMMON.HEADER.WORKSPACE}
      >
        <Button onClick={onOpenInviteModal}>
          <UserPlus className="button-icon-prefix" />
          {UI_COPY.TEAM.HEADER.INVITE_BTN}
        </Button>
      </Heading>

      <RoleHierarchy />

      {/* Toolbar */}
      <div className="app-toolbar">
        <div className="search-field">
          <SearchInput
            placeholder={UI_COPY.TEAM.TOOLBAR.SEARCH_PLACEHOLDER}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            aria-label={UI_COPY.TEAM.TOOLBAR.SEARCH_PLACEHOLDER}
            className="app-search-input"
          />
        </div>
        <span className="table-count-badge">
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
              <TableHead className="cell-actions" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((m) => {
              const isSelf = m.email.includes("admin@") || m.email.includes("yuvaraj@");
              return (
                <TableRow key={m.id}>
                  {/* Member identity & authorized apps */}
                  <TableCell>
                    <div className="member-cell">
                      <span className="avatar">{getInitials(m.name, m.email)}</span>
                      <div>
                        <div className="member-name-row">
                          {m.name}
                          {isSelf && (
                            <span className="tag tag-self">{UI_COPY.TEAM.TABLE.YOU_TAG}</span>
                          )}
                        </div>
                        <div className="member-email">{m.email}</div>
                        {/* Authorized application badges */}
                        {m.allowedApps && m.allowedApps.length > 0 && (
                          <div className="member-apps-row">
                            {m.allowedApps.map((app) => (
                              <span key={app} className="member-app-badge">
                                {getAppName(app)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    <div className="member-role-select-wrap">
                      <Select value={m.role} disabled={isSelf} onValueChange={() => {}}>
                        <SelectTrigger className="member-role-select-trigger">
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
                          <SelectItem value={UserRole.MEMBER}>{UserRole.MEMBER}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>

                  {/* Status toggle */}
                  <TableCell>
                    <div className="member-status-row">
                      <Checkbox
                        id={`status-${m.id}`}
                        checked={m.isActive}
                        disabled={isSelf}
                        onCheckedChange={() => {}}
                        aria-label={UI_COPY.TEAM.APP_ACCESS.STATUS_FOR(m.name)}
                      />
                      <Label
                        htmlFor={`status-${m.id}`}
                        className={`member-status-label ${m.isActive ? "active" : "inactive"}`}
                      >
                        {m.isActive ? UI_COPY.TEAM.TABLE.ACTIVE : UI_COPY.TEAM.TABLE.DISABLED}
                      </Label>
                    </div>
                  </TableCell>

                  {/* Action */}
                  <TableCell className="cell-actions">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isSelf}
                      aria-label={UI_COPY.TEAM.APP_ACCESS.REMOVE_MEMBER(m.name)}
                      className="cell-action-destructive"
                    >
                      <Trash2 className="cell-action-icon-danger" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
