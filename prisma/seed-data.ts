/**
 * @file prisma/seed-data.ts
 * @description Master seed configuration fixtures for workspace tenant and navigation menu.
 * @module devlab-portal/prisma
 */

export const INITIAL_TENANT = {
  name: "Yuva DevLab",
  slug: "yuva-devlab",
  plan: "enterprise",
  isActive: true,
} as const;

export const NAVIGATION_ITEMS = [
  { key: "apps", label: "Ecosystem Apps & Services", icon: "Grid2X2", order: 1, isEnabled: true },
  { key: "iam", label: "IAM & API Keys", icon: "KeyRound", order: 2, isEnabled: true },
  {
    key: "audit",
    label: "Security & Audit Ledger",
    icon: "ShieldCheck",
    order: 3,
    isEnabled: true,
  },
  { key: "team", label: "Team & Permissions", icon: "Users", order: 4, isEnabled: true },
  { key: "settings", label: "Settings & JWKS", icon: "Settings2", order: 5, isEnabled: true },
] as const;

/** Application access authorization scopes */
export enum AppAccessScope {
  ALL = "*",
}
