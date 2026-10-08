/**
 * @file apps/web/src/components/AuditTable.tsx
 * @description Immutable security audit ledger table inspecting administrative operations.
 * @module @devlab/portal-web/components
 */

"use client";

import React, { useState } from "react";
import { ShieldAlert, FileText, ChevronDown, ChevronRight } from "lucide-react";
import type { AuditLog } from "../lib/api-client";

interface AuditTableProps {
  logs: AuditLog[];
}

export function AuditTable({ logs }: AuditTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white">Security Audit Ledger</h2>
        <p className="text-xs text-slate-400">
          Append-only, strictly immutable record of control plane events and kill-switch actions
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a]/80 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-900/50 text-slate-400">
            <tr>
              <th className="px-6 py-3.5 font-semibold">Action</th>
              <th className="px-6 py-3.5 font-semibold">Actor</th>
              <th className="px-6 py-3.5 font-semibold">Target Resource</th>
              <th className="px-6 py-3.5 font-semibold">Timestamp</th>
              <th className="px-6 py-3.5 font-semibold text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  No audit logs recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const isKillSwitch =
                  log.action.includes("APP_DEACTIVATED") || log.action.includes("APP_ACTIVATED");
                const isExpanded = expandedId === log.id;

                return (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-slate-900/40">
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center space-x-1.5 rounded-md px-2.5 py-1 text-xs font-semibold border ${
                            isKillSwitch
                              ? "bg-red-500/10 border-red-500/30 text-red-400"
                              : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                          }`}
                        >
                          {isKillSwitch ? (
                            <ShieldAlert className="h-3 w-3" />
                          ) : (
                            <FileText className="h-3 w-3" />
                          )}
                          <span>{log.action}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-white">
                        {log.actor?.email || log.actorId}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-400">
                        {log.targetType}:{log.targetId}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => toggleExpand(log.id)}
                          className="rounded-lg p-1 text-slate-400 hover:text-white"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && log.metadata && (
                      <tr className="bg-slate-900/70">
                        <td colSpan={5} className="px-6 py-3">
                          <pre className="rounded-xl border border-slate-800 bg-[#090d16] p-3 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
