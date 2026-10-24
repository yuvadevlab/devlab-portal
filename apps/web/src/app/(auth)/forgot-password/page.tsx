/**
 * @file apps/web/src/app/(auth)/forgot-password/page.tsx
 * @description Pure SSR Server Component route for password recovery.
 * @module @devlab/portal-web/app/(auth)/forgot-password
 */

import React from "react";
import type { Metadata } from "next";
import { ForgotPasswordView } from "@/features/auth";
import { UI_COPY } from "@/lib/ui-copy";

export const metadata: Metadata = {
  title: UI_COPY.AUTH.FORGOT_PASSWORD.TITLE,
  description: UI_COPY.AUTH.FORGOT_PASSWORD.DESCRIPTION,
};

export default function ForgotPasswordPage(): React.JSX.Element {
  return <ForgotPasswordView />;
}
