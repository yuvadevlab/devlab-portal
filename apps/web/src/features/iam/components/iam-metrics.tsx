"use client";

/**
 * @file apps/web/src/features/iam/components/iam-metrics.tsx
 * @description Connected 4-column metric cards grid for machine-to-machine IAM credentials and throughput.
 * @module @devlab/portal-web/features/iam/components/iam-metrics
 */

import React from "react";
import { KeyRound, Activity, ShieldCheck, Zap } from "lucide-react";
import { MetricsBar, type MetricItem } from "@/components/layout";
import type { ApiKey } from "@/features/iam/types";

interface IamMetricsProps {
  apiKeys: ApiKey[];
}

export const IamMetrics: React.FC<IamMetricsProps> = ({ apiKeys }) => {
  const activeCount = apiKeys.filter((k) => !k.isRevoked).length;

  const items: MetricItem[] = [
    {
      label: "Active API keys",
      value: activeCount,
      note: "Scoped to registered applications",
      icon: KeyRound,
    },
    {
      label: "24h M2M requests",
      value: "412k",
      note: "↗ 8.2% from yesterday",
      positive: true,
      icon: Activity,
    },
    {
      label: "Rate-limited blocks",
      value: 18,
      note: "Protected in the last 24 hours",
      icon: Zap,
    },
    {
      label: "Credential health",
      value: "100%",
      note: "No compromised credentials",
      positive: true,
      icon: ShieldCheck,
    },
  ];

  return <MetricsBar items={items} />;
};
