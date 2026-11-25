/**
 * @file apps/web/src/features/marketing/components/EcosystemFleetSection.tsx
 * @description Product fleet grid highlighting all first-party applications unified under the Portal.
 * @module @devlab/portal-web/features/marketing/components
 */

import React from "react";
import {
  TrendingUp,
  Cpu,
  ShieldCheck,
  Activity,
  AlertTriangle,
  LayoutGrid,
  Layers,
  ExternalLink,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { ECOSYSTEM_FLEET, type EcosystemApp } from "../data/ecosystem-fleet";
import { UI_COPY } from "@/lib/ui-copy";

const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp,
  Cpu,
  ShieldCheck,
  Activity,
  AlertTriangle,
  LayoutGrid,
  Layers,
};

export const EcosystemFleetSection: React.FC = () => {
  const fleetCopy = UI_COPY.MARKETING.FLEET;

  return (
    <section className="portal-mkt-section portal-mkt-section--bordered" id="ecosystem">
      <div className="portal-mkt-container">
        <div className="portal-mkt-section-header">
          <div className="portal-mkt-badge-pill">
            <Sparkles size={14} />
            <span>{fleetCopy.SECTION_BADGE}</span>
          </div>
          <h2 className="portal-mkt-section-title">{fleetCopy.SECTION_TITLE}</h2>
          <p className="portal-mkt-section-sub">{fleetCopy.SECTION_SUB}</p>
        </div>

        <div className="portal-mkt-grid-3">
          {ECOSYSTEM_FLEET.map((app: EcosystemApp) => {
            const Icon = ICON_MAP[app.iconName] || Layers;
            return (
              <a
                key={app.id}
                href={app.href}
                target={app.href.startsWith("http") ? "_blank" : undefined}
                rel={app.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="portal-mkt-card"
              >
                <div className="portal-mkt-card-header">
                  <div className="portal-mkt-card-icon">
                    <Icon size={20} />
                  </div>
                  <span className="portal-mkt-brand-badge">{app.badge}</span>
                </div>

                <h3 className="portal-mkt-card-title">{app.name}</h3>
                <p className="portal-mkt-card-desc">{app.description}</p>

                <div className="portal-mkt-card-tags">
                  {app.features.map((feature) => (
                    <span key={feature} className="portal-mkt-card-tag">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="portal-mkt-card-action">
                  <span>{fleetCopy.ACTION}</span>
                  <ExternalLink size={14} />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
