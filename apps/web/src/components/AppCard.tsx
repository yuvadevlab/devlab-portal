/**
 * @file apps/web/src/components/AppCard.tsx
 * @description Application card with live health latency monitor, launch trigger, and kill-switch.
 * @module @devlab/portal-web/components
 */

"use client";

import React from "react";
import { ExternalLink, Power, Wifi, WifiOff } from "lucide-react";
import type { RegisteredApp } from "../lib/api-client";

interface AppCardProps {
  app: RegisteredApp;
  onToggleKillSwitch: (app: RegisteredApp) => void;
}

export function AppCard({ app, onToggleKillSwitch }: AppCardProps) {
  const isHealthy = app.healthStatus === "healthy";
  const isDegraded = app.healthStatus === "degraded";

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 hover:shadow-2xl ${
        app.isActive
          ? "border-slate-800 bg-[#0f172a]/90 hover:border-slate-700 hover:bg-[#0f172a]"
          : "border-red-950/60 bg-red-950/10 hover:border-red-900/80"
      }`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                {app.name}
              </h3>
              <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-mono font-medium text-slate-300 border border-slate-700">
                {app.appId}
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-2">
              {app.description || "DevLab platform ecosystem service"}
            </p>
          </div>

          {/* Kill Switch Toggle Button */}
          <button
            onClick={() => onToggleKillSwitch(app)}
            title={app.isActive ? "Deactivate application" : "Activate application"}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
              app.isActive
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40"
                : "border-red-500/30 bg-red-500/20 text-red-400 hover:bg-emerald-500/20 hover:text-emerald-400"
            }`}
          >
            <Power className="h-4 w-4" />
          </button>
        </div>

        {/* Health & Environment Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-slate-800/80 px-2.5 py-1 text-xs font-mono font-medium text-slate-300 border border-slate-700/60">
            {app.environment}
          </span>

          {app.isActive ? (
            <div
              className={`flex items-center space-x-1.5 rounded-md px-2.5 py-1 text-xs font-medium border ${
                isHealthy
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : isDegraded
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              {isHealthy ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              <span>{app.healthStatus}</span>
              {app.latencyMs !== undefined && app.latencyMs >= 0 && (
                <span className="font-mono opacity-75">({app.latencyMs}ms)</span>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">
              <Power className="h-3 w-3" />
              <span>Offline (Kill-Switch Active)</span>
            </div>
          )}
        </div>

        {app.maintenanceNote && !app.isActive && (
          <div className="mt-3 rounded-lg border border-red-900/40 bg-red-950/40 p-2.5 text-xs text-red-300">
            <span className="font-semibold">Notice:</span> {app.maintenanceNote}
          </div>
        )}
      </div>

      {/* Card Footer / Action */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-xs font-mono text-slate-500 truncate max-w-[180px]">
          {app.originUrl}
        </span>
        <a
          href={app.originUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold shadow-md transition-all ${
            app.isActive
              ? "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20"
              : "pointer-events-none bg-slate-800 text-slate-500 opacity-60"
          }`}
        >
          <span>Launch App</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
