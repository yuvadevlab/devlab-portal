"use client";

/**
 * @file apps/web/src/components/layout/portal-navbar.tsx
 * @description Primary sub-navigation tabs bar with active underline indicators and entity count tags.
 * @module @devlab/portal-web/components/layout/portal-navbar
 */

import React from "react";
import { Grid2X2, KeyRound, ShieldCheck, Users, Settings2 } from "lucide-react";
import { Button } from "@yuva-devlab/ui";
import { TabKey } from "@/lib/constants/enums";
import { UI_COPY } from "@/lib/ui-copy";

interface PortalNavbarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  appsCount: number;
}

export const PortalNavbar: React.FC<PortalNavbarProps> = ({
  activeTab,
  onSelectTab,
  appsCount,
}) => {
  const tabs = [
    {
      key: TabKey.APPS,
      label: UI_COPY.COMMON.TABS.APPS,
      icon: Grid2X2,
      count: appsCount,
    },
    {
      key: TabKey.IAM,
      label: UI_COPY.COMMON.TABS.IAM,
      icon: KeyRound,
    },
    {
      key: TabKey.AUDIT,
      label: UI_COPY.COMMON.TABS.AUDIT,
      icon: ShieldCheck,
    },
    {
      key: TabKey.TEAM,
      label: UI_COPY.COMMON.TABS.TEAM,
      icon: Users,
    },
    {
      key: TabKey.SETTINGS,
      label: UI_COPY.COMMON.TABS.SETTINGS,
      icon: Settings2,
    },
  ];

  return (
    <nav className="navbar" aria-label="Main navigation">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Button
            key={tab.key}
            type="button"
            variant="ghost"
            className={`nav-link h-auto rounded-none bg-transparent p-0 hover:bg-transparent ${isActive ? "active" : ""}`}
            onClick={() => onSelectTab(tab.key)}
          >
            <tab.icon className="size-3.5" />
            <span>{tab.label}</span>
            {tab.count !== undefined && <span className="tag py-0!">{tab.count}</span>}
          </Button>
        );
      })}
    </nav>
  );
};
