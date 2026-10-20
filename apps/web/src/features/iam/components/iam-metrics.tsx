"use client";

/**
 * @file apps/web/src/features/iam/components/iam-metrics.tsx
 * @description Connected 4-column metric cards grid for machine-to-machine IAM credentials and throughput.
 * @module @devlab/portal-web/features/iam/components/iam-metrics
 */

import React from "react";
import { KeyRound, Activity, ShieldCheck, Zap } from "lucide-react";
import { MetricsBar, type MetricItem } from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";
import type { ApiKey } from "@/features/iam/types";

interface IamMetricsProps {
  apiKeys: ApiKey[];
}

export const IamMetrics: React.FC<IamMetricsProps> = ({ apiKeys }) => {
  const activeCount = apiKeys.filter((k) => !k.isRevoked).length;

  const items: MetricItem[] = [
    {
      label: UI_COPY.IAM.METRICS.ACTIVE_KEYS,
      value: activeCount,
      note: UI_COPY.IAM.METRICS.ACTIVE_NOTE,
      icon: KeyRound,
    },
    {
      label: UI_COPY.IAM.METRICS.M2M_LABEL,
      value: UI_COPY.IAM.METRICS.M2M_VAL,
      note: UI_COPY.IAM.METRICS.M2M_NOTE,
      positive: true,
      icon: Activity,
    },
    {
      label: UI_COPY.IAM.METRICS.RATE_LIMIT_LABEL,
      value: UI_COPY.IAM.METRICS.RATE_LIMIT_VAL,
      note: UI_COPY.IAM.METRICS.RATE_LIMIT_NOTE,
      icon: Zap,
    },
    {
      label: UI_COPY.IAM.METRICS.HEALTH_LABEL,
      value: UI_COPY.IAM.METRICS.HEALTH_VAL,
      note: UI_COPY.IAM.METRICS.HEALTH_NOTE,
      positive: true,
      icon: ShieldCheck,
    },
  ];

  return <MetricsBar items={items} />;
};
