/**
 * @file apps/web/src/features/marketing/components/CtaBannerSection.tsx
 * @description Master call-to-action banner driving traffic to login and architectural specs.
 * @module @devlab/portal-web/features/marketing/components
 */

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@devlab-portal/ui";
import { ROUTES } from "@/lib/constants/routes";
import { UI_COPY } from "@/lib/ui-copy";

export const CtaBannerSection: React.FC = () => {
  const ctaCopy = UI_COPY.MARKETING.CTA_BANNER;

  return (
    <section className="portal-mkt-container">
      <div className="portal-mkt-cta-card">
        <h2 className="portal-mkt-section-title" style={{ marginTop: 0 }}>
          {ctaCopy.TITLE}
        </h2>
        <p className="portal-mkt-section-sub" style={{ marginBottom: "2rem" }}>
          {ctaCopy.SUBTITLE}
        </p>

        <div className="portal-mkt-hero-actions" style={{ marginBottom: 0 }}>
          <Link href={ROUTES.LOGIN}>
            <Button variant="default" size="lg">
              <span>{ctaCopy.ACTION_PRIMARY}</span>
              <ArrowRight size={15} />
            </Button>
          </Link>

          <Link href={ROUTES.MARKETING_ARCHITECTURE}>
            <Button variant="outline" size="lg">
              <span>{ctaCopy.ACTION_SECONDARY}</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
