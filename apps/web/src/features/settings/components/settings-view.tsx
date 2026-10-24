"use client";

/**
 * @file apps/web/src/features/settings/components/settings-view.tsx
 * @description Dedicated client view component for Platform Cryptographic Keys and OIDC Discovery.
 * @module @devlab/portal-web/features/settings/components
 */

import React from "react";
import { JwksViewer } from "./jwks-viewer";
import { useJwksQuery, useOidcConfigQuery } from "@/features/settings/api";

export function SettingsView(): React.JSX.Element {
  const { data: jwks = null } = useJwksQuery();
  const { data: oidc = null } = useOidcConfigQuery();

  return <JwksViewer jwks={jwks} oidc={oidc} />;
}
