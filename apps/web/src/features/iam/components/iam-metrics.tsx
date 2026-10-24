"use client";

/**
 * @file apps/web/src/features/iam/components/iam-metrics.tsx
 * @description Connected 4-column metric cards grid for machine-to-machine IAM credentials and throughput.
 * @module @devlab/portal-web/features/iam/components/iam-metrics
 */

import React from "react";
import { KeyRound, ShieldAlert, ShieldCheck, Activity } from "lucide-react";
import { MetricsBar, type MetricItem } from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";
import type { ApiKey } from "@/features/iam/types";

interface IamMetricsProps {
  apiKeys: ApiKey[];
}

export const IamMetrics: React.FC<IamMetricsProps> = ({ apiKeys }) => {
  const activeCount = apiKeys.filter((k) => !k.isRevoked).length;
  const revokedCount = apiKeys.filter((k) => k.isRevoked).length;
  const uniqueScopes = new Set(apiKeys.flatMap((k) => k.scopes || [])).size;
  const activeRotationCount = apiKeys.filter((k) => Boolean(k.lastUsedAt)).length;

  const items: MetricItem[] = [
    {
      label: UI_COPY.IAM.METRICS.ACTIVE_KEYS,
      value: activeCount,
      note: UI_COPY.IAM.METRICS.ACTIVE_NOTE,
      icon: KeyRound,
    },
    {
      label: UI_COPY.IAM.METRICS.REVOKED_KEYS,
      value: revokedCount,
      note:
        revokedCount === 0
          ? UI_COPY.IAM.METRICS.REVOKED_ZERO_NOTE
          : UI_COPY.IAM.METRICS.REVOKED_NOTE,
      positive: revokedCount === 0,
      icon: ShieldAlert,
    },
    {
      label: UI_COPY.IAM.METRICS.ASSIGNED_SCOPES,
      value: uniqueScopes,
      note: UI_COPY.IAM.METRICS.ASSIGNED_SCOPES_NOTE,
      icon: ShieldCheck,
      positive: true,
    },
    {
      label: UI_COPY.IAM.METRICS.ACTIVE_ROTATION,
      value: activeRotationCount,
      note: UI_COPY.IAM.METRICS.ACTIVE_ROTATION_NOTE,
      positive: true,
      icon: Activity,
    },
  ];

  return <MetricsBar items={items} />;
};
