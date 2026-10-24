/**
 * @file apps/web/src/features/dashboard/components/portal-dashboard.tsx
 * @description Central dashboard client shell orchestrating ecosystem navigation, live streams, and modals.
 * @module @devlab/portal-web/features/dashboard/components/portal-dashboard
 */

"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { NavigationBar } from "@devlab-portal/ui";
import { PortalHeader, PortalFooter } from "@/components/layout";
import { UI_COPY } from "@/lib/ui-copy";
import { getSocket } from "@/lib/api-client";
import { SOCKET_EVENTS } from "@/lib/constants/routes";
import type { RegisteredApp } from "@/lib/api-client";
import { useAppsQuery, appsQueryKey } from "@/features/apps/api";
import { useApiKeysQuery, apiKeysQueryKey } from "@/features/iam/api";
import { useAuditLogsQuery, auditLogsQueryKey } from "@/features/audit/api";
import { useTeamMembersQuery, teamMembersQueryKey } from "@/features/team/api";
import { useJwksQuery, useOidcConfigQuery } from "@/features/settings/api";
import { useNavigationQuery } from "@/features/dashboard/api";
import { useDashboardActions } from "../hooks/use-dashboard-actions";
import { DashboardTabsContent } from "./dashboard-tabs-content";
import { DashboardModals } from "./dashboard-modals";

export function PortalDashboard(): React.JSX.Element {
  const queryClient = useQueryClient();

  // Dynamic server-driven navigation menus from DB
  const { data: navigationItems = [] } = useNavigationQuery();
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    if (!activeTab && navigationItems.length > 0) {
      setActiveTab(navigationItems[0].key);
    }
  }, [activeTab, navigationItems]);

  // TanStack Query hooks subscribing to server state
  const { data: apps = [] } = useAppsQuery();
  const { data: apiKeys = [] } = useApiKeysQuery();
  const { data: auditLogs = [] } = useAuditLogsQuery();
  const { data: team = [] } = useTeamMembersQuery();
  const { data: jwks = null } = useJwksQuery();
  const { data: oidc = null } = useOidcConfigQuery();

  // Mutation actions encapsulated with Sonner promise toasts
  const {
    handleCreateTenant,
    handleRevokeKey,
    handleCreateApp,
    handleUpdateAppSettings,
    handleToggleKillSwitch,
  } = useDashboardActions(apps);

  // Modal and Drawer States
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isNewTenantOpen, setIsNewTenantOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedAppForDrawer, setSelectedAppForDrawer] = useState<RegisteredApp | null>(null);
  const [selectedAppForKillSwitch, setSelectedAppForKillSwitch] = useState<RegisteredApp | null>(
    null,
  );
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Global Keyboard Shortcut (⌘K / Ctrl+K)
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

  // Real-time WebSocket synchronization
  useEffect(() => {
    const socket = getSocket();

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

  return (
    <div className="portal-shell">
      <PortalHeader
        auditLogs={auditLogs}
        onOpenCommand={() => setIsCommandOpen(true)}
        onOpenNewTenant={() => setIsNewTenantOpen(true)}
        onNavigateTab={setActiveTab}
      />

      <NavigationBar
        items={navigationItems}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        ariaLabel={UI_COPY.COMMON.A11Y.MAIN_NAVIGATION}
        countForItem={(item) => (item.key === "apps" ? apps.length : undefined)}
      />

      <DashboardTabsContent
        activeTab={activeTab}
        apps={apps}
        apiKeys={apiKeys}
        auditLogs={auditLogs}
        team={team}
        jwks={jwks}
        oidc={oidc}
        onOpenRegisterModal={() => setIsRegisterOpen(true)}
        onOpenSettings={(app) => setSelectedAppForDrawer(app)}
        onToggleKillSwitch={(app) => setSelectedAppForKillSwitch(app)}
        onNavigateTab={setActiveTab}
        onOpenGenerateModal={() => setIsApiKeyModalOpen(true)}
        onRevokeKey={handleRevokeKey}
        onOpenInviteModal={() => setIsInviteModalOpen(true)}
      />

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
        onNavigateTab={setActiveTab}
        onCreateTenant={handleCreateTenant}
        onCreateApp={handleCreateApp}
        onUpdateAppSettings={handleUpdateAppSettings}
        onToggleKillSwitch={handleToggleKillSwitch}
        onSuccessRegister={() => {
          setIsRegisterOpen(false);
          queryClient.invalidateQueries({ queryKey: appsQueryKey() });
        }}
        onSuccessApiKey={() => {
          setIsApiKeyModalOpen(false);
          queryClient.invalidateQueries({ queryKey: apiKeysQueryKey() });
        }}
        onSuccessInvite={() => {
          setIsInviteModalOpen(false);
          queryClient.invalidateQueries({ queryKey: teamMembersQueryKey() });
        }}
      />
    </div>
  );
}
