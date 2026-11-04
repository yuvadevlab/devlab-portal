"use client";

/**
 * @file apps/web/src/features/auth/components/auth-brand-logo.tsx
 * @description Centralized branding header with optional SSO target application indicator badge.
 * @module @devlab/portal-web/features/auth/components
 */

import React from "react";
import { Layers } from "lucide-react";
import { UI_COPY } from "@/lib/ui-copy";
import { AUTH_COPY } from "@/lib/ui-copy/auth";

export interface AuthBrandLogoProps {
  /** Optional target application name being authorized for single sign-on */
  targetAppName?: string;
  /** Whether to render the SSO target badge indicator */
  showSsoBadge?: boolean;
}

/**
 * Reusable authentication brand banner displaying system branding and dynamic SSO destination tags.
 */
export function AuthBrandLogo({
  targetAppName,
  showSsoBadge = false,
}: AuthBrandLogoProps): React.JSX.Element {
  return (
    <div className="dl-auth-brand-container">
      <div className="dl-auth-brand-header">
        <span className="dl-auth-brand-icon">
          <Layers className="size-5" />
        </span>
        <span className="dl-auth-brand-text">{UI_COPY.AUTH.BRAND}</span>
      </div>
      {showSsoBadge && targetAppName && (
        <span className="dl-auth-sso-badge">
          {AUTH_COPY.LOGIN.SSO_BADGE_PREFIX} <strong>{targetAppName}</strong>
        </span>
      )}
    </div>
  );
}
