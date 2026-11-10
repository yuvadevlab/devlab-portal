"use client";

/**
 * @file apps/web/src/features/auth/components/reset-password-view.tsx
 * @description Interactive client view for setting account password with Suspense boundary.
 * @module @devlab/portal-web/features/auth
 */

import React, { Suspense } from "react";
import { UI_COPY } from "@/lib/ui-copy";
import { ResetPasswordForm } from "./reset-password-form";

/**
 * Top-level reset password view wrapping ResetPasswordForm in Suspense boundary for useSearchParams.
 */
export const ResetPasswordView: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="dl-auth-fallback-wrap">
          <div className="dl-auth-fallback-text">{UI_COPY.AUTH.RESET_PASSWORD.LOADING}</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
};
