"use client";

/**
 * @file apps/web/src/components/layout/portal-footer.tsx
 * @description Master portal footer displaying live cluster telemetry, API endpoints, and version metadata.
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
  const apiLabel = telemetry?.apiLabel || UI_COPY.COMMON.FOOTER.API;
  const redisLabel = telemetry?.redisStatus || UI_COPY.COMMON.FOOTER.REDIS;
  const versionLabel = telemetry?.version || UI_COPY.COMMON.BRAND.VERSION;
  const envLabel = telemetry?.environmentLabel || UI_COPY.COMMON.HEADER.WORKSPACE;
  const docsUrl = telemetry?.docsUrl || EXTERNAL_ROUTES.DOCS;
  const docsLabel = telemetry?.docsLabel || UI_COPY.COMMON.FOOTER.DOCS;

  return (
    <StatusFooter
      statusLabel={statusLabel}
      statusClass={statusClass}
      apiLabel={apiLabel}
      redisLabel={redisLabel}
      activeApps={telemetry?.activeApps}
      totalApps={telemetry?.totalApps}
      appsActiveLabel={UI_COPY.COMMON.FOOTER.APPS_ACTIVE}
      versionLabel={versionLabel}
      environmentLabel={envLabel}
      docsUrl={docsUrl}
      docsLabel={docsLabel}
    />
  );
};
