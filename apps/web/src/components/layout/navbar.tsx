"use client";

/**
 * @file apps/web/src/components/layout/navbar.tsx
 * @description Top header bar with DevLab brand, live cluster heartbeat, and active session identity.
 * @module @devlab/portal-web/components/layout/navbar
 */

import React from "react";
import { ShieldCheck, Activity } from "lucide-react";
import { Badge } from "@yuva-devlab/ui";
import { UI_COPY } from "@/lib/ui-copy";

interface NavbarProps {
  healthyCount: number;
  totalApps: number;
}

export const Navbar: React.FC<NavbarProps> = ({ healthyCount, totalApps }) => {
  return (
    <header className="border-border bg-card/90 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground shadow-primary/20 flex size-10 items-center justify-center rounded-xl text-lg font-bold shadow-lg">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-foreground text-lg font-extrabold tracking-tight">
                {UI_COPY.COMMON.BRAND.NAME}
              </span>
              <span className="text-muted-foreground text-xs font-medium">
                {UI_COPY.COMMON.BRAND.TITLE}
              </span>
              <Badge
                variant="outline"
                className="border-border text-muted-foreground font-mono text-[10px]"
              >
                {UI_COPY.COMMON.BRAND.VERSION}
              </Badge>
            </div>
            <p className="text-muted-foreground text-[11px] leading-none">
              {UI_COPY.COMMON.BRAND.SUBTITLE}
            </p>
          </div>
        </div>

        {/* Live cluster status & user identity */}
        <div className="flex items-center gap-4">
          {/* Heartbeat pill */}
          <div className="border-success/20 bg-success/10 text-success hidden items-center gap-2 rounded-full border px-3 py-1 text-xs sm:flex">
            <span className="relative flex size-2">
              <span className="bg-success absolute inline-flex size-full animate-ping rounded-full opacity-75" />
              <span className="bg-success relative inline-flex size-2 rounded-full" />
            </span>
            <span className="font-mono text-[11px]">
              {healthyCount}/{totalApps} {UI_COPY.APPS.CARD.STATUS_ACTIVE}
            </span>
            <Activity className="text-success size-3" />
          </div>

          {/* User profile capsule */}
          <div className="border-border bg-background flex items-center gap-2.5 rounded-full border px-3 py-1.5">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full text-xs font-bold">
              A
            </div>
            <div className="hidden text-left md:block">
              <p className="text-foreground text-xs leading-none font-medium">
                Platform Super Admin
              </p>
              <p className="text-muted-foreground mt-0.5 font-mono text-[10px] leading-none">
                admin@devlab.internal
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
