/**
 * @file apps/web/src/app/layout.tsx
 * @description Root SSR layout for the DevLab Portal Control Plane web application.
 * @module @devlab/portal-web
 */

import React from "react";
import type { Metadata } from "next";
import { ConfigProvider } from "@yuva-devlab/ui";
import { QueryProvider } from "@/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevLab Portal — Ecosystem Control Plane",
  description: "Unified IAM, Kill-Switch, and App Launcher for DevLab Micro-Frontend Swarms",
};

/**
 * Root Server Layout wrapping the portal application in Design System and TanStack Query providers.
 */
export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html
      lang="en"
      className="dark"
      data-brand="portal"
      data-theme="portal"
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground selection:bg-primary selection:text-primary-foreground min-h-screen antialiased">
        <ConfigProvider brand="portal" defaultTheme="dark" storageKey="portal-theme">
          <QueryProvider>{children}</QueryProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
