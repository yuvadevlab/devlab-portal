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
import { API_BASE_URL, getAuthToken } from "@/lib/api-client";
import { isJwtExpired, parseJwtClaims } from "@/lib/jwt";
import { APP_ROUTES } from "@/lib/constants/routes";
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

  // Preemptive SSO pass-through if session is already active
  useEffect(() => {
    if (typeof window === "undefined") return;
    const existingToken = getAuthToken();
    if (existingToken && !isJwtExpired(existingToken)) {
      const claims = parseJwtClaims(existingToken);
      const name = resolveUserDisplayName(
        { name: claims?.name as string, email: claims?.email as string },
        existingToken,
      );

      if (redirectParam && redirectParam !== APP_ROUTES.HOME) {
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
    }
  }, [appParam, redirectParam, targetAppName]);

  // Enterprise SSO authentication success handler
  const handleSuccess = (user: AuthUser, token: string) => {
    const displayName = resolveUserDisplayName(user, token);
    const isExternalRedirect = Boolean(redirectParam && redirectParam !== APP_ROUTES.HOME);

    if (isExternalRedirect) {
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
    />
  );
}
