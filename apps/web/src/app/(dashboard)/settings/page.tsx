/**
 * @file apps/web/src/app/(dashboard)/settings/page.tsx
 * @description Cryptographic JWKS and OIDC Configuration SSR page route.
 * Strictly adheres to Rule 7 (pure SSR wrapper, zero "use client").
 * @module @devlab/portal-web/app/(dashboard)/settings
 */

import React from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers";
import { prefetchJwks, prefetchOidcConfig } from "@/features/settings/api";
import { SettingsView } from "@/features/settings/components/settings-view";

export default async function SettingsPage(): Promise<React.JSX.Element> {
  const queryClient = getQueryClient();

  await Promise.allSettled([prefetchJwks(queryClient), prefetchOidcConfig(queryClient)]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsView />
    </HydrationBoundary>
  );
}
