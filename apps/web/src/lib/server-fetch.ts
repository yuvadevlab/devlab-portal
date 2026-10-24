/**
 * @file apps/web/src/lib/server-fetch.ts
 * @description Server-side HTTP client for Next.js Server Component (RSC) prefetching.
 * @module @devlab/portal-web/lib/server-fetch
 */

const SERVER_API_BASE = process.env.NEXT_PUBLIC_DEVLAB_PORTAL_API_URL || "http://localhost:3015";

/**
 * Server-side fetch helper for prefetching queries in Next.js Server Components.
 *
 * @template T Return payload type
 * @param endpoint Relative API endpoint path
 * @param token Optional bearer token forwarded from user session
 * @param options Additional request options
 */
export async function serverFetch<T>(
  endpoint: string,
  token?: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${SERVER_API_BASE}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
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
