/**
 * @file apps/web/src/features/auth/utils/auth-toast.ts
 * @description Enterprise SSO greeting constructor and pending cross-navigation toast dispatcher.
 * @module @devlab/portal-web/features/auth/utils
 */

import { toast } from "@devlab-portal/ui";
import { parseJwtClaims } from "@/lib/jwt";
import { AUTH_COPY } from "@/lib/ui-copy/auth";
import { AuthToastType, AuthQueryParamKey, StorageKey, type PendingAuthToast } from "../types";

export const PENDING_AUTH_TOAST_KEY = StorageKey.PENDING_AUTH_TOAST;

/** Technical acronyms that should always be rendered fully capitalized */
const ACRONYMS = new Set(["ai", "api", "sso", "iam", "id", "ui", "sdk", "cli", "db"]);

/**
 * Dynamically formats an application slug into human-readable Title Case with preserved acronyms.
 * Completely eliminates hardcoded application name mappings.
 *
 * @param slug - Application slug or brand identifier (e.g. "finai", "orchestrai", "custom-service")
 * @returns Standardized, formatted application title
 */
export function formatDynamicAppName(slug: string): string {
  const trimmed = slug.trim();
  if (!trimmed) return "";

  const segments = trimmed
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/(fin|orchestr|vital|devlab|cloud)(ai)/i, "$1-$2")
    .split(/[-_\s]+/)
    .filter(Boolean);

  return segments
    .map((part) => {
      const lower = part.toLowerCase();
      if (ACRONYMS.has(lower)) return lower.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Resolves human-readable brand name for an ecosystem app from query parameters, URLs, or API catalog.
 * Tenant-aware with zero hardcoded application dictionaries.
 *
 * @param appParam - Brand or app identifier slug (e.g. "finai")
 * @param redirectUrl - Target redirect URL containing destination hints
 * @param registeredApps - Optional registered applications fetched from tenant API
 * @returns Standardized application name
 */
export function resolveSsoAppName(
  appParam?: string | null,
  redirectUrl?: string | null,
  registeredApps?: Array<{ slug?: string; name: string }> | null,
): string {
  if (appParam) {
    const key = appParam.trim().toLowerCase();
    if (registeredApps && registeredApps.length > 0) {
      const matched = registeredApps.find((app) => app.slug?.toLowerCase() === key);
      if (matched?.name) return matched.name;
    }
    const formatted = formatDynamicAppName(key);
    if (formatted) return formatted;
  }

  if (redirectUrl) {
    try {
      const parsed = new URL(redirectUrl, "http://localhost");
      if (registeredApps && registeredApps.length > 0) {
        const matched = registeredApps.find(
          (app) =>
            app.slug &&
            (parsed.pathname.toLowerCase().includes(app.slug.toLowerCase()) ||
              parsed.hostname.toLowerCase().includes(app.slug.toLowerCase())),
        );
        if (matched?.name) return matched.name;
      }

      const nestedApp =
        parsed.searchParams.get(AuthQueryParamKey.APP) ||
        parsed.searchParams.get(AuthQueryParamKey.BRAND);
      if (nestedApp) {
        const formatted = formatDynamicAppName(nestedApp);
        if (formatted) return formatted;
      }

      const hostPart = parsed.hostname.replace(/\.devlab\..*$/, "").replace(/^www\./, "");
      if (hostPart && hostPart !== "localhost") {
        const formatted = formatDynamicAppName(hostPart);
        if (formatted) return formatted;
      }
    } catch {
      // Ignore malformed redirect URLs
    }
  }

  return AUTH_COPY.TOAST.DEFAULT_APP_NAME;
}

/**
 * Resolves greeting display name for authenticated user from profile or JWT claims.
 *
 * @param user - User object containing name or email
 * @param token - Optional JWT token containing sub/name claims
 * @returns Human-readable greeting name
 */
export function resolveUserDisplayName(
  user?: { name?: string | null; email?: string | null } | null,
  token?: string | null,
): string {
  if (user?.name && user.name.trim().length > 0) {
    return user.name.trim();
  }

  if (token) {
    const claims = parseJwtClaims(token);
    if (claims?.name && typeof claims.name === "string" && claims.name.trim()) {
      return claims.name.trim();
    }
    if (claims?.email && typeof claims.email === "string" && claims.email.includes("@")) {
      return claims.email.split("@")[0];
    }
  }

  if (user?.email && user.email.includes("@")) {
    return user.email.split("@")[0];
  }

  return AUTH_COPY.TOAST.DEFAULT_MEMBER_NAME;
}

/**
 * Persists an auth toast notification into sessionStorage for cross-navigation rendering.
 *
 * @param payload - Toast payload containing title, description, and severity type
 */
export function setPendingAuthToast(payload: PendingAuthToast): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(StorageKey.PENDING_AUTH_TOAST, JSON.stringify(payload));
  } catch {
    // Graceful degradation when sessionStorage is blocked
  }
}

/**
 * Retrieves and clears queued auth toast from sessionStorage.
 *
 * @returns Pending auth toast payload, or null if empty
 */
export function consumePendingAuthToast(): PendingAuthToast | null {
  if (typeof window === "undefined") return null;
  try {
    const item = window.sessionStorage.getItem(StorageKey.PENDING_AUTH_TOAST);
    if (!item) return null;
    window.sessionStorage.removeItem(StorageKey.PENDING_AUTH_TOAST);
    return JSON.parse(item) as PendingAuthToast;
  } catch {
    return null;
  }
}

/**
 * Dispatches an auth toast notification using Sonner design system primitives.
 *
 * @param payload - Toast notification specifications
 */
export function triggerAuthToast(payload: PendingAuthToast): void {
  const duration = payload.duration ?? 5000;
  const description = payload.description;

  switch (payload.type) {
    case AuthToastType.SUCCESS:
      toast.success(payload.title, { description, duration });
      break;
    case AuthToastType.ERROR:
      toast.error(payload.title, { description, duration });
      break;
    case AuthToastType.WARNING:
      toast.warning(payload.title, { description, duration });
      break;
    case AuthToastType.INFO:
    default:
      toast.info(payload.title, { description, duration });
      break;
  }
}
