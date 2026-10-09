/**
 * @file apps/web/src/components/layout/navbar.tsx
 * @description Top header bar with DevLab brand, live cluster heartbeat, and active session identity.
 * @module @devlab/portal-web/components/layout/navbar
 */

import React from "react";
import { ShieldCheck, Activity } from "lucide-react";
import { Badge } from "@yuva-devlab/ui";
import { UI_COPY } from "../../lib/ui-copy/index";

interface NavbarProps {
  healthyCount: number;
  totalApps: number;
}

export const Navbar: React.FC<NavbarProps> = ({ healthyCount, totalApps }) => {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg shadow-[var(--primary)]/20 font-bold text-lg">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-[var(--foreground)]">
                {UI_COPY.COMMON.BRAND.NAME}
              </span>
              <span className="font-medium text-xs text-[var(--muted-foreground)]">
                {UI_COPY.COMMON.BRAND.TITLE}
              </span>
              <Badge
                variant="outline"
                className="text-[10px] font-mono border-[var(--border)] text-[var(--muted-foreground)]"
              >
                {UI_COPY.COMMON.BRAND.VERSION}
              </Badge>
            </div>
            <p className="text-[11px] text-[var(--muted-foreground)] leading-none">
              {UI_COPY.COMMON.BRAND.SUBTITLE}
            </p>
          </div>
        </div>

        {/* Live cluster status & user identity */}
        <div className="flex items-center gap-4">
          {/* Heartbeat pill */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-[11px]">
              {healthyCount}/{totalApps} {UI_COPY.APPS.CARD.STATUS_ACTIVE}
            </span>
            <Activity className="h-3 w-3 text-emerald-400" />
          </div>

          {/* User profile capsule */}
          <div className="flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-xs">
              A
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-medium text-[var(--foreground)] leading-none">
                Platform Super Admin
              </p>
              <p className="text-[10px] font-mono text-[var(--muted-foreground)] leading-none mt-0.5">
                admin@devlab.internal
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
