/**
 * @file apps/web/src/lib/constants/seo.constants.ts
 * @description Centralized metadata configuration and Schema.org JSON-LD generators for DevLab Portal.
 * @module @devlab/portal-web/constants/seo
 */

export const SITE_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_APP_URL || "https://portal-yuvadevlab.vercel.app",
  AUTHOR_NAME: "Yuva DevLab",
  AUTHOR_EMAIL: "yuva.devlab@gmail.com",
  AUTHOR_URL: "https://portal-yuvadevlab.vercel.app",
  TWITTER_CREATOR: "@yuvadevlab",
  LOCALE: "en_US",
  DEFAULT_OG_IMAGE: "/opengraph-image",
} as const;

export function buildCanonicalUrl(path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_CONFIG.BASE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export const PORTAL_METADATA = {
  TITLE: "DevLab Portal — Micro-Frontend Identity, OIDC & Governance Control Plane",
  TITLE_TEMPLATE: "%s | DevLab Portal",
  DESCRIPTION:
    "Centralized developer management, RS256 OIDC authority, instant sub-millisecond Redis kill-switch bus, and governance control plane for the DevLab AI multi-repo ecosystem.",
  SITE_NAME: "DevLab Portal",
  AUTHOR: SITE_CONFIG.AUTHOR_NAME,
  AUTHOR_URL: SITE_CONFIG.AUTHOR_URL,
  KEYWORDS: [
    "DevLab Portal",
    "Micro-Frontend Control Plane",
    "Single Sign-On",
    "OIDC Provider",
    "JWKS Authority",
    "API Key Management",
    "Redis Kill Switch",
    "Enterprise SSO",
    "Multi-Tenant RBAC",
    "DevLab Ecosystem",
    "FinAI",
    "OrchestrAI",
    "DevLab Guard",
    "DevLab Logs",
  ],
  OG_TITLE: "DevLab Portal — Micro-Frontend Identity, OIDC & Governance Control Plane",
  OG_DESCRIPTION:
    "Unified developer management, RS256 OIDC authority, sub-millisecond Redis kill-switch bus, and multi-tenant governance.",
  OG_IMAGE: "/opengraph-image",
} as const;

export function getOrganizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_CONFIG.BASE_URL}/#organization`,
    name: SITE_CONFIG.AUTHOR_NAME,
    url: SITE_CONFIG.BASE_URL,
    logo: `${SITE_CONFIG.BASE_URL}/icon.svg`,
    sameAs: ["https://github.com/yuvadevlab"],
  };
}

export function getWebSiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.BASE_URL}/#website`,
    name: PORTAL_METADATA.SITE_NAME,
    url: SITE_CONFIG.BASE_URL,
    description: PORTAL_METADATA.DESCRIPTION,
    publisher: {
      "@id": `${SITE_CONFIG.BASE_URL}/#organization`,
    },
  };
}

export function getSoftwareApplicationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_CONFIG.BASE_URL}/#software`,
    name: PORTAL_METADATA.SITE_NAME,
    operatingSystem: "Web Browser",
    applicationCategory: "DeveloperApplication",
    author: {
      "@id": `${SITE_CONFIG.BASE_URL}/#organization`,
    },
    publisher: {
      "@id": `${SITE_CONFIG.BASE_URL}/#organization`,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: PORTAL_METADATA.DESCRIPTION,
    featureList: [
      "RS256 OIDC & JWKS Token Issuance",
      "Sub-Millisecond Redis Kill-Switch Bus",
      "Centralized Multi-Tenant RBAC Engine",
      "Cryptographic API Key Lifecycle Authority",
      "Immutable Security Audit Ledger",
      "Micro-Frontend Unified Single Sign-On",
    ],
  };
}

export function getFaqJsonLd(
  faqs: readonly { question: string; answer: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
