/**
 * @file apps/web/src/app/(auth)/login/page.tsx
 * @description Pure SSR Server Component route for workspace sign-in.
 * @module @devlab/portal-web/app/(auth)/login
 */

import React from "react";
import type { Metadata } from "next";
import { LoginView } from "@/features/auth";
import { UI_COPY } from "@/lib/ui-copy";

export const metadata: Metadata = {
  title: UI_COPY.AUTH.LOGIN.TITLE,
  description: UI_COPY.AUTH.LOGIN.DESCRIPTION,
  openGraph: {
    title: UI_COPY.AUTH.LOGIN.OG_TITLE,
    description: UI_COPY.AUTH.LOGIN.OG_DESCRIPTION,
    url: "/login",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: UI_COPY.AUTH.LOGIN.OG_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: UI_COPY.AUTH.LOGIN.OG_TITLE,
    description: UI_COPY.AUTH.LOGIN.OG_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default function LoginPage(): React.JSX.Element {
  return <LoginView />;
}
