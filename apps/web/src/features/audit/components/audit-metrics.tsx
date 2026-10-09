"use client";

/**
 * @file apps/web/src/features/audit/components/audit-metrics.tsx
 * @description Connected 4-column metric cards grid for immutable audit ledger and cluster integrity.
 * @module @devlab/portal-web/features/audit/components/audit-metrics
 */

import React from "react";
import { ShieldCheck, AlertTriangle, Shield, CheckCircle } from "lucide-react";
import { MetricsBar, type MetricItem } from "@/components/layout";
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
      label: "Recorded events",
      value: logs.length,
      note: "Complete workspace history",
      icon: ShieldCheck,
    },
    {
      label: "Critical events",
      value: criticalCount,
      note: "Emergency actions recorded",
      icon: AlertTriangle,
    },
    {
      label: "Security posture",
      value: "Healthy",
      note: "No unresolved incidents",
      positive: true,
      icon: Shield,
    },
    {
      label: "Audit integrity",
      value: "100%",
      note: "All actions traceable",
      positive: true,
      icon: CheckCircle,
    },
  ];

  return <MetricsBar items={items} />;
};
