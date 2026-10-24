/**
 * @file apps/web/src/lib/ui-copy/iam.ts
 * @description Localized string catalog for IAM keys management, scopes, and modals.
 * @module @devlab/portal-web/ui-copy/iam
 */

export const IAM_COPY = {
  HEADER: {
    TITLE: "IAM & API Keys",
    DESCRIPTION: "Scoped access. Secure connections. Manage machine-to-machine credentials.",
    CREATE_BTN: "Generate API key",
  },
  METRICS: {
    ACTIVE_KEYS: "Active API keys",
    ACTIVE_NOTE: "Scoped to registered applications",
    REVOKED_KEYS: "Revoked credentials",
    REVOKED_ZERO_NOTE: "Zero revoked credentials",
    REVOKED_NOTE: "Revoked credentials on record",
    ASSIGNED_SCOPES: "Assigned scopes",
    ASSIGNED_SCOPES_NOTE: "Granular ecosystem capabilities",
    ACTIVE_ROTATION: "Keys in rotation",
    ACTIVE_ROTATION_NOTE: "Credentials with recorded activity",
  },
  TOOLBAR: {
    SEARCH_PLACEHOLDER: "Search key name or prefix…",
    ALL_APPLICATIONS: "All applications",
  },
  TABLE: {
    NAME: "Key name",
    PREFIX: "Key prefix",
    APP: "Target app",
    SCOPES: "Scopes",
    RATE_LIMIT: "Rate limit",
    LAST_USED: "Last used",
    CREATED: "Created",
    STATUS: "Status",
    ACTIONS: "Actions",
    RPM: "RPM",
    EMPTY_TEXT: "No API keys match your filters.",
    FOOTER_INFO: "credentials · Secrets are only revealed once",
  },
  MODAL: {
    TITLE: "Generate API key",
    DESCRIPTION: "Define machine-to-machine credentials with granular scope access.",
    APP_PLACEHOLDER: "Select target application...",
    ROTATING: "Rotating...",
    REVOKING: "Revoking...",
    TITLE_STEP_1: "Generate API key",
    TITLE_STEP_2: "Your API key is ready",
    DESC_STEP_1: "Define access for your service.",
    DESC_STEP_2: "Copy this key now. It will not be displayed again.",
    NAME_LABEL: "Key name",
    NAME_PLACEHOLDER: "Production telemetry",
    APP_LABEL: "Associated application",
    SCOPES_LABEL: "Scopes",
    RATE_LIMIT_LABEL: "Rate limit",
    EXPIRATION_LABEL: "Expiration (optional)",
    SUBMIT_BTN: "Generate key",
    DONE_BTN: "Done",
    DEMO_WARNING:
      "This is a demo credential, not a live access key. The raw key is discarded when this window closes.",
    SECRET_TITLE: "Your API Secret Key",
    SECRET_WARNING:
      "Save this secret key immediately. It is shown only once and cannot be recovered.",
    GENERATING_TOAST: (name: string) => `Generating API key "${name}"...`,
    GENERATED_TOAST: (name: string) => `API key "${name}" generated successfully`,
    GENERATE_FAILED: "Failed to generate API key",
  },
} as const;
