import type { Metadata } from "next";
import { KeyRound, Zap, ShieldCheck } from "lucide-react";
import { buildCanonicalUrl, PORTAL_METADATA } from "@/lib/constants/seo.constants";
import { ArchitectureSection, WorkflowSection, CtaBannerSection } from "@/features/marketing";

/**
 * @file apps/web/src/app/(marketing)/architecture/page.tsx
 * @description Technical deep-dive into DevLab Portal RS256 OIDC authority and Redis kill-switch bus.
 * @module @devlab/portal-web/app/marketing/architecture
 */

export const metadata: Metadata = {
  title: "Security Architecture & OIDC Specifications | DevLab Portal",
  description:
    "Comprehensive guide to DevLab Portal's RS256 asymmetric cryptographic tokens, JWKS discovery, and sub-millisecond Redis revocation.",
  alternates: {
    canonical: buildCanonicalUrl("/architecture"),
  },
  openGraph: {
    title: "Security Architecture & OIDC Specifications | DevLab Portal",
    description:
      "Comprehensive guide to DevLab Portal's RS256 asymmetric cryptographic tokens, JWKS discovery, and sub-millisecond Redis revocation.",
    url: buildCanonicalUrl("/architecture"),
    siteName: PORTAL_METADATA.SITE_NAME,
    images: [{ url: PORTAL_METADATA.OG_IMAGE }],
  },
};

export default function ArchitecturePage(): React.JSX.Element {
  return (
    <div style={{ paddingTop: "2rem" }}>
      <ArchitectureSection />
      <WorkflowSection />

      <section className="portal-mkt-section portal-mkt-section--bordered">
        <div className="portal-mkt-container">
          <div className="portal-mkt-section-header">
            <h2 className="portal-mkt-section-title">Cryptographic Protocol Specifications</h2>
            <p className="portal-mkt-section-sub">
              Deterministic standards guaranteeing zero-trust validation across micro-frontends
              without shared secrets.
            </p>
          </div>

          <div className="portal-mkt-grid-3">
            <div className="portal-mkt-card">
              <div className="portal-mkt-card-header">
                <div className="portal-mkt-card-icon">
                  <KeyRound size={20} />
                </div>
              </div>
              <h3 className="portal-mkt-card-title">OIDC & JWKS Authority</h3>
              <p className="portal-mkt-card-desc">
                Public JSON Web Key Sets are exposed at /.well-known/jwks.json with 24-hour cache
                headers and automatic KID rotation.
              </p>
            </div>

            <div className="portal-mkt-card">
              <div className="portal-mkt-card-header">
                <div className="portal-mkt-card-icon">
                  <Zap size={20} />
                </div>
              </div>
              <h3 className="portal-mkt-card-title">Sub-Millisecond Revocation</h3>
              <p className="portal-mkt-card-desc">
                When an operator flags a compromise or triggers a kill-switch, a broadcast across
                Redis PUB/SUB instantly purges the token across all edge clusters.
              </p>
            </div>

            <div className="portal-mkt-card">
              <div className="portal-mkt-card-header">
                <div className="portal-mkt-card-icon">
                  <ShieldCheck size={20} />
                </div>
              </div>
              <h3 className="portal-mkt-card-title">Multi-Tenant RBAC</h3>
              <p className="portal-mkt-card-desc">
                Tenant separation is strictly enforced at database and middleware levels, preventing
                privilege escalation between workspace boundaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBannerSection />
    </div>
  );
}
