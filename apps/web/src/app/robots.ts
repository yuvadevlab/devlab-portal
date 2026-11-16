/**
 * @file apps/web/src/app/robots.ts
 * @description Dynamic robots.txt configuration for DevLab Portal.
 * @module @devlab/portal-web/app
 */

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://devlab-portal-self.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/forgot-password"],
      disallow: ["/api/", "/iam/", "/settings/", "/audit/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
