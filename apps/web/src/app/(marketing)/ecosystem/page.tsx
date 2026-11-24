import type { Metadata } from "next";
import { buildCanonicalUrl, PORTAL_METADATA } from "@/lib/constants/seo.constants";
import { EcosystemFleetSection, CtaBannerSection } from "@/features/marketing";

/**
 * @file apps/web/src/app/(marketing)/ecosystem/page.tsx
 * @description Dedicated ecosystem fleet showcase page detailing all connected AI and developer tools.
 * @module @devlab/portal-web/app/marketing/ecosystem
 */

export const metadata: Metadata = {
  title: "Application Fleet & Micro-Frontend Ecosystem | DevLab Portal",
  description:
    "Explore the unified DevLab fleet: FinAI, OrchestrAI, DevLab Guard, DevLab Logs, IncidentAI, and DevLab Portal.",
  alternates: {
    canonical: buildCanonicalUrl("/ecosystem"),
  },
  openGraph: {
    title: "Application Fleet & Micro-Frontend Ecosystem | DevLab Portal",
    description:
      "Explore the unified DevLab fleet: FinAI, OrchestrAI, DevLab Guard, DevLab Logs, IncidentAI, and DevLab Portal.",
    url: buildCanonicalUrl("/ecosystem"),
    siteName: PORTAL_METADATA.SITE_NAME,
    images: [{ url: PORTAL_METADATA.OG_IMAGE }],
  },
};

export default function EcosystemPage(): React.JSX.Element {
  return (
    <div style={{ paddingTop: "2rem" }}>
      <EcosystemFleetSection />
      <CtaBannerSection />
    </div>
  );
}
