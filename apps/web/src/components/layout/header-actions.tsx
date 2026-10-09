"use client";

/**
 * @file apps/web/src/components/layout/header-actions.tsx
 * @description Cluster launcher, notification bell, theme toggle, and user profile menus for portal header.
 * @module @devlab/portal-web/components/layout/header-actions
 */

import React, { useState } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Grid2X2,
  ChevronDown,
  Settings2,
  LogOut,
  Workflow,
  ChartNoAxesCombined,
  Terminal,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { Button } from "@yuva-devlab/ui";
import { TabKey } from "@/lib/constants/enums";
import { UI_COPY } from "@/lib/ui-copy";
import type { AuditLog } from "@/features/audit/types";

interface HeaderActionsProps {
  auditLogs: AuditLog[];
  isLight: boolean;
  onToggleTheme: () => void;
  onOpenCommand: () => void;
  onNavigateTab: (tab: TabKey) => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  auditLogs,
  isLight,
  onToggleTheme,
  onOpenCommand,
  onNavigateTab,
}) => {
  const [activeMenu, setActiveMenu] = useState<string>("");

  const toggle = (menuId: string) => {
    setActiveMenu((prev) => (prev === menuId ? "" : menuId));
  };

  const ecosystemApps = [
    { name: "FinAI", icon: ChartNoAxesCombined, url: "https://finai.devlab.io" },
    { name: "OrchestrAI", icon: Workflow, url: "https://orchestrai.devlab.io" },
    { name: "DevLab Logs", icon: Terminal, url: "https://logs.devlab.io" },
    { name: "DevLab Guard", icon: ShieldCheck, url: "https://guard.staging.devlab.io" },
  ];

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

      {/* Ecosystem Launcher */}
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
              {ecosystemApps.map((app) => (
                <Button
                  key={app.name}
                  variant="ghost"
                  className="h-16 flex-col gap-1 text-xs"
                  onClick={() => {
                    window.open(app.url, "_blank", "noopener,noreferrer");
                    setActiveMenu("");
                  }}
                >
                  <app.icon className="text-primary size-4" />
                  {app.name}
                </Button>
              ))}
              <Button
                variant="ghost"
                className="h-16 flex-col gap-1 text-xs"
                onClick={() => {
                  window.open("https://storybook.devlab.io", "_blank", "noopener,noreferrer");
                  setActiveMenu("");
                }}
              >
                <Layers className="text-primary size-4" />
                UI Storybook
              </Button>
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

      {/* User Profile */}
      <div className="relative">
        <Button
          variant="ghost"
          className="gap-2 px-1"
          aria-label={UI_COPY.COMMON.HEADER.USER_NAME}
          onClick={() => toggle("profile")}
        >
          <span className="avatar">YP</span>
          <ChevronDown className="size-3" />
        </Button>
        {activeMenu === "profile" && (
          <div className="pop-menu">
            <div className="p-3">
              <strong className="text-foreground text-sm font-semibold">
                {UI_COPY.COMMON.HEADER.USER_NAME}
              </strong>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {UI_COPY.COMMON.HEADER.USER_EMAIL}
              </p>
              <span className="tag mt-2.5">{UI_COPY.COMMON.HEADER.USER_ROLE}</span>
            </div>
            <div className="border-border border-t pt-1">
              <Button
                variant="ghost"
                className="menu-item"
                onClick={() => {
                  onNavigateTab(TabKey.SETTINGS);
                  setActiveMenu("");
                }}
              >
                <Settings2 className="mr-2 size-3.5" />
                {UI_COPY.COMMON.HEADER.ACCOUNT_SETTINGS}
              </Button>
              <Button
                variant="ghost"
                className="menu-item text-destructive"
                onClick={() => setActiveMenu("")}
              >
                <LogOut className="mr-2 size-3.5" />
                {UI_COPY.COMMON.HEADER.SIGN_OUT}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
