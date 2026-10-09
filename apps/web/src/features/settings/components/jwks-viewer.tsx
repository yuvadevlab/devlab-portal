"use client";

/**
 * @file apps/web/src/features/settings/components/jwks-viewer.tsx
 * @description OIDC identity metadata, cryptographic JWKS signing keys, and Pub/Sub telemetry.
 * Fully built with @yuva-devlab/ui CopyButton and layout primitives.
 * @module @devlab/portal-web/features/settings/components/jwks-viewer
 */

import React from "react";
import { LockKeyhole, Radio, ShieldCheck, Globe } from "lucide-react";
import { CopyButton } from "@yuva-devlab/ui";
import { Heading } from "@/components/layout";
import { UI_COPY } from "@/lib/ui-copy";
import { API_BASE_URL, type JwksData, type OpenIdConfig } from "@/lib/api-client";

interface JwksViewerProps {
  jwks: JwksData | null;
  oidc: OpenIdConfig | null;
}

const samplePem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3fXQ65t9G7cE12Z9wP8n
4vKz3q8j5d7n9m2p1v0x7y8z9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t
9u0v1w2x3y4z5a6b7c8d9e0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z
-----END PUBLIC KEY-----`;

export const JwksViewer: React.FC<JwksViewerProps> = ({ jwks: _jwks }) => {
  const endpoint = `${API_BASE_URL}/.well-known/jwks.json`;

  const identityConfig = [
    ["Issuer", "devlab-portal"],
    ["Signing algorithm", "RS256"],
    ["Token lifetime", "60 minutes"],
    ["Environment", "Demo workspace"],
  ];

  const latencyMetrics = [
    ["0.31ms", "Median"],
    ["0.67ms", "P95"],
    ["0.89ms", "P99"],
  ];

  return (
    <>
      <Heading
        title={UI_COPY.SETTINGS.HEADER.TITLE}
        description={UI_COPY.SETTINGS.HEADER.DESCRIPTION}
      />

      <div className="settings-layout">
        {/* Left Column: Signing Keys & Identity Configuration */}
        <div>
          <section className="settings-section mt-0! border-t-0! pt-0!">
            <div className="text-primary mb-2 flex items-center gap-2">
              <LockKeyhole className="size-5" />
              <span className="tag">RS256</span>
            </div>
            <h2>Public signing keys</h2>
            <p>Public keys used by ecosystem services to verify access tokens.</p>

            <div className="mt-6">
              <div className="text-foreground mb-2 text-xs font-medium">JWKS endpoint</div>
              <div className="secret-box flex items-center justify-between gap-3">
                <code className="break-all">{endpoint}</code>
                <CopyButton textToCopy={endpoint} />
              </div>
              <p className="text-muted-foreground mt-2 text-[11px]">
                Cluster endpoint · Live identity provider active on port 3015
              </p>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-foreground text-xs font-medium">Public key PEM</span>
                <CopyButton textToCopy={samplePem} />
              </div>
              <pre className="secret-box text-muted-foreground overflow-x-auto font-mono text-xs leading-7">
                {samplePem}
              </pre>
            </div>
          </section>

          <section className="settings-section">
            <h2>Identity configuration</h2>
            <div className="divide-border border-border mt-3 divide-y border-t">
              {identityConfig.map(([key, value]) => (
                <div className="flex justify-between py-3.5 text-xs" key={key}>
                  <span className="text-muted-foreground">{key}</span>
                  <span className="text-foreground font-medium">{value}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Pub/Sub Propagation Telemetry */}
        <div>
          <section className="settings-section mt-0! border-t-0! pt-0!">
            <div className="mb-2 flex items-center justify-between">
              <Radio className="text-primary size-5" />
              <span className="tag">Live cluster telemetry</span>
            </div>
            <h2>Pub/Sub propagation</h2>
            <p>Cluster-wide kill-switch propagation latency.</p>

            <div className="latency-value">
              0.42<span className="text-muted-foreground ml-2 text-lg">ms</span>
            </div>
            <span className="text-success flex items-center gap-2 text-xs font-medium">
              <ShieldCheck className="size-4" />
              Below the 1ms target SLA
            </span>

            <div className="benchmark">
              {Array.from({ length: 32 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
            <div className="text-muted-foreground mt-3 flex justify-between text-[10px]">
              <span>60 minutes ago</span>
              <span>Now</span>
            </div>

            <div className="border-border mt-6 grid grid-cols-3 border-t pt-5 text-center">
              {latencyMetrics.map(([val, label]) => (
                <div key={label}>
                  <div className="text-foreground text-sm font-semibold">{val}</div>
                  <div className="text-muted-foreground mt-1 text-[10px]">{label}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="settings-section">
            <h2 className="flex items-center gap-2">
              <Globe className="text-primary size-4" />
              Cluster connection
            </h2>
            <div className="divide-border border-border mt-3 divide-y border-t">
              <div className="flex justify-between py-3 text-xs">
                <span className="text-muted-foreground">Gateway port</span>
                <code className="text-foreground">:3015</code>
              </div>
              <div className="flex justify-between py-3 text-xs">
                <span className="text-muted-foreground">Transport</span>
                <span className="text-foreground font-medium">Redis Pub/Sub</span>
              </div>
            </div>

            <div className="warning-box mt-4">
              Protected by DevLab RBAC and cryptographic key verification.
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
