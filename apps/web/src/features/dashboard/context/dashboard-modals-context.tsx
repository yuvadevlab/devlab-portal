"use client";

/**
 * @file apps/web/src/features/dashboard/context/dashboard-modals-context.tsx
 * @description React Context providing global modal actions across all dashboard pages.
 * @module @devlab/portal-web/features/dashboard/context
 */

import { createContext, useContext } from "react";
import type { RegisteredApp } from "@/lib/api-client";

export interface DashboardModalsContextValue {
  openCommandPalette: () => void;
  openNewTenant: () => void;
  openRegisterModal: () => void;
  openSettings: (app: RegisteredApp) => void;
  openKillSwitch: (app: RegisteredApp) => void;
  openApiKeyModal: () => void;
  openInviteModal: () => void;
  onNavigateTab: (tabKey: string) => void;
}

export const DashboardModalsContext = createContext<DashboardModalsContextValue | null>(null);

export function useDashboardModals(): DashboardModalsContextValue {
  const context = useContext(DashboardModalsContext);
  if (!context) {
    throw new Error("useDashboardModals must be used within a DashboardModalsProvider");
  }
  return context;
}
