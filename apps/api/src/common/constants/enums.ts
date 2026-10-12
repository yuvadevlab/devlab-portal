/**
 * @file apps/api/src/common/constants/enums.ts
 * @description Centralized domain enums adhering to Zero Hardcoded Strings invariant.
 * @module @devlab/portal-api/common/enums
 */

/** Organization RBAC roles */
export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  DEVELOPER = "developer",
  OPERATOR = "operator",
  READ_ONLY = "read_only",
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

/** Target entity types for audit trail tracking */
export enum AuditTargetType {
  APP = "registered_app",
  API_KEY = "api_key",
  USER = "user",
  TENANT = "tenant",
}

/** Runtime environment scope for registered applications */
export enum AppEnvironment {
  LOCAL_DEV = "local_dev",
  STAGING = "staging",
  PRODUCTION = "production",
}
