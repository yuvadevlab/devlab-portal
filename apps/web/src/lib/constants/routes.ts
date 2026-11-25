/**
 * @file apps/web/src/lib/constants/routes.ts
 * @description Centralized catalog of client routes and backend API endpoints.
 * Eliminates ad-hoc URL strings and provides type-safe path generators.
 * @module @devlab/portal-web/constants/routes
 */

/** Client-side URL paths and tab queries */
export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  APPS: "/apps",
  IAM: "/iam",
  AUDIT: "/audit",
  TEAM: "/team",
  SETTINGS: "/settings",
  ECOSYSTEM: "/ecosystem",
  ARCHITECTURE: "/architecture",
  DEVELOPERS: "/developers",
  ABOUT: "/about",
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_OF_SERVICE: "/terms-of-service",
  TAB: (tab: string) => (tab === "apps" ? "/apps" : `/${tab}`),
} as const;

/** Canonical alias matching ecosystem conventions */
export const ROUTES = {
  ...APP_ROUTES,
  MARKETING_ECOSYSTEM: APP_ROUTES.ECOSYSTEM,
  MARKETING_ARCHITECTURE: APP_ROUTES.ARCHITECTURE,
  MARKETING_DEVELOPERS: APP_ROUTES.DEVELOPERS,
  MARKETING_ABOUT: APP_ROUTES.ABOUT,
} as const;

/** Backend REST API endpoints */
export const API_ROUTES = {
  AUTH_LOGIN: "/auth/login",
  AUTH_ME: "/auth/me",
  AUTH_RESET_PASSWORD: "/auth/reset-password",
  PLATFORM_NAVIGATION: "/api/v1/platform/navigation",
  PLATFORM_TENANTS: "/api/v1/platform/tenants",
  PLATFORM_TELEMETRY: "/api/v1/platform/telemetry",
  APPS: "/api/v1/apps",
  APP_BY_ID: (id: string) => `/api/v1/apps/${encodeURIComponent(id)}`,
  APP_STATUS: (id: string) => `/api/v1/apps/${encodeURIComponent(id)}/status`,
  API_KEYS: "/api/v1/api-keys",
  API_KEY_BY_ID: (id: string) => `/api/v1/api-keys/${encodeURIComponent(id)}`,
  AUDIT_LOGS: (limit = 50, offset = 0) =>
    `/api/v1/audit-logs?limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`,
  USERS: "/api/v1/users",
  JWKS: "/.well-known/jwks.json",
  OPENID_CONFIG: "/.well-known/openid-configuration",
} as const;

/** Real-time WebSocket event names */
export const SOCKET_EVENTS = {
  APP_STATE_CHANGED: "app.state.changed",
  KEY_REVOKED: "key.revoked",
  AUDIT_LOGGED: "audit.logged",
} as const;

/** External documentation, ecosystem applications, and repository links */
export const EXTERNAL_ROUTES = {
  DOCS: process.env.NEXT_PUBLIC_DOCS_URL || "https://github.com/yuvadevlab",
  FIN_AI: process.env.NEXT_PUBLIC_FINAI_URL || "https://fin-ai-yuvadevlab.vercel.app",
  ORCHESTR_AI:
    process.env.NEXT_PUBLIC_ORCHESTRAI_URL || "https://orchestr-ai-yuvadevlab.vercel.app",
  DEVLAB_GUARD: process.env.NEXT_PUBLIC_GUARD_URL || "https://guard-yuvadevlab.vercel.app",
  DEVLAB_LOGS: process.env.NEXT_PUBLIC_LOGS_URL || "https://logs-yuvadevlab.vercel.app",
  INCIDENT_AI:
    process.env.NEXT_PUBLIC_INCIDENTAI_URL || "https://incident-ai-yuvadevlab.vercel.app",
  PORTAL: process.env.NEXT_PUBLIC_APP_URL || "https://portal-yuvadevlab.vercel.app",
} as const;
