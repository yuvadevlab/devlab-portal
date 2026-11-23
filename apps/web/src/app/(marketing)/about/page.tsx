import type { Metadata } from "next";
import { Sparkles, Compass, Shield, Code } from "lucide-react";
import { buildCanonicalUrl, PORTAL_METADATA } from "@/lib/constants/seo.constants";
import { CtaBannerSection } from "@/features/marketing";

/**
 * @file apps/web/src/app/(marketing)/about/page.tsx
 * @description Background, engineering philosophy, and mission of the Yuva DevLab ecosystem.
 * @module @devlab/portal-web/app/marketing/about
 */

export const metadata: Metadata = {
  title: "About Yuva DevLab & Engineering Standards | DevLab Portal",
  description:
    "Learn about Yuva DevLab's vision for autonomous AI agents, zero-trust micro-frontend architectures, and developer sovereignty.",
  alternates: {
    canonical: buildCanonicalUrl("/about"),
  },
  openGraph: {
    title: "About Yuva DevLab & Engineering Standards | DevLab Portal",
    description:
      "Learn about Yuva DevLab's vision for autonomous AI agents, zero-trust micro-frontend architectures, and developer sovereignty.",
    url: buildCanonicalUrl("/about"),
    siteName: PORTAL_METADATA.SITE_NAME,
    images: [{ url: PORTAL_METADATA.OG_IMAGE }],
  },
};

export default function AboutPage(): React.JSX.Element {
  return (
    <div style={{ paddingTop: "2rem" }}>
      <section className="portal-mkt-container">
        <div className="portal-mkt-section-header" style={{ marginBottom: "2rem" }}>
          <div className="portal-mkt-badge-pill">
            <Sparkles size={14} />
            <span>Yuva DevLab</span>
          </div>
          <h1 className="portal-mkt-section-title">Engineering the Autonomous AI Frontier</h1>
          <p className="portal-mkt-section-sub">
            A cohesive suite of specialized micro-frontend platforms built on zero-trust identity,
            strict modularity, and sub-millisecond coordination.
          </p>
        </div>
      </section>

      <section className="portal-mkt-section portal-mkt-section--bordered">
        <div className="portal-mkt-container">
          <div className="portal-mkt-grid-3">
            <div className="portal-mkt-card">
              <div className="portal-mkt-card-header">
                <div className="portal-mkt-card-icon">
                  <Compass size={20} />
                </div>
              </div>
              <h3 className="portal-mkt-card-title">Autonomous Ecosystem</h3>
              <p className="portal-mkt-card-desc">
                From autonomous financial planning in FinAI to agent swarm orchestration in
                OrchestrAI, each service does one thing exceptionally well while sharing identity
                and tokens.
              </p>
            </div>

            <div className="portal-mkt-card">
              <div className="portal-mkt-card-header">
                <div className="portal-mkt-card-icon">
                  <Shield size={20} />
                </div>
              </div>
              <h3 className="portal-mkt-card-title">Zero-Trust by Design</h3>
              <p className="portal-mkt-card-desc">
                No shared database secrets. Every micro-frontend cryptographically validates
                incoming bearer tokens against the Portal's public JWKS keyset.
              </p>
            </div>

            <div className="portal-mkt-card">
              <div className="portal-mkt-card-header">
                <div className="portal-mkt-card-icon">
                  <Code size={20} />
                </div>
              </div>
              <h3 className="portal-mkt-card-title">Platform-Native Web Standards</h3>
              <p className="portal-mkt-card-desc">
                Constructed with pure CSS cascade layers, semantic modular components, strict
                line-count budgets, and accessible markup.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBannerSection />
    </div>
  );
}
