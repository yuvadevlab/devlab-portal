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

/** Pre-configured DevLab Ecosystem Registered Applications */
export const REGISTERED_ECOSYSTEM_APPS = [
  {
    appId: "finai",
    name: "FinAI",
    slug: "finai",
    description: "Autonomous AI-native financial intelligence and tracking platform",
    originUrl: "http://localhost:3001",
    apiUrl: "http://localhost:4001",
    callbackUrls: ["http://localhost:3001/api/auth/callback", "http://localhost:3001"],
    healthUrl: "http://localhost:4001/api/v1/health",
    themeColor: "mint",
    iconUrl: "ChartNoAxesCombined",
    environment: "local_dev" as const,
    isActive: true,
  },
  {
    appId: "orchestrai",
    name: "OrchestrAI",
    slug: "orchestrai",
    description: "Distributed autonomous multi-agent swarm orchestrator",
    originUrl: "http://localhost:3002",
    apiUrl: "http://localhost:4002",
    callbackUrls: ["http://localhost:3002/api/auth/callback", "http://localhost:3002"],
    healthUrl: "http://localhost:4002/health",
    themeColor: "blue",
    iconUrl: "Workflow",
    environment: "local_dev" as const,
    isActive: true,
  },
  {
    appId: "devlab-logs",
    name: "DevLab Logs",
    slug: "devlab-logs",
    description: "High-throughput structured observability & logging cluster",
    originUrl: "http://localhost:3003",
    apiUrl: "http://localhost:4003",
    callbackUrls: ["http://localhost:3003/api/auth/callback", "http://localhost:3003"],
    healthUrl: "http://localhost:4003/health",
    themeColor: "amber",
    iconUrl: "Terminal",
    environment: "local_dev" as const,
    isActive: true,
  },
  {
    appId: "vitalai",
    name: "VitalAI",
    slug: "vitalai",
    description: "Longevity and biomechanical coaching platform",
    originUrl: "http://localhost:3004",
    apiUrl: "http://localhost:4004",
    callbackUrls: ["http://localhost:3004/api/auth/callback", "http://localhost:3004"],
    healthUrl: "http://localhost:4004/health",
    themeColor: "lime",
    iconUrl: "Activity",
    environment: "local_dev" as const,
    isActive: true,
  },
  {
    appId: "devlab-guard",
    name: "DevLab Guard",
    slug: "devlab-guard",
    description: "Zero-trust network & runtime security policy enforcement",
    originUrl: "http://localhost:8000",
    apiUrl: "http://localhost:8000",
    callbackUrls: ["http://localhost:8000/api/auth/callback", "http://localhost:8000"],
    healthUrl: "http://localhost:8000/health",
    themeColor: "rose",
    iconUrl: "ShieldCheck",
    environment: "local_dev" as const,
    isActive: true,
  },
  {
    appId: "incidentai",
    name: "IncidentAI",
    slug: "incidentai",
    description: "Autonomous incident response and remediation engine",
    originUrl: "http://localhost:8085",
    apiUrl: "http://localhost:8085",
    callbackUrls: ["http://localhost:8085/api/auth/callback", "http://localhost:8085"],
    healthUrl: "http://localhost:8085/health",
    themeColor: "rose",
    iconUrl: "AlertTriangle",
    environment: "local_dev" as const,
    isActive: true,
  },
] as const;
