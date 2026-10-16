/**
 * @file apps/web/src/features/auth/api/get-me.ts
 * @description TanStack Query hook and SSR prefetch helper for authenticated user profile.
 * @module @devlab/portal-web/features/auth/api/get-me
 */

import { useQuery, type QueryClient, type UseQueryResult } from "@tanstack/react-query";
import { api, type UserMember } from "@/lib/api-client";
import { serverFetch } from "@/lib/server-fetch";
import { API_ROUTES } from "@/lib/constants/routes";

/** Canonical query key for current authenticated user profile */
export const authMeQueryKey = (): readonly ["auth-me"] => ["auth-me"] as const;

/**
 * Client-side React hook querying current authenticated user profile.
 */
export function useAuthMeQuery(): UseQueryResult<UserMember, Error> {
  return useQuery<UserMember, Error>({
    queryKey: authMeQueryKey(),
    queryFn: () => api.getMe(),
    staleTime: 60_000,
  });
}

/**
 * Server-side prefetch helper for Next.js SSR page hydration.
 *
 * @param queryClient Active server QueryClient instance
 * @param token Optional bearer token for server authorization
 */
export async function prefetchAuthMe(queryClient: QueryClient, token?: string): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: authMeQueryKey(),
    queryFn: () => serverFetch<UserMember>(API_ROUTES.AUTH_ME, token),
  });
}
