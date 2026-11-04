/**
 * @file apps/web/src/lib/api-client.ts
 * @description Centralized API client utility with bearer token auto-bootstrap, mutex 401 guarding, and real-time Socket.IO.
 * @module @devlab/portal-web/lib/api-client
 */

import { io, Socket } from "socket.io-client";
import { API_ROUTES, APP_ROUTES } from "@/lib/constants/routes";
import {
  HttpMethod,
  AuthToastType,
  StorageKey,
  CookieKey,
  HttpHeader,
  ContentType,
  AuthQueryParamKey,
} from "@/lib/constants/enums";
import { AUTH_COPY } from "@/lib/ui-copy/auth";
import { isJwtExpired } from "@/lib/jwt";
import type {
  NavigationItem,
  RegisteredApp,
  CreateAppPayload,
  UpdateAppSettingsPayload,
  CreateApiKeyPayload,
  CreateUserPayload,
  ApiKey,
  AuditLog,
  UserMember,
  JwksData,
  OpenIdConfig,
  SystemTelemetry,
  Tenant,
} from "./types/api";

export * from "./types/api";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_DEVLAB_PORTAL_API_URL || "http://localhost:4000";

let cachedToken: string | null = null;
let isPurgingSession = false;

/**
 * Retrieves valid authentication token from browser storage or cookie.
 * Preemptively clears expired tokens without making dead network requests.
 */
export function getAuthToken(): string {
  if (typeof window === "undefined") return "";

  if (cachedToken) {
    if (isJwtExpired(cachedToken)) {
      purgeClientSession();
      return "";
    }
    return cachedToken;
  }

  try {
    const stored = window.localStorage.getItem(StorageKey.ACCESS_TOKEN);
    if (stored && stored.trim().length > 0) {
      if (isJwtExpired(stored)) {
        purgeClientSession();
        return "";
      }
      cachedToken = stored.trim();
      return cachedToken;
    }
  } catch {
    // Ignore localStorage access restriction
  }

  try {
    const pattern = new RegExp(`(?:^|;\\s*)${CookieKey.ACCESS_TOKEN}=([^;]+)`);
    const match = document.cookie.match(pattern);
    if (match && match[1]) {
      const decoded = decodeURIComponent(match[1]).trim();
      if (decoded.length > 0) {
        if (isJwtExpired(decoded)) {
          purgeClientSession();
          return "";
        }
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
 * Clears client session tokens and triggers redirection to /login with mutex protection.
 */
export function purgeClientSession(): void {
  if (isPurgingSession) return;
  isPurgingSession = true;
  cachedToken = null;

  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(StorageKey.ACCESS_TOKEN);
      window.localStorage.removeItem(StorageKey.AUTH_TOKEN);
      window.localStorage.removeItem(StorageKey.AUTH_USER);
      document.cookie = `${CookieKey.ACCESS_TOKEN}=; path=/; max-age=0; SameSite=Lax`;
    } catch {
      // Ignore teardown errors
    }
    const current = window.location.pathname;
    const isAuth =
      current === APP_ROUTES.LOGIN ||
      current === APP_ROUTES.FORGOT_PASSWORD ||
      current === APP_ROUTES.RESET_PASSWORD;
    if (!isAuth) window.location.href = APP_ROUTES.LOGIN;
  }
}

/** Standard fetch wrapper with JSON serialization, bearer auth, and short-circuit 401 interception */
async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (isPurgingSession) {
    throw new Error(AUTH_COPY.TOAST.SESSION_EXPIRED_DESC);
  }

  const token = getAuthToken();
  const headers: Record<string, string> = {
    [HttpHeader.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
    ...(token ? { [HttpHeader.AUTHORIZATION]: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    if (res.status === 401) {
      if (typeof window !== "undefined") {
        try {
          window.sessionStorage.setItem(
            StorageKey.PENDING_AUTH_TOAST,
            JSON.stringify({
              type: AuthToastType.WARNING,
              title: AUTH_COPY.TOAST.SESSION_EXPIRED_TITLE,
              description: AUTH_COPY.TOAST.SESSION_EXPIRED_DESC,
            }),
          );
        } catch {
          // Ignore session storage errors
        }
      }
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
      `${API_ROUTES.API_KEYS}${appId ? `?${AuthQueryParamKey.APP_ID}=${encodeURIComponent(appId)}` : ""}`,
    ),

  createApiKey: (payload: CreateApiKeyPayload): Promise<ApiKey & { rawKey: string }> =>
    fetchJson<ApiKey & { rawKey: string }>(API_ROUTES.API_KEYS, {
      method: HttpMethod.POST,
      body: JSON.stringify(payload),
    }),

  revokeApiKey: (id: string): Promise<ApiKey> =>
    fetchJson<ApiKey>(API_ROUTES.API_KEY_BY_ID(id), { method: HttpMethod.DELETE }),

  getAuditLogs: (limit = 50, offset = 0): Promise<AuditLog[]> =>
    fetchJson<AuditLog[]>(API_ROUTES.AUDIT_LOGS(limit, offset)),

  getUsers: (): Promise<UserMember[]> => fetchJson<UserMember[]>(API_ROUTES.USERS),

  createUser: (payload: CreateUserPayload): Promise<UserMember> =>
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
