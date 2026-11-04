"use client";

/**
 * @file apps/web/src/features/auth/components/sso-handoff-card.tsx
 * @description In-card SSO redirection transition card (Google Identity / Okta pattern).
 * Displays identity verification status and destination app handoff without transient toast popups.
 * @module @devlab/portal-web/features/auth/components
 */

import React from "react";
import { AuthCard } from "@yuva-devlab/auth-client";
import { AUTH_COPY } from "@/lib/ui-copy/auth";
import { AuthBrandTheme } from "../types";
import { AuthBrandLogo } from "./auth-brand-logo";

export interface SsoHandoffCardProps {
  /** Authenticated user display name */
  displayName: string;
  /** Destination enterprise application name */
  targetAppName: string;
  /** Visual branding variant */
  brand?: string;
  /** Visual theme */
  theme?: string;
}

/**
 * Dedicated visual handoff state rendered during cross-application single sign-on redirect.
 */
export function SsoHandoffCard({
  displayName,
  targetAppName,
  brand = AuthBrandTheme.PORTAL,
  theme = AuthBrandTheme.PORTAL,
}: SsoHandoffCardProps): React.JSX.Element {
  const initials =
    displayName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || AUTH_COPY.INITIALS_FALLBACK;

  return (
    <AuthCard
      title={AUTH_COPY.LOGIN.SSO_CONNECTING}
      subtitle={AUTH_COPY.LOGIN.REDIRECTING_TO_APP(targetAppName)}
      brand={brand}
      theme={theme}
      logo={<AuthBrandLogo targetAppName={targetAppName} showSsoBadge />}
      fullPage
    >
      <div className="dl-auth-handoff-state">
        <div className="dl-auth-handoff-avatar">{initials}</div>
        <h3 className="dl-auth-handoff-title">{AUTH_COPY.LOGIN.SSO_HANDOFF_TITLE(displayName)}</h3>
        <p className="dl-auth-handoff-desc">{AUTH_COPY.LOGIN.SSO_HANDOFF_DESC(targetAppName)}</p>
        <div className="dl-auth-handoff-bar">
          <div className="dl-auth-handoff-progress" />
        </div>
      </div>
    </AuthCard>
  );
}
