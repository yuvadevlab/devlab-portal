"use client";

/**
 * @file apps/web/src/features/auth/components/forgot-password-form.tsx
 * @description Interactive password recovery form using @yuva-devlab/auth-client ForgotPassword.
 * @module @devlab/portal-web/features/auth/components
 */

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ForgotPassword } from "@yuva-devlab/auth-client";
import { toast } from "@devlab-portal/ui";
import { API_BASE_URL } from "@/lib/api-client";
import { APP_ROUTES } from "@/lib/constants/routes";
import { AUTH_COPY } from "@/lib/ui-copy/auth";
import { AuthQueryParamKey, AuthBrandTheme } from "../types";
import { AuthBrandLogo } from "./auth-brand-logo";

/**
 * Password recovery form component mounted inside ForgotPasswordView.
 */
export function ForgotPasswordForm(): React.JSX.Element {
  const searchParams = useSearchParams();
  const apiBaseUrl = API_BASE_URL;

  const appParam =
    searchParams.get(AuthQueryParamKey.APP) ||
    searchParams.get(AuthQueryParamKey.BRAND) ||
    undefined;
  const redirectParam = searchParams.get(AuthQueryParamKey.REDIRECT) || APP_ROUTES.HOME;

  const handleSuccess = (email: string) => {
    toast.success(AUTH_COPY.TOAST.FORGOT_PASSWORD_SUCCESS_TITLE, {
      description: AUTH_COPY.TOAST.FORGOT_PASSWORD_SUCCESS_DESC(email),
      duration: 6000,
    });
  };

  const handleError = (error: Error) => {
    toast.error(AUTH_COPY.TOAST.FORGOT_PASSWORD_ERROR_TITLE, {
      description: error.message || AUTH_COPY.TOAST.FORGOT_PASSWORD_ERROR_FALLBACK,
      duration: 5000,
    });
  };

  const signInUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (appParam) params.set(AuthQueryParamKey.APP, appParam);
    if (redirectParam && redirectParam !== APP_ROUTES.HOME) {
      params.set(AuthQueryParamKey.REDIRECT, redirectParam);
    }
    const qs = params.toString();
    return `${APP_ROUTES.LOGIN}${qs ? `?${qs}` : ""}`;
  }, [appParam, redirectParam]);

  const brandTheme = appParam ?? AuthBrandTheme.PORTAL;

  return (
    <ForgotPassword
      apiBaseUrl={apiBaseUrl}
      brand={brandTheme}
      theme={brandTheme}
      signInUrl={signInUrl}
      onSuccess={handleSuccess}
      onError={handleError}
      logo={<AuthBrandLogo />}
      fullPage
    />
  );
}
