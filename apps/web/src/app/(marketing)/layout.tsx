import React from "react";
import "@/features/marketing/styles/marketing.css";
import { PublicHeader, PublicFooter } from "@/features/marketing";

/**
 * @file apps/web/src/app/(marketing)/layout.tsx
 * @description Master layout for public marketing, SEO, and ecosystem showcase pages.
 * @module @devlab/portal-web/app/marketing
 */

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="portal-mkt-page">
      <PublicHeader />
      <main style={{ flex: 1 }}>{children}</main>
      <PublicFooter />
    </div>
  );
}
