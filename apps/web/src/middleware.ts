/**
 * @file apps/web/src/middleware.ts
 * @description Next.js Edge middleware enforcing session authentication guards across the Control Plane.
 * @module @devlab/portal-web
 */

import { NextResponse, type NextRequest } from "next/server";
import { isJwtExpired } from "@/lib/jwt";

/** Public authentication routes accessible without an active session */
const AUTH_ROUTES = new Set(["/login", "/forgot-password", "/reset-password"]);

/**
 * Edge middleware intercepting requests to enforce active session cookies.
 *
 * @param request - Inbound Next.js HTTP request
 * @returns NextResponse redirecting unauthenticated or authenticated users appropriately
 */
export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get("devlab_access_token");
  const tokenValue = tokenCookie?.value?.trim();
  const isAuthenticated = Boolean(tokenValue && !isJwtExpired(tokenValue));

  const isAuthRoute = AUTH_ROUTES.has(pathname);

  // 1. Unauthenticated or expired users attempting to access protected routes get redirected to /login
  if (!isAuthenticated && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    const response = NextResponse.redirect(loginUrl);
    if (tokenCookie) {
      response.cookies.delete("devlab_access_token");
    }
    return response;
  }

  // 2. Authenticated users attempting to access /login, /forgot-password, etc. get redirected to dashboard /
  if (isAuthenticated && isAuthRoute) {
    const dashboardUrl = new URL("/", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

/**
 * Configure path matching rules to exclude internal Next.js assets, static files, and public images.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (*.png, *.svg, *.jpg, *.jpeg, *.gif, *.webp)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
