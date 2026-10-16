/**
 * @file apps/web/src/app/(auth)/login/page.tsx
 * @description Pure SSR Server Component route for workspace sign-in.
 * @module @devlab/portal-web/app/(auth)/login
 */

import React from "react";
import type { Metadata } from "next";
import { LoginView } from "@/features/auth";

export const metadata: Metadata = {
  title: "Sign In — DevLab Portal",
  description: "Sign in to your DevLab workspace control plane",
};

export default function LoginPage(): React.JSX.Element {
  return <LoginView />;
}
