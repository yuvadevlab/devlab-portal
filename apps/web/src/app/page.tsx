/**
 * @file apps/web/src/app/page.tsx
 * @description Master control plane dashboard orchestrating Apps, IAM, Audit, Team, and OIDC views.
 * @module @devlab/portal-web
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "../components/layout/navbar";
import { TabNav } from "../components/layout/tab-nav";
import { TabKey, AppStatus } from "../lib/constants/enums";
import { SOCKET_EVENTS } from "../lib/constants/routes";
import {
  api,
  getSocket,
  RegisteredApp,
  ApiKey,
  AuditLog,
  UserMember,
  JwksData,
  OpenIdConfig,
  CreateAppPayload,
  UpdateAppSettingsPayload,
} from "../lib/api-client";

import {
  AppMetrics,
  AppGrid,
  AppSettingsDrawer,
  KillSwitchModal,
  RegisterAppModal,
} from "../features/apps/index";
import { ApiKeysTable, ApiKeyModal } from "../features/iam/index";
import { AuditTable } from "../features/audit/index";
import { TeamTable, InviteMemberModal } from "../features/team/index";
import { JwksViewer } from "../features/settings/index";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabKey>(TabKey.APPS);
  const [apps, setApps] = useState<RegisteredApp[]>([]);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [team, setTeam] = useState<UserMember[]>([]);
  const [jwks, setJwks] = useState<JwksData | null>(null);
  const [oidc, setOidc] = useState<OpenIdConfig | null>(null);

  // Modal & Drawer visibility states
  const [selectedSettingsApp, setSelectedSettingsApp] = useState<RegisteredApp | null>(null);
  const [selectedKillSwitchApp, setSelectedKillSwitchApp] = useState<RegisteredApp | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const refreshData = useCallback(async () => {
    try {
      const [fetchedApps, fetchedKeys, fetchedLogs, fetchedTeam, fetchedJwks, fetchedOidc] =
        await Promise.all([
          api.getApps(),
          api.getApiKeys().catch(() => []),
          api.getAuditLogs().catch(() => []),
          api.getUsers().catch(() => []),
          api.getJwks().catch(() => null),
          api.getOpenIdConfig().catch(() => null),
        ]);

      setApps(fetchedApps);
      setKeys(fetchedKeys);
      setLogs(fetchedLogs);
      setTeam(fetchedTeam);
      setJwks(fetchedJwks);
      setOidc(fetchedOidc);
    } catch (err) {
      console.error("Failed to load control plane data:", err);
    }
  }, []);

  useEffect(() => {
    refreshData();

    // Subscribe to live cluster events via Socket.IO
    const socket = getSocket();
    const handleAppStateChanged = (payload: {
      appId: string;
      isActive: boolean;
      maintenanceNote?: string;
    }) => {
      setApps((prev) =>
        prev.map((app) =>
          app.appId === payload.appId
            ? { ...app, isActive: payload.isActive, maintenanceNote: payload.maintenanceNote }
            : app,
        ),
      );
      api
        .getAuditLogs()
        .then(setLogs)
        .catch(() => {});
    };

    socket.on(SOCKET_EVENTS.APP_STATE_CHANGED, handleAppStateChanged);
    return () => {
      socket.off(SOCKET_EVENTS.APP_STATE_CHANGED, handleAppStateChanged);
    };
  }, [refreshData]);

  // Action handlers
  const handleToggleKillSwitch = async (
    id: string,
    nextState: boolean,
    maintenanceNote?: string,
  ) => {
    await api.updateAppStatus(id, nextState, maintenanceNote);
    await refreshData();
  };

  const handleSaveSettings = async (id: string, payload: UpdateAppSettingsPayload) => {
    await api.updateAppSettings(id, payload);
    await refreshData();
  };

  const handleRegisterApp = async (payload: CreateAppPayload) => {
    const created = await api.createApp(payload);
    await refreshData();
    return created;
  };

  const handleRevokeKey = async (id: string) => {
    await api.revokeApiKey(id);
    await refreshData();
  };

  const healthyCount = apps.filter(
    (a) => a.isActive && a.healthStatus === AppStatus.HEALTHY,
  ).length;

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Navbar healthyCount={healthyCount} totalApps={apps.length} />
      <TabNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        appsCount={apps.length}
        keysCount={keys.length}
        auditCount={logs.length}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        {activeTab === TabKey.APPS && (
          <div>
            <AppMetrics apps={apps} />
            <AppGrid
              apps={apps}
              onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
              onOpenSettings={(app) => setSelectedSettingsApp(app)}
              onToggleKillSwitch={(app) => setSelectedKillSwitchApp(app)}
            />
          </div>
        )}

        {activeTab === TabKey.IAM && (
          <ApiKeysTable
            keys={keys}
            onOpenCreateModal={() => setIsKeyModalOpen(true)}
            onRevokeKey={handleRevokeKey}
          />
        )}

        {activeTab === TabKey.AUDIT && <AuditTable logs={logs} />}

        {activeTab === TabKey.TEAM && (
          <TeamTable members={team} onOpenInviteModal={() => setIsInviteModalOpen(true)} />
        )}

        {activeTab === TabKey.SETTINGS && <JwksViewer jwks={jwks} oidc={oidc} />}
      </main>

      {/* Slide-over App Settings Drawer */}
      <AppSettingsDrawer
        app={selectedSettingsApp}
        isOpen={Boolean(selectedSettingsApp)}
        onClose={() => setSelectedSettingsApp(null)}
        onSave={handleSaveSettings}
      />

      {/* Confirmation Modal for Kill-Switch */}
      <KillSwitchModal
        app={selectedKillSwitchApp}
        isOpen={Boolean(selectedKillSwitchApp)}
        onClose={() => setSelectedKillSwitchApp(null)}
        onConfirm={handleToggleKillSwitch}
      />

      {/* Application Registration Wizard */}
      <RegisterAppModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSubmit={handleRegisterApp}
        onSuccess={refreshData}
      />

      {/* API Key Generation Modal */}
      <ApiKeyModal
        apps={apps}
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onSuccess={refreshData}
      />

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={refreshData}
      />
    </div>
  );
}
