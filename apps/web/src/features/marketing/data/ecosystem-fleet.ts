/**
 * @file apps/web/src/features/marketing/data/ecosystem-fleet.ts
 * @description Master catalog of all first-party applications in the DevLab ecosystem.
 * @module @devlab/portal-web/features/marketing/data
 */

import { EXTERNAL_ROUTES } from "@/lib/constants/routes";

export interface EcosystemApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
  badge: string;
  iconName: string;
  features: string[];
}

export const ECOSYSTEM_FLEET: readonly EcosystemApp[] = [
  {
    id: "fin-ai",
    name: "FinAI",
    tagline: "Autonomous Financial Intelligence",
    description:
      "Intelligent personal finance and wealth management platform with Gemini-powered advisory, envelope budgeting, and multi-year forecasting.",
    href: EXTERNAL_ROUTES.FIN_AI,
    badge: "Live Production",
    iconName: "TrendingUp",
    features: [
      "AI Expense Categorization",
      "Envelope Budget Planning",
      "Gemini Financial Advisor",
      "Zero Data Selling Model",
    ],
  },
  {
    id: "orchestr-ai",
    name: "OrchestrAI",
    tagline: "Multi-Agent Swarm Orchestrator",
    description:
      "Autonomous AI agent coordination platform managing task decomposition, worker swarms, shared message boards, and parallel execution.",
    href: EXTERNAL_ROUTES.ORCHESTR_AI,
    badge: "Production",
    iconName: "Cpu",
    features: [
      "Agent Swarm Coordination",
      "Task Graph Decomposition",
      "Dynamic Workspace Forking",
      "Telemetry & Cost Attribution",
    ],
  },
  {
    id: "devlab-guard",
    name: "DevLab Guard",
    tagline: "Real-Time AI Safety & Moderation",
    description:
      "Edge-based prompt injection detection, sensitive PII redaction, and compliance guardrails shielding LLM applications.",
    href: EXTERNAL_ROUTES.DEVLAB_GUARD,
    badge: "Preview",
    iconName: "ShieldCheck",
    features: [
      "Prompt Injection Shield",
      "PII Anonymization",
      "Output Hallucination Checks",
      "Sub-Millisecond Edge Evaluation",
    ],
  },
  {
    id: "devlab-logs",
    name: "DevLab Logs",
    tagline: "Distributed Telemetry & Audit",
    description:
      "High-throughput structured logging and observability pipeline streaming events from all ecosystem micro-frontends and workers.",
    href: EXTERNAL_ROUTES.DEVLAB_LOGS,
    badge: "Production",
    iconName: "Activity",
    features: [
      "Sub-Millisecond Log Ingestion",
      "Cross-Service Trace Correlating",
      "Loki & ClickHouse Integration",
      "Full-Text Telemetry Search",
    ],
  },
  {
    id: "incident-ai",
    name: "IncidentAI",
    tagline: "Automated Incident Remediation",
    description:
      "Autonomous site reliability engineering copilot diagnosing system anomalies, performing root-cause analysis, and orchestrating rollbacks.",
    href: EXTERNAL_ROUTES.INCIDENT_AI,
    badge: "Preview",
    iconName: "AlertTriangle",
    features: [
      "Anomaly Detection Engine",
      "Automated RCA Report Gen",
      "Canary Rollback Automation",
      "Slack & PagerDuty Integration",
    ],
  },
  {
    id: "devlab-portal",
    name: "DevLab Portal",
    tagline: "Identity & Governance Control Plane",
    description:
      "Centralized RS256 OIDC authority, API key lifecycle manager, and Redis kill-switch bus governing the entire ecosystem.",
    href: EXTERNAL_ROUTES.PORTAL,
    badge: "Core Platform",
    iconName: "LayoutGrid",
    features: [
      "RS256 OIDC & JWKS Token Issuance",
      "Sub-Millisecond Redis Revocation",
      "Multi-Tenant RBAC Hierarchy",
      "Cryptographic API Key Authority",
    ],
  },
] as const;
