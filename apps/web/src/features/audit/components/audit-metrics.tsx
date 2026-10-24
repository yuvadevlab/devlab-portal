"use client";

/**
 * @file apps/web/src/features/audit/components/audit-metrics.tsx
 * @description Connected 4-column metric cards grid for immutable audit ledger and cluster integrity.
 * @module @devlab/portal-web/features/audit/components/audit-metrics
 */

import React from "react";
import { Box, Activity, CalendarDays, Users } from "lucide-react";
import { MetricsBar, type MetricItem } from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";
import type { AuditLog } from "@/features/audit/types";

interface AuditMetricsProps {
  logs: AuditLog[];
}

export const AuditMetrics: React.FC<AuditMetricsProps> = ({ logs }) => {
  const criticalCount = logs.filter(
    (l) =>
      l.action.toLowerCase().includes("kill") ||
      l.action.toLowerCase().includes("deactivat") ||
      l.action.toLowerCase().includes("revok"),
  ).length;

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const todaysCount = logs.filter((l) => new Date(l.createdAt).getTime() >= startOfDay).length;
  const uniqueActors = new Set(logs.map((l) => l.actor?.email || l.actorId).filter(Boolean)).size;

  const items: MetricItem[] = [
    {
      label: UI_COPY.AUDIT.METRICS.RECORDED,
      value: logs.length,
      note: UI_COPY.AUDIT.METRICS.RECORDED_NOTE,
      icon: Box,
    },
    {
      label: UI_COPY.AUDIT.METRICS.CRITICAL,
      value: criticalCount,
      note: UI_COPY.AUDIT.METRICS.CRITICAL_NOTE,
      positive: criticalCount === 0,
      icon: Activity,
    },
    {
      label: UI_COPY.AUDIT.METRICS.TODAYS_EVENTS,
      value: todaysCount,
      note: UI_COPY.AUDIT.METRICS.TODAYS_NOTE,
      positive: true,
      icon: CalendarDays,
    },
    {
      label: UI_COPY.AUDIT.METRICS.UNIQUE_ACTORS,
      value: uniqueActors,
      note: UI_COPY.AUDIT.METRICS.UNIQUE_ACTORS_NOTE,
      positive: true,
      icon: Users,
    },
  ];

  return <MetricsBar items={items} />;
};
