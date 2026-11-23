/**
 * @file apps/web/src/features/marketing/components/ArchitectureSection.tsx
 * @description Architecture section detailing RS256 JWKS OIDC, Redis revocation, and audit mechanics.
 * @module @devlab/portal-web/features/marketing/components
 */

import React from "react";
import { KeyRound, Zap, ShieldCheck, Sparkles } from "lucide-react";
import { UI_COPY } from "@/lib/ui-copy";

export const ArchitectureSection: React.FC = () => {
  const secCopy = UI_COPY.MARKETING.SECURITY;

  return (
    <section className="portal-mkt-section portal-mkt-section--bordered" id="architecture">
      <div className="portal-mkt-container">
        <div className="portal-mkt-section-header">
          <div className="portal-mkt-badge-pill">
            <Sparkles size={14} />
            <span>{secCopy.SECTION_BADGE}</span>
          </div>
          <h2 className="portal-mkt-section-title">{secCopy.SECTION_TITLE}</h2>
          <p className="portal-mkt-section-sub">{secCopy.SECTION_SUB}</p>
        </div>

        <div className="portal-mkt-grid-3">
          <div className="portal-mkt-card">
            <div className="portal-mkt-card-header">
              <div className="portal-mkt-card-icon">
                <KeyRound size={20} />
              </div>
            </div>
            <h3 className="portal-mkt-card-title">{secCopy.CARD_1_TITLE}</h3>
            <p className="portal-mkt-card-desc">{secCopy.CARD_1_DESC}</p>
          </div>

          <div className="portal-mkt-card">
            <div className="portal-mkt-card-header">
              <div className="portal-mkt-card-icon">
                <Zap size={20} />
              </div>
            </div>
            <h3 className="portal-mkt-card-title">{secCopy.CARD_2_TITLE}</h3>
            <p className="portal-mkt-card-desc">{secCopy.CARD_2_DESC}</p>
          </div>

          <div className="portal-mkt-card">
            <div className="portal-mkt-card-header">
              <div className="portal-mkt-card-icon">
                <ShieldCheck size={20} />
              </div>
            </div>
            <h3 className="portal-mkt-card-title">{secCopy.CARD_3_TITLE}</h3>
            <p className="portal-mkt-card-desc">{secCopy.CARD_3_DESC}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
