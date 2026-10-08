/**
 * @file apps/web/src/components/ApiKeysTable.tsx
 * @description Table displaying active and revoked API keys with revocation triggers.
 * @module @devlab/portal-web/components
 */

"use client";

import React from "react";
import { Trash2, Plus, Shield } from "lucide-react";
import type { ApiKey } from "../lib/api-client";

interface ApiKeysTableProps {
  keys: ApiKey[];
  onOpenCreateModal: () => void;
  onRevokeKey: (id: string) => Promise<void>;
}

export function ApiKeysTable({ keys, onOpenCreateModal, onRevokeKey }: ApiKeysTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">M2M Scoped API Keys</h2>
          <p className="text-xs text-slate-400">
            Cryptographic SHA-256 credentials for microservices and autonomous workers
          </p>
        </div>
        <button
          onClick={onOpenCreateModal}
          className="flex items-center space-x-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" />
          <span>Create API Key</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a]/80 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-900/50 text-slate-400">
            <tr>
              <th className="px-6 py-3.5 font-semibold">Key Identifier</th>
              <th className="px-6 py-3.5 font-semibold">Name</th>
              <th className="px-6 py-3.5 font-semibold">Granted Scopes</th>
              <th className="px-6 py-3.5 font-semibold">Rate Limit</th>
              <th className="px-6 py-3.5 font-semibold">Status</th>
              <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {keys.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No API keys registered yet. Click &quot;Create API Key&quot; to issue your first
                  credential.
                </td>
              </tr>
            ) : (
              keys.map((k) => (
                <tr key={k.id} className="hover:bg-slate-900/40">
                  <td className="px-6 py-4 font-mono font-medium text-emerald-400">
                    {k.keyPrefix}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{k.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {k.scopes.map((s) => (
                        <span
                          key={s}
                          className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono">{k.rateLimitRpm} RPM</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium border ${
                        k.isRevoked
                          ? "bg-red-500/10 border-red-500/20 text-red-400"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {k.isRevoked ? "Revoked" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!k.isRevoked && (
                      <button
                        onClick={() => onRevokeKey(k.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                        title="Revoke Key"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
