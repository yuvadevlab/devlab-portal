/**
 * @file apps/web/src/app/(auth)/login/page.tsx
 * @description Pure SSR Server Component route for workspace sign-in.
 * @module @devlab/portal-web/app/(auth)/login
 */

import React from "react";
import type { Metadata } from "next";
import { LoginView } from "@/features/auth";
import { UI_COPY } from "@/lib/ui-copy";

export const metadata: Metadata = {
  title: UI_COPY.AUTH.LOGIN.TITLE,
  description: UI_COPY.AUTH.LOGIN.DESCRIPTION,
};

export default function LoginPage(): React.JSX.Element {
  return <LoginView />;
}
