/**
 * @file apps/web/src/features/marketing/components/PublicFooter.tsx
 * @description Standard semantic footer for public marketing and landing pages.
 * @module @devlab/portal-web/features/marketing/components
 */

import React from "react";
import Link from "next/link";
import { Layers } from "lucide-react";
import { ROUTES, EXTERNAL_ROUTES } from "@/lib/constants/routes";
import { UI_COPY } from "@/lib/ui-copy";

export const PublicFooter: React.FC = () => {
  const copy = UI_COPY.MARKETING.FOOTER;

  return (
    <footer className="portal-mkt-footer">
      <div className="portal-mkt-container">
        <div className="portal-mkt-footer-grid">
          <div>
            <div className="portal-mkt-brand-link">
              <Layers size={18} />
              <span>DevLab Portal</span>
            </div>
            <p className="portal-mkt-footer-desc">{copy.DESC}</p>
          </div>

          <div>
            <h4 className="portal-mkt-footer-heading">{copy.COL_PRODUCT}</h4>
            <ul className="portal-mkt-footer-list">
              <li>
                <a
                  href={EXTERNAL_ROUTES.FIN_AI}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portal-mkt-footer-link"
                >
                  FinAI
                </a>
              </li>
              <li>
                <a
                  href={EXTERNAL_ROUTES.ORCHESTR_AI}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portal-mkt-footer-link"
                >
                  OrchestrAI
                </a>
              </li>
              <li>
                <a
                  href={EXTERNAL_ROUTES.DEVLAB_GUARD}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portal-mkt-footer-link"
                >
                  DevLab Guard
                </a>
              </li>
              <li>
                <a
                  href={EXTERNAL_ROUTES.DEVLAB_LOGS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portal-mkt-footer-link"
                >
                  DevLab Logs
                </a>
              </li>
              <li>
                <a
                  href={EXTERNAL_ROUTES.INCIDENT_AI}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portal-mkt-footer-link"
                >
                  IncidentAI
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="portal-mkt-footer-heading">{copy.COL_PLATFORM}</h4>
            <ul className="portal-mkt-footer-list">
              <li>
                <Link href={ROUTES.MARKETING_ECOSYSTEM} className="portal-mkt-footer-link">
                  Fleet Overview
                </Link>
              </li>
              <li>
                <Link href={ROUTES.MARKETING_ARCHITECTURE} className="portal-mkt-footer-link">
                  RS256 & OIDC Specs
                </Link>
              </li>
              <li>
                <Link href={ROUTES.MARKETING_DEVELOPERS} className="portal-mkt-footer-link">
                  Developer Docs
                </Link>
              </li>
              <li>
                <Link href={ROUTES.MARKETING_ABOUT} className="portal-mkt-footer-link">
                  About DevLab
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="portal-mkt-footer-heading">{copy.COL_LEGAL}</h4>
            <ul className="portal-mkt-footer-list">
              <li>
                <Link href={ROUTES.PRIVACY_POLICY} className="portal-mkt-footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={ROUTES.TERMS_OF_SERVICE} className="portal-mkt-footer-link">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/yuvadevlab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portal-mkt-footer-link"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="portal-mkt-footer-bottom">
          <span>{copy.COPYRIGHT}</span>
          <span>{copy.DISCLAIMER}</span>
        </div>
      </div>
    </footer>
  );
};
