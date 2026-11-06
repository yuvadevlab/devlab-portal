"use client";

/**
 * @file apps/web/src/features/apps/components/app-card.tsx
 * @description Application catalog card with thematic color palettes, live telemetry, and control actions.
 * Fully built with @devlab-portal/ui Button and design tokens.
 * @module @devlab/portal-web/features/apps/components/app-card
 */

import React from "react";
import { Link2, HeartPulse, ArrowUpRight, Settings2, Power, Server } from "lucide-react";
import { Button, getNavIcon } from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { AppStatus } from "@/lib/constants/enums";
import type { RegisteredApp } from "@/features/apps/types";

interface AppCardProps {
  app: RegisteredApp;
  onOpenSettings: (app: RegisteredApp) => void;
  onToggleKillSwitch: (app: RegisteredApp) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onOpenSettings, onToggleKillSwitch }) => {
  const isRoutingActive = app.isActive;

  // Purely dynamic server-driven thematic color with deterministic palette rotation fallback
  const getAppColor = (registeredApp: RegisteredApp): string => {
    if (registeredApp.themeColor) {
      return registeredApp.themeColor;
    }
    const PALETTE = ["mint", "blue", "amber", "rose", "teal"] as const;
    const seed = registeredApp.id || registeredApp.appId || registeredApp.slug;
    const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return PALETTE[hash % PALETTE.length];
  };

  /**
   * Resolves visual indicators and status copy based on operational health probes and kill-switch status.
   */
  const resolveStatusMeta = () => {
    if (!isRoutingActive) {
      return {
        label: UI_COPY.APPS.CARD.STATUS_SUSPENDED,
        cssClass: "status suspended",
        probeCode: UI_COPY.APPS.CARD.CODE_503,
        probeCodeClass: "text-destructive",
        canLaunch: false,
      };
    }

    switch (app.healthStatus) {
      case AppStatus.HEALTHY:
        return {
          label: UI_COPY.APPS.CARD.STATUS_ONLINE,
          cssClass: "status",
          probeCode: UI_COPY.APPS.CARD.CODE_200,
          probeCodeClass: "text-success",
          canLaunch: true,
        };
      case AppStatus.DEGRADED:
        return {
          label: UI_COPY.APPS.CARD.STATUS_DEGRADED,
          cssClass: "status degraded",
          probeCode: UI_COPY.APPS.CARD.CODE_DEGRADED,
          probeCodeClass: "text-amber-500",
          canLaunch: true,
        };
      case AppStatus.STARTING:
        return {
          label: UI_COPY.APPS.CARD.STATUS_STARTING,
          cssClass: "status starting",
          probeCode: UI_COPY.APPS.CARD.CODE_STARTING,
          probeCodeClass: "text-amber-500",
          canLaunch: false,
        };
      case AppStatus.UNREACHABLE:
        return {
          label: UI_COPY.APPS.CARD.STATUS_OFFLINE,
          cssClass: "status offline",
          probeCode: UI_COPY.APPS.CARD.CODE_OFFLINE,
          probeCodeClass: "text-destructive",
          canLaunch: false,
        };
      default:
        return {
          label: UI_COPY.APPS.CARD.STATUS_UNKNOWN,
          cssClass: "status unknown",
          probeCode: UI_COPY.APPS.CARD.CODE_UNKNOWN,
          probeCodeClass: "text-muted-foreground",
          canLaunch: false,
        };
    }
  };

  const statusMeta = resolveStatusMeta();
  const appColor = getAppColor(app);
  const IconComponent = getNavIcon(app.iconUrl);

  return (
    <article className={`app-card ${appColor}`}>
      {/* Top Header: Thematic Icon & Status Pulse */}
      <div className="app-card-top">
        <div className="app-icon">
          <IconComponent className="size-5" />
        </div>
        <span className={statusMeta.cssClass}>
          <span className="status-dot" />
          {statusMeta.label}
        </span>
      </div>

      {/* App Name & Environment Tag */}
      <h2>
        {app.name}
        <span className="env-badge">
          {app.environment === "local_dev" ? UI_COPY.APPS.TOOLBAR.LOCAL_DEV : app.environment}
        </span>
      </h2>

      {/* Description */}
      <p className="app-description">{app.description || UI_COPY.APPS.CARD.NO_DESC}</p>

      {/* Origin URL (Frontend) */}
      <div className="endpoint">
        <Link2 className="size-3 shrink-0" />
        <span className="truncate">{app.originUrl}</span>
      </div>

      {/* Backend API URL */}
      {app.apiUrl && (
        <div className="endpoint">
          <Server className="size-3 shrink-0" />
          <span className="truncate">{app.apiUrl}</span>
        </div>
      )}

      {/* Health Probe & Status Code */}
      <div className="endpoint">
        <HeartPulse className="size-3 shrink-0" />
        <span className="truncate">{app.healthUrl || "/health"}</span>
        <span
          className={`ml-auto font-mono text-[10px] font-semibold ${statusMeta.probeCodeClass}`}
        >
          {statusMeta.probeCode}
        </span>
      </div>

      {/* Card Footer: Launch Console & Controls */}
      <div className="app-card-footer">
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground hover:text-foreground gap-1 px-2 text-xs"
          onClick={() => window.open(app.originUrl, "_blank", "noopener,noreferrer")}
          disabled={!statusMeta.canLaunch}
        >
          {UI_COPY.APPS.CARD.OPEN_CONSOLE}
          <ArrowUpRight className="size-3" />
        </Button>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            title={`${UI_COPY.COMMON.ACTIONS.SETTINGS}: ${app.name}`}
            aria-label={`${UI_COPY.COMMON.ACTIONS.SETTINGS}: ${app.name}`}
            onClick={() => onOpenSettings(app)}
          >
            <Settings2 className="size-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="text-destructive hover:bg-destructive/10"
            title={`${isRoutingActive ? UI_COPY.APPS.CARD.DEACTIVATE_BTN : UI_COPY.APPS.CARD.ACTIVATE_BTN}: ${app.name}`}
            aria-label={`${isRoutingActive ? UI_COPY.APPS.CARD.DEACTIVATE_BTN : UI_COPY.APPS.CARD.ACTIVATE_BTN}: ${app.name}`}
            onClick={() => onToggleKillSwitch(app)}
          >
            <Power className="text-destructive size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
};
