/**
 * @file apps/web/src/lib/server-auth.ts
 * @description Server-side session verification helper extracting bearer tokens from HTTP cookies.
 * @module @devlab/portal-web/lib/server-auth
 */

import { cookies } from "next/headers";
import { isJwtExpired } from "./jwt";

export interface ServerAuthSession {
  token: string;
}

/**
 * Reads and verifies presence of active session token from Next.js request cookies.
 * Preemptively rejects expired or corrupted tokens to prevent 401 cascading during SSR prefetching.
 *
 * @returns Active session token object, or null if unauthenticated or expired
 */
export async function getServerAuth(): Promise<ServerAuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("devlab_access_token")?.value?.trim();

  if (!token || isJwtExpired(token)) {
    return null;
  }

  return { token };
}
