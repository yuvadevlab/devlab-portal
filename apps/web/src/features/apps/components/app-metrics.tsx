"use client";

/**
 * @file apps/web/src/features/apps/components/app-metrics.tsx
 * @description Connected 4-column metric cards grid displaying registered services and operational routing telemetry.
 * @module @devlab/portal-web/features/apps/components/app-metrics
 */

import React from "react";
import { Server, Activity, AlertOctagon, Gauge } from "lucide-react";
import { MetricsBar, type MetricItem } from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { AppStatus } from "@/lib/constants/enums";
import type { RegisteredApp } from "@/features/apps/types";

interface AppMetricsProps {
  apps: RegisteredApp[];
}

export const AppMetrics: React.FC<AppMetricsProps> = ({ apps }) => {
  const totalCount = apps.length;
  const suspendedCount = apps.filter((app) => !app.isActive).length;
  const healthyCount = apps.filter(
    (app) => app.isActive && app.healthStatus === AppStatus.HEALTHY,
  ).length;
  const issueCount = apps.filter(
    (app) =>
      app.isActive &&
      (app.healthStatus === AppStatus.UNREACHABLE || app.healthStatus === AppStatus.DEGRADED),
  ).length;

  const validLatencies = apps
    .map((app) => app.latencyMs)
    .filter((ms): ms is number => typeof ms === "number" && ms > 0);
  const avgLatency =
    validLatencies.length > 0
      ? Math.round(validLatencies.reduce((sum, val) => sum + val, 0) / validLatencies.length)
      : 0;

  const resolveActiveNote = () => {
    if (suspendedCount > 0) return UI_COPY.APPS.METRICS.SUSPENDED_NOTE;
    if (issueCount > 0) return UI_COPY.APPS.METRICS.DEGRADED_NOTE;
    return UI_COPY.APPS.METRICS.HEALTHY_NOTE;
  };

  const items: MetricItem[] = [
    {
      label: UI_COPY.APPS.METRICS.TOTAL_APPS,
      value: totalCount,
      note: UI_COPY.APPS.METRICS.TOTAL_NOTE,
      icon: Server,
    },
    {
      label: UI_COPY.APPS.METRICS.ACTIVE_SERVICES,
      value: `${healthyCount}/${totalCount}`,
      note: resolveActiveNote(),
      positive: issueCount === 0 && suspendedCount === 0,
      icon: Activity,
    },
    {
      label: UI_COPY.APPS.METRICS.KILL_SWITCHES,
      value: suspendedCount,
      note:
        suspendedCount > 0
          ? UI_COPY.APPS.METRICS.CONTROLS_ENGAGED
          : UI_COPY.APPS.METRICS.NO_DISRUPTIONS,
      positive: suspendedCount === 0,
      icon: AlertOctagon,
    },
    {
      label: UI_COPY.APPS.METRICS.AVG_LATENCY,
      value: avgLatency > 0 ? `${avgLatency}ms` : "—",
      note: UI_COPY.APPS.METRICS.AVG_LATENCY_NOTE,
      positive: avgLatency > 0 && avgLatency < 50,
      icon: Gauge,
    },
  ];

  return <MetricsBar items={items} />;
};
