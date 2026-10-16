"use client";

/**
 * @file apps/web/src/components/layout/metrics-bar.tsx
 * @description Connected 4-column metric cards grid with positive growth telemetry indicators.
 * @module @devlab/portal-web/components/layout/metrics-bar
 */

import React from "react";
import { Box, Activity, ShieldCheck, Zap, ArrowUpRight, type LucideIcon } from "lucide-react";

export interface MetricItem {
  label: string;
  value: string | number;
  note: string;
  positive?: boolean;
  icon?: LucideIcon;
}

interface MetricsBarProps {
  items: MetricItem[];
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ items }) => {
  const defaultIcons = [Box, Activity, ShieldCheck, Zap];

  return (
    <div className="metrics">
      {items.map((item, index) => {
        const IconComponent = item.icon || defaultIcons[index % defaultIcons.length] || Box;

        return (
          <div className="metric" key={item.label}>
            <div className="metric-label">
              <span>{item.label}</span>
              <IconComponent className="text-muted-foreground size-3.5" />
            </div>

            <div className="metric-value">
              <span>{item.value}</span>
              {item.positive && <ArrowUpRight className="text-success size-4" />}
            </div>

            <div className={`metric-note ${item.positive ? "positive" : ""}`}>{item.note}</div>
          </div>
        );
      })}
    </div>
  );
};
