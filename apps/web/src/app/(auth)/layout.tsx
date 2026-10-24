/**
 * @file apps/web/src/app/(auth)/layout.tsx
 * @description Pure Server-rendered layout wrapper for authentication routes.
 * @module @devlab/portal-web/app/(auth)
 */

import React from "react";

interface AuthLayoutProps {
  readonly children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps): React.JSX.Element {
  return <>{children}</>;
}
