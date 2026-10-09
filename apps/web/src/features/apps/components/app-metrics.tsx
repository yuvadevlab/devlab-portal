/**
 * @file apps/web/src/features/apps/components/app-metrics.tsx
 * @description High-level KPI metrics bar displaying active swarms and routing health.
 * Consumes @yuva-devlab/ui MetricCard and MetricsGrid primitives.
 * @module @devlab/portal-web/features/apps/components/app-metrics
 */

import React from "react";
import { Server, Activity, AlertOctagon, Cpu } from "lucide-react";
import { MetricCard, MetricsGrid } from "@yuva-devlab/ui";
import { UI_COPY } from "../../../lib/ui-copy/index";
import type { RegisteredApp } from "../types";

interface AppMetricsProps {
  apps: RegisteredApp[];
}

export const AppMetrics: React.FC<AppMetricsProps> = ({ apps }) => {
  const totalCount = apps.length;
  // Calculate healthy microservices responding to probes
  const healthyCount = apps.filter((app) => app.isActive && app.healthStatus === "healthy").length;
  // Identify offline or manually severed applications
  const offlineCount = apps.filter(
    (app) => !app.isActive || app.healthStatus === "unreachable",
  ).length;

  return (
    <MetricsGrid className="mb-8">
      <MetricCard
        label={UI_COPY.APPS.METRICS.TOTAL_APPS}
        value={totalCount}
        icon={<Server className="text-primary h-4 w-4" />}
      />
      <MetricCard
        label={UI_COPY.APPS.METRICS.HEALTHY}
        value={healthyCount}
        note={
          totalCount > 0
            ? `${Math.round((healthyCount / totalCount) * 100)}% operational`
            : undefined
        }
        positive={true}
        icon={<Activity className="h-4 w-4 text-emerald-400" />}
      />
      <MetricCard
        label={UI_COPY.APPS.METRICS.OFFLINE}
        value={offlineCount}
        note={offlineCount > 0 ? "Severed traffic" : "All active"}
        positive={offlineCount === 0}
        icon={<AlertOctagon className="text-destructive h-4 w-4" />}
      />
      <MetricCard
        label={UI_COPY.APPS.METRICS.TOKEN_OPS}
        value="2 Swarms"
        note="Federated nodes"
        icon={<Cpu className="h-4 w-4 text-sky-400" />}
      />
    </MetricsGrid>
  );
};
