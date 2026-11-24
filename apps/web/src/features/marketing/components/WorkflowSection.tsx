/**
 * @file apps/web/src/features/marketing/components/WorkflowSection.tsx
 * @description 3-step operational workflow for developer onboarding and token governance.
 * @module @devlab/portal-web/features/marketing/components
 */

import React from "react";
import { Sparkles } from "lucide-react";
import { UI_COPY } from "@/lib/ui-copy";

export const WorkflowSection: React.FC = () => {
  const archCopy = UI_COPY.MARKETING.ARCHITECTURE;

  return (
    <section className="portal-mkt-section portal-mkt-section--bordered">
      <div className="portal-mkt-container">
        <div className="portal-mkt-section-header">
          <div className="portal-mkt-badge-pill">
            <Sparkles size={14} />
            <span>{archCopy.SECTION_BADGE}</span>
          </div>
          <h2 className="portal-mkt-section-title">{archCopy.SECTION_TITLE}</h2>
          <p className="portal-mkt-section-sub">{archCopy.SECTION_SUB}</p>
        </div>

        <ol className="portal-mkt-steps-grid">
          <li className="portal-mkt-step-card">
            <span className="portal-mkt-step-num">{archCopy.STEP_1_NUM}</span>
            <h3 className="portal-mkt-card-title">{archCopy.STEP_1_TITLE}</h3>
            <p className="portal-mkt-card-desc">{archCopy.STEP_1_DESC}</p>
          </li>

          <li className="portal-mkt-step-card">
            <span className="portal-mkt-step-num">{archCopy.STEP_2_NUM}</span>
            <h3 className="portal-mkt-card-title">{archCopy.STEP_2_TITLE}</h3>
            <p className="portal-mkt-card-desc">{archCopy.STEP_2_DESC}</p>
          </li>

          <li className="portal-mkt-step-card">
            <span className="portal-mkt-step-num">{archCopy.STEP_3_NUM}</span>
            <h3 className="portal-mkt-card-title">{archCopy.STEP_3_TITLE}</h3>
            <p className="portal-mkt-card-desc">{archCopy.STEP_3_DESC}</p>
          </li>
        </ol>
      </div>
    </section>
  );
};
