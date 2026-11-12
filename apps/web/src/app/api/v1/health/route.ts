/**
 * @file apps/web/src/app/api/v1/health/route.ts
 * @description Health probe route handler for DevLab Portal Web frontend.
 * @module @devlab/portal-web/api/v1/health
 */

import { NextResponse } from "next/server";
import { APP_VERSION } from "@/lib/constants/version";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "ok",
    service: "devlab-portal-web",
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
  });
}
