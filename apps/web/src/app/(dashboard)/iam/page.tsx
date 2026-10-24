/**
 * @file apps/web/src/app/(dashboard)/iam/page.tsx
 * @description IAM Machine Credentials and API Keys SSR page route.
 * Strictly adheres to Rule 7 (pure SSR wrapper, zero "use client").
 * @module @devlab/portal-web/app/(dashboard)/iam
 */

import React from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers";
import { getServerAuth } from "@/lib/server-auth";
import { prefetchApiKeys } from "@/features/iam/api";
import { prefetchApps } from "@/features/apps/api";
import { IamView } from "@/features/iam/components/iam-view";

export default async function IamPage(): Promise<React.JSX.Element> {
  const auth = await getServerAuth();
  const queryClient = getQueryClient();

  if (auth?.token) {
    await Promise.allSettled([
      prefetchApiKeys(queryClient, auth.token),
      prefetchApps(queryClient, auth.token),
    ]);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <IamView />
    </HydrationBoundary>
  );
}
