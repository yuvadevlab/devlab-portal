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
import { API_ROUTES } from "@/lib/constants/routes";
import {
  API_BASE_URL,
  type JwksData,
  type OpenIdConfig,
  type SystemTelemetry,
} from "@/lib/api-client";

interface JwksViewerProps {
  jwks: JwksData | null;
  oidc: OpenIdConfig | null;
  telemetry?: SystemTelemetry | null;
}

export const JwksViewer: React.FC<JwksViewerProps> = ({ jwks, oidc, telemetry }) => {
  const endpoint = oidc?.jwks_uri || `${API_BASE_URL}${API_ROUTES.JWKS}`;
  const activeKey = jwks?.keys?.[0];
  const livePem =
    jwks?.pem || (activeKey ? JSON.stringify(activeKey, null, 2) : "Loading public key...");

  const identityConfig = [
    [UI_COPY.SETTINGS.IDENTITY.ISSUER, oidc?.issuer || UI_COPY.SETTINGS.IDENTITY.ISSUER_VAL],
    [
      UI_COPY.SETTINGS.IDENTITY.ALGORITHM,
      activeKey?.alg || UI_COPY.SETTINGS.IDENTITY.ALGORITHM_VAL,
    ],
    [UI_COPY.SETTINGS.IDENTITY.LIFETIME, UI_COPY.SETTINGS.IDENTITY.LIFETIME_VAL],
    [
      UI_COPY.SETTINGS.IDENTITY.ENV,
      telemetry?.environmentLabel || UI_COPY.SETTINGS.IDENTITY.ENV_VAL,
    ],
  ];

  const latencyMetrics = [
    [
      telemetry?.redisLatencyMs !== undefined ? `${telemetry.redisLatencyMs}ms` : "< 1ms",
      UI_COPY.SETTINGS.TELEMETRY.MEDIAN,
    ],
    [
      telemetry?.dbLatencyMs !== undefined ? `${telemetry.dbLatencyMs}ms` : "< 1ms",
      UI_COPY.SETTINGS.TELEMETRY.P95,
    ],
    [
      telemetry?.latencyMs !== undefined ? `${telemetry.latencyMs}ms` : "1ms",
      UI_COPY.SETTINGS.TELEMETRY.P99,
    ],
  ];

  const latencyVal = telemetry?.latencyMs !== undefined ? `${telemetry.latencyMs}` : "1";
  const apiPortVal = telemetry?.apiPort
    ? `:${telemetry.apiPort}`
    : UI_COPY.SETTINGS.CONNECTION.PORT_VAL;
  const transportVal = telemetry?.redisStatus || UI_COPY.SETTINGS.CONNECTION.TRANSPORT_VAL;
  const keyTag = activeKey?.alg ? `${activeKey.alg} · ${activeKey.kid}` : UI_COPY.SETTINGS.KEYS.TAG;

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
              <span className="tag">{keyTag}</span>
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
                <CopyButton textToCopy={livePem} />
              </div>
              <pre className="secret-box secret-box-pem">{livePem}</pre>
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
              {latencyVal}
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
                <code className="settings-val">{apiPortVal}</code>
              </div>
              <div className="settings-key-value-row">
                <span className="settings-key">{UI_COPY.SETTINGS.CONNECTION.TRANSPORT}</span>
                <span className="settings-val">{transportVal}</span>
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
