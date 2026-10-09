/**
 * @file apps/web/src/features/settings/api/index.ts
 * @description Centralized barrel exporting TanStack Query hooks for security settings.
 * @module @devlab/portal-web/features/settings/api
 */

export { jwksQueryKey, useJwksQuery, prefetchJwks } from "./get-jwks";
export { oidcConfigQueryKey, useOidcConfigQuery, prefetchOidcConfig } from "./get-oidc-config";
