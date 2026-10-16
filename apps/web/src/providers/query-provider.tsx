"use client";

/**
 * @file apps/web/src/providers/query-provider.tsx
 * @description Centralized TanStack Query client provider for server and browser hydration.
 * @module @devlab/portal-web/providers/query-provider
 */

import React, { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "./get-query-client";

/**
 * React context provider making TanStack Query available throughout the app tree.
 */
export function QueryProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [queryClient] = useState(() => getQueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
