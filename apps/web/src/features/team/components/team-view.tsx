"use client";

/**
 * @file apps/web/src/features/team/components/team-view.tsx
 * @description Dedicated client view component for Team Members and workspace access management.
 * @module @devlab/portal-web/features/team/components
 */

import React from "react";
import { TeamTable } from "./team-table";
import { useTeamMembersQuery } from "@/features/team/api";
import { useAppsQuery } from "@/features/apps/api";
import { useDashboardModals } from "@/features/dashboard/context";

export function TeamView(): React.JSX.Element {
  const { data: team = [] } = useTeamMembersQuery();
  const { data: apps = [] } = useAppsQuery();
  const { openInviteModal } = useDashboardModals();

  return <TeamTable members={team} apps={apps} onOpenInviteModal={openInviteModal} />;
}
