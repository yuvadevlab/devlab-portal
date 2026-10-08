/**
 * @file apps/web/src/lib/api-client.ts
 * @description API client utility and real-time Socket.IO subscription manager.
 * @module @devlab/portal-web/lib
 */

import { io, Socket } from "socket.io-client";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3015";

/**
 * Standard fetch wrapper with JSON serialization and error handling.
 */
async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `API error ${res.status}: ${res.statusText}`);
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

export const api = {
  getApps: (): Promise<RegisteredApp[]> => fetchJson<RegisteredApp[]>("/api/v1/apps"),

  updateAppStatus: (
    id: string,
    isActive: boolean,
    maintenanceNote?: string,
  ): Promise<RegisteredApp> =>
    fetchJson<RegisteredApp>(`/api/v1/apps/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isActive, maintenanceNote }),
    }),

  getApiKeys: (appId?: string): Promise<ApiKey[]> =>
    fetchJson<ApiKey[]>(`/api/v1/api-keys${appId ? `?app_id=${appId}` : ""}`),

  createApiKey: (payload: {
    name: string;
    appId: string;
    scopes: string[];
    rateLimitRpm?: number;
    expiresAt?: string;
  }): Promise<ApiKey & { rawKey: string }> =>
    fetchJson<ApiKey & { rawKey: string }>("/api/v1/api-keys", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  revokeApiKey: (id: string): Promise<ApiKey> =>
    fetchJson<ApiKey>(`/api/v1/api-keys/${id}`, {
      method: "DELETE",
    }),

  getAuditLogs: (limit = 50, offset = 0): Promise<AuditLog[]> =>
    fetchJson<AuditLog[]>(`/api/v1/audit-logs?limit=${limit}&offset=${offset}`),
};

/**
 * Initializes and returns singleton Socket.IO connection for live cluster updates.
 */
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
