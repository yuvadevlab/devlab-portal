/**
 * @file apps/web/src/features/team/api/get-team-members.ts
 * @description TanStack Query hook and SSR prefetch helper for organization team members.
 * @module @devlab/portal-web/features/team/api/get-team-members
 */

import { useQuery, type QueryClient, type UseQueryResult } from "@tanstack/react-query";
import { api, type UserMember } from "@/lib/api-client";
import { serverFetch } from "@/lib/server-fetch";
import { API_ROUTES } from "@/lib/constants/routes";

/** Canonical query key for organization team roster */
export const teamMembersQueryKey = (): readonly ["team-members"] => ["team-members"] as const;

/**
 * Client-side React hook subscribing to team members and RBAC assignments.
 */
export function useTeamMembersQuery(): UseQueryResult<UserMember[], Error> {
  return useQuery<UserMember[], Error>({
    queryKey: teamMembersQueryKey(),
    queryFn: () => api.getUsers(),
  });
}

/**
 * Server-side prefetch helper for Next.js SSR page hydration.
 *
 * @param queryClient Active server QueryClient instance
 */
export async function prefetchTeamMembers(queryClient: QueryClient, token?: string): Promise<void> {
  await queryClient
    .query({
      queryKey: teamMembersQueryKey(),
      queryFn: () => serverFetch<UserMember[]>(API_ROUTES.USERS, token),
    })
    .catch(() => {});
}
