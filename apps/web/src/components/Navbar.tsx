/**
 * @file apps/web/src/components/Navbar.tsx
 * @description Top navigation bar displaying ecosystem brand and live control plane telemetry.
 * @module @devlab/portal-web/components
 */

"use client";

import React from "react";
import { ShieldCheck, Activity, Layers } from "lucide-react";

interface NavbarProps {
  activeTab: "launcher" | "iam" | "audit";
  onSelectTab: (tab: "launcher" | "iam" | "audit") => void;
}

export function Navbar({ activeTab, onSelectTab }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#090d16]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/20">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white">DevLab</span>
              <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-blue-400 border border-blue-500/20">
                Portal
              </span>
            </div>
            <p className="text-xs text-slate-400">Distributed Swarm Control Plane</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 rounded-xl bg-slate-900/80 p-1 border border-slate-800">
          <button
            onClick={() => onSelectTab("launcher")}
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "launcher"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>App Launcher</span>
          </button>
          <button
            onClick={() => onSelectTab("iam")}
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "iam"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>IAM Studio</span>
          </button>
          <button
            onClick={() => onSelectTab("audit")}
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "audit"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Audit Ledger</span>
          </button>
        </nav>

        {/* Live Cluster Pill */}
        <div className="flex items-center space-x-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span>Mesh Active</span>
        </div>
      </div>
    </header>
  );
}
