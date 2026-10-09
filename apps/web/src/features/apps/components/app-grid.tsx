"use client";

/**
 * @file apps/web/src/features/apps/components/app-grid.tsx
 * @description Catalog grid toolbar with search filtering, environment toggles, and app cards.
 * Fully built with @yuva-devlab/ui Button, Input, Tabs, and TabsList components.
 * @module @devlab/portal-web/features/apps/components/app-grid
 */

import React, { useState, useMemo } from "react";
import { Search, Plus, ServerOff } from "lucide-react";
import { Button, Input, Tabs, TabsList, TabsTrigger } from "@yuva-devlab/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { AppCard } from "./app-card";
import type { RegisteredApp } from "@/features/apps/types";

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
      <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative max-w-md flex-1">
            <Search className="text-muted-foreground absolute top-2.5 left-3 size-4" />
            <Input
              type="text"
              placeholder={UI_COPY.COMMON.ACTIONS.SEARCH}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card border-border h-9 pl-9 text-xs"
            />
          </div>

          {/* Environment filter segmented tabs */}
          <div className="hidden lg:block">
            <Tabs value={envFilter} onValueChange={setEnvFilter}>
              <TabsList className="h-9">
                {envOptions.map((opt) => (
                  <TabsTrigger key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Register App Button */}
        <Button
          onClick={onOpenRegisterModal}
          className="bg-primary text-primary-foreground h-9 shrink-0 px-4 text-xs font-medium shadow-sm hover:opacity-90"
        >
          <Plus className="mr-1.5 size-4" />
          {UI_COPY.APPS.HEADER.ADD_APP_BTN}
        </Button>
      </div>

      {/* Grid of registered application cards */}
      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        <div className="border-border bg-card/40 flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
          <div className="bg-background border-border text-muted-foreground mb-3 flex size-12 items-center justify-center rounded-full border">
            <ServerOff className="size-6" />
          </div>
          <h4 className="text-foreground text-sm font-semibold">{UI_COPY.COMMON.EMPTY.NO_DATA}</h4>
          <p className="text-muted-foreground mt-1 max-w-sm text-xs">
            {UI_COPY.COMMON.EMPTY.NO_DATA_DESC}
          </p>
        </div>
      )}
    </div>
  );
};
