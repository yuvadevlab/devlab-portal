"use client";

/**
 * @file apps/web/src/features/apps/components/app-card.tsx
 * @description Application catalog card with thematic color palettes, live telemetry, and control actions.
 * Fully built with @yuva-devlab/ui Button and design tokens.
 * @module @devlab/portal-web/features/apps/components/app-card
 */

import React from "react";
import {
  Link2,
  HeartPulse,
  ArrowUpRight,
  Settings2,
  Power,
  ChartNoAxesCombined,
  Workflow,
  Terminal,
  ShieldCheck,
  Layers,
  Bot,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@yuva-devlab/ui";
import type { RegisteredApp } from "@/features/apps/types";

interface AppCardProps {
  app: RegisteredApp;
  onOpenSettings: (app: RegisteredApp) => void;
  onToggleKillSwitch: (app: RegisteredApp) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onOpenSettings, onToggleKillSwitch }) => {
  const isRoutingActive = app.isActive;

  // Assign distinct thematic accent color palette
  const getAppColor = (appId: string): string => {
    if (appId.includes("finai")) return "mint";
    if (appId.includes("orchestrai")) return "blue";
    if (appId.includes("log")) return "amber";
    if (appId.includes("guard")) return "rose";
    return "teal";
  };

  // Assign contextual domain icon
  const getAppIcon = (appId: string): LucideIcon => {
    if (appId.includes("finai")) return ChartNoAxesCombined;
    if (appId.includes("orchestrai")) return Workflow;
    if (appId.includes("log")) return Terminal;
    if (appId.includes("guard")) return ShieldCheck;
    if (appId.includes("portal")) return Layers;
    return Bot;
  };

  const appColor = getAppColor(app.appId);
  const IconComponent = getAppIcon(app.appId);

  return (
    <article className={`app-card ${appColor}`}>
      {/* Top Header: Thematic Icon & Status Pulse */}
      <div className="app-card-top">
        <div className="app-icon">
          <IconComponent className="size-5" />
        </div>
        <span className={`status ${!isRoutingActive ? "suspended" : ""}`}>
          <span className="status-dot" />
          {isRoutingActive ? "Online" : "Suspended"}
        </span>
      </div>

      {/* App Name & Environment Tag */}
      <h2>
        {app.name}
        <span className="env-badge">
          {app.environment === "local_dev" ? "local dev" : app.environment}
        </span>
      </h2>

      {/* Description */}
      <p className="app-description">{app.description || "No description provided."}</p>

      {/* Origin URL */}
      <div className="endpoint">
        <Link2 className="size-3 shrink-0" />
        <span>{app.originUrl}</span>
      </div>

      {/* Health Probe & Status Code */}
      <div className="endpoint">
        <HeartPulse className="size-3 shrink-0" />
        <span>{app.healthUrl || "/health"}</span>
        <span
          className={`ml-auto font-mono text-[10px] font-semibold ${
            isRoutingActive ? "text-success" : "text-destructive"
          }`}
        >
          {isRoutingActive ? "200 OK" : "503"}
        </span>
      </div>

      {/* Card Footer: Launch Console & Controls */}
      <div className="app-card-footer">
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground hover:text-foreground gap-1 px-2 text-xs"
          onClick={() => window.open(app.originUrl, "_blank", "noopener,noreferrer")}
          disabled={!isRoutingActive}
        >
          Open console
          <ArrowUpRight className="size-3" />
        </Button>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            title={`Settings for ${app.name}`}
            aria-label={`Settings for ${app.name}`}
            onClick={() => onOpenSettings(app)}
          >
            <Settings2 className="size-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="text-destructive hover:bg-destructive/10"
            title={`${isRoutingActive ? "Kill-switch" : "Restore"} ${app.name}`}
            aria-label={`Kill-switch ${app.name}`}
            onClick={() => onToggleKillSwitch(app)}
          >
            <Power className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
};
