/**
 * @file prisma/seed-data.ts
 * @description Master seed configuration fixtures for workspace tenant, initial super admin, and navigation menu.
 * @module devlab-portal/prisma
 */

export const INITIAL_TENANT = {
  name: "Yuva DevLab",
  slug: "yuva-devlab",
  plan: "enterprise",
  isActive: true,
} as const;

export const INITIAL_SUPER_ADMIN = {
  email: process.env.ADMIN_DEFAULT_EMAIL || "yuva.devlab@gmail.com",
  name: "Yuvaraj Pattabi",
  defaultPassword: process.env.ADMIN_DEFAULT_PASSWORD || "DevLab@2026!Admin",
  role: "super_admin" as const,
  isActive: true,
  allowedApps: ["*"],
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
