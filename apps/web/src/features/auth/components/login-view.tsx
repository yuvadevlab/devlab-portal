"use client";

/**
 * @file apps/web/src/features/auth/components/login-view.tsx
 * @description Interactive client view for portal sign-in with Suspense boundary.
 * @module @devlab/portal-web/features/auth
 */

import React, { Suspense } from "react";
import { UI_COPY } from "@/lib/ui-copy";
import { LoginForm } from "./login-form";

/**
 * Top-level login client view wrapping LoginForm in Suspense boundary for useSearchParams hydration.
 */
export const LoginView: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="dl-auth-fallback-wrap">
          <div className="dl-auth-fallback-text">{UI_COPY.AUTH.RESET_PASSWORD.LOADING}</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
};
