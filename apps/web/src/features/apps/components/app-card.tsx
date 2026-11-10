"use client";

/**
 * @file apps/web/src/features/apps/components/app-card.tsx
 * @description Application catalog card with thematic color palettes, live telemetry, and control actions.
 * Fully built with @devlab-portal/ui Button and design tokens.
 * @module @devlab/portal-web/features/apps/components/app-card
 */

import React from "react";
import {
  Link2,
  HeartPulse,
  ArrowUpRight,
  Settings2,
  Power,
  Server,
  Terminal,
  Code2,
} from "lucide-react";
import { Button, getNavIcon } from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { AppStatus } from "@/lib/constants/enums";
import { useOpenIdeMutation } from "../api/supervisor";
import type { RegisteredApp } from "@/features/apps/types";

interface AppCardProps {
  app: RegisteredApp;
  onOpenSettings: (app: RegisteredApp) => void;
  onToggleKillSwitch: (app: RegisteredApp) => void;
  onOpenSupervisor?: (app: RegisteredApp) => void;
}

export const AppCard: React.FC<AppCardProps> = ({
  app,
  onOpenSettings,
  onToggleKillSwitch,
  onOpenSupervisor,
}) => {
  const isRoutingActive = app.isActive;
  const openIdeMutation = useOpenIdeMutation();

  /**
   * Resolves visual indicators and status copy based on operational health probes and kill-switch status.
   */
  const resolveStatusMeta = () => {
    if (!isRoutingActive) {
      return {
        label: UI_COPY.APPS.CARD.STATUS_SUSPENDED,
        cssClass: "status suspended",
        probeCode: UI_COPY.APPS.CARD.CODE_503,
        probeCodeClass: "probe-code-danger",
        canLaunch: false,
      };
    }

    switch (app.healthStatus) {
      case AppStatus.HEALTHY:
        return {
          label: UI_COPY.APPS.CARD.STATUS_ONLINE,
          cssClass: "status",
          probeCode: UI_COPY.APPS.CARD.CODE_200,
          probeCodeClass: "probe-code-success",
          canLaunch: true,
        };
      case AppStatus.DEGRADED:
        return {
          label: UI_COPY.APPS.CARD.STATUS_DEGRADED,
          cssClass: "status degraded",
          probeCode: UI_COPY.APPS.CARD.CODE_DEGRADED,
          probeCodeClass: "probe-code-warn",
          canLaunch: true,
        };
      case AppStatus.STARTING:
        return {
          label: UI_COPY.APPS.CARD.STATUS_STARTING,
          cssClass: "status starting",
          probeCode: UI_COPY.APPS.CARD.CODE_STARTING,
          probeCodeClass: "probe-code-warn",
          canLaunch: false,
        };
      case AppStatus.UNREACHABLE:
        return {
          label: UI_COPY.APPS.CARD.STATUS_OFFLINE,
          cssClass: "status offline",
          probeCode: UI_COPY.APPS.CARD.CODE_OFFLINE,
          probeCodeClass: "probe-code-danger",
          canLaunch: false,
        };
      default:
        return {
          label: UI_COPY.APPS.CARD.STATUS_UNKNOWN,
          cssClass: "status unknown",
          probeCode: UI_COPY.APPS.CARD.CODE_UNKNOWN,
          probeCodeClass: "probe-code-muted",
          canLaunch: false,
        };
    }
  };

  const statusMeta = resolveStatusMeta();
  const appColor = app.themeColor?.trim();
  const IconComponent = getNavIcon(app.iconUrl);

  return (
    <article
      className="app-card"
      style={appColor ? ({ "--app-color": appColor } as React.CSSProperties) : undefined}
    >
      {/* Top Header: Thematic Icon & Status Pulse */}
      <div className="app-card-top">
        <div className="app-icon">
          <IconComponent className="app-icon-svg" />
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
        <Link2 className="endpoint-icon" />
        <span className="endpoint-url">{app.originUrl}</span>
      </div>

      {/* Backend API URL */}
      {app.apiUrl && (
        <div className="endpoint">
          <Server className="endpoint-icon" />
          <span className="endpoint-url">{app.apiUrl}</span>
        </div>
      )}

      {/* Health Probe & Status Code */}
      <div className="endpoint">
        <HeartPulse className="endpoint-icon" />
        <span className="endpoint-url">{app.healthUrl || "/health"}</span>
        <span className={`endpoint-status-code ${statusMeta.probeCodeClass}`}>
          {statusMeta.probeCode}
        </span>
      </div>

      {/* Card Footer: Launch Console & Controls */}
      <div className="app-card-footer">
        <Button
          size="sm"
          variant="ghost"
          className="app-card-launch-btn"
          onClick={() => window.open(app.originUrl, "_blank", "noopener,noreferrer")}
          disabled={!statusMeta.canLaunch}
        >
          {UI_COPY.APPS.CARD.OPEN_CONSOLE}
          <ArrowUpRight className="app-card-launch-icon" />
        </Button>

        <div className="app-card-actions">
          <Button
            size="icon"
            variant="ghost"
            title={`Open ${app.name} in IDE`}
            aria-label={`Open ${app.name} in IDE`}
            disabled={openIdeMutation.isPending}
            onClick={() => openIdeMutation.mutate({ appId: app.appId, ide: "antigravity" })}
          >
            <Code2 className="app-action-icon" />
          </Button>

          {onOpenSupervisor && (
            <Button
              size="icon"
              variant="ghost"
              title={`Process Supervisor: ${app.name}`}
              aria-label={`Process Supervisor: ${app.name}`}
              onClick={() => onOpenSupervisor(app)}
            >
              <Terminal className="app-action-icon" />
            </Button>
          )}

          <Button
            size="icon"
            variant="ghost"
            title={`${UI_COPY.COMMON.ACTIONS.SETTINGS}: ${app.name}`}
            aria-label={`${UI_COPY.COMMON.ACTIONS.SETTINGS}: ${app.name}`}
            onClick={() => onOpenSettings(app)}
          >
            <Settings2 className="app-action-icon" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="app-card-kill-btn"
            title={`${isRoutingActive ? UI_COPY.APPS.CARD.DEACTIVATE_BTN : UI_COPY.APPS.CARD.ACTIVATE_BTN}: ${app.name}`}
            aria-label={`${isRoutingActive ? UI_COPY.APPS.CARD.DEACTIVATE_BTN : UI_COPY.APPS.CARD.ACTIVATE_BTN}: ${app.name}`}
            onClick={() => onToggleKillSwitch(app)}
          >
            <Power className="app-action-icon app-action-danger" />
          </Button>
        </div>
      </div>
    </article>
  );
};
