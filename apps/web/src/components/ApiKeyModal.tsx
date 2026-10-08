/**
 * @file apps/web/src/components/ApiKeyModal.tsx
 * @description Modal dialog for configuring scoped API credentials with one-time key display.
 * @module @devlab/portal-web/components
 */

"use client";

import React, { useState } from "react";
import { Copy, Check, Key, X, AlertTriangle } from "lucide-react";
import { api, RegisteredApp } from "../lib/api-client";

const AVAILABLE_SCOPES = [
  "orchestrai:executions:create",
  "orchestrai:executions:read",
  "finai:insights:read",
  "finai:transactions:write",
  "logs:ingest",
  "system:admin",
];

interface ApiKeyModalProps {
  apps: RegisteredApp[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApiKeyModal({ apps, isOpen, onClose, onSuccess }: ApiKeyModalProps) {
  const [name, setName] = useState("");
  const [appId, setAppId] = useState(apps[0]?.appId || "orchestrai");
  const [selectedScopes, setSelectedScopes] = useState<string[]>([AVAILABLE_SCOPES[0]!]);
  const [rateLimit, setRateLimit] = useState(600);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const toggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  };

  const handleCreate = async () => {
    if (!name) return;
    setLoading(true);
    try {
      const res = await api.createApiKey({
        name,
        appId,
        scopes: selectedScopes,
        rateLimitRpm: rateLimit,
      });
      setCreatedKey(res.rawKey);
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0f172a] p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-white">
            <Key className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-bold">Generate Scoped API Key</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {createdKey ? (
          <div className="py-6 space-y-4">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-300 flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Copy this key immediately. For security reasons, it will never be displayed again.
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                readOnly
                value={createdKey}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 font-mono text-xs text-emerald-400"
              />
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-300" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={onClose}
                className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-700"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Key Name</label>
              <input
                type="text"
                placeholder="e.g. Swarm Execution Worker"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Application Scope
              </label>
              <select
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                {apps.map((app) => (
                  <option key={app.id} value={app.appId}>
                    {app.name} ({app.appId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Granted Scopes
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto p-1">
                {AVAILABLE_SCOPES.map((scope) => (
                  <label
                    key={scope}
                    className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedScopes.includes(scope)}
                      onChange={() => toggleScope(scope)}
                      className="rounded border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <span className="font-mono">{scope}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!name || loading}
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate Key"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
