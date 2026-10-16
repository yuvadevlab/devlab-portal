/**
 * @file apps/web/src/providers/get-query-client.ts
 * @description Isomorphic TanStack QueryClient instantiator for SSR prefetching and client caching.
 * @module @devlab/portal-web/providers/get-query-client
 */

import { QueryClient, defaultShouldDehydrateQuery, isServer } from "@tanstack/react-query";

/**
 * Creates a configured QueryClient instance for SSR and browser caching.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Returns a cached singleton QueryClient for the browser or fresh client for SSR.
 */
export function getQueryClient(): QueryClient {
  if (isServer) {
    // Server runtime: always create a fresh QueryClient per request
    return makeQueryClient();
  }
  // Browser runtime: reuse the single QueryClient across component mounts
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
