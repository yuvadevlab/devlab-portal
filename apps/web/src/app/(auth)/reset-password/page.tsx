/**
 * @file apps/web/src/app/(auth)/reset-password/page.tsx
 * @description Server component entry point for setting account password.
 * Adheres strictly to the pure SSR page wrapper invariant.
 * @module @devlab/portal-web/app/(auth)/reset-password
 */

import type { Metadata } from "next";
import { ResetPasswordView } from "@/features/auth";

export const metadata: Metadata = {
  title: "Set Password | DevLab Portal",
  description: "Set or reset your DevLab workspace credentials.",
};

export default function ResetPasswordPage(): React.JSX.Element {
  return <ResetPasswordView />;
}
