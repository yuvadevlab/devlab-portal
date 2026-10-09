"use client";

/**
 * @file apps/web/src/features/apps/components/app-grid.tsx
 * @description Application catalog grid with search filtering, environment tabs, and register card.
 * Fully built with @yuva-devlab/ui primitives.
 * @module @devlab/portal-web/features/apps/components/app-grid
 */

import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@yuva-devlab/ui";
import { AppCard } from "./app-card";
import { RecentActivity } from "./recent-activity";
import { TabKey } from "@/lib/constants/enums";
import type { RegisteredApp } from "@/features/apps/types";
import type { AuditLog } from "@/features/audit/types";

interface AppGridProps {
  apps: RegisteredApp[];
  auditLogs: AuditLog[];
  onOpenRegisterModal: () => void;
  onOpenSettings: (app: RegisteredApp) => void;
  onToggleKillSwitch: (app: RegisteredApp) => void;
  onNavigateTab: (tab: TabKey) => void;
}

export const AppGrid: React.FC<AppGridProps> = ({
  apps,
  auditLogs,
  onOpenRegisterModal,
  onOpenSettings,
  onToggleKillSwitch,
  onNavigateTab,
}) => {
  const [search, setSearch] = useState("");
  const [selectedEnv, setSelectedEnv] = useState<string>("All");

  const environments = [
    { key: "All", label: "All environments" },
    { key: "production", label: "Production" },
    { key: "staging", label: "Staging" },
    { key: "local_dev", label: "Local dev" },
  ];

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.appId.toLowerCase().includes(search.toLowerCase()) ||
      (app.description && app.description.toLowerCase().includes(search.toLowerCase()));

    const matchesEnv = selectedEnv === "All" || app.environment === selectedEnv;
    return matchesSearch && matchesEnv;
  });

  return (
    <>
      {/* Filter and Search Toolbar */}
      <div className="app-toolbar">
        <div className="flex items-center gap-3">
          <div className="search-field">
            <Search className="size-3.5" />
            <input
              placeholder="Search applications…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search applications"
            />
          </div>
          <span className="text-muted-foreground text-xs whitespace-nowrap">
            {filteredApps.length} apps
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="segmented">
            {environments.map((env) => (
              <Button
                key={env.key}
                variant="ghost"
                size="sm"
                className={`segment text-muted-foreground h-7 px-3 text-xs ${
                  selectedEnv === env.key ? "active" : ""
                }`}
                onClick={() => setSelectedEnv(env.key)}
              >
                {env.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* 3-Column Responsive Apps Grid */}
      <div className="app-grid">
        {filteredApps.map((app) => (
          <AppCard
            key={app.id}
            app={app}
            onOpenSettings={onOpenSettings}
            onToggleKillSwitch={onToggleKillSwitch}
          />
        ))}

        {/* Bring Next Idea Dotted Register Card */}
        <div className="register-card">
          <span className="register-symbol">
            <Plus className="text-muted-foreground size-5" />
          </span>
          <strong>Bring your next idea into the ecosystem</strong>
          <p>One identity. Every application.</p>
          <Button variant="outline" size="sm" onClick={onOpenRegisterModal}>
            <Plus className="mr-1 size-3.5" />
            Register application
          </Button>
        </div>
      </div>

      {filteredApps.length === 0 && (
        <p className="empty-state">No applications match your search.</p>
      )}

      {/* Live Recent Activity Feed */}
      <RecentActivity auditLogs={auditLogs} onNavigateTab={onNavigateTab} />
    </>
  );
};
