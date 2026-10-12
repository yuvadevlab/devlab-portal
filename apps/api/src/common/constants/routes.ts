/**
 * @file apps/api/src/common/constants/routes.ts
 * @description Dynamic URL builders and server-driven route constants.
 * @module @devlab/portal-api/common/routes
 */

export const PORTAL_ROUTES = {
  RESET_PASSWORD_PATH: process.env.PORTAL_RESET_PASSWORD_PATH || "/reset-password",
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
  const portalOrigin = options.origin || process.env.PORTAL_ORIGIN || "http://localhost:3005";
  const path = process.env.PORTAL_RESET_PASSWORD_PATH || PORTAL_ROUTES.RESET_PASSWORD_PATH;
  const url = new URL(path, portalOrigin);
  url.searchParams.set("token", options.token);
  if (options.welcome) {
    url.searchParams.set("welcome", "true");
  }
  return url.toString();
}
