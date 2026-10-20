"use client";

/**
 * @file apps/web/src/features/auth/components/forgot-password-view.tsx
 * @description Interactive client view for portal password recovery with theme adaptation.
 * @module @devlab/portal-web/features/auth
 */

import React, { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ForgotPassword } from "@yuva-devlab/auth-client";
import { API_BASE_URL } from "@/lib/api-client";
import { UI_COPY } from "@/lib/ui-copy";

function ForgotPasswordForm(): React.JSX.Element {
  const searchParams = useSearchParams();
  const apiBaseUrl = API_BASE_URL;

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
          <div className="text-muted-foreground text-sm">{UI_COPY.AUTH.RESET_PASSWORD.LOADING}</div>
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
};
