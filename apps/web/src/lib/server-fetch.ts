/**
 * @file apps/web/src/lib/server-fetch.ts
 * @description Server-side HTTP client for Next.js Server Component (RSC) prefetching.
 * @module @devlab/portal-web/lib/server-fetch
 */

import { API_ROUTES } from "@/lib/constants/routes";
import { HttpMethod } from "@/lib/constants/enums";
import { logger } from "@/lib/logger";

const SERVER_API_BASE =
  process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3015";

let serverCachedToken: string | null = null;

/**
 * Obtains an administrative RS256 JWT token for server-side prefetching.
 */
async function getServerAuthToken(): Promise<string> {
  if (serverCachedToken) {
    return serverCachedToken;
  }

  try {
    const res = await fetch(`${SERVER_API_BASE}${API_ROUTES.AUTH_LOGIN}`, {
      method: HttpMethod.POST,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@devlab.internal",
        password: "DevLab@2026!Admin",
      }),
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      const token: string = data.accessToken || "";
      serverCachedToken = token;
      return token;
    }
  } catch (err) {
    logger.warn("Could not pre-authenticate server session for SSR prefetch:", err);
  }

  return "";
}

/**
 * Server-side fetch helper for prefetching queries in Next.js Server Components.
 *
 * @template T Return payload type
 * @param endpoint Relative API endpoint path
 * @param options Additional request options
 */
export async function serverFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getServerAuthToken();
  const url = `${SERVER_API_BASE}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(`Server fetch failed [${res.status}] ${url}: ${errorBody.slice(0, 200)}`);
  }

  return res.json() as Promise<T>;
}
