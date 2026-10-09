"use client";

/**
 * @file apps/web/src/features/dashboard/components/portal-dashboard.tsx
 * @description Master client component coordinating Lovable console layout, DB-driven navigation, and query state.
 * @module @devlab/portal-web/features/dashboard/components/portal-dashboard
 */

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PortalHeader, PortalNavbar, PortalFooter } from "@/components/layout";
import { SOCKET_EVENTS } from "@/lib/constants/routes";
import { getSocket, type RegisteredApp } from "@/lib/api-client";
import {
  appsQueryKey,
  useAppsQuery,
  useCreateAppMutation,
  useUpdateAppSettingsMutation,
  useToggleKillSwitchMutation,
} from "@/features/apps";
import { apiKeysQueryKey, useApiKeysQuery, useRevokeApiKeyMutation } from "@/features/iam";
import { auditLogsQueryKey, useAuditLogsQuery } from "@/features/audit";
import { teamMembersQueryKey, useTeamMembersQuery } from "@/features/team";
import { useJwksQuery, useOidcConfigQuery } from "@/features/settings";
import { useNavigationQuery } from "../api/get-navigation";
import { DashboardTabsContent } from "./dashboard-tabs-content";
import { DashboardModals } from "./dashboard-modals";

export function PortalDashboard(): React.JSX.Element {
  const queryClient = useQueryClient();

  // Dynamic server-driven navigation menus from DB
  const { data: navigationItems = [] } = useNavigationQuery();
  const [activeTab, setActiveTab] = useState<string>("");

  // Select the initial menu item dynamically from DB results (zero hardcoded default menu)
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

  // Mutations
  const createApp = useCreateAppMutation();
  const updateAppSettings = useUpdateAppSettingsMutation();
  const toggleKillSwitch = useToggleKillSwitchMutation();
  const revokeApiKey = useRevokeApiKeyMutation();

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

      <PortalNavbar
        items={navigationItems}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        appsCount={apps.length}
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
        onRevokeKey={async (id) => {
          await revokeApiKey.mutateAsync(id);
        }}
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
        onCreateApp={async (payload) => createApp.mutateAsync(payload)}
        onUpdateAppSettings={async (id, payload) => {
          await updateAppSettings.mutateAsync({ id, payload });
        }}
        onToggleKillSwitch={async (id, nextState, maintenanceNote) => {
          await toggleKillSwitch.mutateAsync({ id, nextState, maintenanceNote });
        }}
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
