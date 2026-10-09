/**
 * @file apps/web/src/lib/api-client.ts
 * @description Centralized API client utility with bearer token auto-bootstrap and real-time Socket.IO subscriptions.
 * @module @devlab/portal-web/lib/api-client
 */

import { io, Socket } from "socket.io-client";
import { API_ROUTES, SOCKET_EVENTS } from "./constants/routes";
import { HttpMethod } from "./constants/enums";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3015";

let cachedToken: string | null = null;

/**
 * Retrieves valid authentication token or bootstraps a developer session.
 */
async function getAuthToken(): Promise<string> {
  if (cachedToken) {
    return cachedToken;
  }

  // Attempt local storage token if available in browser
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem("devlab_access_token");
    if (stored) {
      cachedToken = stored;
      return stored;
    }
  }

  // Dev bootstrap: obtain RS256 token from local control plane
  try {
    const res = await fetch(`${API_BASE_URL}${API_ROUTES.AUTH_LOGIN}`, {
      method: HttpMethod.POST,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@devlab.internal",
        password: "DevLab@2026!Admin",
      }),
    });
    if (res.ok) {
      const data = await res.json();
      cachedToken = data.accessToken;
      if (typeof window !== "undefined" && cachedToken) {
        window.localStorage.setItem("devlab_access_token", cachedToken);
      }
      return cachedToken || "";
    }
  } catch (err) {
    console.warn("Could not auto-bootstrap admin session:", err);
  }

  return "";
}

/** Standard fetch wrapper with JSON serialization and authentication */
async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export interface RegisteredApp {
  id: string;
  appId: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  originUrl: string;
  callbackUrls: string[];
  healthUrl: string;
  environment: string;
  isActive: boolean;
  maintenanceNote?: string;
  latencyMs?: number;
  healthStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppPayload {
  name: string;
  appId: string;
  slug?: string;
  description?: string;
  originUrl: string;
  callbackUrls?: string[];
  healthUrl?: string;
  environment?: string;
}

export interface UpdateAppSettingsPayload {
  name?: string;
  description?: string;
  originUrl?: string;
  callbackUrls?: string[];
  healthUrl?: string;
  maintenanceNote?: string;
}

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

export interface UserMember {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
}

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

export interface OpenIdConfig {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
}

export const api = {
  getApps: (): Promise<RegisteredApp[]> => fetchJson<RegisteredApp[]>(API_ROUTES.APPS),

  createApp: (payload: CreateAppPayload): Promise<RegisteredApp & { clientSecret: string }> =>
    fetchJson<RegisteredApp & { clientSecret: string }>(API_ROUTES.APPS, {
      method: HttpMethod.POST,
      body: JSON.stringify(payload),
    }),

  updateAppSettings: (id: string, payload: UpdateAppSettingsPayload): Promise<RegisteredApp> =>
    fetchJson<RegisteredApp>(API_ROUTES.APP_BY_ID(id), {
      method: HttpMethod.PATCH,
      body: JSON.stringify(payload),
    }),

  updateAppStatus: (
    id: string,
    isActive: boolean,
    maintenanceNote?: string,
  ): Promise<RegisteredApp> =>
    fetchJson<RegisteredApp>(API_ROUTES.APP_STATUS(id), {
      method: HttpMethod.PATCH,
      body: JSON.stringify({ isActive, maintenanceNote }),
    }),

  getApiKeys: (appId?: string): Promise<ApiKey[]> =>
    fetchJson<ApiKey[]>(
      `${API_ROUTES.API_KEYS}${appId ? `?app_id=${encodeURIComponent(appId)}` : ""}`,
    ),

  createApiKey: (payload: {
    name: string;
    appId: string;
    scopes: string[];
    rateLimitRpm?: number;
    expiresAt?: string;
  }): Promise<ApiKey & { rawKey: string }> =>
    fetchJson<ApiKey & { rawKey: string }>(API_ROUTES.API_KEYS, {
      method: HttpMethod.POST,
      body: JSON.stringify(payload),
    }),

  revokeApiKey: (id: string): Promise<ApiKey> =>
    fetchJson<ApiKey>(API_ROUTES.API_KEY_BY_ID(id), {
      method: HttpMethod.DELETE,
    }),

  getAuditLogs: (limit = 50, offset = 0): Promise<AuditLog[]> =>
    fetchJson<AuditLog[]>(API_ROUTES.AUDIT_LOGS(limit, offset)),

  getUsers: (): Promise<UserMember[]> => fetchJson<UserMember[]>(API_ROUTES.USERS),

  createUser: (payload: { email: string; name: string; role?: string }): Promise<UserMember> =>
    fetchJson<UserMember>(API_ROUTES.USERS, {
      method: HttpMethod.POST,
      body: JSON.stringify(payload),
    }),

  getJwks: (): Promise<JwksData> => fetchJson<JwksData>(API_ROUTES.JWKS),

  getOpenIdConfig: (): Promise<OpenIdConfig> => fetchJson<OpenIdConfig>(API_ROUTES.OPENID_CONFIG),
};

let socketInstance: Socket | null = null;
export function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(API_BASE_URL, {
      path: "/events",
      transports: ["websocket", "polling"],
      autoConnect: true,
    });
  }
  return socketInstance;
}
