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
    JWKS_NOTE: "Cluster endpoint · Live identity provider active on port 4000",
    KEY_ID_LABEL: "Key ID",
    PEM_LABEL: "Public key PEM",
  },
  IDENTITY: {
    TITLE: "Identity configuration",
    ISSUER: "Issuer",
    ISSUER_VAL: "http://localhost:4000",
    ALGORITHM: "Signing algorithm",
    ALGORITHM_VAL: "RS256",
    LIFETIME: "Token lifetime",
    LIFETIME_VAL: "60 minutes",
    ENV: "Environment",
    ENV_VAL: "Local Dev",
  },
  TELEMETRY: {
    TAG: "Live cluster telemetry",
    TITLE: "Pub/Sub propagation",
    DESCRIPTION: "Cluster-wide kill-switch propagation latency.",
    LATENCY_VAL: "1",
    LATENCY_UNIT: "ms",
    SLA_NOTE: "Below the 1ms target SLA",
    RANGE_START: "60 minutes ago",
    RANGE_END: "Now",
    MEDIAN: "Redis Latency",
    MEDIAN_VAL: "1ms",
    P95: "DB Latency",
    P95_VAL: "0ms",
    P99: "Total Roundtrip",
    P99_VAL: "1ms",
  },
  CONNECTION: {
    TITLE: "Cluster connection",
    PORT: "Portal API port",
    PORT_VAL: ":4000",
    TRANSPORT: "Transport",
    TRANSPORT_VAL: "Redis Pub/Sub",
    WARNING: "Protected by DevLab RBAC and cryptographic key verification.",
  },
} as const;
