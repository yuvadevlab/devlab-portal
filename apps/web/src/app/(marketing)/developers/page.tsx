import type { Metadata } from "next";
import { Sparkles, Code2, Terminal, Cpu } from "lucide-react";
import { buildCanonicalUrl, PORTAL_METADATA } from "@/lib/constants/seo.constants";
import { CtaBannerSection } from "@/features/marketing";

/**
 * @file apps/web/src/app/(marketing)/developers/page.tsx
 * @description Developer integration documentation, SDK guides, and endpoint references.
 * @module @devlab/portal-web/app/marketing/developers
 */

export const metadata: Metadata = {
  title: "Developer Integration & API Specifications | DevLab Portal",
  description:
    "Quickstart guides, SDK documentation, and endpoint references for integrating with DevLab Portal identity and token authority.",
  alternates: {
    canonical: buildCanonicalUrl("/developers"),
  },
  openGraph: {
    title: "Developer Integration & API Specifications | DevLab Portal",
    description:
      "Quickstart guides, SDK documentation, and endpoint references for integrating with DevLab Portal identity and token authority.",
    url: buildCanonicalUrl("/developers"),
    siteName: PORTAL_METADATA.SITE_NAME,
    images: [{ url: PORTAL_METADATA.OG_IMAGE }],
  },
};

export default function DevelopersPage(): React.JSX.Element {
  return (
    <div style={{ paddingTop: "2rem" }}>
      <section className="portal-mkt-container">
        <div className="portal-mkt-section-header" style={{ marginBottom: "2rem" }}>
          <div className="portal-mkt-badge-pill">
            <Sparkles size={14} />
            <span>Developer Ecosystem</span>
          </div>
          <h1 className="portal-mkt-section-title">Developer Integration & SDK Architecture</h1>
          <p className="portal-mkt-section-sub">
            Integrate downstream apps, AI agent swarms, and background workers with single sign-on
            and token validation.
          </p>
        </div>
      </section>

      <section className="portal-mkt-section portal-mkt-section--bordered">
        <div className="portal-mkt-container">
          <div className="portal-mkt-grid-3">
            <div className="portal-mkt-card">
              <div className="portal-mkt-card-header">
                <div className="portal-mkt-card-icon">
                  <Code2 size={20} />
                </div>
                <span className="portal-mkt-brand-badge">NPM Package</span>
              </div>
              <h3 className="portal-mkt-card-title">@yuva-devlab/auth-client</h3>
              <p className="portal-mkt-card-desc">
                High-performance universal client library for Node.js, Next.js, and edge workers
                with automatic token refresh.
              </p>
              <div className="portal-mkt-card-tags">
                <span className="portal-mkt-card-tag">TypeScript</span>
                <span className="portal-mkt-card-tag">Edge Compatible</span>
              </div>
            </div>

            <div className="portal-mkt-card">
              <div className="portal-mkt-card-header">
                <div className="portal-mkt-card-icon">
                  <Terminal size={20} />
                </div>
                <span className="portal-mkt-brand-badge">Prefixed Keys</span>
              </div>
              <h3 className="portal-mkt-card-title">Cryptographic API Keys</h3>
              <p className="portal-mkt-card-desc">
                Scoped machine-to-machine tokens with deterministic prefixes (dl_live_ and dl_test_)
                and sha256 checksums.
              </p>
              <div className="portal-mkt-card-tags">
                <span className="portal-mkt-card-tag">Scoped Permissions</span>
                <span className="portal-mkt-card-tag">Instant Revocation</span>
              </div>
            </div>

            <div className="portal-mkt-card">
              <div className="portal-mkt-card-header">
                <div className="portal-mkt-card-icon">
                  <Cpu size={20} />
                </div>
                <span className="portal-mkt-brand-badge">Micro-Frontend</span>
              </div>
              <h3 className="portal-mkt-card-title">Unified Single Sign-On</h3>
              <p className="portal-mkt-card-desc">
                Cross-application session propagation via standard HTTP-only secure cookie exchanges
                and OIDC redirects.
              </p>
              <div className="portal-mkt-card-tags">
                <span className="portal-mkt-card-tag">Zero Session Desync</span>
                <span className="portal-mkt-card-tag">Sub-Domain SSO</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBannerSection />
    </div>
  );
}
