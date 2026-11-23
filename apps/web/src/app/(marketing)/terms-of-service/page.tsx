import type { Metadata } from "next";
import { Sparkles, FileText } from "lucide-react";
import { buildCanonicalUrl, PORTAL_METADATA } from "@/lib/constants/seo.constants";

/**
 * @file apps/web/src/app/(marketing)/terms-of-service/page.tsx
 * @description Standard terms of service governing access to DevLab Portal and API endpoints.
 * @module @devlab/portal-web/app/marketing/terms-of-service
 */

export const metadata: Metadata = {
  title: "Terms of Service | DevLab Portal",
  description:
    "Terms and conditions governing the use of DevLab Portal control plane and developer identity authority.",
  alternates: {
    canonical: buildCanonicalUrl("/terms-of-service"),
  },
  openGraph: {
    title: "Terms of Service | DevLab Portal",
    description:
      "Terms and conditions governing the use of DevLab Portal control plane and developer identity authority.",
    url: buildCanonicalUrl("/terms-of-service"),
    siteName: PORTAL_METADATA.SITE_NAME,
    images: [{ url: PORTAL_METADATA.OG_IMAGE }],
  },
};

export default function TermsOfServicePage(): React.JSX.Element {
  return (
    <div style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <div className="portal-mkt-container">
        <div className="portal-mkt-section-header" style={{ marginBottom: "2rem" }}>
          <div className="portal-mkt-badge-pill">
            <Sparkles size={14} />
            <span>Legal Agreement</span>
          </div>
          <h1 className="portal-mkt-section-title">Terms of Service</h1>
          <p className="portal-mkt-section-sub">
            Last Updated: November 2026. Standard governing guidelines for DevLab control plane
            operators.
          </p>
        </div>

        <div className="portal-mkt-card" style={{ maxWidth: 840, margin: "0 auto", gap: "1.5rem" }}>
          <div className="flex items-center gap-3">
            <FileText size={20} />
            <h2 className="portal-mkt-card-title" style={{ margin: 0 }}>
              1. Acceptance of Terms
            </h2>
          </div>
          <p className="portal-mkt-card-desc">
            By accessing or operating the DevLab Portal, issuing API keys, or validating RS256 OIDC
            tokens via JWKS, you agree to comply with and be bound by these Terms of Service.
          </p>

          <h3 className="portal-mkt-card-title" style={{ fontSize: "1.125rem", margin: 0 }}>
            2. Responsible Use & Security Guarantees
          </h3>
          <p className="portal-mkt-card-desc">
            Operators must safeguard generated private credentials and API keys. Any attempt to
            exploit or circumvent the cryptographic authorization layer, flood the Redis bus, or
            perform unauthorized privilege escalation is strictly prohibited.
          </p>

          <h3 className="portal-mkt-card-title" style={{ fontSize: "1.125rem", margin: 0 }}>
            3. Software License
          </h3>
          <p className="portal-mkt-card-desc">
            DevLab Portal components and client SDKs are distributed under the MIT License unless
            explicitly designated otherwise.
          </p>

          <h3 className="portal-mkt-card-title" style={{ fontSize: "1.125rem", margin: 0 }}>
            4. Contact
          </h3>
          <p className="portal-mkt-card-desc">
            Direct legal and compliance inquiries to yuva.devlab@gmail.com.
          </p>
        </div>
      </div>
    </div>
  );
}
