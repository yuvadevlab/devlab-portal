/**
 * @file apps/web/src/app/sitemap.ts
 * @description Dynamic sitemap.xml generator indexing all canonical public pages of DevLab Portal.
 * Excludes authenticated control plane routes to preserve administrative privacy.
 * @module @devlab/portal-web/app
 */

import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants/seo.constants";
import { APP_ROUTES } from "@/lib/constants/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.BASE_URL;
  const now = new Date();

  return [
    {
      url: `${baseUrl}${APP_ROUTES.HOME}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}${APP_ROUTES.ECOSYSTEM}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}${APP_ROUTES.ARCHITECTURE}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}${APP_ROUTES.DEVELOPERS}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}${APP_ROUTES.ABOUT}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}${APP_ROUTES.LOGIN}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}${APP_ROUTES.FORGOT_PASSWORD}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}${APP_ROUTES.PRIVACY_POLICY}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}${APP_ROUTES.TERMS_OF_SERVICE}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
