"use client";

/**
 * @file apps/web/src/features/dashboard/components/portal-dashboard.tsx
 * @description Master client component coordinating tabs, TanStack Query hooks, and real-time sockets.
 * @module @devlab/portal-web/features/dashboard/components/portal-dashboard
 */

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Navbar, TabNav } from "@/components/layout";
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

  // TanStack Query hooks subscribing to prehydrated server state
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

  // Dialog & Slide-over states
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedAppForDrawer, setSelectedAppForDrawer] = useState<RegisteredApp | null>(null);
  const [selectedAppForKillSwitch, setSelectedAppForKillSwitch] = useState<RegisteredApp | null>(
    null,
  );
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Real-time WebSocket event synchronization
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

  const activeAppsCount = apps.filter((a) => a.isActive).length;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar healthyCount={activeAppsCount} totalApps={apps.length} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <TabNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          appsCount={apps.length}
          keysCount={apiKeys.length}
          auditCount={auditLogs.length}
        />

        <div className="mt-8">
          {activeTab === TabKey.APPS && (
            <div className="space-y-8">
              <AppMetrics apps={apps} />
              <AppGrid
                apps={apps}
                onOpenRegisterModal={() => setIsRegisterOpen(true)}
                onOpenSettings={(app) => setSelectedAppForDrawer(app)}
                onToggleKillSwitch={(app) => setSelectedAppForKillSwitch(app)}
              />
            </div>
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
        </div>
      </main>

      {/* Slide-overs & Modals */}
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
