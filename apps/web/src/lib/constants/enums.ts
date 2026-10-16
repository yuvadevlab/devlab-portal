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
