/**
 * @file apps/web/src/components/KillSwitchModal.tsx
 * @description Modal dialog confirming emergency application kill-switch state toggle.
 * @module @devlab/portal-web/components
 */

"use client";

import React, { useState } from "react";
import { AlertTriangle, Power, X } from "lucide-react";
import type { RegisteredApp } from "../lib/api-client";

interface KillSwitchModalProps {
  app: RegisteredApp;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (appId: string, nextState: boolean, maintenanceNote?: string) => Promise<void>;
}

export function KillSwitchModal({ app, isOpen, onClose, onConfirm }: KillSwitchModalProps) {
  const [maintenanceNote, setMaintenanceNote] = useState(app.maintenanceNote || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nextState = !app.isActive;

  if (!isOpen) return null;

  const handleAction = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(app.id, nextState, maintenanceNote);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0f172a] p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-xl ${nextState ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
            >
              {nextState ? <Power className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            </div>
            <h3 className="text-lg font-semibold text-white">
              {nextState ? "Activate Service" : "Emergency Kill-Switch"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <p className="text-sm text-slate-300">
            You are about to {nextState ? "restore" : "sever"} traffic for{" "}
            <span className="font-semibold text-white">{app.name}</span> ({app.appId}).
          </p>

          {!nextState && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
              ⚠️ Deactivating will immediately return HTTP 503 and broadcast downtime events across
              the DevLab mesh.
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Maintenance Note (Visible to operators & clients)
            </label>
            <input
              type="text"
              value={maintenanceNote}
              onChange={(e) => setMaintenanceNote(e.target.value)}
              placeholder="e.g. Upgrading database schemas..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleAction}
            disabled={isSubmitting}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all ${
              nextState
                ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30"
                : "bg-red-600 hover:bg-red-500 shadow-red-600/30"
            }`}
          >
            <Power className="h-4 w-4" />
            <span>
              {isSubmitting
                ? "Updating..."
                : nextState
                  ? "Confirm Activation"
                  : "Deactivate Service"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
