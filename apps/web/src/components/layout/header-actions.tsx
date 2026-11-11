"use client";

/**
 * @file apps/web/src/components/layout/header-actions.tsx
 * @description Cluster launcher, notification bell, theme toggle, and user profile menus for portal header.
 * Subscribes to live registered applications via TanStack Query.
 * @module @devlab/portal-web/components/layout/header-actions
 */

import React, { useState } from "react";
import { Search, Bell, Sun, Moon, Grid2X2, ChevronDown } from "lucide-react";
import { Button } from "@devlab-portal/ui";
import { getNavIcon } from "@devlab-portal/ui";
import { TabKey } from "@/lib/constants/enums";
import { UI_COPY } from "@/lib/ui-copy";
import type { AuditLog, UserMember } from "@/lib/api-client";
import { useAppsQuery } from "@/features/apps";
import { HeaderUserMenu } from "./header-user-menu";

interface HeaderActionsProps {
  auditLogs: AuditLog[];
  isLight: boolean;
  currentUser?: UserMember | null;
  onToggleTheme: () => void;
  onOpenCommand: () => void;
  onNavigateTab: (tabKey: string) => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  auditLogs,
  isLight,
  currentUser,
  onToggleTheme,
  onOpenCommand,
  onNavigateTab,
}) => {
  const [activeMenu, setActiveMenu] = useState<string>("");

  // Live database-registered ecosystem apps from API
  const { data: registeredApps = [] } = useAppsQuery();

  const toggle = (menuId: string) => {
    setActiveMenu((prev) => (prev === menuId ? "" : menuId));
  };

  return (
    <div className="header-actions-row">
      <span className="health-pill top-health">
        <span className="status-dot pulse" />
        {UI_COPY.COMMON.HEADER.CLUSTER_ONLINE}
        <ChevronDown className="health-chevron" />
      </span>

      <Button
        variant="ghost"
        size="icon"
        title={UI_COPY.COMMON.HEADER.SEARCH_TOOLTIP}
        aria-label={UI_COPY.COMMON.HEADER.SEARCH_LABEL}
        onClick={onOpenCommand}
      >
        <Search className="action-icon" />
      </Button>

      {/* Ecosystem Launcher (Dynamic from API) */}
      <div className="header-apps relative-anchor">
        <Button
          variant="ghost"
          size="icon"
          title={UI_COPY.COMMON.HEADER.ECOSYSTEM_LAUNCHER}
          aria-label={UI_COPY.COMMON.HEADER.ECOSYSTEM_LAUNCHER}
          onClick={() => toggle("apps")}
        >
          <Grid2X2 className="action-icon" />
        </Button>
        {activeMenu === "apps" && (
          <div className="pop-menu ecosystem-popmenu">
            <div className="ecosystem-popmenu-header">
              <p className="ecosystem-header-title">{UI_COPY.COMMON.HEADER.ECOSYSTEM_HEADER}</p>
              <span className="ecosystem-count-badge">{registeredApps.length}</span>
            </div>
            <div className="ecosystem-grid">
              {registeredApps.map((app) => {
                const IconComponent = getNavIcon(app.iconUrl);
                return (
                  <button
                    key={app.id || app.appId}
                    type="button"
                    className="ecosystem-app-btn group"
                    onClick={() => {
                      window.open(app.originUrl, "_blank", "noopener,noreferrer");
                      setActiveMenu("");
                    }}
                    title={`${app.name} (${app.originUrl})`}
                  >
                    <div className="ecosystem-icon-wrapper">
                      <IconComponent className="ecosystem-app-icon" />
                    </div>
                    <span className="ecosystem-app-title">{app.name}</span>
                    <span className="ecosystem-app-sub">{app.appId}</span>
                  </button>
                );
              })}
              {registeredApps.length === 0 && (
                <div className="ecosystem-empty-msg">{UI_COPY.COMMON.HEADER.NO_APPS}</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notification Bell */}
      <div className="notifications-wrap">
        <Button
          variant="ghost"
          size="icon"
          title={UI_COPY.COMMON.HEADER.NOTIFICATIONS}
          aria-label={UI_COPY.COMMON.HEADER.NOTIFICATIONS}
          onClick={() => toggle("notifications")}
        >
          <Bell className="action-icon" />
        </Button>
        {activeMenu === "notifications" && (
          <div className="pop-menu">
            <h3 className="notifications-header">
              {UI_COPY.COMMON.HEADER.NOTIFICATIONS} <span className="tag">{auditLogs.length}</span>
            </h3>
            <div className="notifications-list">
              {auditLogs.slice(0, 3).map((item) => (
                <div key={item.id} className="notification-item">
                  <p className="notification-title">{item.targetId}</p>
                  <p className="notification-subtitle">{item.action}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        title={isLight ? UI_COPY.COMMON.HEADER.DARK_MODE : UI_COPY.COMMON.HEADER.LIGHT_MODE}
        aria-label={UI_COPY.COMMON.ACTIONS.FILTER}
        onClick={onToggleTheme}
      >
        {isLight ? <Moon className="action-icon" /> : <Sun className="action-icon" />}
      </Button>

      <span className="topbar-divider topbar-divider-tight" />

      {/* User Profile Dropdown */}
      <HeaderUserMenu
        user={currentUser}
        isOpen={activeMenu === "profile"}
        onToggle={() => toggle("profile")}
        onClose={() => setActiveMenu("")}
        onNavigateSettings={() => onNavigateTab(TabKey.SETTINGS)}
      />
    </div>
  );
};
