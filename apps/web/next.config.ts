import type { NextConfig } from "next";

/**
 * Next.js 15 configuration for DevLab Portal Web.
 * Transpiles design-system packages linked from devlab-shared.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@yuva-devlab/ui", "@yuva-devlab/tokens"],
  eslint: {
    // ESLint is run across the workspace via root `pnpm lint` and quality gates
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type checking is enforced via root `pnpm typecheck`
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
