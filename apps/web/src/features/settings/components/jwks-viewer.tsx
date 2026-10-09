/**
 * @file apps/web/src/features/settings/components/jwks-viewer.tsx
 * @description OIDC identity metadata and active RFC 7517 JWKS key inspector.
 * Consumes @yuva-devlab/ui CopyButton and Badge primitives.
 * @module @devlab/portal-web/features/settings/components/jwks-viewer
 */

import React from "react";
import { KeyRound, Globe, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Badge, CopyButton } from "@yuva-devlab/ui";
import { UI_COPY } from "../../../lib/ui-copy/index";
import { API_BASE_URL, JwksData, OpenIdConfig } from "../../../lib/api-client";

interface JwksViewerProps {
  jwks: JwksData | null;
  oidc: OpenIdConfig | null;
}

export const JwksViewer: React.FC<JwksViewerProps> = ({ jwks, oidc }) => {
  const jwksUrl = `${API_BASE_URL}/.well-known/jwks.json`;
  const oidcUrl = `${API_BASE_URL}/.well-known/openid-configuration`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-5">
        <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
          {UI_COPY.SETTINGS.HEADER.TITLE}
        </h2>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          {UI_COPY.SETTINGS.HEADER.DESCRIPTION}
        </p>
      </div>

      {/* OIDC Discovery Endpoints Card */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/15 text-[var(--primary)]">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[var(--foreground)]">
              {UI_COPY.SETTINGS.OIDC.TITLE}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              {UI_COPY.SETTINGS.OIDC.DESCRIPTION}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
          {/* OIDC Config URI */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[var(--muted-foreground)] text-[11px]">
                {UI_COPY.SETTINGS.OIDC.DISCOVERY_URL}
              </span>
              <CopyButton textToCopy={oidcUrl} />
            </div>
            <p className="font-mono text-xs text-[var(--foreground)] truncate">{oidcUrl}</p>
          </div>

          {/* JWKS URI */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[var(--muted-foreground)] text-[11px]">
                {UI_COPY.SETTINGS.JWKS.ENDPOINT_LABEL}
              </span>
              <CopyButton textToCopy={jwksUrl} />
            </div>
            <p className="font-mono text-xs text-[var(--foreground)] truncate">{jwksUrl}</p>
          </div>
        </div>
      </div>

      {/* Active Public Key Sets */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/15 text-[var(--primary)]">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[var(--foreground)]">
                {UI_COPY.SETTINGS.JWKS.TITLE}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                {UI_COPY.SETTINGS.JWKS.DESCRIPTION}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {UI_COPY.SETTINGS.JWKS.STATUS_ACTIVE}
          </span>
        </div>

        {/* Keys listing */}
        {jwks?.keys?.map((key) => (
          <div
            key={key.kid}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[var(--primary)]" />
                <span className="font-mono text-xs font-bold text-[var(--foreground)]">
                  kid: {key.kid}
                </span>
                <Badge variant="outline" className="text-[10px] font-mono border-[var(--border)]">
                  {key.alg}
                </Badge>
                <Badge variant="outline" className="text-[10px] font-mono border-[var(--border)]">
                  {key.kty}
                </Badge>
              </div>
              <CopyButton textToCopy={JSON.stringify(key, null, 2)} />
            </div>

            {/* Modulus (n) preview */}
            <div>
              <span className="text-[10px] uppercase font-mono text-[var(--muted-foreground)] block mb-1">
                Public Modulus (RSA N)
              </span>
              <pre className="overflow-x-auto rounded border border-[var(--border)] bg-[var(--card)] p-2 font-mono text-[10px] text-[var(--muted-foreground)] max-h-16">
                {key.n}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
