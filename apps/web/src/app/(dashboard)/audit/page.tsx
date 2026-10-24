/**
 * @file apps/web/src/app/(dashboard)/audit/page.tsx
 * @description Immutable Audit Ledger and Security Receipts SSR page route.
 * Strictly adheres to Rule 7 (pure SSR wrapper, zero "use client").
 * @module @devlab/portal-web/app/(dashboard)/audit
 */

import React from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers";
import { getServerAuth } from "@/lib/server-auth";
import { prefetchAuditLogs } from "@/features/audit/api";
import { AuditView } from "@/features/audit/components/audit-view";

export default async function AuditPage(): Promise<React.JSX.Element> {
  const auth = await getServerAuth();
  const queryClient = getQueryClient();

  if (auth?.token) {
    await prefetchAuditLogs(queryClient, 100, auth.token);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuditView />
    </HydrationBoundary>
  );
}
