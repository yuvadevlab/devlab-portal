/**
 * @file apps/web/src/features/team/index.ts
 * @description Centralized barrel exporting team management components, API hooks, and types.
 * @module @devlab/portal-web/features/team
 */

export * from "./types";
export * from "./api";
export { RoleHierarchy } from "./components/role-hierarchy";
export { TeamTable } from "./components/team-table";
export { InviteMemberModal } from "./components/invite-member-modal";

export { TeamView } from "./components/team-view";
