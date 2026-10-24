"use client";

/**
 * @file apps/web/src/features/auth/components/forgot-password-view.tsx
 * @description Interactive client view for portal password recovery with theme adaptation.
 * @module @devlab/portal-web/features/auth
 */

import React, { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Layers } from "lucide-react";
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
    <ForgotPassword
      apiBaseUrl={apiBaseUrl}
      brand={appParam ?? "portal"}
      theme={appParam ?? "portal"}
      signInUrl={signInUrl}
      logo={
        <div className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg shadow-md">
            <Layers className="size-5" />
          </span>
          <span className="text-foreground text-xl font-bold tracking-tight">
            {UI_COPY.AUTH.BRAND}
          </span>
        </div>
      }
      fullPage
    />
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
