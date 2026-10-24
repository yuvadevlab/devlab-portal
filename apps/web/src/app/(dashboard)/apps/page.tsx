/**
 * @file apps/web/src/app/(dashboard)/apps/page.tsx
 * @description Ecosystem Applications catalog SSR page route.
 * Strictly adheres to Rule 7 (pure SSR wrapper, zero "use client").
 * @module @devlab/portal-web/app/(dashboard)/apps
 */

import React from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers";
import { getServerAuth } from "@/lib/server-auth";
import { prefetchApps } from "@/features/apps/api";
import { prefetchAuditLogs } from "@/features/audit/api";
import { AppsView } from "@/features/apps/components/apps-view";

export default async function AppsPage(): Promise<React.JSX.Element> {
  const auth = await getServerAuth();
  const queryClient = getQueryClient();

  if (auth?.token) {
    await Promise.allSettled([
      prefetchApps(queryClient, auth.token),
      prefetchAuditLogs(queryClient, 100, auth.token),
    ]);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AppsView />
    </HydrationBoundary>
  );
}
