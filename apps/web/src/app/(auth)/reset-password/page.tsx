/**
 * @file apps/web/src/app/(auth)/reset-password/page.tsx
 * @description Server component entry point for setting account password.
 * Adheres strictly to the pure SSR page wrapper invariant.
 * @module @devlab/portal-web/app/(auth)/reset-password
 */

import type { Metadata } from "next";
import { ResetPasswordView } from "@/features/auth";
import { UI_COPY } from "@/lib/ui-copy";

export const metadata: Metadata = {
  title: UI_COPY.AUTH.RESET_PASSWORD.TITLE,
  description: UI_COPY.AUTH.RESET_PASSWORD.DESCRIPTION,
};

export default function ResetPasswordPage(): React.JSX.Element {
  return <ResetPasswordView />;
}
