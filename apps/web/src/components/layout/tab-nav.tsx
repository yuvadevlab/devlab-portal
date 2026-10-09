/**
 * @file apps/web/src/components/layout/tab-nav.tsx
 * @description Horizontal control plane navigation tabs with badge counts and icon highlights.
 * @module @devlab/portal-web/components/layout/tab-nav
 */

import React from "react";
import { LayoutGrid, Key, ShieldAlert, Users, Cpu } from "lucide-react";
import { TabKey } from "../../lib/constants/enums";
import { UI_COPY } from "../../lib/ui-copy/index";

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
    <div className="border-b border-[var(--border)] bg-[var(--background)] px-6">
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
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm font-semibold"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--card)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-mono leading-none ${
                    isActive
                      ? "bg-black/20 text-[var(--primary-foreground)]"
                      : "bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)]"
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
