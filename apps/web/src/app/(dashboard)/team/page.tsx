/**
 * @file apps/web/src/app/(dashboard)/team/page.tsx
 * @description Team Members and RBAC Access Management SSR page route.
 * Strictly adheres to Rule 7 (pure SSR wrapper, zero "use client").
 * @module @devlab/portal-web/app/(dashboard)/team
 */

import React from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers";
import { getServerAuth } from "@/lib/server-auth";
import { prefetchTeamMembers } from "@/features/team/api";
import { prefetchApps } from "@/features/apps/api";
import { TeamView } from "@/features/team/components/team-view";

export default async function TeamPage(): Promise<React.JSX.Element> {
  const auth = await getServerAuth();
  const queryClient = getQueryClient();

  if (auth?.token) {
    await Promise.allSettled([
      prefetchTeamMembers(queryClient, auth.token),
      prefetchApps(queryClient, auth.token),
    ]);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TeamView />
    </HydrationBoundary>
  );
}
