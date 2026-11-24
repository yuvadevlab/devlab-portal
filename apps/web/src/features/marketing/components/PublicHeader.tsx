"use client";

/**
 * @file apps/web/src/features/marketing/components/PublicHeader.tsx
 * @description Master navigation header for public marketing and landing pages.
 * Features brand link, ecosystem nav links, theme toggle, and console access button.
 * @module @devlab/portal-web/features/marketing/components
 */

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, Moon, Sun, Menu, X, ArrowRight } from "lucide-react";
import { Button, useTheme } from "@devlab-portal/ui";
import { ROUTES } from "@/lib/constants/routes";
import { UI_COPY } from "@/lib/ui-copy";

const NAV_ITEMS = [
  { href: ROUTES.MARKETING_ECOSYSTEM, labelKey: "ECOSYSTEM" as const },
  { href: ROUTES.MARKETING_ARCHITECTURE, labelKey: "ARCHITECTURE" as const },
  { href: ROUTES.MARKETING_DEVELOPERS, labelKey: "DEVELOPERS" as const },
  { href: ROUTES.MARKETING_ABOUT, labelKey: "ABOUT" as const },
];

export const PublicHeader: React.FC = () => {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const copy = UI_COPY.MARKETING;

  const isLight = resolvedTheme === "light";

  const handleToggleTheme = () => {
    setTheme(isLight ? "dark" : "light");
  };

  return (
    <header className="portal-mkt-header">
      <div className="portal-mkt-container">
        <div className="portal-mkt-header-inner">
          <Link href={ROUTES.HOME} className="portal-mkt-brand-link">
            <Layers size={20} />
            <span>DevLab Portal</span>
            <span className="portal-mkt-brand-badge">{copy.BADGES.CONTROL_PLANE}</span>
          </Link>

          <nav className="portal-mkt-nav" aria-label={copy.NAV.ARIA_NAV}>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`portal-mkt-nav-link ${isActive ? "portal-mkt-nav-link--active" : ""}`}
                >
                  {copy.NAV[item.labelKey]}
                </Link>
              );
            })}
          </nav>

          <div className="portal-mkt-header-actions">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleTheme}
              aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
            >
              {isLight ? <Moon size={16} /> : <Sun size={16} />}
            </Button>

            <Link href={ROUTES.LOGIN}>
              <Button variant="default" size="sm">
                <span>{copy.NAV.CONSOLE}</span>
                <ArrowRight size={14} />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="portal-mkt-mobile-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            style={{
              padding: "1rem 0 1.5rem",
              borderTop: "1px solid var(--dl-color-border-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`portal-mkt-nav-link ${pathname === item.href ? "portal-mkt-nav-link--active" : ""}`}
              >
                {copy.NAV[item.labelKey]}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
