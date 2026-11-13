/**
 * @file apps/api/src/common/constants/routes.ts
 * @description Dynamic URL builders and server-driven route constants.
 * @module @devlab/portal-api/common/routes
 */

export const PORTAL_ROUTES = {
  RESET_PASSWORD_PATH: process.env.PORTAL_RESET_PASSWORD_PATH || "/reset-password",
} as const;

/**
 * Canonical OIDC and RFC 7517 Discovery endpoints for DevLab Portal API.
 */
export const OIDC_ROUTES = {
  WELL_KNOWN_PREFIX: ".well-known",
  JWKS: "/.well-known/jwks.json",
  JWKS_ENDPOINT: "jwks.json",
  OPENID_CONFIGURATION: "/.well-known/openid-configuration",
  OPENID_CONFIG_ENDPOINT: "openid-configuration",
  PUBLIC_PEM: "/.well-known/public.pem",
  PUBLIC_PEM_ENDPOINT: "public.pem",
} as const;

export interface ResetPasswordUrlOptions {
  token: string;
  welcome?: boolean;
  origin?: string;
}

/**
 * Builds a dynamic, fully qualified password recovery or member onboarding URL.
 */
export function buildResetPasswordUrl(options: ResetPasswordUrlOptions): string {
  const portalOrigin = options.origin || process.env.PORTAL_ORIGIN || "http://localhost:3000";
  const path = process.env.PORTAL_RESET_PASSWORD_PATH || PORTAL_ROUTES.RESET_PASSWORD_PATH;
  const url = new URL(path, portalOrigin);
  url.searchParams.set("token", options.token);
  if (options.welcome) {
    url.searchParams.set("welcome", "true");
  }
  return url.toString();
}
