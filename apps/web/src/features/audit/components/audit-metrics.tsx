"use client";

/**
 * @file apps/web/src/features/audit/components/audit-metrics.tsx
 * @description Connected 4-column metric cards grid for immutable audit ledger and cluster integrity.
 * @module @devlab/portal-web/features/audit/components/audit-metrics
 */

import React from "react";
import { ShieldCheck, AlertTriangle, Shield, CheckCircle } from "lucide-react";
import { MetricsBar, type MetricItem } from "@/components/layout";
import { UI_COPY } from "@/lib/ui-copy";
import type { AuditLog } from "@/features/audit/types";

interface AuditMetricsProps {
  logs: AuditLog[];
}

export const AuditMetrics: React.FC<AuditMetricsProps> = ({ logs }) => {
  const criticalCount = logs.filter(
    (l) => l.action.includes("kill") || l.action.includes("deactivated"),
  ).length;

  const items: MetricItem[] = [
    {
      label: UI_COPY.AUDIT.METRICS.RECORDED,
      value: logs.length,
      note: UI_COPY.AUDIT.METRICS.RECORDED_NOTE,
      icon: ShieldCheck,
    },
    {
      label: UI_COPY.AUDIT.METRICS.CRITICAL,
      value: criticalCount,
      note: UI_COPY.AUDIT.METRICS.CRITICAL_NOTE,
      icon: AlertTriangle,
    },
    {
      label: UI_COPY.AUDIT.METRICS.POSTURE,
      value: UI_COPY.AUDIT.METRICS.POSTURE_VAL,
      note: UI_COPY.AUDIT.METRICS.POSTURE_NOTE,
      positive: true,
      icon: Shield,
    },
    {
      label: UI_COPY.AUDIT.METRICS.INTEGRITY,
      value: UI_COPY.AUDIT.METRICS.INTEGRITY_VAL,
      note: UI_COPY.AUDIT.METRICS.INTEGRITY_NOTE,
      positive: true,
      icon: CheckCircle,
    },
  ];

  return <MetricsBar items={items} />;
};
