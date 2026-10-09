/**
 * @file apps/web/src/lib/ui-copy/common.ts
 * @description Universal UI copy, button labels, and system status badges.
 * Eliminates raw string literals across UI layouts and interactive controls.
 * @module @devlab/portal-web/ui-copy/common
 */

export const COMMON_COPY = {
  BRAND: {
    NAME: "DevLab",
    TITLE: "Portal Control Plane",
    SUBTITLE: "Micro-Frontend Identity & Governance Hub",
    VERSION: "v2.0.0-enterprise",
  },
  ACTIONS: {
    SAVE: "Save Changes",
    CANCEL: "Cancel",
    CONFIRM: "Confirm",
    DELETE: "Delete",
    REVOKE: "Revoke",
    CREATE: "Create",
    REGISTER: "Register New App",
    GENERATE: "Generate Key",
    INVITE: "Invite Member",
    CLOSE: "Close",
    SEARCH: "Search applications, keys, logs...",
    FILTER: "Filter",
    REFRESH: "Refresh",
    COPIED: "Copied to clipboard",
    COPY: "Copy",
    NEXT: "Next Step",
    BACK: "Previous",
    FINISH: "Complete & Done",
    LAUNCH: "Launch App",
    SETTINGS: "App Settings",
    INSPECT: "Inspect Payload",
    KILL_SWITCH: "Kill Switch",
  },
  STATUS: {
    HEALTHY: "200 OK — Healthy",
    DEGRADED: "Degraded",
    UNREACHABLE: "Unreachable (503)",
    MAINTENANCE: "Under Maintenance",
    ACTIVE: "Active",
    REVOKED: "Revoked",
    LIVE_CLUSTER: "Live Cluster Connected",
  },
  ENVIRONMENTS: {
    LOCAL_DEV: "Local Dev",
    STAGING: "Staging",
    PRODUCTION: "Production",
  },
  TABS: {
    APPS: "Applications",
    IAM: "IAM & Keys",
    AUDIT: "Security Ledger",
    TEAM: "Team & RBAC",
    SETTINGS: "OIDC & JWKS",
  },
  EMPTY: {
    NO_DATA: "No items found",
    NO_DATA_DESC: "Try clearing search filters or create a new entry.",
  },
  LOADING: {
    GENERIC: "Loading control plane state...",
  },
} as const;
