"use client";

/**
 * @file apps/web/src/components/layout/portal-navbar.tsx
 * @description Primary sub-navigation tabs bar rendered dynamically from database navigation items.
 * Strictly adheres to Lovable console specification with full height stretching and bottom border indicators.
 * @module @devlab/portal-web/components/layout/portal-navbar
 */

import React from "react";
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
          <button
            key={tab.id || tab.key}
            type="button"
            className={`nav-link ${isActive ? "active" : ""}`}
            onClick={() => onSelectTab(tab.key)}
          >
            <IconComponent className="size-[15px]" />
            <span>{tab.label}</span>
            {count !== undefined && <span className="tag py-0!">{count}</span>}
          </button>
        );
      })}
    </nav>
  );
};
