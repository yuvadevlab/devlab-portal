"use client";

/**
 * @file apps/web/src/features/settings/components/jwks-viewer.tsx
 * @description OIDC identity metadata and active RFC 7517 JWKS key inspector.
 * Consumes @yuva-devlab/ui CopyButton and Badge primitives.
 * @module @devlab/portal-web/features/settings/components/jwks-viewer
 */

import React from "react";
import { KeyRound, Globe, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Badge, CopyButton } from "@yuva-devlab/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { API_BASE_URL, JwksData, OpenIdConfig } from "@/lib/api-client";

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
      <div className="border-border border-b pb-5">
        <h2 className="text-foreground text-xl font-bold tracking-tight">
          {UI_COPY.SETTINGS.HEADER.TITLE}
        </h2>
        <p className="text-muted-foreground mt-1 text-xs">{UI_COPY.SETTINGS.HEADER.DESCRIPTION}</p>
      </div>

      {/* OIDC Discovery Endpoints Card */}
      <div className="border-border bg-card space-y-4 rounded-xl border p-6">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-lg">
            <Globe className="size-4" />
          </div>
          <div>
            <h3 className="text-foreground text-sm font-bold">{UI_COPY.SETTINGS.OIDC.TITLE}</h3>
            <p className="text-muted-foreground text-xs">{UI_COPY.SETTINGS.OIDC.DESCRIPTION}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-2 text-xs md:grid-cols-2">
          {/* OIDC Config URI */}
          <div className="border-border bg-background space-y-1 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[11px] font-medium">
                {UI_COPY.SETTINGS.OIDC.DISCOVERY_URL}
              </span>
              <CopyButton textToCopy={oidc ? JSON.stringify(oidc, null, 2) : oidcUrl} />
            </div>
            <p className="text-foreground truncate font-mono text-xs">{oidcUrl}</p>
          </div>

          {/* JWKS URI */}
          <div className="border-border bg-background space-y-1 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[11px] font-medium">
                {UI_COPY.SETTINGS.JWKS.ENDPOINT_LABEL}
              </span>
              <CopyButton textToCopy={jwksUrl} />
            </div>
            <p className="text-foreground truncate font-mono text-xs">{jwksUrl}</p>
          </div>
        </div>
      </div>

      {/* Active Public Key Sets */}
      <div className="border-border bg-card space-y-5 rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-lg">
              <KeyRound className="size-4" />
            </div>
            <div>
              <h3 className="text-foreground text-sm font-bold">{UI_COPY.SETTINGS.JWKS.TITLE}</h3>
              <p className="text-muted-foreground text-xs">{UI_COPY.SETTINGS.JWKS.DESCRIPTION}</p>
            </div>
          </div>
          <span className="border-success/20 bg-success/10 text-success inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold">
            <CheckCircle2 className="size-3.5" />
            {UI_COPY.SETTINGS.JWKS.STATUS_ACTIVE}
          </span>
        </div>

        {/* Keys listing */}
        {jwks?.keys?.map((key) => (
          <div
            key={key.kid}
            className="border-border bg-background space-y-3 rounded-lg border p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-primary size-4" />
                <span className="text-foreground font-mono text-xs font-bold">kid: {key.kid}</span>
                <Badge variant="outline" className="border-border font-mono text-[10px]">
                  {key.alg}
                </Badge>
                <Badge variant="outline" className="border-border font-mono text-[10px]">
                  {key.kty}
                </Badge>
              </div>
              <CopyButton textToCopy={JSON.stringify(key, null, 2)} />
            </div>

            {/* Modulus (n) preview */}
            <div>
              <span className="text-muted-foreground mb-1 block font-mono text-[10px] uppercase">
                Public Modulus (RSA N)
              </span>
              <pre className="border-border bg-card text-muted-foreground max-h-16 overflow-x-auto rounded border p-2 font-mono text-[10px]">
                {key.n}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
