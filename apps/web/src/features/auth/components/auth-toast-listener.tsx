"use client";

/**
 * @file apps/web/src/features/auth/components/auth-toast-listener.tsx
 * @description Global client component listening for pending auth toasts and SSO redirect feedback.
 * @module @devlab/portal-web/features/auth/components
 */

import { useEffect } from "react";
import { AUTH_COPY } from "@/lib/ui-copy/auth";
import { AuthToastType, AuthQueryParamKey, QueryParamValue } from "../types";
import { consumePendingAuthToast, triggerAuthToast } from "../utils/auth-toast";

/**
 * Client listener component mounted globally to deliver queued auth notifications across page navigations.
 */
export function AuthToastListener(): null {
  useEffect(() => {
    // 1. Deliver queued session toasts across hard page reloads and client navigations
    const pendingToast = consumePendingAuthToast();
    if (pendingToast) {
      // Small timeout to allow DOM/Toaster mounting to complete
      const timer = setTimeout(() => {
        triggerAuthToast(pendingToast);
      }, 80);
      return () => clearTimeout(timer);
    }

    // 2. Inspect query parameters for SSO error or signed-out notifications from external apps
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      let handled = false;

      const authError =
        params.get(AuthQueryParamKey.AUTH_ERROR) || params.get(AuthQueryParamKey.ERROR_DESCRIPTION);
      if (authError) {
        triggerAuthToast({
          type: AuthToastType.ERROR,
          title: AUTH_COPY.TOAST.LOGIN_ERROR_TITLE,
          description: decodeURIComponent(authError),
          duration: 6000,
        });
        params.delete(AuthQueryParamKey.AUTH_ERROR);
        params.delete(AuthQueryParamKey.ERROR_DESCRIPTION);
        params.delete(AuthQueryParamKey.ERROR);
        handled = true;
      }

      if (params.get(AuthQueryParamKey.SIGNED_OUT) === QueryParamValue.TRUE) {
        triggerAuthToast({
          type: AuthToastType.INFO,
          title: AUTH_COPY.TOAST.SIGNED_OUT_TITLE,
          description: AUTH_COPY.TOAST.SIGNED_OUT_DESC,
          duration: 5000,
        });
        params.delete(AuthQueryParamKey.SIGNED_OUT);
        handled = true;
      }

      if (params.get(AuthQueryParamKey.SESSION_EXPIRED) === QueryParamValue.TRUE) {
        triggerAuthToast({
          type: AuthToastType.WARNING,
          title: AUTH_COPY.TOAST.SESSION_EXPIRED_TITLE,
          description: AUTH_COPY.TOAST.SESSION_EXPIRED_DESC,
          duration: 5000,
        });
        params.delete(AuthQueryParamKey.SESSION_EXPIRED);
        handled = true;
      }

      if (handled) {
        const newSearch = params.toString();
        const newUrl =
          window.location.pathname + (newSearch ? `?${newSearch}` : "") + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, []);

  return null;
}
