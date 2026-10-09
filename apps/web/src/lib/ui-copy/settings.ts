/**
 * @file apps/web/src/lib/ui-copy/settings.ts
 * @description Localized string catalog for OIDC discovery, JWKS keys, and system diagnostics.
 * @module @devlab/portal-web/ui-copy/settings
 */

export const SETTINGS_COPY = {
  HEADER: {
    TITLE: "OIDC Identity & JWKS Discovery",
    DESCRIPTION:
      "Inspect RS256 signing keys, OpenID configuration endpoints, and distributed trust boundaries.",
  },
  JWKS: {
    TITLE: "Active RFC 7517 JSON Web Key Set (JWKS)",
    DESCRIPTION: "Downstream microservices verify signed JWT tokens against these public keys.",
    ENDPOINT_LABEL: "JWKS Discovery Endpoint",
    KEY_ID: "Key ID (kid)",
    ALGORITHM: "Algorithm",
    KEY_TYPE: "Key Type (kty)",
    KEY_USE: "Intended Use",
    STATUS_ACTIVE: "Active & Serving",
  },
  OIDC: {
    TITLE: "OpenID Connect Configuration",
    DESCRIPTION: "RFC 8414 standardized discovery metadata for federated authentication flows.",
    DISCOVERY_URL: "OIDC Discovery URL",
    TOKEN_ENDPOINT: "Token Exchange Endpoint",
    AUTH_ENDPOINT: "Authorization Endpoint",
  },
} as const;
