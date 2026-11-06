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

  // 1. Unauthenticated or expired users attempting to access protected routes get redirected to /login
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

  // 2. Authenticated users attempting to access /login, /forgot-password, etc. get redirected to dashboard / or SSO return URL
  if (isAuthenticated && isAuthRoute) {
    const redirectParam = request.nextUrl.searchParams.get(AuthQueryParamKey.REDIRECT);
    if (redirectParam && redirectParam !== APP_ROUTES.HOME && tokenValue) {
      try {
        const targetUrl = new URL(redirectParam, request.url);
        targetUrl.searchParams.set(AuthQueryParamKey.TOKEN, tokenValue);
        return NextResponse.redirect(targetUrl);
      } catch {
        const sep = redirectParam.includes("?") ? "&" : "?";
        return NextResponse.redirect(
          new URL(
            `${redirectParam}${sep}${AuthQueryParamKey.TOKEN}=${encodeURIComponent(tokenValue)}`,
            request.url,
          ),
        );
      }
    }
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
