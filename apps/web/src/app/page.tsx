/**
 * @file apps/web/src/app/page.tsx
 * @description Master control plane SSR route prefetching core telemetry and hydrating the client dashboard.
 * @module @devlab/portal-web/app
 */

import React from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers";
import { prefetchApps } from "@/features/apps/api";
import { prefetchApiKeys } from "@/features/iam/api";
import { prefetchAuditLogs } from "@/features/audit/api";
import { prefetchTeamMembers } from "@/features/team/api";
import { prefetchJwks, prefetchOidcConfig } from "@/features/settings/api";
import { PortalDashboard } from "@/features/dashboard";

/**
 * Server-rendered root page preloading ecosystem telemetry for zero-layout-shift hydration.
 */
export default async function Page(): Promise<React.JSX.Element> {
  const queryClient = getQueryClient();

  // Concurrent server-side prefetch of portal state for instant client hydration
  await Promise.allSettled([
    prefetchApps(queryClient),
    prefetchApiKeys(queryClient),
    prefetchAuditLogs(queryClient),
    prefetchTeamMembers(queryClient),
    prefetchJwks(queryClient),
    prefetchOidcConfig(queryClient),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PortalDashboard />
    </HydrationBoundary>
  );
}
