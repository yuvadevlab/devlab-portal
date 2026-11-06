/**
 * @file apps/web/src/lib/constants/enums.ts
 * @description Domain enums and constant discriminators for the DevLab Portal web client.
 * Enforces zero magic string literals across UI components, state machines, and API interactions.
 * @module @devlab/portal-web/constants/enums
 */

/** Primary dashboard navigation tabs */
export enum TabKey {
  APPS = "apps",
  IAM = "iam",
  AUDIT = "audit",
  TEAM = "team",
  SETTINGS = "settings",
}

/** Operational health status of an ecosystem microservice */
export enum AppStatus {
  HEALTHY = "healthy",
  DEGRADED = "degraded",
  UNREACHABLE = "unreachable",
  MAINTENANCE = "maintenance",
  STARTING = "starting",
  UNKNOWN = "unknown",
}

/** Runtime environment scope for registered applications */
export enum AppEnvironment {
  LOCAL_DEV = "local_dev",
  STAGING = "staging",
  PRODUCTION = "production",
}

/** Organization RBAC roles */
export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  DEVELOPER = "developer",
  OPERATOR = "operator",
  READ_ONLY = "read_only",
  MEMBER = "member",
}

/** Application access authorization scopes */
export enum AppAccessScope {
  ALL = "*",
}

/** OAuth2 / API Key permission scopes */
export enum ApiKeyScope {
  READ = "read",
  WRITE = "write",
  ADMIN = "admin",
  EXECUTE = "execute",
  EVENTS = "events",
}

/**
 * Builds a dynamic scoped permission string for any registered ecosystem app.
 *
 * @param appSlug - Application identifier or slug
 * @param action - Action name or scope verb
 * @returns Fully qualified scope string (e.g. "finance-api:read")
 */
export function buildScope(appSlug: string, action: string): string {
  return `${appSlug}:${action}`;
}

/** Standard audit event types recorded in immutable ledger */
export enum AuditAction {
  APP_REGISTERED = "APP_REGISTERED",
  APP_UPDATED = "APP_UPDATED",
  APP_ACTIVATED = "APP_ACTIVATED",
  APP_DEACTIVATED = "APP_DEACTIVATED",
  API_KEY_CREATED = "API_KEY_CREATED",
  API_KEY_REVOKED = "API_KEY_REVOKED",
  USER_INVITED = "USER_INVITED",
  STATUS_UPDATED = "STATUS_UPDATED",
}

/** Standard HTTP verbs */
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}

/** Severity level for UI alerts, toasts, and audit logs */
export enum SeverityLevel {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

/** Toast notification severity level enum for authentication and session events */
export enum AuthToastType {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
  WARNING = "warning",
}

/** Telemetry status class indicators for UI status badge dots */
export enum HealthStatusClass {
  HEALTHY = "healthy",
  WARNING = "warning",
  ERROR = "error",
}

/** URL query parameter keys used across authentication and SSO routing */
export enum AuthQueryParamKey {
  APP = "app",
  APP_ID = "app_id",
  BRAND = "brand",
  REDIRECT = "redirect",
  TOKEN = "token",
  WELCOME = "welcome",
  AUTH_ERROR = "auth_error",
  ERROR_DESCRIPTION = "error_description",
  ERROR = "error",
  SIGNED_OUT = "signed_out",
  SESSION_EXPIRED = "session_expired",
}

/** Standard query parameter values for flags and state */
export enum QueryParamValue {
  TRUE = "true",
  FALSE = "false",
}

/** Browser Storage keys (localStorage / sessionStorage) */
export enum StorageKey {
  PENDING_AUTH_TOAST = "devlab_pending_auth_toast",
  ACTIVE_TENANT_ID = "devlab_active_tenant_id",
  ACCESS_TOKEN = "devlab_access_token",
  AUTH_TOKEN = "devlab_auth_token",
  AUTH_USER = "devlab_auth_user",
  PORTAL_THEME = "portal-theme",
}

/** Browser Cookie keys */
export enum CookieKey {
  ACCESS_TOKEN = "devlab_access_token",
}

/** Form field names used in authentication inputs */
export enum AuthFormField {
  TOKEN = "token",
  NEW_PASSWORD = "newPassword",
  PASSWORD = "password",
  CONFIRM_PASSWORD = "confirmPassword",
  EMAIL = "email",
}

/** Standard brand and theme identifiers */
export enum AuthBrandTheme {
  PORTAL = "portal",
}

/** Standard HTTP header names */
export enum HttpHeader {
  CONTENT_TYPE = "Content-Type",
  AUTHORIZATION = "Authorization",
}

/** Standard MIME content types */
export enum ContentType {
  APPLICATION_JSON = "application/json",
}
