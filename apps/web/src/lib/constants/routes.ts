/**
 * @file apps/web/src/lib/constants/routes.ts
 * @description Centralized catalog of client routes and backend API endpoints.
 * Eliminates ad-hoc URL strings and provides type-safe path generators.
 * @module @devlab/portal-web/constants/routes
 */

/** Client-side URL paths and tab queries */
export const APP_ROUTES = {
  HOME: "/",
  TAB: (tab: string) => `/?tab=${encodeURIComponent(tab)}`,
} as const;

/** Backend REST API endpoints */
export const API_ROUTES = {
  AUTH_LOGIN: "/auth/login",
  AUTH_ME: "/auth/me",
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
