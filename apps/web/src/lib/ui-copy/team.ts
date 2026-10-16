/**
 * @file apps/web/src/lib/ui-copy/team.ts
 * @description Localized string catalog for team members, RBAC roles, hierarchy, and invite modal.
 * @module @devlab/portal-web/ui-copy/team
 */

export const TEAM_COPY = {
  HEADER: {
    TITLE: "Team & Permissions",
    DESCRIPTION: "The right access for the right people. Manage your workspace’s team and roles.",
    INVITE_BTN: "Invite member",
  },
  HIERARCHY: {
    TITLE: "Role hierarchy",
    R01_INDEX: "01",
    R01_ROLE: "super_admin",
    R01_DESC: "Full ecosystem control and tenant ownership",
    R02_INDEX: "02",
    R02_ROLE: "admin",
    R02_DESC: "Manage applications, keys, and team members",
    R03_INDEX: "03",
    R03_ROLE: "developer",
    R03_DESC: "Build integrations and manage service credentials",
    R04_INDEX: "04",
    R04_ROLE: "operator",
    R04_DESC: "Monitor services and respond to incidents",
    R05_INDEX: "05",
    R05_ROLE: "read_only",
    R05_DESC: "View applications and audit records",
    R06_INDEX: "06",
    R06_ROLE: "member",
    R06_DESC: "End-user access scoped exclusively to designated applications",
  },
  TOOLBAR: {
    SEARCH_PLACEHOLDER: "Search team members…",
    MEMBERS_SUFFIX: "members",
  },
  TABLE: {
    MEMBER: "Member",
    EMAIL: "Email Address",
    ROLE: "Role",
    STATUS: "Status",
    JOINED: "Joined",
    ACTIONS: "Actions",
    YOU_TAG: "You",
    ACTIVE: "Active",
    DISABLED: "Disabled",
    EMPTY_TEXT: "No team members match your search.",
  },
  MODAL: {
    ROLE_PLACEHOLDER: "Select role...",
    TITLE: "Invite a team member",
    DESCRIPTION: "Add a member to this demo workspace. No email will be sent.",
    NAME_LABEL: "Full Name",
    NAME_PLACEHOLDER: "e.g. Alex Chen",
    EMAIL_LABEL: "Email address",
    EMAIL_PLACEHOLDER: "colleague@company.com",
    ROLE_LABEL: "Initial role",
    SUBMIT_BTN: "Invite member",
    SUCCESS_ALERT: "Invitation generated and temporary credentials assigned.",
  },
  ROLES: {
    SUPER_ADMIN: "super_admin",
    ADMIN: "admin",
    DEVELOPER: "developer",
    OPERATOR: "operator",
    READ_ONLY: "read_only",
    MEMBER: "member",
  },
} as const;
