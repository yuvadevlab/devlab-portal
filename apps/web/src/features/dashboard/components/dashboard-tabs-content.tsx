"use client";

/**
 * @file apps/web/src/features/dashboard/components/dashboard-tabs-content.tsx
 * @description Tab views switcher rendering domain panels based on the active navigation item.
 * @module @devlab/portal-web/features/dashboard/components/dashboard-tabs-content
 */

import React from "react";
import { AppMetrics, AppGrid } from "@/features/apps";
import { ApiKeysTable } from "@/features/iam";
import { AuditTable } from "@/features/audit";
import { TeamTable } from "@/features/team";
import { JwksViewer } from "@/features/settings";
import type {
  RegisteredApp,
  ApiKey,
  AuditLog,
  UserMember,
  JwksData,
  OpenIdConfig,
} from "@/lib/api-client";

interface DashboardTabsContentProps {
  activeTab: string;
  apps: RegisteredApp[];
  apiKeys: ApiKey[];
  auditLogs: AuditLog[];
  team: UserMember[];
  jwks: JwksData | null;
  oidc: OpenIdConfig | null;
  onOpenRegisterModal: () => void;
  onOpenSettings: (app: RegisteredApp) => void;
  onToggleKillSwitch: (app: RegisteredApp) => void;
  onNavigateTab: (tabKey: string) => void;
  onOpenGenerateModal: () => void;
  onRevokeKey: (id: string) => Promise<void>;
  onOpenInviteModal: () => void;
}

export const DashboardTabsContent: React.FC<DashboardTabsContentProps> = ({
  activeTab,
  apps,
  apiKeys,
  auditLogs,
  team,
  jwks,
  oidc,
  onOpenRegisterModal,
  onOpenSettings,
  onToggleKillSwitch,
  onNavigateTab,
  onOpenGenerateModal,
  onRevokeKey,
  onOpenInviteModal,
}) => {
  return (
    <main className="page-content">
      {activeTab === "apps" && (
        <>
          <AppMetrics apps={apps} />
          <AppGrid
            apps={apps}
            auditLogs={auditLogs}
            onOpenRegisterModal={onOpenRegisterModal}
            onOpenSettings={onOpenSettings}
            onToggleKillSwitch={onToggleKillSwitch}
            onNavigateTab={onNavigateTab}
          />
        </>
      )}

      {activeTab === "iam" && (
        <ApiKeysTable
          apiKeys={apiKeys}
          apps={apps}
          onOpenGenerateModal={onOpenGenerateModal}
          onRevokeKey={onRevokeKey}
        />
      )}

      {activeTab === "audit" && <AuditTable logs={auditLogs} />}

      {activeTab === "team" && (
        <TeamTable members={team} apps={apps} onOpenInviteModal={onOpenInviteModal} />
      )}

      {activeTab === "settings" && <JwksViewer jwks={jwks} oidc={oidc} />}
    </main>
  );
};
