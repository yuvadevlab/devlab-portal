/**
 * @file apps/web/src/lib/ui-copy/common.ts
 * @description Universal UI copy, button labels, navigation titles, and system status badges.
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
  METADATA: {
    TITLE: "DevLab Portal — Ecosystem Control Plane",
    DESCRIPTION: "Unified IAM, Kill-Switch, and App Launcher for DevLab Micro-Frontend Swarms",
  },
  TIME: {
    JUST_NOW: "just now",
    RECENTLY: "recently",
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
    GENERATING: "Generating...",
    INVITING: "Inviting...",
    REGISTERING: "Registering...",
    WORKSPACE: "Workspace",
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
  HEADER: {
    WORKSPACE: "Workspace",
    SEARCH_TENANTS: "Search tenants…",
    CREATE_TENANT: "Create New Tenant",
    CLUSTER_ONLINE: "Cluster online",
    SEARCH_TOOLTIP: "Search (⌘K)",
    SEARCH_LABEL: "Search portal",
    ECOSYSTEM_LAUNCHER: "Ecosystem launcher",
    ECOSYSTEM_HEADER: "DevLab Ecosystem",
    NO_APPS: "No ecosystem apps registered",
    NOTIFICATIONS: "Notifications",
    DARK_MODE: "Switch to dark mode",
    LIGHT_MODE: "Switch to light mode",
    ENTERPRISE_PLAN: "Enterprise",
    ACCOUNT_SETTINGS: "Account settings",
    SIGN_OUT: "Sign out",
    MEMBER_FALLBACK: "Member",
    SIGNED_OUT_MESSAGE: "Signed out of DevLab Portal",
  },
  A11Y: {
    MAIN_NAVIGATION: "Main navigation",
  },
  FOOTER: {
    API: "API :4000",
    REDIS: "Redis active",
    DOCS: "Docs",
    APPS_ACTIVE: "Apps Active",
    COMMAND_HINT: "Press ⌘K for Command Palette",
    LATENCY_SUFFIX: "Latency",
    REDIS_DEGRADED: "Redis degraded",
  },
  MEMBER: {
    ALL_APPLICATIONS: "All Applications",
    SYSTEM: "System",
  },
  FILTERS: {
    ALL: "All",
  },
  COMMAND: {
    TITLE: "Search DevLab Portal",
    DESCRIPTION: "Quickly navigate across ecosystem applications, keys, and security ledgers.",
    PLACEHOLDER: "Where would you like to go?",
    EMPTY: "No matching navigation destinations found.",
  },
  TENANT_MODAL: {
    TITLE: "Create New Tenant",
    DESCRIPTION: "Provision a new isolated workspace tenant identity for agentic swarms.",
    NAME_LABEL: "Tenant Name",
    NAME_PLACEHOLDER: "e.g., Production Swarm Cluster",
    SUBMIT_BTN: "Create Tenant",
  },
  EMPTY: {
    NO_DATA: "No items found",
    NO_DATA_DESC: "Try clearing search filters or create a new entry.",
  },
  LOADING: {
    GENERIC: "Loading control plane state...",
  },
} as const;
