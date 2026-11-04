/**
 * @file apps/web/src/features/auth/types.ts
 * @description Type definitions for authentication sessions, pending toasts, and SSO flows.
 * @module @devlab/portal-web/features/auth/types
 */

import {
  AuthToastType,
  AuthQueryParamKey,
  QueryParamValue,
  StorageKey,
  AuthFormField,
  AuthBrandTheme,
} from "@/lib/constants/enums";

export {
  AuthToastType,
  AuthQueryParamKey,
  QueryParamValue,
  StorageKey,
  AuthFormField,
  AuthBrandTheme,
};

/**
 * Payload stored in sessionStorage for cross-navigation toast notifications.
 */
export interface PendingAuthToast {
  /** Visual variant / severity of the notification */
  type: AuthToastType;
  /** Primary greeting or title banner */
  title: string;
  /** Explanatory description or handoff context */
  description?: string;
  /** Milliseconds before auto-dismissal */
  duration?: number;
}

/**
 * Configuration options for dispatching SSO greeting toasts.
 */
export interface SsoGreetingOptions {
  /** Target ecosystem app name being redirected to (e.g. "FinAI") */
  appName?: string;
  /** Whether the user is redirecting to an external application */
  isRedirect?: boolean;
  /** Raw JWT token for fallback claims extraction */
  token?: string;
}
