/**
 * @file apps/web/src/app/layout.tsx
 * @description Root layout for the DevLab Portal Control Plane web application.
 * @module @devlab/portal-web
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevLab Portal — Ecosystem Control Plane",
  description: "Unified IAM, Kill-Switch, and App Launcher for DevLab Micro-Frontend Swarms",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" data-brand="portal" data-theme="portal">
      <body className="bg-background text-foreground selection:bg-primary selection:text-primary-foreground min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
