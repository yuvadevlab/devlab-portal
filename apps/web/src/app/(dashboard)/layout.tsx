/**
 * @file apps/web/src/app/(dashboard)/layout.tsx
 * @description Master dashboard persistent shell SSR layout wrapper.
 * Strictly adheres to Rule 7 (pure SSR wrapper, zero "use client").
 * @module @devlab/portal-web/app/(dashboard)/layout
 */

import React from "react";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers";
import { getServerAuth } from "@/lib/server-auth";
import { prefetchAuthMe } from "@/features/auth/api";
import { prefetchNavigation, prefetchTenants } from "@/features/dashboard/api";
import { prefetchApps } from "@/features/apps/api";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element> {
  const auth = await getServerAuth();

  if (!auth) {
    redirect("/login");
  }

  const queryClient = getQueryClient();

  await Promise.allSettled([
    prefetchAuthMe(queryClient, auth.token),
    prefetchNavigation(queryClient),
    prefetchTenants(queryClient),
    prefetchApps(queryClient, auth.token),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardShell>{children}</DashboardShell>
    </HydrationBoundary>
  );
}
