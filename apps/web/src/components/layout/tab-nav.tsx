"use client";

/**
 * @file apps/web/src/components/layout/tab-nav.tsx
 * @description Horizontal control plane navigation tabs with badge counts and icon highlights.
 * @module @devlab/portal-web/components/layout/tab-nav
 */

import React from "react";
import { LayoutGrid, Key, ShieldAlert, Users, Cpu } from "lucide-react";
import { TabKey } from "@/lib/constants";
import { UI_COPY } from "@/lib/ui-copy";

interface TabNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  appsCount: number;
  keysCount: number;
  auditCount: number;
}

export const TabNav: React.FC<TabNavProps> = ({
  activeTab,
  onSelectTab,
  appsCount,
  keysCount,
  auditCount,
}) => {
  const tabs = [
    {
      key: TabKey.APPS,
      label: UI_COPY.COMMON.TABS.APPS,
      icon: LayoutGrid,
      count: appsCount,
    },
    {
      key: TabKey.IAM,
      label: UI_COPY.COMMON.TABS.IAM,
      icon: Key,
      count: keysCount,
    },
    {
      key: TabKey.AUDIT,
      label: UI_COPY.COMMON.TABS.AUDIT,
      icon: ShieldAlert,
      count: auditCount,
    },
    {
      key: TabKey.TEAM,
      label: UI_COPY.COMMON.TABS.TEAM,
      icon: Users,
    },
    {
      key: TabKey.SETTINGS,
      label: UI_COPY.COMMON.TABS.SETTINGS,
      icon: Cpu,
    },
  ];

  return (
    <div className="border-border bg-background border-b px-6">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectTab(tab.key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] leading-none ${
                    isActive
                      ? "text-primary-foreground bg-black/20"
                      : "bg-card text-muted-foreground border-border border"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
