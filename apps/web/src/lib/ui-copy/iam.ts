/**
 * @file apps/web/src/lib/ui-copy/iam.ts
 * @description Localized string catalog for IAM keys management, scopes, and modals.
 * @module @devlab/portal-web/ui-copy/iam
 */

export const IAM_COPY = {
  HEADER: {
    TITLE: "IAM & Scoped API Keys",
    DESCRIPTION:
      "Generate high-throughput API keys with granular scopes and rate limiting for agent swarms.",
    CREATE_BTN: "Create API Key",
  },
  TABLE: {
    NAME: "Key Name",
    PREFIX: "Key Prefix",
    APP: "Target App",
    SCOPES: "Scopes",
    RATE_LIMIT: "Rate Limit (RPM)",
    LAST_USED: "Last Used",
    CREATED: "Created",
    STATUS: "Status",
    ACTIONS: "Actions",
    EMPTY_TEXT: "No API keys created yet. Click Generate Key to create one.",
  },
  MODAL: {
    TITLE: "Generate Scoped API Key",
    DESCRIPTION:
      "Issue a cryptographically secure key with strict rate limiting and ecosystem scopes.",
    NAME_LABEL: "Key Description / Name",
    NAME_PLACEHOLDER: "e.g., CI/CD Deployment Swarm Key",
    APP_LABEL: "Target Ecosystem Application",
    SCOPES_LABEL: "Granted Permissions / Scopes",
    RATE_LIMIT_LABEL: "Rate Limit (Requests per minute)",
    SECRET_TITLE: "Your API Secret Key",
    SECRET_WARNING:
      "Save this secret key immediately. It is shown only once and cannot be recovered.",
  },
} as const;
