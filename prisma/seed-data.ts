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

/** Pre-configured DevLab Ecosystem Applications */
export const ECOSYSTEM_APPS = [
  {
    appId: "orchestrai",
    name: "OrchestrAI Swarm Platform",
    slug: "orchestrai",
    description:
      "Enterprise distributed AI agent orchestration platform engineered for complex multi-agent swarms.",
    originUrl: "http://localhost:3001",
    apiUrl: "http://localhost:4001",
    callbackUrls: ["http://localhost:3001"],
    healthUrl: "http://localhost:4001/health",
    themeColor: "purple",
    environment: "local_dev" as const,
    isActive: true,
  },
  {
    appId: "finai",
    name: "FinAI Financial Intelligence",
    slug: "finai",
    description:
      "AI-powered personal and family finance management platform with net worth and budget intelligence.",
    originUrl: "http://localhost:3000",
    apiUrl: "http://localhost:4000/api/v1",
    callbackUrls: ["http://localhost:3000"],
    healthUrl: "http://localhost:4000/api/v1/health",
    themeColor: "emerald",
    environment: "local_dev" as const,
    isActive: true,
  },
  {
    appId: "vitalai",
    name: "VitalAI Athletic Conditioning",
    slug: "vitalai",
    description:
      "High-performance AI fitness coaching platform with scientific hypertrophy periodization.",
    originUrl: "http://localhost:3004",
    apiUrl: "http://localhost:4004",
    callbackUrls: ["http://localhost:3004"],
    healthUrl: "http://localhost:4004/health",
    themeColor: "lime",
    environment: "local_dev" as const,
    isActive: true,
  },
  {
    appId: "devlab-logs",
    name: "DevLab Logs & Telemetry",
    slug: "logs",
    description:
      "Sub-second log aggregation, analytical DuckDB querying, and semantic Log-RAG search engine.",
    originUrl: "http://localhost:3025",
    apiUrl: "http://localhost:3020",
    callbackUrls: ["http://localhost:3025"],
    healthUrl: "http://localhost:3020/health",
    themeColor: "blue",
    environment: "local_dev" as const,
    isActive: true,
  },
  {
    appId: "incidentai",
    name: "IncidentAI SRE Commander",
    slug: "incidentai",
    description:
      "Autonomous Site Reliability Engineer diagnosing production crashes and dry-running surgical repairs.",
    originUrl: "http://localhost:8085",
    apiUrl: "http://localhost:8085",
    callbackUrls: ["http://localhost:8085"],
    healthUrl: "http://localhost:8085/health",
    themeColor: "red",
    environment: "local_dev" as const,
    isActive: true,
  },
  {
    appId: "devlab-guard",
    name: "DevLab Guard AST Linter",
    slug: "guard",
    description:
      "Autonomous AST governance, architectural rule enforcement, and credential leakage prevention engine.",
    originUrl: "http://localhost:8000",
    apiUrl: "http://localhost:8000",
    callbackUrls: ["http://localhost:8000"],
    healthUrl: "http://localhost:8000/health",
    themeColor: "amber",
    environment: "local_dev" as const,
    isActive: true,
  },
] as const;
