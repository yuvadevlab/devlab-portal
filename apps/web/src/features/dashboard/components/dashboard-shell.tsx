"use client";

/**
 * @file apps/web/src/features/dashboard/components/dashboard-shell.tsx
 * @description Persistent dashboard application shell coordinating header, navigation, footer, and modals.
 * @module @devlab/portal-web/features/dashboard/components
 */

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { NavigationBar } from "@devlab-portal/ui";
import { PortalHeader, PortalFooter } from "@/components/layout";
import { UI_COPY } from "@/lib/ui-copy";
import { getSocket } from "@/lib/api-client";
import { SOCKET_EVENTS } from "@/lib/constants/routes";
import type { RegisteredApp } from "@/lib/api-client";
import { useAppsQuery, appsQueryKey } from "@/features/apps/api";
import { apiKeysQueryKey } from "@/features/iam/api";
import { useAuditLogsQuery } from "@/features/audit/api";
import { auditLogsQueryKey } from "@/features/audit/api";
import { teamMembersQueryKey } from "@/features/team/api";
import { useNavigationQuery } from "@/features/dashboard/api";
import { useDashboardActions } from "../hooks/use-dashboard-actions";
import { DashboardModals } from "./dashboard-modals";
import {
  DashboardModalsContext,
  type DashboardModalsContextValue,
} from "../context/dashboard-modals-context";

export function DashboardShell({ children }: { children: React.ReactNode }): React.JSX.Element {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = pathname.replace(/^\//, "").split("/")[0] || "apps";

  const { data: navigationItems = [] } = useNavigationQuery();
  const { data: apps = [] } = useAppsQuery();
  const { data: auditLogs = [] } = useAuditLogsQuery();

  const { handleCreateTenant, handleCreateApp, handleUpdateAppSettings, handleToggleKillSwitch } =
    useDashboardActions(apps);

  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isNewTenantOpen, setIsNewTenantOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedAppForDrawer, setSelectedAppForDrawer] = useState<RegisteredApp | null>(null);
  const [selectedAppForKillSwitch, setSelectedAppForKillSwitch] = useState<RegisteredApp | null>(
    null,
  );
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleAppStateChanged = () => {
      queryClient.invalidateQueries({ queryKey: appsQueryKey() });
      queryClient.invalidateQueries({ queryKey: auditLogsQueryKey() });
    };

    const handleKeyRevoked = () => {
      queryClient.invalidateQueries({ queryKey: apiKeysQueryKey() });
      queryClient.invalidateQueries({ queryKey: auditLogsQueryKey() });
    };

    const handleAuditLogged = () => {
      queryClient.invalidateQueries({ queryKey: auditLogsQueryKey() });
    };

    socket.on(SOCKET_EVENTS.APP_STATE_CHANGED, handleAppStateChanged);
    socket.on(SOCKET_EVENTS.KEY_REVOKED, handleKeyRevoked);
    socket.on(SOCKET_EVENTS.AUDIT_LOGGED, handleAuditLogged);

    return () => {
      socket.off(SOCKET_EVENTS.APP_STATE_CHANGED, handleAppStateChanged);
      socket.off(SOCKET_EVENTS.KEY_REVOKED, handleKeyRevoked);
      socket.off(SOCKET_EVENTS.AUDIT_LOGGED, handleAuditLogged);
    };
  }, [queryClient]);

  const handleNavigateTab = (tabKey: string) => {
    router.push(tabKey === "apps" ? "/apps" : "/" + tabKey);
  };

  const contextValue: DashboardModalsContextValue = {
    openCommandPalette: () => setIsCommandOpen(true),
    openNewTenant: () => setIsNewTenantOpen(true),
    openRegisterModal: () => setIsRegisterOpen(true),
    openSettings: (app: RegisteredApp) => setSelectedAppForDrawer(app),
    openKillSwitch: (app: RegisteredApp) => setSelectedAppForKillSwitch(app),
    openApiKeyModal: () => setIsApiKeyModalOpen(true),
    openInviteModal: () => setIsInviteModalOpen(true),
    onNavigateTab: handleNavigateTab,
  };

  return (
    <DashboardModalsContext.Provider value={contextValue}>
      <div className="layout">
        <PortalHeader
          auditLogs={auditLogs}
          onOpenNewTenant={() => setIsNewTenantOpen(true)}
          onOpenCommand={() => setIsCommandOpen(true)}
          onNavigateTab={handleNavigateTab}
        />

        <NavigationBar
          items={navigationItems}
          activeTab={activeTab}
          onSelectTab={handleNavigateTab}
          ariaLabel={UI_COPY.COMMON.A11Y.MAIN_NAVIGATION}
          countForItem={(item) => (item.key === "apps" ? apps.length : undefined)}
        />

        <main className="page-content">{children}</main>

        <PortalFooter />

        <DashboardModals
          navigationItems={navigationItems}
          apps={apps}
          isCommandOpen={isCommandOpen}
          isNewTenantOpen={isNewTenantOpen}
          isRegisterOpen={isRegisterOpen}
          selectedAppForDrawer={selectedAppForDrawer}
          selectedAppForKillSwitch={selectedAppForKillSwitch}
          isApiKeyModalOpen={isApiKeyModalOpen}
          isInviteModalOpen={isInviteModalOpen}
          onCloseCommand={() => setIsCommandOpen(false)}
          onCloseNewTenant={() => setIsNewTenantOpen(false)}
          onCloseRegister={() => setIsRegisterOpen(false)}
          onCloseDrawer={() => setSelectedAppForDrawer(null)}
          onCloseKillSwitch={() => setSelectedAppForKillSwitch(null)}
          onCloseApiKeyModal={() => setIsApiKeyModalOpen(false)}
          onCloseInviteModal={() => setIsInviteModalOpen(false)}
          onNavigateTab={handleNavigateTab}
          onCreateTenant={handleCreateTenant}
          onCreateApp={handleCreateApp}
          onUpdateAppSettings={handleUpdateAppSettings}
          onToggleKillSwitch={handleToggleKillSwitch}
          onSuccessRegister={() => {
            queryClient.invalidateQueries({ queryKey: appsQueryKey() });
          }}
          onSuccessApiKey={() => {
            queryClient.invalidateQueries({ queryKey: apiKeysQueryKey() });
          }}
          onSuccessInvite={() => {
            setIsInviteModalOpen(false);
            queryClient.invalidateQueries({ queryKey: teamMembersQueryKey() });
          }}
        />
      </div>
    </DashboardModalsContext.Provider>
  );
}
