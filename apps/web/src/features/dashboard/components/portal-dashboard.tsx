"use client";

/**
 * @file apps/web/src/features/dashboard/components/portal-dashboard.tsx
 * @description Master client component coordinating Lovable console layout, query hooks, and modals.
 * @module @devlab/portal-web/features/dashboard/components/portal-dashboard
 */

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  PortalHeader,
  PortalNavbar,
  PortalFooter,
  CommandDialog,
  TenantModal,
} from "@/components/layout";
import { TabKey } from "@/lib/constants/enums";
import { SOCKET_EVENTS } from "@/lib/constants/routes";
import { getSocket, type RegisteredApp } from "@/lib/api-client";
import {
  appsQueryKey,
  useAppsQuery,
  useCreateAppMutation,
  useUpdateAppSettingsMutation,
  useToggleKillSwitchMutation,
  AppMetrics,
  AppGrid,
  AppSettingsDrawer,
  KillSwitchModal,
  RegisterAppModal,
} from "@/features/apps";
import {
  apiKeysQueryKey,
  useApiKeysQuery,
  useRevokeApiKeyMutation,
  ApiKeysTable,
  ApiKeyModal,
} from "@/features/iam";
import { auditLogsQueryKey, useAuditLogsQuery, AuditTable } from "@/features/audit";
import {
  teamMembersQueryKey,
  useTeamMembersQuery,
  TeamTable,
  InviteMemberModal,
} from "@/features/team";
import { useJwksQuery, useOidcConfigQuery, JwksViewer } from "@/features/settings";

export function PortalDashboard(): React.JSX.Element {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabKey>(TabKey.APPS);

  // TanStack Query hooks subscribing to server and local cache state
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

      <PortalNavbar activeTab={activeTab} onSelectTab={setActiveTab} appsCount={apps.length} />

      <main className="page-content">
        {activeTab === TabKey.APPS && (
          <>
            <AppMetrics apps={apps} />
            <AppGrid
              apps={apps}
              auditLogs={auditLogs}
              onOpenRegisterModal={() => setIsRegisterOpen(true)}
              onOpenSettings={(app) => setSelectedAppForDrawer(app)}
              onToggleKillSwitch={(app) => setSelectedAppForKillSwitch(app)}
              onNavigateTab={setActiveTab}
            />
          </>
        )}

        {activeTab === TabKey.IAM && (
          <ApiKeysTable
            apiKeys={apiKeys}
            onOpenGenerateModal={() => setIsApiKeyModalOpen(true)}
            onRevokeKey={async (id) => {
              await revokeApiKey.mutateAsync(id);
            }}
          />
        )}

        {activeTab === TabKey.AUDIT && <AuditTable logs={auditLogs} />}

        {activeTab === TabKey.TEAM && (
          <TeamTable members={team} onOpenInviteModal={() => setIsInviteModalOpen(true)} />
        )}

        {activeTab === TabKey.SETTINGS && <JwksViewer jwks={jwks} oidc={oidc} />}

        <PortalFooter />
      </main>

      {/* Global Command Dialog & Tenant Creation Modal */}
      <CommandDialog
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNavigateTab={setActiveTab}
      />

      <TenantModal
        isOpen={isNewTenantOpen}
        onClose={() => setIsNewTenantOpen(false)}
        onCreateTenant={() => {}}
      />

      {/* Slide-overs & Operations Modals */}
      <RegisterAppModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSubmit={async (payload) => createApp.mutateAsync(payload)}
        onSuccess={() => {
          setIsRegisterOpen(false);
          queryClient.invalidateQueries({ queryKey: appsQueryKey() });
        }}
      />

      <AppSettingsDrawer
        app={selectedAppForDrawer}
        isOpen={!!selectedAppForDrawer}
        onClose={() => setSelectedAppForDrawer(null)}
        onSave={async (id, payload) => {
          await updateAppSettings.mutateAsync({ id, payload });
        }}
      />

      <KillSwitchModal
        app={selectedAppForKillSwitch}
        isOpen={!!selectedAppForKillSwitch}
        onClose={() => setSelectedAppForKillSwitch(null)}
        onConfirm={async (id, nextState, maintenanceNote) => {
          await toggleKillSwitch.mutateAsync({ id, nextState, maintenanceNote });
        }}
      />

      <ApiKeyModal
        apps={apps}
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSuccess={() => {
          setIsApiKeyModalOpen(false);
          queryClient.invalidateQueries({ queryKey: apiKeysQueryKey() });
        }}
      />

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={() => {
          setIsInviteModalOpen(false);
          queryClient.invalidateQueries({ queryKey: teamMembersQueryKey() });
        }}
      />
    </div>
  );
}
