"use client";

/**
 * @file apps/web/src/components/layout/portal-header.tsx
 * @description Master control plane topbar with tenant switching and integration with header action menus.
 * @module @devlab/portal-web/components/layout/portal-header
 */

import React, { useState, useEffect } from "react";
import { Layers, ChevronDown, Check, Plus } from "lucide-react";
import { Button } from "@yuva-devlab/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { TabKey } from "@/lib/constants/enums";
import type { AuditLog } from "@/features/audit/types";
import { HeaderActions } from "./header-actions";

interface PortalHeaderProps {
  auditLogs: AuditLog[];
  onOpenCommand: () => void;
  onOpenNewTenant: () => void;
  onNavigateTab: (tab: TabKey) => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  auditLogs,
  onOpenCommand,
  onOpenNewTenant,
  onNavigateTab,
}) => {
  const [isLight, setIsLight] = useState(false);
  const [isTenantMenuOpen, setIsTenantMenuOpen] = useState(false);
  const [activeTenant, setActiveTenant] = useState("Yuva DevLab");
  const [tenants] = useState(["Yuva DevLab", "Staging Swarm Tenant", "Personal Sandbox"]);
  const [tenantSearch, setTenantSearch] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", !isLight);
  }, [isLight]);

  return (
    <header className="topbar">
      {/* Brand & Tenant Selector */}
      <div className="flex items-center">
        <div
          className="brand cursor-pointer"
          onClick={() => onNavigateTab(TabKey.APPS)}
          role="button"
          tabIndex={0}
        >
          <span className="logo-mark">
            <Layers className="size-5" />
          </span>
          {UI_COPY.COMMON.BRAND.NAME} Portal
        </div>
        <span className="topbar-divider" />
        <div className="relative">
          <Button
            variant="ghost"
            className="tenant-button"
            onClick={() => setIsTenantMenuOpen((prev) => !prev)}
          >
            <span className="tenant-avatar">YD</span>
            <span className="tenant-label">{activeTenant}</span>
            <span className="plan-badge">Enterprise</span>
            <ChevronDown className="size-3" />
          </Button>

          {isTenantMenuOpen && (
            <div className="pop-menu tenant-menu">
              <input
                className="border-border bg-secondary mb-2 w-full rounded-md border p-2 text-xs"
                placeholder="Search tenants…"
                aria-label="Search tenants"
                value={tenantSearch}
                onChange={(e) => setTenantSearch(e.target.value)}
              />
              {tenants
                .filter((t) => t.toLowerCase().includes(tenantSearch.toLowerCase()))
                .map((t) => (
                  <Button
                    key={t}
                    variant="ghost"
                    className="menu-item justify-between"
                    onClick={() => {
                      setActiveTenant(t);
                      setIsTenantMenuOpen(false);
                    }}
                  >
                    {t}
                    {activeTenant === t && <Check className="text-primary size-3" />}
                  </Button>
                ))}
              <Button
                variant="ghost"
                className="menu-item text-primary"
                onClick={() => {
                  setIsTenantMenuOpen(false);
                  onOpenNewTenant();
                }}
              >
                <Plus className="mr-1 size-3" />
                Create New Tenant
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Cluster Status, Search, Launcher, Notifications, Theme, Profile */}
      <HeaderActions
        auditLogs={auditLogs}
        isLight={isLight}
        onToggleTheme={() => setIsLight((prev) => !prev)}
        onOpenCommand={onOpenCommand}
        onNavigateTab={onNavigateTab}
      />
    </header>
  );
};
