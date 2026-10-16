"use client";

/**
 * @file apps/web/src/features/auth/components/login-view.tsx
 * @description Interactive client view for portal sign-in with enterprise brand/theme adaptation and SSO redirect.
 * @module @devlab/portal-web/features/auth
 */

import React, { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SignIn } from "@yuva-devlab/auth-client";

function LoginForm(): React.JSX.Element {
  const searchParams = useSearchParams();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3015";

  const appParam = searchParams.get("app") || searchParams.get("brand") || undefined;
  const redirectParam = searchParams.get("redirect") || "/";

  // Build target return URL including the session token upon sign-in success
  const handleSuccess = (_user: unknown, token: string) => {
    if (typeof window !== "undefined") {
      if (redirectParam && redirectParam !== "/") {
        // Parse return URL and append fresh SSO session token
        try {
          const url = new URL(redirectParam, window.location.origin);
          url.searchParams.set("token", token);
          window.location.href = url.toString();
          return;
        } catch {
          // If relative path without origin
          const separator = redirectParam.includes("?") ? "&" : "?";
          window.location.href = `${redirectParam}${separator}token=${encodeURIComponent(token)}`;
          return;
        }
      }
      window.location.href = "/";
    }
  };

  const forgotPasswordUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (appParam) params.set("app", appParam);
    if (redirectParam && redirectParam !== "/") {
      params.set("redirect", redirectParam);
    }
    const qs = params.toString();
    return `/forgot-password${qs ? `?${qs}` : ""}`;
  }, [appParam, redirectParam]);

  return (
    <div
      data-brand={appParam}
      data-theme={appParam}
      className="flex min-h-screen items-center justify-center p-4 transition-colors"
    >
      <SignIn
        apiBaseUrl={apiBaseUrl}
        brand={appParam}
        theme={appParam}
        onSuccess={handleSuccess}
        forgotPasswordUrl={forgotPasswordUrl}
      />
    </div>
  );
}

export const LoginView: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-muted-foreground text-sm">Loading…</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
};
