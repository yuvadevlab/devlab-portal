"use client";

/**
 * @file apps/web/src/components/layout/portal-header.tsx
 * @description Master control plane topbar with database-driven tenant switching and role-gated administration.
 * Only super_admin accounts may switch or create tenants; all other roles view a static workspace badge.
 * @module @devlab/portal-web/components/layout/portal-header
 */

import React, { useState, useEffect } from "react";
import { Layers, ChevronDown, Check, Plus } from "lucide-react";
import { Button, Input, useTheme } from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { TabKey, UserRole } from "@/lib/constants/enums";
import { useAuthMeQuery } from "@/features/auth";
import { useTenantsQuery } from "@/features/dashboard";
import type { AuditLog } from "@/features/audit/types";
import { HeaderActions } from "./header-actions";

interface PortalHeaderProps {
  auditLogs: AuditLog[];
  onOpenCommand: () => void;
  onOpenNewTenant: () => void;
  onNavigateTab: (tabKey: string) => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  auditLogs,
  onOpenCommand,
  onOpenNewTenant,
  onNavigateTab,
}) => {
  const { resolvedTheme, setTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  const handleToggleTheme = () => {
    setTheme(isLight ? "dark" : "light");
  };

  const [isTenantMenuOpen, setIsTenantMenuOpen] = useState(false);
  const [tenantSearch, setTenantSearch] = useState("");
  const [activeTenantId, setActiveTenantId] = useState<string>("");

  // Authenticated user session
  const { data: currentUser } = useAuthMeQuery();

  // Dynamic database tenants
  const { data: dbTenants } = useTenantsQuery();

  const tenants = dbTenants && dbTenants.length > 0 ? dbTenants : [];
  // Guard tenant switcher against non-superadmin accounts
  const isSuperAdmin = currentUser?.role === UserRole.SUPER_ADMIN;

  // Synchronize active tenant identity with localStorage or user profile
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("devlab_active_tenant_id");
      if (storedId && tenants.some((t) => t.id === storedId)) {
        setActiveTenantId(storedId);
        return;
      }
    }

    if (currentUser?.tenantId && tenants.some((t) => t.id === currentUser.tenantId)) {
      setActiveTenantId(currentUser.tenantId);
    } else if (tenants.length > 0 && !activeTenantId) {
      setActiveTenantId(tenants[0].id);
    }
  }, [tenants, currentUser, activeTenantId]);

  const activeTenantObj = tenants.find((t) => t.id === activeTenantId);
  const activeTenantName =
    activeTenantObj?.name || currentUser?.tenant?.name || UI_COPY.COMMON.HEADER.WORKSPACE;

  const initials =
    activeTenantName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "WS";

  return (
    <header className="topbar">
      {/* Brand & Dynamic DB Tenant Selector */}
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

        {/* Role-Gated Tenant Switcher: super_admin only */}
        {isSuperAdmin ? (
          <div className="relative">
            <Button
              variant="ghost"
              className="tenant-button"
              onClick={() => setIsTenantMenuOpen((prev) => !prev)}
            >
              <span className="tenant-avatar">{initials}</span>
              <span className="tenant-label">{activeTenantName}</span>
              <ChevronDown className="size-3" />
            </Button>

            {isTenantMenuOpen && (
              <div className="pop-menu tenant-menu">
                <Input
                  className="border-border bg-secondary mb-2 h-8 w-full p-2 text-xs"
                  placeholder={UI_COPY.COMMON.HEADER.SEARCH_TENANTS}
                  aria-label={UI_COPY.COMMON.HEADER.SEARCH_TENANTS}
                  value={tenantSearch}
                  onChange={(e) => setTenantSearch(e.target.value)}
                />
                {tenants
                  .filter((t) => t.name.toLowerCase().includes(tenantSearch.toLowerCase()))
                  .map((t) => (
                    <Button
                      key={t.id}
                      variant="ghost"
                      className="menu-item justify-between"
                      onClick={() => {
                        setActiveTenantId(t.id);
                        if (typeof window !== "undefined") {
                          localStorage.setItem("devlab_active_tenant_id", t.id);
                        }
                        setIsTenantMenuOpen(false);
                      }}
                    >
                      <span>{t.name}</span>
                      {activeTenantId === t.id && <Check className="text-primary size-3" />}
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
                  {UI_COPY.COMMON.HEADER.CREATE_TENANT}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 px-2 py-1 text-xs">
            <span className="tenant-avatar">{initials}</span>
            <span className="tenant-label text-foreground font-medium">{activeTenantName}</span>
          </div>
        )}
      </div>

      {/* Cluster Status, Search, Launcher, Notifications, Theme, Profile */}
      <HeaderActions
        auditLogs={auditLogs}
        isLight={isLight}
        currentUser={currentUser}
        onToggleTheme={handleToggleTheme}
        onOpenCommand={onOpenCommand}
        onNavigateTab={onNavigateTab}
      />
    </header>
  );
};
