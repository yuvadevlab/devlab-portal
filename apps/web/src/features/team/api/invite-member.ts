/**
 * @file apps/web/src/features/team/api/invite-member.ts
 * @description TanStack Mutation hook for adding and assigning RBAC roles to organization members.
 * @module @devlab/portal-web/features/team/api/invite-member
 */

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { api, type UserMember } from "@/lib/api-client";
import { teamMembersQueryKey } from "./get-team-members";

/**
 * Variables payload required to execute {@link useInviteMemberMutation}.
 */
interface InviteMemberVariables {
  /** Invitee corporate email address */
  email: string;
  /** Invitee full display name */
  name: string;
  /** Assigned RBAC role */
  role: string;
  /** Optional scoped platform application entitlement identifiers */
  allowedApps?: string[];
}

/**
 * Mutation hook for adding members and sending portal onboarding access.
 *
 * @returns TanStack Mutation result object
 */
export function useInviteMemberMutation(): UseMutationResult<
  UserMember,
  Error,
  InviteMemberVariables
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, name, role, allowedApps }: InviteMemberVariables) =>
      api.createUser({ email, name, role, allowedApps }),
    onSuccess: () => {
      // Invalidate team members query cache immediately to refresh roster
      queryClient.invalidateQueries({ queryKey: teamMembersQueryKey() });
    },
  });
}

export { useInviteMemberMutation as useInviteMember };
