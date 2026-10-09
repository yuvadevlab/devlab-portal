/**
 * @file apps/web/src/features/team/api/invite-member.ts
 * @description TanStack Mutation hook for adding and assigning RBAC roles to organization members.
 * @module @devlab/portal-web/features/team/api/invite-member
 */

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { api, type UserMember } from "@/lib/api-client";
import { teamMembersQueryKey } from "./get-team-members";

interface InviteMemberVariables {
  email: string;
  name: string;
  role: string;
}

/**
 * Mutation hook for adding members and sending portal onboarding access.
 */
export function useInviteMemberMutation(): UseMutationResult<
  UserMember,
  Error,
  InviteMemberVariables
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, name, role }: InviteMemberVariables) =>
      api.createUser({ email, name, role }),
    onSuccess: () => {
      // Invalidate team members query cache immediately
      queryClient.invalidateQueries({ queryKey: teamMembersQueryKey() });
    },
  });
}

export { useInviteMemberMutation as useInviteMember };
