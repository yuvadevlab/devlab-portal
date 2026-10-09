/**
 * @file apps/web/src/components/layout/nav-icon.ts
 * @description Dynamic Lucide icon resolver for server-driven navigation menus.
 * @module @devlab/portal-web/components/layout/nav-icon
 */

import {
  Grid2X2,
  KeyRound,
  ShieldCheck,
  Users,
  Settings2,
  Layers,
  Activity,
  Box,
  Zap,
  Terminal,
  Workflow,
  Globe,
  Lock,
  Sliders,
  FolderCode,
  type LucideIcon,
} from "lucide-react";

/** Registry mapping server-provided icon identifier strings to Lucide components */
const ICON_REGISTRY: Record<string, LucideIcon> = {
  Grid2X2,
  KeyRound,
  ShieldCheck,
  Users,
  Settings2,
  Layers,
  Activity,
  Box,
  Zap,
  Terminal,
  Workflow,
  Globe,
  Lock,
  Sliders,
};

/**
 * Resolves a Lucide icon component dynamically from a database icon string.
 *
 * @param iconKey - String identifier saved in the database
 * @returns Matching Lucide icon component, or FolderCode fallback
 */
export function getNavIcon(iconKey: string): LucideIcon {
  return ICON_REGISTRY[iconKey] || FolderCode;
}
