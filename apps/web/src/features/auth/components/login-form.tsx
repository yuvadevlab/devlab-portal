"use client";

/**
 * @file apps/web/src/features/auth/components/login-form.tsx
 * @description Interactive login form component handling SSO token handoff, session check, and @yuva-devlab/auth-client SignIn.
 * @module @devlab/portal-web/features/auth/components
 */

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignIn, type AuthUser } from "@yuva-devlab/auth-client";
import { toast } from "@devlab-portal/ui";
import { API_BASE_URL, getAuthToken, purgeClientSession, api } from "@/lib/api-client";
import { isJwtExpired, parseJwtClaims } from "@/lib/jwt";
import { APP_ROUTES } from "@/lib/constants/routes";
import { UI_COPY } from "@/lib/ui-copy";
import { AUTH_COPY } from "@/lib/ui-copy/auth";
import { AuthToastType, AuthQueryParamKey, AuthBrandTheme } from "../types";
import {
  resolveSsoAppName,
  resolveUserDisplayName,
  setPendingAuthToast,
} from "../utils/auth-toast";
import { AuthBrandLogo } from "./auth-brand-logo";
import { SsoHandoffCard } from "./sso-handoff-card";

/**
 * Interactive login form component mounted inside LoginView.
 */
export function LoginForm(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const apiBaseUrl = API_BASE_URL;

  const appParam =
    searchParams.get(AuthQueryParamKey.APP) ||
    searchParams.get(AuthQueryParamKey.BRAND) ||
    undefined;
  const redirectParam = searchParams.get(AuthQueryParamKey.REDIRECT) || APP_ROUTES.HOME;

  const [handoff, setHandoff] = useState<{ isHandoff: boolean; displayName: string } | null>(null);

  const targetAppName = useMemo(
    () => resolveSsoAppName(appParam, redirectParam),
    [appParam, redirectParam],
  );

  const SSO_GUARD_KEY = "devlab_sso_handoff_guard";

  // Preemptive SSO pass-through if session is already active and cryptographically verified
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check for explicit re-auth / error flags
    const promptParam = searchParams.get("prompt");
    const errorParam =
      searchParams.get(AuthQueryParamKey.ERROR) ||
      searchParams.get(AuthQueryParamKey.AUTH_ERROR) ||
      searchParams.get(AuthQueryParamKey.SESSION_EXPIRED);
    const isForceReAuth =
      promptParam === "login" || promptParam === "consent" || Boolean(errorParam);

    if (isForceReAuth) {
      sessionStorage.removeItem(SSO_GUARD_KEY);
      purgeClientSession();
      setHandoff(null);
      if (errorParam) {
        toast.warning(AUTH_COPY.TOAST.SESSION_EXPIRED_TITLE, {
          description: AUTH_COPY.TOAST.SESSION_EXPIRED_DESC,
          duration: 5000,
        });
      }
      return;
    }

    const existingToken = getAuthToken();
    if (!existingToken || isJwtExpired(existingToken)) {
      return;
    }

    // SSO Loop Guard: Detect rapid ping-pong bounces to the same destination
    if (redirectParam && redirectParam !== APP_ROUTES.HOME) {
      try {
        const lastHandoffRaw = sessionStorage.getItem(SSO_GUARD_KEY);
        if (lastHandoffRaw) {
          const { url, time } = JSON.parse(lastHandoffRaw);
          if (url === redirectParam && Date.now() - time < 5000) {
            // Infinite bounce detected! Clear token and require explicit user login
            sessionStorage.removeItem(SSO_GUARD_KEY);
            purgeClientSession();
            setHandoff(null);
            toast.error(AUTH_COPY.TOAST.SESSION_EXPIRED_TITLE, {
              description: "Session validation failed for this application. Please sign in again.",
              duration: 6000,
            });
            return;
          }
        }
      } catch {
        sessionStorage.removeItem(SSO_GUARD_KEY);
      }
    }

    let isCancelled = false;

    // Cryptographically verify token validity with DevLab backend before handing off
    async function verifyAndHandoff() {
      try {
        await api.getMe();
        if (isCancelled) return;

        const claims = parseJwtClaims(existingToken);
        const name = resolveUserDisplayName(
          { name: claims?.name as string, email: claims?.email as string },
          existingToken,
        );

        if (redirectParam && redirectParam !== APP_ROUTES.HOME) {
          // Record handoff attempt in session storage for loop prevention
          try {
            sessionStorage.setItem(
              SSO_GUARD_KEY,
              JSON.stringify({ url: redirectParam, time: Date.now() }),
            );
          } catch {
            // Ignore storage errors
          }

          setHandoff({ isHandoff: true, displayName: name });

          const timer = setTimeout(() => {
            try {
              const url = new URL(redirectParam, window.location.origin);
              url.searchParams.set(AuthQueryParamKey.TOKEN, existingToken);
              window.location.href = url.toString();
            } catch {
              const separator = redirectParam.includes("?") ? "&" : "?";
              window.location.href = `${redirectParam}${separator}${AuthQueryParamKey.TOKEN}=${encodeURIComponent(existingToken)}`;
            }
          }, 800);

          return () => clearTimeout(timer);
        }
      } catch {
        // Backend rejected token (401 or invalid signature)
        if (!isCancelled) {
          purgeClientSession();
          setHandoff(null);
        }
      }
    }

    verifyAndHandoff();

    return () => {
      isCancelled = true;
    };
  }, [appParam, redirectParam, searchParams, targetAppName]);

  // Enterprise SSO authentication success handler
  const handleSuccess = (user: AuthUser, token: string) => {
    const displayName = resolveUserDisplayName(user, token);
    const isExternalRedirect = Boolean(redirectParam && redirectParam !== APP_ROUTES.HOME);

    if (isExternalRedirect) {
      try {
        sessionStorage.removeItem(SSO_GUARD_KEY);
      } catch {
        // Ignore storage errors
      }

      // Option A: Smooth in-card SSO handoff (Google / Okta standard, zero toast flicker)
      setHandoff({ isHandoff: true, displayName });

      setTimeout(() => {
        try {
          const url = new URL(redirectParam, window.location.origin);
          url.searchParams.set(AuthQueryParamKey.TOKEN, token);
          window.location.href = url.toString();
        } catch {
          const separator = redirectParam.includes("?") ? "&" : "?";
          window.location.href = `${redirectParam}${separator}${AuthQueryParamKey.TOKEN}=${encodeURIComponent(token)}`;
        }
      }, 900);
    } else {
      // Direct DevLab Portal workspace sign-in
      const title = AUTH_COPY.TOAST.SSO_LOGIN_SUCCESS_TITLE(displayName);
      const description = AUTH_COPY.TOAST.SSO_LOGIN_PORTAL_DESC;

      toast.success(title, { description, duration: 5000 });

      setPendingAuthToast({
        type: AuthToastType.SUCCESS,
        title,
        description,
      });

      setTimeout(() => {
        router.push(APP_ROUTES.HOME);
      }, 400);
    }
  };

  const handleError = (error: Error) => {
    toast.error(AUTH_COPY.TOAST.LOGIN_ERROR_TITLE, {
      description: error.message || AUTH_COPY.TOAST.LOGIN_ERROR_DESC,
      duration: 5000,
    });
  };

  const forgotPasswordUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (appParam) params.set(AuthQueryParamKey.APP, appParam);
    if (redirectParam && redirectParam !== APP_ROUTES.HOME) {
      params.set(AuthQueryParamKey.REDIRECT, redirectParam);
    }
    const qs = params.toString();
    return `${APP_ROUTES.FORGOT_PASSWORD}${qs ? `?${qs}` : ""}`;
  }, [appParam, redirectParam]);

  const logo = useMemo(
    () => <AuthBrandLogo targetAppName={targetAppName} showSsoBadge={Boolean(appParam)} />,
    [appParam, targetAppName],
  );

  const brandTheme = appParam ?? AuthBrandTheme.PORTAL;

  if (handoff?.isHandoff) {
    return (
      <SsoHandoffCard
        displayName={handoff.displayName}
        targetAppName={targetAppName}
        brand={brandTheme}
        theme={brandTheme}
      />
    );
  }

  return (
    <SignIn
      apiBaseUrl={apiBaseUrl}
      brand={brandTheme}
      theme={brandTheme}
      onSuccess={handleSuccess}
      onError={handleError}
      forgotPasswordUrl={forgotPasswordUrl}
      logo={logo}
      fullPage
      legalConfig={{
        appName: UI_COPY.COMMON.BRAND.APP_NAME,
        version: UI_COPY.COMMON.BRAND.VERSION,
        showLinks: true,
      }}
    />
  );
}
