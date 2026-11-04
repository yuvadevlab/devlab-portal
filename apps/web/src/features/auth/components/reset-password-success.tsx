"use client";

/**
 * @file apps/web/src/features/auth/components/reset-password-success.tsx
 * @description Success indicator component rendered after successful password credential update.
 * @module @devlab/portal-web/features/auth/components
 */

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { UI_COPY } from "@/lib/ui-copy";

/**
 * Success visual feedback state displayed when password reset completes.
 */
export function ResetPasswordSuccess(): React.JSX.Element {
  const copy = UI_COPY.AUTH.RESET_PASSWORD;

  return (
    <div className="dl-auth-success-state">
      <div className="dl-auth-success-icon-wrapper">
        <CheckCircle2 size={24} />
      </div>
      <p className="dl-auth-success-redirect-text">{copy.REDIRECTING}</p>
    </div>
  );
}
