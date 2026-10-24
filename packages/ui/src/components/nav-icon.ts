import {
  Activity,
  Bot,
  Box,
  ChartNoAxesCombined,
  Cpu,
  FolderCode,
  Globe,
  Grid2X2,
  Key,
  KeyRound,
  Layers,
  LayoutGrid,
  Lock,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Terminal,
  Users,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICON_REGISTRY: Record<string, LucideIcon> = {
  Activity,
  Bot,
  Box,
  ChartNoAxesCombined,
  Cpu,
  FolderCode,
  Globe,
  Grid2X2,
  Key,
  KeyRound,
  Layers,
  LayoutGrid,
  Lock,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Terminal,
  Users,
  Workflow,
  Zap,
};

/**
 * Resolves a supported icon name from navigation metadata to its Lucide component.
 */
export function getNavIcon(iconKey?: string | null): LucideIcon {
  return (iconKey && ICON_REGISTRY[iconKey]) || FolderCode;
}
