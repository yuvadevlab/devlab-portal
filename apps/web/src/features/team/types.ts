/**
 * @file apps/web/src/features/team/types.ts
 * @description Types and contracts for Team & RBAC management.
 * @module @devlab/portal-web/features/team/types
 */

import type { UserMember } from "@/lib/api-client";

export type { UserMember };

/**
 * State contract for member invitation form inputs.
 */
export interface InviteMemberFormState {
  /** Full name of the invitee */
  name: string;
  /** Corporate email address */
  email: string;
  /** Assigned RBAC role string */
  role: string;
  /** Permitted platform application identifiers */
  allowedApps?: string[];
}
