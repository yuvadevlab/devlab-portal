/**
 * @file apps/web/src/features/marketing/components/FaqSection.tsx
 * @description Frequently Asked Questions section with semantic accordion/items for DevLab Portal.
 * @module @devlab/portal-web/features/marketing/components
 */

import React from "react";
import { Sparkles, HelpCircle } from "lucide-react";
import { UI_COPY } from "@/lib/ui-copy";
import { getFaqJsonLd } from "@/lib/constants/seo.constants";

export const FaqSection: React.FC = () => {
  const faqCopy = UI_COPY.MARKETING.FAQ;
  const faqJsonLd = getFaqJsonLd(faqCopy.ITEMS);

  return (
    <section className="portal-mkt-section portal-mkt-section--bordered" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="portal-mkt-container">
        <div className="portal-mkt-section-header">
          <div className="portal-mkt-badge-pill">
            <Sparkles size={14} />
            <span>{faqCopy.SECTION_BADGE}</span>
          </div>
          <h2 className="portal-mkt-section-title">{faqCopy.SECTION_TITLE}</h2>
        </div>

        <div className="portal-mkt-faq-list">
          {faqCopy.ITEMS.map((item) => (
            <div key={item.question} className="portal-mkt-faq-item">
              <h3 className="portal-mkt-faq-q flex items-center gap-2">
                <HelpCircle size={16} />
                <span>{item.question}</span>
              </h3>
              <p className="portal-mkt-faq-a">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
