/**
 * @file apps/web/src/lib/ui-copy/apps.ts
 * @description Localized string catalog for ecosystem applications, cards, wizard, and kill-switch.
 * @module @devlab/portal-web/ui-copy/apps
 */

export const APPS_COPY = {
  HEADER: {
    TITLE: "Ecosystem Applications",
    DESCRIPTION:
      "Manage federated micro-frontend swarms, OIDC client configurations, and active kill-switches.",
    ADD_APP_BTN: "Register Application",
  },
  METRICS: {
    TOTAL_APPS: "Registered Applications",
    HEALTHY: "Healthy & Routing",
    OFFLINE: "Kill-Switched / Offline",
    TOKEN_OPS: "Active Swarm Nodes",
  },
  CARD: {
    ORIGIN_LABEL: "Base Origin",
    HEALTH_LABEL: "Health Probe",
    LATENCY_SUFFIX: "ms",
    ENV_TAG: "Env",
    CLIENT_ID_LABEL: "Client ID",
    STATUS_ACTIVE: "Routing Active",
    STATUS_KILLED: "Kill-Switched",
    SETTINGS_TOOLTIP: "Configure redirect URLs & origins",
    LAUNCH_TOOLTIP: "Open application in new tab",
    DEACTIVATE_BTN: "Deactivate",
    ACTIVATE_BTN: "Re-enable Traffic",
  },
  DRAWER: {
    TITLE: "Application Configuration",
    SUBTITLE: "Operational endpoints, OAuth2 callbacks, and origin whitelist.",
    NAME_LABEL: "Display Name",
    DESC_LABEL: "Description",
    ORIGIN_LABEL: "Origin URL",
    CALLBACKS_LABEL: "Allowed Callback URLs (one per line)",
    HEALTH_LABEL: "Health Probe URL",
    NOTE_LABEL: "Maintenance Note",
    SAVE_BTN: "Save Application Settings",
    SUCCESS_ALERT: "Configuration updated successfully",
  },
  KILL_SWITCH: {
    TITLE_TRIGGER: "Trigger Application Kill-Switch",
    TITLE_RESTORE: "Restore Application Traffic",
    WARNING_TRIGGER:
      "This action will immediately sever token issuance and block routing for all downstream microservices.",
    WARNING_RESTORE:
      "Traffic and token verification will be immediately re-enabled for this application.",
    REASON_LABEL: "Operational Incident / Maintenance Reason",
    REASON_PLACEHOLDER: "e.g., Scheduled database maintenance or emergency patch rollout...",
    CONFIRM_TRIGGER: "Kill Switch App",
    CONFIRM_RESTORE: "Re-activate Application",
  },
  WIZARD: {
    MODAL_TITLE: "Register New Ecosystem Application",
    STEP_1_TITLE: "1. App Identity",
    STEP_1_DESC: "Basic identifiers, names, and environment target.",
    STEP_2_TITLE: "2. Security & Routing",
    STEP_2_DESC: "OAuth2 redirect URLs and allowed CORS origins.",
    STEP_3_TITLE: "3. Credentials & Reveal",
    STEP_3_DESC: "Generated Client ID and secret keys.",
    FIELDS: {
      NAME: "Application Name",
      NAME_PLACEHOLDER: "e.g. IncidentAI Console",
      APP_ID: "Unique App ID (Slug)",
      APP_ID_PLACEHOLDER: "e.g. incidentai",
      DESCRIPTION: "Description",
      DESCRIPTION_PLACEHOLDER: "Autonomous incident response and remediation dashboard",
      ENVIRONMENT: "Environment",
      ORIGIN_URL: "Origin URL",
      ORIGIN_PLACEHOLDER: "http://localhost:3004",
      HEALTH_URL: "Health Check Probe URL",
      HEALTH_PLACEHOLDER: "http://localhost:3004/api/health",
      CALLBACK_URLS: "OAuth Redirect URIs (comma-separated)",
      CALLBACK_PLACEHOLDER: "http://localhost:3004/api/auth/callback",
    },
    CREDENTIALS: {
      CLIENT_ID: "Client ID",
      CLIENT_SECRET: "Client Secret",
      WARNING_COPY:
        "Make sure to copy your client secret now. For security purposes, this plaintext value cannot be retrieved again.",
    },
  },
} as const;
