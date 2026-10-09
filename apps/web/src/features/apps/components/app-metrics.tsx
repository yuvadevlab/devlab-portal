"use client";

/**
 * @file apps/web/src/features/apps/components/app-metrics.tsx
 * @description Connected 4-column metric cards grid displaying registered services and operational routing telemetry.
 * @module @devlab/portal-web/features/apps/components/app-metrics
 */

import React from "react";
import { Server, Activity, AlertOctagon, Zap } from "lucide-react";
import { MetricsBar, type MetricItem } from "@/components/layout";
import type { RegisteredApp } from "@/features/apps/types";

interface AppMetricsProps {
  apps: RegisteredApp[];
}

export const AppMetrics: React.FC<AppMetricsProps> = ({ apps }) => {
  const totalCount = apps.length;
  const suspendedCount = apps.filter((app) => !app.isActive).length;
  const activeCount = totalCount - suspendedCount;

  const items: MetricItem[] = [
    {
      label: "Registered applications",
      value: totalCount,
      note: "Across your DevLab ecosystem",
      icon: Server,
    },
    {
      label: "Active services",
      value: activeCount,
      note: suspendedCount > 0 ? "Services currently suspended" : "100% of services operational",
      positive: suspendedCount === 0,
      icon: Activity,
    },
    {
      label: "Active kill-switches",
      value: suspendedCount,
      note: suspendedCount > 0 ? "Emergency controls engaged" : "No active service disruptions",
      positive: suspendedCount === 0,
      icon: AlertOctagon,
    },
    {
      label: "Monthly inter-service requests",
      value: "1.2M",
      note: "↗ 12.8% from last month",
      positive: true,
      icon: Zap,
    },
  ];

  return <MetricsBar items={items} />;
};
