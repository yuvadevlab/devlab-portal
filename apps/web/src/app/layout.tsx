/**
 * @file apps/web/src/app/layout.tsx
 * @description Root SSR layout for the DevLab Portal Control Plane web application.
 * @module @devlab/portal-web
 */

import React from "react";
import type { Metadata, Viewport } from "next";
import { ConfigProvider, Toaster } from "@devlab-portal/ui";
import { QueryProvider } from "@/providers";
import { AuthToastListener } from "@/features/auth";
import { appearanceScript } from "@/lib/appearance-script";
import { UI_COPY } from "@/lib/ui-copy";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://devlab-portal-self.vercel.app";

export const viewport: Viewport = {
  themeColor: "#5ed8a9",
};

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: UI_COPY.COMMON.METADATA.TITLE,
    template: UI_COPY.COMMON.METADATA.TITLE_TEMPLATE,
  },
  description: UI_COPY.COMMON.METADATA.DESCRIPTION,
  applicationName: UI_COPY.COMMON.BRAND.APP_NAME,
  authors: [{ name: UI_COPY.COMMON.METADATA.AUTHOR, url: UI_COPY.COMMON.METADATA.AUTHOR_URL }],
  creator: UI_COPY.COMMON.METADATA.AUTHOR,
  publisher: UI_COPY.COMMON.METADATA.AUTHOR,
  keywords: [...UI_COPY.COMMON.METADATA.KEYWORDS],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: appUrl,
    siteName: UI_COPY.COMMON.METADATA.SITE_NAME,
    title: UI_COPY.COMMON.METADATA.OG_TITLE,
    description: UI_COPY.COMMON.METADATA.OG_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: UI_COPY.COMMON.METADATA.OG_TITLE,
    description: UI_COPY.COMMON.METADATA.OG_DESCRIPTION,
    creator: "@yuvadevlab",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/**
 * Root Server Layout wrapping the portal application in Design System and TanStack Query providers.
 */
export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html lang="en" data-brand="portal" data-theme="portal" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: appearanceScript }} />
      </head>
      <body className="portal-root">
        <ConfigProvider brand="portal" defaultTheme="dark" storageKey="portal-theme">
          <QueryProvider>
            {children}
            <Toaster position="bottom-right" closeButton />
            <AuthToastListener />
          </QueryProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
