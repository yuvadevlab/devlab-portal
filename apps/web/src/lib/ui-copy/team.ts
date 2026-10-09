/**
 * @file apps/web/src/lib/ui-copy/team.ts
 * @description Localized string catalog for team members, RBAC roles, and invite modal.
 * @module @devlab/portal-web/ui-copy/team
 */

export const TEAM_COPY = {
  HEADER: {
    TITLE: "Team Members & RBAC",
    DESCRIPTION:
      "Manage organization operators, developer permissions, and platform super administrators.",
    INVITE_BTN: "Invite Member",
  },
  TABLE: {
    MEMBER: "Member",
    EMAIL: "Email Address",
    ROLE: "Assigned Role",
    STATUS: "Status",
    JOINED: "Joined",
    EMPTY_TEXT: "No team members found.",
  },
  MODAL: {
    TITLE: "Invite Team Member",
    DESCRIPTION: "Grant access to the DevLab Portal ecosystem control plane.",
    NAME_LABEL: "Full Name",
    NAME_PLACEHOLDER: "e.g. Alex Chen",
    EMAIL_LABEL: "Work Email Address",
    EMAIL_PLACEHOLDER: "alex@company.internal",
    ROLE_LABEL: "Platform Role",
    SUCCESS_ALERT: "Invitation generated and temporary credentials assigned.",
  },
  ROLES: {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Administrator",
    DEVELOPER: "Developer",
    OPERATOR: "Operator",
    READ_ONLY: "Auditor / Read-Only",
  },
} as const;
