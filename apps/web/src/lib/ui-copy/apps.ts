/**
 * @file apps/web/src/lib/ui-copy/apps.ts
 * @description Localized string catalog for ecosystem applications, cards, wizard, and kill-switch.
 * @module @devlab/portal-web/ui-copy/apps
 */

import { APPS_WIZARD_COPY, APPS_DRAWER_COPY } from "./apps-wizard";
import { APPS_SUPERVISOR_COPY, APPS_DEPENDENCY_SELECTOR_COPY } from "./apps-supervisor";

export const APPS_COPY = {
  HEADER: {
    TITLE: "Ecosystem Apps & Services",
    DESCRIPTION:
      "Your ecosystem, connected. Manage applications, monitor health, and stay in control.",
    ADD_APP_BTN: "Register new application",
  },
  METRICS: {
    TOTAL_APPS: "Registered applications",
    TOTAL_NOTE: "Across your DevLab ecosystem",
    ACTIVE_SERVICES: "Online services",
    HEALTHY_NOTE: "All services operational",
    DEGRADED_NOTE: "Services degraded or offline",
    SUSPENDED_NOTE: "Services currently suspended",
    KILL_SWITCHES: "Active kill-switches",
    NO_DISRUPTIONS: "No active service disruptions",
    CONTROLS_ENGAGED: "Emergency controls engaged",
    AVG_LATENCY: "Avg probe latency",
    AVG_LATENCY_NOTE: "Operational health check response",
  },
  TOOLBAR: {
    SEARCH_PLACEHOLDER: "Search applications…",
    APPS_SUFFIX: "apps",
    ALL_ENVIRONMENTS: "All environments",
    PRODUCTION: "Production",
    STAGING: "Staging",
    LOCAL_DEV: "Local dev",
  },
  CARD: {
    ORIGIN_LABEL: "Base Origin",
    HEALTH_LABEL: "Health Probe",
    LATENCY_SUFFIX: "ms",
    ENV_TAG: "Env",
    CLIENT_ID_LABEL: "Client ID",
    STATUS_ACTIVE: "Routing Active",
    STATUS_KILLED: "Kill-Switched",
    STATUS_ONLINE: "Online",
    STATUS_OFFLINE: "Offline",
    STATUS_DEGRADED: "Unhealthy",
    STATUS_STARTING: "Starting",
    STATUS_SUSPENDED: "Suspended",
    STATUS_UNKNOWN: "Unknown",
    CODE_200: "200 OK",
    CODE_503: "503",
    CODE_OFFLINE: "Offline",
    CODE_DEGRADED: "Degraded",
    CODE_STARTING: "Starting",
    CODE_UNKNOWN: "—",
    OPEN_CONSOLE: "Open console",
    NO_DESC: "No description provided.",
    REGISTER_TITLE: "Bring your next idea into the ecosystem",
    REGISTER_DESC: "One identity. Every application.",
    REGISTER_BTN: "Register application",
    EMPTY_SEARCH: "No applications match your search.",
    SETTINGS_TOOLTIP: "Configure redirect URLs & origins",
    LAUNCH_TOOLTIP: "Open application in new tab",
    DEACTIVATE_BTN: "Deactivate",
    ACTIVATE_BTN: "Activate",
    DEACTIVATE_APP_TOOLTIP: "Deactivate application (suspend traffic)",
    ACTIVATE_APP_TOOLTIP: "Activate application (resume traffic)",
    ROUTING_SUSPENDED: "Routing Suspended",
    LAUNCH_DISABLED_TOOLTIP: "Application traffic routing is currently suspended",
    LAUNCH_OFFLINE_TOOLTIP:
      "Application is currently offline. Start process in supervisor to launch console",
  },
  RECENT_ACTIVITY: {
    TITLE: "Recent activity",
    LIVE_BADGE: "Live",
    VIEW_LEDGER: "View audit ledger",
    EMPTY: "No recent operational events recorded yet.",
    MINUTES_AGO: "minutes ago",
    INSPECT_TOOLTIP: "Inspect audit event receipt & payload",
    ACTIONS: {
      KEY_CREATED: "created an API key for",
      KEY_REVOKED: "revoked an API key for",
      APP_REGISTERED: "registered",
      APP_UPDATED: "updated configuration for",
      APP_ACTIVATED: "restored traffic for",
      APP_DEACTIVATED: "engaged kill-switch for",
      STATUS_UPDATED: "updated kill-switch status for",
      USER_INVITED: "invited team member",
    },
  },
  DRAWER: APPS_DRAWER_COPY,
  DEPENDENCY_SELECTOR: APPS_DEPENDENCY_SELECTOR_COPY,
  SUPERVISOR: APPS_SUPERVISOR_COPY,
  KILL_SWITCH: {
    TITLE_TRIGGER: "Deactivate Application",
    TITLE_RESTORE: "Activate Application",
    WARNING_TRIGGER:
      "In a connected cluster, Redis Pub/Sub evicts active sessions and suspends gateway routing. This demo updates local application status.",
    WARNING_RESTORE: "Restores gateway routing and resumes incoming traffic for this application.",
    REASON_LABEL: "Incident / Maintenance Note (Optional)",
    REASON_PLACEHOLDER: "Describe the incident reason or change ticket…",
    CONFIRM_TRIGGER: "Deactivate Application",
    CONFIRM_RESTORE: "Activate Application",
  },
  WIZARD: APPS_WIZARD_COPY,
} as const;
