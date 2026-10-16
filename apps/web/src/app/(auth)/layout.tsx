/**
 * @file apps/web/src/app/(auth)/layout.tsx
 * @description Pure Server-rendered layout wrapper for authentication routes.
 * @module @devlab/portal-web/app/(auth)
 */

import React from "react";
import { Layers } from "lucide-react";

interface AuthLayoutProps {
  readonly children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps): React.JSX.Element {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-6">
      <div className="mb-8 flex items-center gap-2">
        <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg shadow-md">
          <Layers className="size-5" />
        </span>
        <span className="text-foreground text-xl font-bold tracking-tight">Yuva DevLab</span>
      </div>
      {children}
    </div>
  );
}
