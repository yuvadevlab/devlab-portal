"use client";

/**
 * @file apps/web/src/components/layout/tab-nav.tsx
 * @description Horizontal control plane navigation tabs with badge counts and dynamic server-driven icons.
 * Fully built with @yuva-devlab/ui Tabs, TabsList, and TabsTrigger primitives.
 * @module @devlab/portal-web/components/layout/tab-nav
 */

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@yuva-devlab/ui";
import { useNavigationQuery } from "@/features/dashboard";
import { getNavIcon } from "./nav-icon";
import type { NavigationItem } from "@/lib/api-client";

interface TabNavProps {
  items?: NavigationItem[];
  activeTab: string;
  onSelectTab: (tab: string) => void;
  appsCount?: number;
  keysCount?: number;
  auditCount?: number;
}

export const TabNav: React.FC<TabNavProps> = ({
  items,
  activeTab,
  onSelectTab,
  appsCount,
  keysCount,
  auditCount,
}) => {
  const { data: dbItems = [] } = useNavigationQuery();
  const navItems = items && items.length > 0 ? items : dbItems;

  if (navItems.length === 0) {
    return null;
  }

  return (
    <div className="border-border bg-background border-b px-6">
      <div className="mx-auto flex max-w-7xl items-center overflow-x-auto py-2">
        <Tabs value={activeTab} onValueChange={(val) => onSelectTab(val)}>
          <TabsList className="h-auto gap-2 border-0 bg-transparent p-0">
            {navItems.map((tab) => {
              const Icon = getNavIcon(tab.icon);
              const count =
                tab.key === "apps"
                  ? appsCount
                  : tab.key === "iam"
                    ? keysCount
                    : tab.key === "audit"
                      ? auditCount
                      : undefined;

              return (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium"
                >
                  <Icon className="size-4" />
                  <span>{tab.label}</span>
                  {count !== undefined && (
                    <span className="border-border bg-card text-muted-foreground rounded-full border px-1.5 py-0.5 font-mono text-[10px] leading-none">
                      {count}
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
