"use client";

/**
 * @file apps/web/src/features/auth/components/reset-password-form.tsx
 * @description Reset password state container using @yuva-devlab/auth-client AuthCard.
 * @module @devlab/portal-web/features/auth/components
 */

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AuthCard } from "@yuva-devlab/auth-client";
import { toast } from "@devlab-portal/ui";
import { API_BASE_URL } from "@/lib/api-client";
import { APP_ROUTES, API_ROUTES } from "@/lib/constants/routes";
import {
  HttpMethod,
  HttpHeader,
  ContentType,
  AuthQueryParamKey,
  QueryParamValue,
  AuthFormField,
  AuthBrandTheme,
} from "@/lib/constants/enums";
import { UI_COPY } from "@/lib/ui-copy";
import { AUTH_COPY } from "@/lib/ui-copy/auth";
import { AuthToastType } from "../types";
import { setPendingAuthToast } from "../utils/auth-toast";
import { AuthBrandLogo } from "./auth-brand-logo";
import { ResetPasswordSuccess } from "./reset-password-success";
import { ResetPasswordInputs } from "./reset-password-inputs";

/**
 * Reset password card container managing input state and mutation handlers.
 */
export function ResetPasswordForm(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get(AuthQueryParamKey.TOKEN) ?? "";
  const isWelcome = searchParams.get(AuthQueryParamKey.WELCOME) === QueryParamValue.TRUE;
  const appParam =
    searchParams.get(AuthQueryParamKey.APP) ||
    searchParams.get(AuthQueryParamKey.BRAND) ||
    undefined;
  const copy = UI_COPY.AUTH.RESET_PASSWORD;

  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!token.trim()) {
      setErrorMessage(copy.VALIDATION.TOKEN_REQUIRED);
      return;
    }
    if (password.length < 8) {
      setErrorMessage(copy.VALIDATION.PASSWORD_MIN_LENGTH);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(copy.VALIDATION.PASSWORDS_MISMATCH);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}${API_ROUTES.AUTH_RESET_PASSWORD}`, {
        method: HttpMethod.POST,
        headers: { [HttpHeader.CONTENT_TYPE]: ContentType.APPLICATION_JSON },
        body: JSON.stringify({
          [AuthFormField.TOKEN]: token.trim(),
          [AuthFormField.NEW_PASSWORD]: password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || copy.VALIDATION.RESET_FAILED);
      }

      toast.success(AUTH_COPY.TOAST.RESET_PASSWORD_SUCCESS_TITLE, {
        description: AUTH_COPY.TOAST.RESET_PASSWORD_SUCCESS_DESC,
        duration: 5000,
      });

      setPendingAuthToast({
        type: AuthToastType.SUCCESS,
        title: AUTH_COPY.TOAST.RESET_PASSWORD_SUCCESS_TITLE,
        description: AUTH_COPY.TOAST.RESET_PASSWORD_LOGIN_HINT,
      });

      setDone(true);
      setTimeout(() => router.push(APP_ROUTES.LOGIN), 2500);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setErrorMessage(error.message);
      toast.error(AUTH_COPY.TOAST.RESET_PASSWORD_ERROR_TITLE, {
        description: error.message,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const footer = useMemo(
    () => (
      <Link href={APP_ROUTES.LOGIN} className="dl-auth-link dl-auth-back-link">
        <ArrowLeft size={14} />
        {copy.BACK_TO_SIGN_IN}
      </Link>
    ),
    [copy.BACK_TO_SIGN_IN],
  );

  const brandTheme = appParam ?? AuthBrandTheme.PORTAL;

  return (
    <AuthCard
      title={copy.SET_ACCOUNT_TITLE}
      subtitle={done ? copy.SUCCESS_TITLE : copy.SET_ACCOUNT_DESCRIPTION}
      errorMsg={errorMessage}
      brand={brandTheme}
      theme={brandTheme}
      footer={footer}
      logo={<AuthBrandLogo />}
      fullPage
    >
      {done ? (
        <ResetPasswordSuccess />
      ) : (
        <ResetPasswordInputs
          token={token}
          showTokenInput={!tokenFromUrl}
          onTokenChange={setToken}
          password={password}
          onPasswordChange={setPassword}
          confirmPassword={confirmPassword}
          onConfirmPasswordChange={setConfirmPassword}
          loading={loading}
          isWelcome={isWelcome}
          onSubmit={handleSubmit}
        />
      )}
    </AuthCard>
  );
}
