/**
 * @file apps/web/src/lib/server-auth.ts
 * @description Server-side session verification helper extracting bearer tokens from HTTP cookies.
 * @module @devlab/portal-web/lib/server-auth
 */

import { cookies } from "next/headers";

export interface ServerAuthSession {
  token: string;
}

/**
 * Reads and verifies presence of active session token from Next.js request cookies.
 *
 * @returns Active session token object, or null if unauthenticated
 */
export async function getServerAuth(): Promise<ServerAuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("devlab_access_token")?.value;

  if (!token || token.trim().length === 0) {
    return null;
  }

  return { token: token.trim() };
}
