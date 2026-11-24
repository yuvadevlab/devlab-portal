/**
 * @file apps/web/src/app/robots.ts
 * @description Dynamic robots.txt configuration for DevLab Portal.
 * @module @devlab/portal-web/app
 */

import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants/seo.constants";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_CONFIG.BASE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/ecosystem",
        "/architecture",
        "/developers",
        "/about",
        "/login",
        "/forgot-password",
        "/privacy-policy",
        "/terms-of-service",
        "/icon.svg",
        "/opengraph-image",
      ],
      disallow: ["/api/", "/iam/", "/settings/", "/audit/", "/team/", "/apps/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
