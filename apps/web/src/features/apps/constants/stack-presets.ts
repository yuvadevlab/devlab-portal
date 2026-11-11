/**
 * @file apps/web/src/features/apps/constants/stack-presets.ts
 * @description Standard polyglot technology stack command templates for application registration.
 * @module @devlab/portal-web/features/apps/constants/stack-presets
 */

export interface StackPreset {
  readonly id: string;
  readonly label: string;
  readonly devCommand: string;
  readonly buildCommand: string;
  readonly startCommand: string;
}

export const STACK_PRESETS: readonly StackPreset[] = [
  {
    id: "node",
    label: "Node / TS",
    devCommand: "pnpm dev",
    buildCommand: "pnpm build",
    startCommand: "pnpm start",
  },
  {
    id: "bun",
    label: "Bun",
    devCommand: "bun dev",
    buildCommand: "bun build ./src/index.ts --outdir ./dist",
    startCommand: "bun start",
  },
  {
    id: "python",
    label: "Python / FastAPI",
    devCommand: "uvicorn main:app --reload --port 8000",
    buildCommand: "pip install -r requirements.txt",
    startCommand: "uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4",
  },
  {
    id: "go",
    label: "Go",
    devCommand: "go run .",
    buildCommand: "go build -o ./bin/app .",
    startCommand: "./bin/app",
  },
  {
    id: "rust",
    label: "Rust",
    devCommand: "cargo run",
    buildCommand: "cargo build --release",
    startCommand: "./target/release/app",
  },
  {
    id: "docker",
    label: "Docker Compose",
    devCommand: "docker compose up",
    buildCommand: "docker compose build",
    startCommand: "docker compose up -d",
  },
] as const;
