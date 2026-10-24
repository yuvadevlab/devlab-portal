/**
 * @file apps/web/src/app/page.tsx
 * @description Master control plane entry point redirecting authenticated users to /apps.
 * Strictly adheres to Rule 7 (pure SSR wrapper, zero "use client").
 * @module @devlab/portal-web/app
 */

import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/server-auth";

export default async function Page(): Promise<never> {
  const auth = await getServerAuth();

  if (!auth) {
    redirect("/login");
  }

  redirect("/apps");
}
