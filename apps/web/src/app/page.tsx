/**
 * @file apps/web/src/app/page.tsx
 * @description Main dashboard orchestrating App Launcher, IAM Studio, and Audit Ledger.
 * @module @devlab/portal-web
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "../components/Navbar";
import { AppCard } from "../components/AppCard";
import { KillSwitchModal } from "../components/KillSwitchModal";
import { ApiKeysTable } from "../components/ApiKeysTable";
import { ApiKeyModal } from "../components/ApiKeyModal";
import { AuditTable } from "../components/AuditTable";
import { api, getSocket, RegisteredApp, ApiKey, AuditLog } from "../lib/api-client";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"launcher" | "iam" | "audit">("launcher");
  const [apps, setApps] = useState<RegisteredApp[]>([]);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [selectedKillSwitchApp, setSelectedKillSwitchApp] = useState<RegisteredApp | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  const refreshData = useCallback(async () => {
    try {
      const [fetchedApps, fetchedKeys, fetchedLogs] = await Promise.all([
        api.getApps(),
        api.getApiKeys(),
        api.getAuditLogs(),
      ]);
      setApps(fetchedApps);
      setKeys(fetchedKeys);
      setLogs(fetchedLogs);
    } catch (err) {
      console.error("Failed to load control plane data:", err);
    }
  }, []);

  useEffect(() => {
    refreshData();

    // Listen for live cluster events via Socket.IO
    const socket = getSocket();
    socket.on(
      "app.state.changed",
      (payload: { appId: string; isActive: boolean; maintenanceNote?: string }) => {
        setApps((prev) =>
          prev.map((app) =>
            app.appId === payload.appId
              ? { ...app, isActive: payload.isActive, maintenanceNote: payload.maintenanceNote }
              : app,
          ),
        );
        // Refresh audit logs upon state change
        api
          .getAuditLogs()
          .then(setLogs)
          .catch(() => {});
      },
    );

    return () => {
      socket.off("app.state.changed");
    };
  }, [refreshData]);

  const handleToggleKillSwitch = async (
    id: string,
    nextState: boolean,
    maintenanceNote?: string,
  ) => {
    await api.updateAppStatus(id, nextState, maintenanceNote);
    await refreshData();
  };

  const handleRevokeKey = async (id: string) => {
    await api.revokeApiKey(id);
    await refreshData();
  };

  const healthyCount = apps.filter((a) => a.isActive && a.healthStatus === "healthy").length;
  const offlineCount = apps.filter((a) => !a.isActive).length;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        {activeTab === "launcher" && (
          <div className="space-y-6">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/60 p-4">
                <span className="text-xs text-slate-400">Total Registered Apps</span>
                <p className="mt-1 text-2xl font-bold text-white">{apps.length}</p>
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <span className="text-xs text-emerald-400">Healthy & Routing</span>
                <p className="mt-1 text-2xl font-bold text-emerald-400">{healthyCount}</p>
              </div>
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                <span className="text-xs text-red-400">Kill-Switched / Offline</span>
                <p className="mt-1 text-2xl font-bold text-red-400">{offlineCount}</p>
              </div>
            </div>

            {/* Application Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  onToggleKillSwitch={(a) => setSelectedKillSwitchApp(a)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "iam" && (
          <ApiKeysTable
            keys={keys}
            onOpenCreateModal={() => setIsKeyModalOpen(true)}
            onRevokeKey={handleRevokeKey}
          />
        )}

        {activeTab === "audit" && <AuditTable logs={logs} />}
      </main>

      {/* Confirmation Modal for Kill-Switch */}
      {selectedKillSwitchApp && (
        <KillSwitchModal
          app={selectedKillSwitchApp}
          isOpen={true}
          onClose={() => setSelectedKillSwitchApp(null)}
          onConfirm={handleToggleKillSwitch}
        />
      )}

      {/* API Key Generation Modal */}
      <ApiKeyModal
        apps={apps}
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onSuccess={refreshData}
      />
    </div>
  );
}
