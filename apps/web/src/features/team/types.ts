/**
 * @file apps/web/src/features/team/types.ts
 * @description Types and contracts for Team & RBAC management.
 * @module @devlab/portal-web/features/team/types
 */

import type { UserMember } from "../../lib/api-client";

export type { UserMember };

export interface InviteMemberFormState {
  name: string;
  email: string;
  role: string;
}
