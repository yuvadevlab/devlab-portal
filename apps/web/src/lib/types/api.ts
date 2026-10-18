/**
 * @file apps/web/src/lib/types/api.ts
 * @description Type definitions and payloads for DevLab Portal API communication.
 * @module @devlab/portal-web/lib/types/api
 */

/** DB-driven platform navigation menu item */
export interface NavigationItem {
  id: string;
  key: string;
  label: string;
  icon: string;
  order: number;
  isEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Ecosystem registered application entity */
export interface RegisteredApp {
  id: string;
  appId: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  themeColor?: string;
  originUrl: string;
  apiUrl?: string;
  callbackUrls: string[];
  healthUrl: string;
  environment: string;
  isActive: boolean;
  maintenanceNote?: string;
  tenantId?: string;
  latencyMs?: number;
  healthStatus?: string;
  createdAt: string;
  updatedAt: string;
}

/** Payload for registering an ecosystem application */
export interface CreateAppPayload {
  name: string;
  appId: string;
  slug?: string;
  description?: string;
  themeColor?: string;
  originUrl: string;
  apiUrl?: string;
  callbackUrls?: string[];
  healthUrl?: string;
  environment?: string;
}

/** Payload for updating application configuration */
export interface UpdateAppSettingsPayload {
  name?: string;
  description?: string;
  originUrl?: string;
  apiUrl?: string;
  callbackUrls?: string[];
  healthUrl?: string;
  themeColor?: string;
  maintenanceNote?: string;
}

/** IAM API key entity */
export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  appId: string;
  scopes: string[];
  rateLimitRpm: number;
  expiresAt?: string;
  lastUsedAt?: string;
  isRevoked: boolean;
  createdAt: string;
}

/** Immutable security audit ledger log item */
export interface AuditLog {
  id: string;
  action: string;
  actorId: string;
  actor?: { id: string; email: string; name: string };
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

/** Organization team member user profile */
export interface UserMember {
  id: string;
  email: string;
  name: string;
  role: string;
  allowedApps?: string[];
  tenantId?: string;
  tenant?: {
    id: string;
    name: string;
    slug: string;
  };
  avatarUrl?: string;
  inviteUrl?: string;
  inviteToken?: string;
  isActive: boolean;
  createdAt: string;
}

/** OIDC JWKS public key specifications */
export interface JwksData {
  keys: Array<{
    kty: string;
    n: string;
    e: string;
    kid: string;
    use: string;
    alg: string;
  }>;
}

/** OpenID Connect discovery configuration */
export interface OpenIdConfig {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
}
