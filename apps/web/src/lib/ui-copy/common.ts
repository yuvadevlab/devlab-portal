/**
 * @file apps/web/src/lib/ui-copy/common.ts
 * @description Universal UI copy, button labels, navigation titles, and system status badges.
 * Eliminates raw string literals across UI layouts and interactive controls.
 * @module @devlab/portal-web/ui-copy/common
 */

import { APP_VERSION } from "../constants/version";

export const COMMON_COPY = {
  BRAND: {
    NAME: "DevLab",
    APP_NAME: "DevLab Portal",
    TITLE: "Portal Control Plane",
    SUBTITLE: "Micro-Frontend Identity & Governance Hub",
    VERSION: APP_VERSION,
  },
  METADATA: {
    TITLE: "DevLab Portal — Ecosystem Control Plane",
    TITLE_TEMPLATE: "%s | DevLab Portal",
    DESCRIPTION:
      "Unified Single Sign-On, IAM administration, and application control plane for DevLab Micro-Frontend ecosystem.",
    SITE_NAME: "DevLab Portal",
    AUTHOR: "Yuva DevLab",
    AUTHOR_URL: "https://devlab-portal-self.vercel.app",
    KEYWORDS: [
      "DevLab",
      "Portal",
      "Single Sign-On",
      "SSO",
      "IAM",
      "Micro-Frontends",
      "Control Plane",
      "Cloud Security",
      "Identity Management",
    ],
    OG_TITLE: "DevLab Portal — Ecosystem Control Plane & Enterprise SSO",
    OG_DESCRIPTION:
      "Unified Single Sign-On, IAM administration, and application control plane for DevLab Micro-Frontend ecosystem.",
    OG_IMAGE_ALT: "DevLab Portal Ecosystem Control Plane & Enterprise Single Sign-On",
    OG_FOOTER_LEFT: "Ecosystem Control Plane • DevLab Portal",
    OG_FOOTER_RIGHT: "yuva.devlab@gmail.com",
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
    LATENCY_UNIT: "ms",
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
