"use client";

/**
 * @file apps/web/src/features/settings/components/jwks-viewer.tsx
 * @description OIDC identity metadata, cryptographic JWKS signing keys, and Pub/Sub telemetry.
 * Fully built with @devlab-portal/ui CopyButton and layout primitives.
 * @module @devlab/portal-web/features/settings/components/jwks-viewer
 */

import React from "react";
import { LockKeyhole, Radio, ShieldCheck, Globe } from "lucide-react";
import { CopyButton, Heading } from "@devlab-portal/ui";
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
    [UI_COPY.SETTINGS.IDENTITY.ISSUER, UI_COPY.SETTINGS.IDENTITY.ISSUER_VAL],
    [UI_COPY.SETTINGS.IDENTITY.ALGORITHM, UI_COPY.SETTINGS.IDENTITY.ALGORITHM_VAL],
    [UI_COPY.SETTINGS.IDENTITY.LIFETIME, UI_COPY.SETTINGS.IDENTITY.LIFETIME_VAL],
    [UI_COPY.SETTINGS.IDENTITY.ENV, UI_COPY.SETTINGS.IDENTITY.ENV_VAL],
  ];

  const latencyMetrics = [
    [UI_COPY.SETTINGS.TELEMETRY.MEDIAN_VAL, UI_COPY.SETTINGS.TELEMETRY.MEDIAN],
    [UI_COPY.SETTINGS.TELEMETRY.P95_VAL, UI_COPY.SETTINGS.TELEMETRY.P95],
    [UI_COPY.SETTINGS.TELEMETRY.P99_VAL, UI_COPY.SETTINGS.TELEMETRY.P99],
  ];

  return (
    <>
      <Heading
        title={UI_COPY.SETTINGS.HEADER.TITLE}
        description={UI_COPY.SETTINGS.HEADER.DESCRIPTION}
        eyebrowLabel={UI_COPY.COMMON.HEADER.WORKSPACE}
      />

      <div className="settings-layout">
        {/* Left Column: Signing Keys & Identity Configuration */}
        <div>
          <section className="settings-section settings-section-first">
            <div className="settings-card-header">
              <LockKeyhole className="settings-header-icon" />
              <span className="tag">{UI_COPY.SETTINGS.KEYS.TAG}</span>
            </div>
            <h2>{UI_COPY.SETTINGS.KEYS.TITLE}</h2>
            <p>{UI_COPY.SETTINGS.KEYS.DESCRIPTION}</p>

            <div className="settings-field-group">
              <div className="settings-field-label">{UI_COPY.SETTINGS.KEYS.JWKS_LABEL}</div>
              <div className="secret-box secret-box-spread">
                <code className="secret-box-code">{endpoint}</code>
                <CopyButton textToCopy={endpoint} />
              </div>
              <p className="settings-field-note">{UI_COPY.SETTINGS.KEYS.JWKS_NOTE}</p>
            </div>

            <div className="settings-field-group">
              <div className="settings-card-header-spread">
                <span className="settings-field-label">{UI_COPY.SETTINGS.KEYS.PEM_LABEL}</span>
                <CopyButton textToCopy={samplePem} />
              </div>
              <pre className="secret-box secret-box-pem">{samplePem}</pre>
            </div>
          </section>

          <section className="settings-section">
            <h2>{UI_COPY.SETTINGS.IDENTITY.TITLE}</h2>
            <div className="settings-key-value-list">
              {identityConfig.map(([key, value]) => (
                <div className="settings-key-value-row" key={key}>
                  <span className="settings-key">{key}</span>
                  <span className="settings-val">{value}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Pub/Sub Propagation Telemetry */}
        <div>
          <section className="settings-section settings-section-first">
            <div className="settings-card-header-spread">
              <Radio className="settings-header-icon" />
              <span className="tag">{UI_COPY.SETTINGS.TELEMETRY.TAG}</span>
            </div>
            <h2>{UI_COPY.SETTINGS.TELEMETRY.TITLE}</h2>
            <p>{UI_COPY.SETTINGS.TELEMETRY.DESCRIPTION}</p>

            <div className="latency-value">
              {UI_COPY.SETTINGS.TELEMETRY.LATENCY_VAL}
              <span className="latency-unit">{UI_COPY.SETTINGS.TELEMETRY.LATENCY_UNIT}</span>
            </div>
            <span className="settings-sla-note">
              <ShieldCheck className="sla-icon" />
              {UI_COPY.SETTINGS.TELEMETRY.SLA_NOTE}
            </span>

            <div className="benchmark">
              {Array.from({ length: 32 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
            <div className="benchmark-range-row">
              <span>{UI_COPY.SETTINGS.TELEMETRY.RANGE_START}</span>
              <span>{UI_COPY.SETTINGS.TELEMETRY.RANGE_END}</span>
            </div>

            <div className="settings-metrics-grid">
              {latencyMetrics.map(([val, label]) => (
                <div key={label}>
                  <div className="settings-metric-val">{val}</div>
                  <div className="settings-metric-label">{label}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="settings-section">
            <h2 className="settings-subheading">
              <Globe className="globe-icon" />
              {UI_COPY.SETTINGS.CONNECTION.TITLE}
            </h2>
            <div className="settings-key-value-list">
              <div className="settings-key-value-row">
                <span className="settings-key">{UI_COPY.SETTINGS.CONNECTION.PORT}</span>
                <code className="settings-val">{UI_COPY.SETTINGS.CONNECTION.PORT_VAL}</code>
              </div>
              <div className="settings-key-value-row">
                <span className="settings-key">{UI_COPY.SETTINGS.CONNECTION.TRANSPORT}</span>
                <span className="settings-val">{UI_COPY.SETTINGS.CONNECTION.TRANSPORT_VAL}</span>
              </div>
            </div>

            <div className="warning-box settings-warning-box">
              {UI_COPY.SETTINGS.CONNECTION.WARNING}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
