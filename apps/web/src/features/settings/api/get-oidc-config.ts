/**
 * @file apps/web/src/features/settings/api/get-oidc-config.ts
 * @description TanStack Query hook and SSR prefetch helper for RFC 8414 OpenID Configuration discovery.
 * @module @devlab/portal-web/features/settings/api/get-oidc-config
 */

import { useQuery, type QueryClient, type UseQueryResult } from "@tanstack/react-query";
import { api, type OpenIdConfig } from "@/lib/api-client";
import { serverFetch } from "@/lib/server-fetch";
import { API_ROUTES } from "@/lib/constants/routes";

/** Canonical query key for OpenID Connect discovery */
export const oidcConfigQueryKey = (): readonly ["oidc-config"] => ["oidc-config"] as const;

/**
 * Client-side React hook subscribing to OpenID Connect discovery metadata.
 */
export function useOidcConfigQuery(): UseQueryResult<OpenIdConfig, Error> {
  return useQuery<OpenIdConfig, Error>({
    queryKey: oidcConfigQueryKey(),
    queryFn: () => api.getOpenIdConfig(),
  });
}

/**
 * Server-side prefetch helper for Next.js SSR page hydration.
 *
 * @param queryClient Active server QueryClient instance
 */
export async function prefetchOidcConfig(queryClient: QueryClient, token?: string): Promise<void> {
  await queryClient
    .query({
      queryKey: oidcConfigQueryKey(),
      queryFn: () => serverFetch<OpenIdConfig>(API_ROUTES.OPENID_CONFIG, token),
    })
    .catch(() => {});
}
