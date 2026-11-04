"use client";

/**
 * @file apps/web/src/features/auth/components/forgot-password-view.tsx
 * @description Interactive client view for portal password recovery with Suspense boundary.
 * @module @devlab/portal-web/features/auth
 */

import React, { Suspense } from "react";
import { UI_COPY } from "@/lib/ui-copy";
import { ForgotPasswordForm } from "./forgot-password-form";

/**
 * Top-level forgot-password view wrapping ForgotPasswordForm in Suspense boundary for useSearchParams.
 */
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
