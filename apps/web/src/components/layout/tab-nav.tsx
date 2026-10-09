"use client";

/**
 * @file apps/web/src/components/layout/tab-nav.tsx
 * @description Horizontal control plane navigation tabs with badge counts and icon highlights.
 * Fully built with @yuva-devlab/ui Tabs, TabsList, and TabsTrigger primitives.
 * @module @devlab/portal-web/components/layout/tab-nav
 */

import React from "react";
import { LayoutGrid, Key, ShieldAlert, Users, Cpu } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@yuva-devlab/ui";
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
      <div className="mx-auto flex max-w-7xl items-center overflow-x-auto py-2">
        <Tabs value={activeTab} onValueChange={(val) => onSelectTab(val as TabKey)}>
          <TabsList className="h-auto gap-2 border-0 bg-transparent p-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium"
                >
                  <Icon className="size-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="border-border bg-card text-muted-foreground rounded-full border px-1.5 py-0.5 font-mono text-[10px] leading-none">
                      {tab.count}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
