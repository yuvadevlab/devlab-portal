/**
 * @file apps/web/src/app/(auth)/forgot-password/page.tsx
 * @description Pure SSR Server Component route for password recovery.
 * @module @devlab/portal-web/app/(auth)/forgot-password
 */

import React from "react";
import type { Metadata } from "next";
import { ForgotPasswordView } from "@/features/auth";

export const metadata: Metadata = {
  title: "Forgot Password — DevLab Portal",
  description: "Reset your DevLab workspace account password",
};

export default function ForgotPasswordPage(): React.JSX.Element {
  return <ForgotPasswordView />;
}
