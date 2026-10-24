"use client";

/**
 * @file apps/web/src/components/layout/portal-footer.tsx
 * @description Master portal footer displaying live cluster telemetry, latency probe, and version metadata.
 * Subscribes to real-time background polling intervals.
 * @module @devlab/portal-web/components/layout/portal-footer
 */

import React from "react";
import { StatusFooter } from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { AppStatus, HealthStatusClass } from "@/lib/constants/enums";
import { EXTERNAL_ROUTES } from "@/lib/constants/routes";
import { useTelemetryQuery } from "@/features/dashboard";

export const PortalFooter: React.FC = () => {
  const { data: telemetry } = useTelemetryQuery();

  const isHealthy = telemetry?.isRedisHealthy !== false && telemetry?.isDbHealthy !== false;
  const isDegraded = telemetry?.status === AppStatus.DEGRADED;
  const statusClass = isHealthy
    ? HealthStatusClass.HEALTHY
    : isDegraded
      ? HealthStatusClass.WARNING
      : HealthStatusClass.ERROR;

  const statusLabel = telemetry?.statusText || UI_COPY.COMMON.STATUS.HEALTHY;
  const latencyMs =
    telemetry?.latencyMs ??
    (telemetry?.dbLatencyMs !== undefined && telemetry?.redisLatencyMs !== undefined
      ? telemetry.dbLatencyMs + telemetry.redisLatencyMs
      : undefined);
  const versionLabel = telemetry?.version || UI_COPY.COMMON.BRAND.VERSION;
  const envLabel = telemetry?.environmentLabel || UI_COPY.COMMON.HEADER.WORKSPACE;
  const docsUrl = telemetry?.docsUrl || EXTERNAL_ROUTES.DOCS;
  const docsLabel = telemetry?.docsLabel || UI_COPY.COMMON.FOOTER.DOCS;
  const commandHint = UI_COPY.COMMON.FOOTER.COMMAND_HINT;

  return (
    <StatusFooter
      statusLabel={statusLabel}
      statusClass={statusClass}
      latencyMs={latencyMs}
      redisLabel={telemetry?.redisStatus}
      versionLabel={versionLabel}
      environmentLabel={envLabel}
      commandHint={commandHint}
      docsUrl={docsUrl}
      docsLabel={docsLabel}
    />
  );
};
