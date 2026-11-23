/**
 * @file apps/web/src/features/marketing/components/HeroSection.tsx
 * @description Hero section showcasing DevLab Portal control plane value proposition and trust strip.
 * @module @devlab/portal-web/features/marketing/components
 */

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, KeyRound, Sparkles } from "lucide-react";
import { Button } from "@devlab-portal/ui";
import { ROUTES } from "@/lib/constants/routes";
import { UI_COPY } from "@/lib/ui-copy";

export const HeroSection: React.FC = () => {
  const heroCopy = UI_COPY.MARKETING.HERO;
  const badgeCopy = UI_COPY.MARKETING.BADGES;

  return (
    <section className="portal-mkt-hero">
      <div className="portal-mkt-hero-glow" aria-hidden="true" />
      <div className="portal-mkt-container">
        <div className="portal-mkt-badge-pill">
          <Sparkles size={14} />
          <span>{badgeCopy.CONTROL_PLANE}</span>
        </div>

        <h1 className="portal-mkt-hero-title">
          {heroCopy.HEADLINE_PREFIX}{" "}
          <span className="portal-mkt-hero-accent">{heroCopy.HEADLINE_ACCENT}</span>
        </h1>

        <p className="portal-mkt-hero-sub">{heroCopy.SUBTITLE}</p>

        <div className="portal-mkt-hero-actions">
          <Link href={ROUTES.LOGIN}>
            <Button variant="default" size="lg">
              <span>{heroCopy.CTA_CONSOLE}</span>
              <ArrowRight size={15} />
            </Button>
          </Link>

          <Link href={ROUTES.MARKETING_ECOSYSTEM}>
            <Button variant="outline" size="lg">
              <span>{heroCopy.CTA_ECOSYSTEM}</span>
            </Button>
          </Link>
        </div>

        <ul className="portal-mkt-trust-strip">
          <li className="portal-mkt-trust-item">
            <KeyRound size={16} />
            <span>{heroCopy.TRUST_1}</span>
          </li>
          <li className="portal-mkt-trust-item">
            <Zap size={16} />
            <span>{heroCopy.TRUST_2}</span>
          </li>
          <li className="portal-mkt-trust-item">
            <ShieldCheck size={16} />
            <span>{heroCopy.TRUST_3}</span>
          </li>
        </ul>
      </div>
    </section>
  );
};
