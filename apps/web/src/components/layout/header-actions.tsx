"use client";

/**
 * @file apps/web/src/components/layout/header-actions.tsx
 * @description Cluster launcher, notification bell, theme toggle, and user profile menus for portal header.
 * Subscribes to live registered applications via TanStack Query.
 * @module @devlab/portal-web/components/layout/header-actions
 */

import React, { useState } from "react";
import { Search, Bell, Sun, Moon, Grid2X2, ChevronDown } from "lucide-react";
import { Button } from "@yuva-devlab/ui";
import { TabKey } from "@/lib/constants/enums";
import { UI_COPY } from "@/lib/ui-copy";
import type { AuditLog, UserMember } from "@/lib/api-client";
import { useAppsQuery } from "@/features/apps";
import { getNavIcon } from "./nav-icon";
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
    <div className="flex items-center gap-2">
      <span className="health-pill top-health">
        <span className="status-dot pulse" />
        {UI_COPY.COMMON.HEADER.CLUSTER_ONLINE}
        <ChevronDown className="size-2.5" />
      </span>

      <Button
        variant="ghost"
        size="icon"
        title={UI_COPY.COMMON.HEADER.SEARCH_TOOLTIP}
        aria-label={UI_COPY.COMMON.HEADER.SEARCH_LABEL}
        onClick={onOpenCommand}
      >
        <Search className="size-4" />
      </Button>

      {/* Ecosystem Launcher (Dynamic from API) */}
      <div className="header-apps relative">
        <Button
          variant="ghost"
          size="icon"
          title={UI_COPY.COMMON.HEADER.ECOSYSTEM_LAUNCHER}
          aria-label={UI_COPY.COMMON.HEADER.ECOSYSTEM_LAUNCHER}
          onClick={() => toggle("apps")}
        >
          <Grid2X2 className="size-4" />
        </Button>
        {activeMenu === "apps" && (
          <div className="pop-menu">
            <p className="text-muted-foreground px-2 py-1 text-[10px] font-semibold tracking-wider uppercase">
              {UI_COPY.COMMON.HEADER.ECOSYSTEM_HEADER}
            </p>
            <div className="mt-1 grid grid-cols-2 gap-1">
              {registeredApps.map((app) => {
                const IconComponent = getNavIcon(app.iconUrl);
                return (
                  <Button
                    key={app.id || app.appId}
                    variant="ghost"
                    className="h-16 flex-col gap-1 text-xs"
                    onClick={() => {
                      window.open(app.originUrl, "_blank", "noopener,noreferrer");
                      setActiveMenu("");
                    }}
                  >
                    <IconComponent className="text-primary size-4" />
                    <span className="max-w-25 truncate">{app.name}</span>
                  </Button>
                );
              })}
              {registeredApps.length === 0 && (
                <div className="text-muted-foreground col-span-2 py-3 text-center text-xs">
                  No ecosystem apps registered
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notification Bell */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          title={UI_COPY.COMMON.HEADER.NOTIFICATIONS}
          aria-label={UI_COPY.COMMON.HEADER.NOTIFICATIONS}
          onClick={() => toggle("notifications")}
        >
          <Bell className="size-4" />
        </Button>
        {activeMenu === "notifications" && (
          <div className="pop-menu">
            <h3 className="flex items-center justify-between px-2 py-1.5 text-xs font-medium">
              {UI_COPY.COMMON.HEADER.NOTIFICATIONS} <span className="tag">{auditLogs.length}</span>
            </h3>
            <div className="divide-border mt-1 divide-y">
              {auditLogs.slice(0, 3).map((item) => (
                <div key={item.id} className="p-2 text-left">
                  <p className="text-foreground text-xs font-medium">{item.targetId}</p>
                  <p className="text-muted-foreground mt-0.5 text-[10px]">{item.action}</p>
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
        {isLight ? <Moon className="size-4" /> : <Sun className="size-4" />}
      </Button>

      <span className="topbar-divider mx-1!" />

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
