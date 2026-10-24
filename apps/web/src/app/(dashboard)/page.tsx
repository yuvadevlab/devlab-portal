/**
 * @file apps/web/src/app/(dashboard)/page.tsx
 * @description Dashboard root entry redirecting seamlessly to default /apps route.
 * @module @devlab/portal-web/app/(dashboard)/page
 */

import { redirect } from "next/navigation";

export default function DashboardRootPage(): never {
  redirect("/apps");
}
