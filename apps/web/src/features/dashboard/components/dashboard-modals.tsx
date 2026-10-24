"use client";

/**
 * @file apps/web/src/features/dashboard/components/dashboard-modals.tsx
 * @description Master modals, slide-overs, and command drawers coordinator for portal dashboard.
 * @module @devlab/portal-web/features/dashboard/components/dashboard-modals
 */

import React from "react";
import { NavigationCommandDialog } from "@devlab-portal/ui";
import { TenantModal } from "@/components/layout";
import { UI_COPY } from "@/lib/ui-copy";
import {
  RegisterAppModal,
  AppSettingsDrawer,
  KillSwitchModal,
  type CreateAppPayload,
  type UpdateAppSettingsPayload,
} from "@/features/apps";
import { ApiKeyModal } from "@/features/iam";
import { InviteMemberModal } from "@/features/team";
import type { NavigationItem, RegisteredApp } from "@/lib/api-client";

interface DashboardModalsProps {
  navigationItems: NavigationItem[];
  apps: RegisteredApp[];
  isCommandOpen: boolean;
  isNewTenantOpen: boolean;
  isRegisterOpen: boolean;
  selectedAppForDrawer: RegisteredApp | null;
  selectedAppForKillSwitch: RegisteredApp | null;
  isApiKeyModalOpen: boolean;
  isInviteModalOpen: boolean;
  onCloseCommand: () => void;
  onCloseNewTenant: () => void;
  onCloseRegister: () => void;
  onCloseDrawer: () => void;
  onCloseKillSwitch: () => void;
  onCloseApiKeyModal: () => void;
  onCloseInviteModal: () => void;
  onNavigateTab: (tabKey: string) => void;
  onCreateTenant: (name: string) => Promise<void>;
  onCreateApp: (payload: CreateAppPayload) => Promise<{ clientSecret: string }>;
  onUpdateAppSettings: (id: string, payload: UpdateAppSettingsPayload) => Promise<void>;
  onToggleKillSwitch: (id: string, nextState: boolean, maintenanceNote?: string) => Promise<void>;
  onSuccessRegister: () => void;
  onSuccessApiKey: () => void;
  onSuccessInvite: () => void;
}

export const DashboardModals: React.FC<DashboardModalsProps> = ({
  navigationItems,
  apps,
  isCommandOpen,
  isNewTenantOpen,
  isRegisterOpen,
  selectedAppForDrawer,
  selectedAppForKillSwitch,
  isApiKeyModalOpen,
  isInviteModalOpen,
  onCloseCommand,
  onCloseNewTenant,
  onCloseRegister,
  onCloseDrawer,
  onCloseKillSwitch,
  onCloseApiKeyModal,
  onCloseInviteModal,
  onNavigateTab,
  onCreateTenant,
  onCreateApp,
  onUpdateAppSettings,
  onToggleKillSwitch,
  onSuccessRegister,
  onSuccessApiKey,
  onSuccessInvite,
}) => {
  return (
    <>
      {/* Global Command Dialog & Tenant Creation Modal */}
      <NavigationCommandDialog
        isOpen={isCommandOpen}
        onClose={onCloseCommand}
        onSelectItem={onNavigateTab}
        items={navigationItems}
        copy={{
          title: UI_COPY.COMMON.COMMAND.TITLE,
          description: UI_COPY.COMMON.COMMAND.DESCRIPTION,
          placeholder: UI_COPY.COMMON.COMMAND.PLACEHOLDER,
          emptyResult: UI_COPY.COMMON.COMMAND.EMPTY,
        }}
      />

      <TenantModal
        isOpen={isNewTenantOpen}
        onClose={onCloseNewTenant}
        onCreateTenant={onCreateTenant}
      />

      {/* Slide-overs & Operations Modals */}
      <RegisterAppModal
        isOpen={isRegisterOpen}
        onClose={onCloseRegister}
        onSubmit={onCreateApp}
        onSuccess={onSuccessRegister}
      />

      <AppSettingsDrawer
        app={selectedAppForDrawer}
        isOpen={!!selectedAppForDrawer}
        onClose={onCloseDrawer}
        onSave={onUpdateAppSettings}
      />

      <KillSwitchModal
        app={selectedAppForKillSwitch}
        isOpen={!!selectedAppForKillSwitch}
        onClose={onCloseKillSwitch}
        onConfirm={onToggleKillSwitch}
      />

      <ApiKeyModal
        apps={apps}
        isOpen={isApiKeyModalOpen}
        onClose={onCloseApiKeyModal}
        onSuccess={onSuccessApiKey}
      />

      <InviteMemberModal
        apps={apps}
        isOpen={isInviteModalOpen}
        onClose={onCloseInviteModal}
        onSuccess={onSuccessInvite}
      />
    </>
  );
};
