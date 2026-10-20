"use client";

/**
 * @file apps/web/src/features/auth/components/reset-password-view.tsx
 * @description Interactive client view for setting account password via reset or invite token.
 * @module @devlab/portal-web/features/auth
 */

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Lock, Loader2 } from "lucide-react";
import { Button, Input, Label } from "@devlab-portal/ui";
import { API_BASE_URL } from "@/lib/api-client";
import { UI_COPY } from "@/lib/ui-copy";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") ?? "";
  const isWelcome = searchParams.get("welcome") === "true";
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
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim(), newPassword: password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || copy.VALIDATION.RESET_FAILED);
      }

      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="space-y-4 text-center">
        <div className="bg-success/15 text-success mx-auto flex size-14 items-center justify-center rounded-full">
          <CheckCircle2 className="size-7" />
        </div>
        <div>
          <h3 className="text-foreground text-base font-semibold">{copy.SUCCESS_TITLE}</h3>
          <p className="text-muted-foreground mt-1 text-xs">{copy.REDIRECTING}</p>
        </div>
        <Button asChild className="w-full">
          <Link href="/login">{copy.LOGIN_ACTION}</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="bg-destructive/15 text-destructive rounded-lg p-3 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      {!tokenFromUrl && (
        <div className="space-y-1.5">
          <Label htmlFor="token" className="text-xs font-semibold">
            {copy.TOKEN_LABEL}
          </Label>
          <Input
            id="token"
            type="text"
            placeholder={copy.TOKEN_PLACEHOLDER}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={loading}
            className="h-9 font-mono text-xs"
          />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-xs font-semibold">
          {isWelcome ? copy.CREATE_PASSWORD_LABEL : copy.NEW_PASSWORD_LABEL}
        </Label>
        <Input
          id="password"
          type="password"
          placeholder={copy.PASSWORD_PLACEHOLDER}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className="h-9 text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-xs font-semibold">
          {copy.CONFIRM_PASSWORD_LABEL}
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder={copy.PASSWORD_PLACEHOLDER}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          className="h-9 text-xs"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-primary text-primary-foreground mt-2 w-full text-xs font-medium"
      >
        {loading ? (
          <>
            <Loader2 className="mr-1.5 size-3.5 animate-spin" />
            {copy.UPDATING_PASSWORD}
          </>
        ) : (
          <>
            <Lock className="mr-1.5 size-3.5" />
            {isWelcome ? copy.SET_PASSWORD_ACTION : copy.RESET_PASSWORD_ACTION}
          </>
        )}
      </Button>
    </form>
  );
}

export const ResetPasswordView: React.FC = () => {
  const copy = UI_COPY.AUTH.RESET_PASSWORD;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-foreground text-xl font-bold tracking-tight">
          {copy.SET_ACCOUNT_TITLE}
        </h2>
        <p className="text-muted-foreground mt-1 text-xs">{copy.SET_ACCOUNT_DESCRIPTION}</p>
      </div>

      <div className="border-border bg-card rounded-xl border p-6 shadow-sm">
        <Suspense fallback={<div className="text-muted-foreground text-xs">{copy.LOADING}</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>

      <div className="text-center">
        <Link
          href="/login"
          className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-xs font-medium"
        >
          <ArrowLeft className="size-3.5" />
          {copy.BACK_TO_SIGN_IN}
        </Link>
      </div>
    </div>
  );
};
