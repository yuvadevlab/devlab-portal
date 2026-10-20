"use client";

import React from "react";
import { getNavIcon } from "./nav-icon";

export interface NavigationBarItem {
  id?: string;
  key: string;
  label: string;
  icon?: string | null;
}

export interface NavigationBarProps {
  items: NavigationBarItem[];
  activeTab: string;
  onSelectTab: (tabKey: string) => void;
  ariaLabel: string;
  countForItem?: (item: NavigationBarItem) => number | undefined;
}

/**
 * Renders server-provided navigation items as a compact application navigation bar.
 */
export function NavigationBar({
  items,
  activeTab,
  onSelectTab,
  ariaLabel,
  countForItem,
}: NavigationBarProps) {
  if (items.length === 0) return null;

  return (
    <nav className="navbar" aria-label={ariaLabel}>
      {items.map((item) => {
        const Icon = getNavIcon(item.icon);
        const count = countForItem?.(item);

        return (
          <button
            key={item.id || item.key}
            type="button"
            className={`nav-link ${activeTab === item.key ? "active" : ""}`}
            onClick={() => onSelectTab(item.key)}
          >
            <Icon className="size-3.75" />
            <span>{item.label}</span>
            {count !== undefined && <span className="tag py-0!">{count}</span>}
          </button>
        );
      })}
    </nav>
  );
}
