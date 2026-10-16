"use client";

/**
 * @file apps/web/src/features/auth/components/forgot-password-view.tsx
 * @description Interactive client view for portal password recovery with theme adaptation.
 * @module @devlab/portal-web/features/auth
 */

import React, { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ForgotPassword } from "@yuva-devlab/auth-client";

function ForgotPasswordForm(): React.JSX.Element {
  const searchParams = useSearchParams();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3015";

  const appParam = searchParams.get("app") || searchParams.get("brand") || undefined;
  const redirectParam = searchParams.get("redirect") || "/";

  const signInUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (appParam) params.set("app", appParam);
    if (redirectParam && redirectParam !== "/") {
      params.set("redirect", redirectParam);
    }
    const qs = params.toString();
    return `/login${qs ? `?${qs}` : ""}`;
  }, [appParam, redirectParam]);

  return (
    <div
      data-brand={appParam}
      data-theme={appParam}
      className="flex min-h-screen items-center justify-center p-4 transition-colors"
    >
      <ForgotPassword
        apiBaseUrl={apiBaseUrl}
        brand={appParam}
        theme={appParam}
        signInUrl={signInUrl}
      />
    </div>
  );
}

export const ForgotPasswordView: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-muted-foreground text-sm">Loading…</div>
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
};
