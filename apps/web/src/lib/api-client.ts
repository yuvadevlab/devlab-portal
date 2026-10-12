export interface SystemTelemetry {
  readonly status: string;
  readonly statusText: string;
  readonly apiPort: number | string;
  readonly apiLabel: string;
  readonly redisStatus: string;
  readonly isRedisHealthy: boolean;
  readonly isDbHealthy?: boolean;
  readonly dbLatencyMs?: number;
  readonly redisLatencyMs?: number;
  readonly totalApps?: number;
  readonly activeApps?: number;
  readonly activeUsers?: number;
  readonly uptimeSeconds?: number;
  readonly version: string;
  readonly environment: string;
  readonly environmentLabel: string;
  readonly docsUrl: string;
  readonly docsLabel: string;
}

export interface Tenant {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly plan: string;
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * @file apps/web/src/lib/api-client.ts
 * @description Centralized API client utility with bearer token auto-bootstrap and real-time Socket.IO subscriptions.
 * @module @devlab/portal-web/lib/api-client
 */

import { io, Socket } from "socket.io-client";
import { API_ROUTES } from "@/lib/constants/routes";
import { HttpMethod } from "@/lib/constants/enums";
import type {
  NavigationItem,
  RegisteredApp,
  CreateAppPayload,
  UpdateAppSettingsPayload,
  ApiKey,
  AuditLog,
  UserMember,
  JwksData,
  OpenIdConfig,
} from "@/lib/types/api";

export * from "@/lib/types/api";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3015";

let cachedToken: string | null = null;

/**
 * Retrieves valid authentication token from browser storage or cookie.
 */
function getAuthToken(): string {
  if (typeof window === "undefined") {
    return "";
  }

  if (cachedToken) {
    return cachedToken;
  }

  try {
    const stored = window.localStorage.getItem("devlab_access_token");
    if (stored && stored.trim().length > 0) {
      cachedToken = stored.trim();
      return cachedToken;
    }
  } catch {
    // Ignore localStorage access restriction
  }

  try {
    const match = document.cookie.match(/(?:^|;\\s*)devlab_access_token=([^;]+)/);
    if (match && match[1]) {
      const decoded = decodeURIComponent(match[1]).trim();
      if (decoded.length > 0) {
        cachedToken = decoded;
        return cachedToken;
      }
    }
  } catch {
    // Ignore cookie read errors
  }

  return "";
}

/**
 * Clears client session tokens and triggers redirection to /login.
 */
export function purgeClientSession(): void {
  cachedToken = null;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem("devlab_access_token");
      window.localStorage.removeItem("devlab_auth_token");
      window.localStorage.removeItem("devlab_auth_user");
      document.cookie = "devlab_access_token=; path=/; max-age=0; SameSite=Lax";
    } catch {
      // Ignore teardown errors
    }
    const current = window.location.pathname;
    if (current !== "/login" && current !== "/forgot-password" && current !== "/reset-password") {
      window.location.href = "/login";
    }
  }
}

/** Standard fetch wrapper with JSON serialization, bearer auth, and 401 interception */
async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    if (res.status === 401) {
      purgeClientSession();
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  getNavigation: (): Promise<NavigationItem[]> =>
    fetchJson<NavigationItem[]>(API_ROUTES.PLATFORM_NAVIGATION),

  getTenants: (): Promise<Tenant[]> => fetchJson<Tenant[]>(API_ROUTES.PLATFORM_TENANTS),

  createTenant: (payload: { name: string }): Promise<Tenant> =>
    fetchJson<Tenant>(API_ROUTES.PLATFORM_TENANTS, {
      method: HttpMethod.POST,
      body: JSON.stringify(payload),
    }),

  getTelemetry: (): Promise<SystemTelemetry> =>
    fetchJson<SystemTelemetry>(API_ROUTES.PLATFORM_TELEMETRY),

  getMe: (): Promise<UserMember> => fetchJson<UserMember>(API_ROUTES.AUTH_ME),

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
