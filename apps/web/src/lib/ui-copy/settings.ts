/**
 * @file apps/web/src/lib/ui-copy/settings.ts
 * @description Localized string catalog for OIDC discovery, JWKS keys, and system diagnostics.
 * @module @devlab/portal-web/ui-copy/settings
 */

export const SETTINGS_COPY = {
  HEADER: {
    TITLE: "Settings & Cryptographic JWKS",
    DESCRIPTION:
      "The trust layer of your ecosystem. Inspect identity configuration and cluster telemetry.",
  },
  KEYS: {
    TAG: "RS256",
    TITLE: "Public signing keys",
    DESCRIPTION: "Public keys used by ecosystem services to verify access tokens.",
    JWKS_LABEL: "JWKS endpoint",
    JWKS_NOTE: "Cluster endpoint · Live identity provider active on port 3015",
    PEM_LABEL: "Public key PEM",
  },
  IDENTITY: {
    TITLE: "Identity configuration",
    ISSUER: "Issuer",
    ISSUER_VAL: "devlab-portal",
    ALGORITHM: "Signing algorithm",
    ALGORITHM_VAL: "RS256",
    LIFETIME: "Token lifetime",
    LIFETIME_VAL: "60 minutes",
    ENV: "Environment",
    ENV_VAL: "Demo workspace",
  },
  TELEMETRY: {
    TAG: "Live cluster telemetry",
    TITLE: "Pub/Sub propagation",
    DESCRIPTION: "Cluster-wide kill-switch propagation latency.",
    LATENCY_VAL: "0.42",
    LATENCY_UNIT: "ms",
    SLA_NOTE: "Below the 1ms target SLA",
    RANGE_START: "60 minutes ago",
    RANGE_END: "Now",
    MEDIAN: "Median",
    MEDIAN_VAL: "0.31ms",
    P95: "P95",
    P95_VAL: "0.67ms",
    P99: "P99",
    P99_VAL: "0.89ms",
  },
  CONNECTION: {
    TITLE: "Cluster connection",
    PORT: "Gateway port",
    PORT_VAL: ":3015",
    TRANSPORT: "Transport",
    TRANSPORT_VAL: "Redis Pub/Sub",
    WARNING: "Protected by DevLab RBAC and cryptographic key verification.",
  },
} as const;
