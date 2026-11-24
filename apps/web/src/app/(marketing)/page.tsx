import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/server-auth";
import { ROUTES } from "@/lib/constants/routes";
import {
  PORTAL_METADATA,
  buildCanonicalUrl,
  getSoftwareApplicationJsonLd,
} from "@/lib/constants/seo.constants";
import {
  HeroSection,
  EcosystemFleetSection,
  ArchitectureSection,
  WorkflowSection,
  FaqSection,
  CtaBannerSection,
} from "@/features/marketing";

/**
 * @file apps/web/src/app/(marketing)/page.tsx
 * @description Public marketing and capability landing page for DevLab Portal.
 * Redirects authenticated operators to /apps, while serving rich indexable SEO content to visitors and search engines.
 * @module @devlab/portal-web/app/marketing
 */

export const metadata: Metadata = {
  title: PORTAL_METADATA.TITLE,
  description: PORTAL_METADATA.DESCRIPTION,
  alternates: {
    canonical: buildCanonicalUrl("/"),
  },
  openGraph: {
    title: PORTAL_METADATA.OG_TITLE,
    description: PORTAL_METADATA.OG_DESCRIPTION,
    url: buildCanonicalUrl("/"),
    siteName: PORTAL_METADATA.SITE_NAME,
    images: [
      {
        url: PORTAL_METADATA.OG_IMAGE,
        width: 1200,
        height: 630,
        alt: PORTAL_METADATA.TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PORTAL_METADATA.OG_TITLE,
    description: PORTAL_METADATA.OG_DESCRIPTION,
    images: [PORTAL_METADATA.OG_IMAGE],
  },
};

export default async function MarketingHomePage(): Promise<React.JSX.Element> {
  const auth = await getServerAuth();

  if (auth) {
    redirect(ROUTES.APPS);
  }

  const softwareJsonLd = getSoftwareApplicationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <HeroSection />
      <EcosystemFleetSection />
      <ArchitectureSection />
      <WorkflowSection />
      <FaqSection />
      <CtaBannerSection />
    </>
  );
}
