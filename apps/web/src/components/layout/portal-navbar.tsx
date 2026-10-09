"use client";

/**
 * @file apps/web/src/components/layout/portal-navbar.tsx
 * @description Primary sub-navigation tabs bar rendered dynamically from database navigation items.
 * Strictly adheres to server-driven navigation requirements with zero hardcoded menus.
 * @module @devlab/portal-web/components/layout/portal-navbar
 */

import React from "react";
import { Button } from "@yuva-devlab/ui";
import type { NavigationItem } from "@/lib/api-client";
import { getNavIcon } from "./nav-icon";

interface PortalNavbarProps {
  items: NavigationItem[];
  activeTab: string;
  onSelectTab: (tabKey: string) => void;
  appsCount?: number;
}

export const PortalNavbar: React.FC<PortalNavbarProps> = ({
  items,
  activeTab,
  onSelectTab,
  appsCount,
}) => {
  // If no navigation items exist or haven't loaded yet from the DB, render nothing
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className="navbar" aria-label="Main navigation">
      {items.map((tab) => {
        const IconComponent = getNavIcon(tab.icon);
        const isActive = activeTab === tab.key;
        const count = tab.key === "apps" ? appsCount : undefined;

        return (
          <Button
            key={tab.id || tab.key}
            type="button"
            variant="ghost"
            className={`nav-link h-auto rounded-none bg-transparent p-0 hover:bg-transparent ${isActive ? "active" : ""}`}
            onClick={() => onSelectTab(tab.key)}
          >
            <IconComponent className="size-3.5" />
            <span>{tab.label}</span>
            {count !== undefined && <span className="tag py-0!">{count}</span>}
          </Button>
        );
      })}
    </nav>
  );
};
