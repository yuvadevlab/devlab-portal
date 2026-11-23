import type { Metadata } from "next";
import { Sparkles, ShieldCheck } from "lucide-react";
import { buildCanonicalUrl, PORTAL_METADATA } from "@/lib/constants/seo.constants";

/**
 * @file apps/web/src/app/(marketing)/privacy-policy/page.tsx
 * @description Formal privacy policy for DevLab Portal and associated ecosystem micro-frontends.
 * @module @devlab/portal-web/app/marketing/privacy-policy
 */

export const metadata: Metadata = {
  title: "Privacy Policy | DevLab Portal",
  description:
    "DevLab Portal's privacy commitments, zero data selling guarantee, and cryptographic data protection principles.",
  alternates: {
    canonical: buildCanonicalUrl("/privacy-policy"),
  },
  openGraph: {
    title: "Privacy Policy | DevLab Portal",
    description:
      "DevLab Portal's privacy commitments, zero data selling guarantee, and cryptographic data protection principles.",
    url: buildCanonicalUrl("/privacy-policy"),
    siteName: PORTAL_METADATA.SITE_NAME,
    images: [{ url: PORTAL_METADATA.OG_IMAGE }],
  },
};

export default function PrivacyPolicyPage(): React.JSX.Element {
  return (
    <div style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <div className="portal-mkt-container">
        <div className="portal-mkt-section-header" style={{ marginBottom: "2rem" }}>
          <div className="portal-mkt-badge-pill">
            <Sparkles size={14} />
            <span>Privacy & Trust</span>
          </div>
          <h1 className="portal-mkt-section-title">Privacy Policy</h1>
          <p className="portal-mkt-section-sub">
            Last Updated: November 2026. Zero tracking, zero data monetization, and cryptographic
            sovereignty.
          </p>
        </div>

        <div className="portal-mkt-card" style={{ maxWidth: 840, margin: "0 auto", gap: "1.5rem" }}>
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} />
            <h2 className="portal-mkt-card-title" style={{ margin: 0 }}>
              1. Fundamental Privacy Philosophy
            </h2>
          </div>
          <p className="portal-mkt-card-desc">
            DevLab Portal operates under a strict zero-monetization policy regarding user
            credentials, identity data, and telemetry. We never sell, rent, or trade personal data
            or identity profiles to advertisers, data brokers, or third parties.
          </p>

          <h3 className="portal-mkt-card-title" style={{ fontSize: "1.125rem", margin: 0 }}>
            2. Authentication & Identity Data
          </h3>
          <p className="portal-mkt-card-desc">
            When you register or sign in to DevLab Portal, we store your account email address,
            cryptographically hashed passwords (Argon2id), and assigned organization role. Session
            tokens are issued using RS256 private keys and stored in secure HTTP-only cookies.
          </p>

          <h3 className="portal-mkt-card-title" style={{ fontSize: "1.125rem", margin: 0 }}>
            3. Redis Revocation & Security Audit Logs
          </h3>
          <p className="portal-mkt-card-desc">
            To prevent unauthorized access and support compliance requirements, system events (such
            as API key creation, permission grants, and key revocation) are immutably logged with
            actor attribution and timestamp.
          </p>

          <h3 className="portal-mkt-card-title" style={{ fontSize: "1.125rem", margin: 0 }}>
            4. Inquiries & Data Rights
          </h3>
          <p className="portal-mkt-card-desc">
            For questions or requests concerning your account data or privacy rights, please reach
            out to our engineering security team at yuva.devlab@gmail.com.
          </p>
        </div>
      </div>
    </div>
  );
}
