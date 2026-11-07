/**
 * @file apps/web/src/middleware.ts
 * @description Next.js Edge middleware enforcing session authentication guards across the Control Plane.
 * @module @devlab/portal-web
 */

import { NextResponse, type NextRequest } from "next/server";
import { isJwtExpired } from "@/lib/jwt";
import { APP_ROUTES } from "@/lib/constants/routes";
import { CookieKey, AuthQueryParamKey } from "@/lib/constants/enums";

/** Public authentication routes accessible without an active session */
const AUTH_ROUTES: ReadonlySet<string> = new Set<string>([
  APP_ROUTES.LOGIN,
  APP_ROUTES.FORGOT_PASSWORD,
  APP_ROUTES.RESET_PASSWORD,
]);

/**
 * Edge middleware intercepting requests to enforce active session cookies.
 *
 * @param request - Inbound Next.js HTTP request
 * @returns NextResponse redirecting unauthenticated or authenticated users appropriately
 */
export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get(CookieKey.ACCESS_TOKEN);
  const tokenValue = tokenCookie?.value?.trim();
  const isAuthenticated = Boolean(tokenValue && !isJwtExpired(tokenValue));

  const isAuthRoute = AUTH_ROUTES.has(pathname);

  // Check for explicit re-authentication flags or upstream auth failure signals
  const promptParam = request.nextUrl.searchParams.get("prompt");
  const errorParam =
    request.nextUrl.searchParams.get(AuthQueryParamKey.ERROR) ||
    request.nextUrl.searchParams.get(AuthQueryParamKey.AUTH_ERROR) ||
    request.nextUrl.searchParams.get(AuthQueryParamKey.SESSION_EXPIRED);
  const isForceReAuth = promptParam === "login" || promptParam === "consent" || Boolean(errorParam);

  // 1. If explicit re-authentication is requested on auth routes, clear stale cookie and pass through to login form
  if (isAuthRoute && isForceReAuth) {
    const response = NextResponse.next();
    if (tokenCookie) {
      response.cookies.delete(CookieKey.ACCESS_TOKEN);
    }
    return response;
  }

  // 2. Unauthenticated or expired users attempting to access protected routes get redirected to /login
  if (!isAuthenticated && !isAuthRoute) {
    const loginUrl = new URL(APP_ROUTES.LOGIN, request.url);
    if (pathname !== APP_ROUTES.HOME) {
      loginUrl.searchParams.set(AuthQueryParamKey.REDIRECT, pathname);
    }
    const response = NextResponse.redirect(loginUrl);
    if (tokenCookie) {
      response.cookies.delete(CookieKey.ACCESS_TOKEN);
    }
    return response;
  }

  // 3. Authenticated users attempting to access /login, /forgot-password, etc.
  if (isAuthenticated && isAuthRoute) {
    const redirectParam = request.nextUrl.searchParams.get(AuthQueryParamKey.REDIRECT);
    // If navigating to an external application (SSO redirect), allow /login to render
    // so LoginForm can cryptographically verify the token against the backend and provide
    // the smooth handoff experience (or catch 401s and prompt for login without looping).
    if (redirectParam && redirectParam !== APP_ROUTES.HOME) {
      return NextResponse.next();
    }
    // Direct navigation to portal login while already authenticated redirects to portal dashboard
    const dashboardUrl = new URL(APP_ROUTES.HOME, request.url);
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
