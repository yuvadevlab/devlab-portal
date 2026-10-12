/**
 * @file apps/web/src/app/page.tsx
 * @description Master control plane SSR route enforcing auth guards and hydrating client dashboard.
 * @module @devlab/portal-web/app
 */

import React from "react";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers";
import { getServerAuth } from "@/lib/server-auth";
import { prefetchApps } from "@/features/apps/api";
import { prefetchApiKeys } from "@/features/iam/api";
import { prefetchAuditLogs } from "@/features/audit/api";
import { prefetchTeamMembers } from "@/features/team/api";
import { prefetchJwks, prefetchOidcConfig } from "@/features/settings/api";
import { prefetchAuthMe } from "@/features/auth/api";
import { PortalDashboard } from "@/features/dashboard";

/**
 * Server-rendered root page preloading ecosystem telemetry for zero-layout-shift hydration.
 * Strictly redirects unauthenticated requests to /login.
 */
export default async function Page(): Promise<React.JSX.Element> {
  const auth = await getServerAuth();

  if (!auth) {
    redirect("/login");
  }

  const queryClient = getQueryClient();

  // Concurrent server-side prefetch of portal state for instant client hydration
  await Promise.allSettled([
    prefetchAuthMe(queryClient, auth.token),
    prefetchApps(queryClient, auth.token),
    prefetchApiKeys(queryClient, auth.token),
    prefetchAuditLogs(queryClient, 50, auth.token),
    prefetchTeamMembers(queryClient, auth.token),
    prefetchJwks(queryClient, auth.token),
    prefetchOidcConfig(queryClient, auth.token),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PortalDashboard />
    </HydrationBoundary>
  );
}
