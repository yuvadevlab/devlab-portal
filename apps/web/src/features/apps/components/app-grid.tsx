/**
 * @file apps/web/src/features/apps/components/app-grid.tsx
 * @description Catalog grid toolbar with search filtering, environment toggles, and app cards.
 * @module @devlab/portal-web/features/apps/components/app-grid
 */

import React, { useState, useMemo } from "react";
import { Search, Plus, ServerOff } from "lucide-react";
import { Button, Input } from "@yuva-devlab/ui";
import { UI_COPY } from "../../../lib/ui-copy/index";
import { AppCard } from "./app-card";
import type { RegisteredApp } from "../types";

interface AppGridProps {
  apps: RegisteredApp[];
  onOpenRegisterModal: () => void;
  onOpenSettings: (app: RegisteredApp) => void;
  onToggleKillSwitch: (app: RegisteredApp) => void;
}

export const AppGrid: React.FC<AppGridProps> = ({
  apps,
  onOpenRegisterModal,
  onOpenSettings,
  onToggleKillSwitch,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [envFilter, setEnvFilter] = useState<string>("all");

  // Filter apps by search term and target runtime environment
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.appId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.description && app.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesEnv = envFilter === "all" || app.environment === envFilter;
      return matchesSearch && matchesEnv;
    });
  }, [apps, searchQuery, envFilter]);

  const envOptions = [
    { value: "all", label: "All Envs" },
    { value: "local_dev", label: UI_COPY.COMMON.ENVIRONMENTS.LOCAL_DEV },
    { value: "staging", label: UI_COPY.COMMON.ENVIRONMENTS.STAGING },
    { value: "production", label: UI_COPY.COMMON.ENVIRONMENTS.PRODUCTION },
  ];

  return (
    <div className="space-y-6">
      {/* Control bar: search, environment filter, register CTA */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
            <Input
              type="text"
              placeholder={UI_COPY.COMMON.ACTIONS.SEARCH}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[var(--card)] border-[var(--border)] text-xs h-9"
            />
          </div>

          {/* Environment filter pills */}
          <div className="hidden lg:flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] p-1">
            {envOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setEnvFilter(opt.value)}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                  envFilter === opt.value
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Register App Button */}
        <Button
          onClick={onOpenRegisterModal}
          className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 font-medium text-xs h-9 px-4 shrink-0 shadow-sm"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          {UI_COPY.APPS.HEADER.ADD_APP_BTN}
        </Button>
      </div>

      {/* Grid of registered application cards */}
      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              onOpenSettings={onOpenSettings}
              onToggleKillSwitch={onToggleKillSwitch}
            />
          ))}
        </div>
      ) : (
        /* Empty filter result display */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] p-12 text-center bg-[var(--card)]/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)] mb-3">
            <ServerOff className="h-6 w-6" />
          </div>
          <h4 className="font-semibold text-sm text-[var(--foreground)]">
            {UI_COPY.COMMON.EMPTY.NO_DATA}
          </h4>
          <p className="mt-1 text-xs text-[var(--muted-foreground)] max-w-sm">
            {UI_COPY.COMMON.EMPTY.NO_DATA_DESC}
          </p>
        </div>
      )}
    </div>
  );
};
