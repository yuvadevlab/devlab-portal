/**
 * @file apps/api/src/modules/supervisor/supervisor-ide-launcher.ts
 * @description Host IDE integration launching Antigravity IDE, VS Code, or Cursor targeting workspace directories.
 * @module @devlab/portal-api/supervisor
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import child_process from "node:child_process";
import { Logger } from "@yuva-devlab/logger";

export interface LaunchIdeResult {
  success: boolean;
  launched: boolean;
  ide: string;
  workingDir: string;
  message: string;
  deepLinkUrl: string;
  deepLink: string;
  hostSpawned: boolean;
  error?: string;
}

const logger = new Logger("IdeLauncher");

/**
 * Resolves the URI deep-link scheme for a given code editor.
 *
 * @param ide - Target editor identifier
 * @param workingDir - Absolute filesystem directory path
 * @returns Protocol URI string (e.g. antigravity-ide://file/path)
 */
export function getIdeDeepLink(ide: string, workingDir: string): string {
  const normIde = ide.toLowerCase();
  const cleanPath = workingDir.startsWith("/") ? workingDir : `/${workingDir}`;
  if (normIde === "vscode" || normIde === "code") {
    return `vscode://file${cleanPath}`;
  }
  if (normIde === "cursor") {
    return `cursor://file${cleanPath}`;
  }
  return `antigravity-ide://file${cleanPath}`;
}

/**
 * Searches the host environment PATH for an executable.
 *
 * @param executableName - Base command name (e.g. code, cursor)
 * @returns Full executable path if found, or null
 */
function findInPath(executableName: string): string | null {
  const isWindows = process.platform === "win32";
  const pathEnv = process.env.PATH || "";
  const delimiter = isWindows ? ";" : ":";
  const exts = isWindows ? [".exe", ".cmd", ".bat", ""] : [""];

  for (const dir of pathEnv.split(delimiter)) {
    for (const ext of exts) {
      const fullPath = path.join(dir, executableName + ext);
      try {
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
          return fullPath;
        }
      } catch {
        // Continue searching next PATH entry
      }
    }
  }
  return null;
}

interface CommandPlan {
  cmd: string;
  args: string[];
}

/**
 * Resolves the executable command and arguments for the chosen IDE on the host OS.
 *
 * @param ide - Normalized target IDE name
 * @param workingDir - Absolute target working directory
 * @returns CommandPlan or null if IDE is not detected
 */
function resolveIdeCommand(ide: string, workingDir: string): CommandPlan | null {
  const isMac = os.platform() === "darwin";
  const home = os.homedir();

  if (ide === "antigravity" || ide === "agy") {
    if (isMac) {
      const macIdeCli =
        "/Applications/Antigravity IDE.app/Contents/Resources/app/bin/antigravity-ide";
      if (fs.existsSync(macIdeCli)) {
        return { cmd: macIdeCli, args: [workingDir] };
      }
      if (fs.existsSync("/Applications/Antigravity IDE.app")) {
        return { cmd: "open", args: ["-a", "Antigravity IDE", workingDir] };
      }
      const homeIde = path.join(home, "Applications/Antigravity IDE.app");
      if (fs.existsSync(homeIde)) {
        return { cmd: "open", args: ["-a", homeIde, workingDir] };
      }
      if (fs.existsSync("/Applications/Antigravity.app")) {
        return { cmd: "open", args: ["-a", "Antigravity", workingDir] };
      }
    }
    const pathCli = findInPath("antigravity-ide");
    if (pathCli) return { cmd: pathCli, args: [workingDir] };
    return null;
  }

  if (ide === "vscode" || ide === "code") {
    const codeCli =
      findInPath("code") ?? (fs.existsSync("/usr/local/bin/code") ? "/usr/local/bin/code" : null);
    if (codeCli) {
      return { cmd: codeCli, args: [workingDir] };
    }
    if (isMac) {
      if (fs.existsSync("/Applications/Visual Studio Code.app")) {
        return { cmd: "open", args: ["-a", "Visual Studio Code", workingDir] };
      }
      const homeCode = path.join(home, "Applications/Visual Studio Code.app");
      if (fs.existsSync(homeCode)) {
        return { cmd: "open", args: ["-a", homeCode, workingDir] };
      }
    }
    return null;
  }

  if (ide === "cursor") {
    const cursorCli =
      findInPath("cursor") ??
      (fs.existsSync("/usr/local/bin/cursor") ? "/usr/local/bin/cursor" : null);
    if (cursorCli) {
      return { cmd: cursorCli, args: [workingDir] };
    }
    if (isMac) {
      if (fs.existsSync("/Applications/Cursor.app")) {
        return { cmd: "open", args: ["-a", "Cursor", workingDir] };
      }
      const homeCursor = path.join(home, "Applications/Cursor.app");
      if (fs.existsSync(homeCursor)) {
        return { cmd: "open", args: ["-a", homeCursor, workingDir] };
      }
    }
    return null;
  }

  return null;
}

/**
 * Launches the specified IDE on the local host machine targeting the application's working directory.
 *
 * @param workingDir - Absolute directory path
 * @param ide - Target editor name (antigravity, vscode, cursor)
 * @returns LaunchIdeResult with status and deep link fallback
 */
export function launchHostIde(workingDir: string, ide = "antigravity"): LaunchIdeResult {
  if (!fs.existsSync(workingDir)) {
    throw new Error(`Directory does not exist on disk: ${workingDir}`);
  }

  const targetIde = ide.toLowerCase();
  const deepLinkUrl = getIdeDeepLink(targetIde, workingDir);
  const plan = resolveIdeCommand(targetIde, workingDir);

  if (!plan) {
    const ideLabel =
      targetIde === "antigravity"
        ? "Antigravity IDE"
        : targetIde === "vscode"
          ? "Visual Studio Code"
          : "Cursor";
    logger.warn(`Host IDE "${ideLabel}" is not installed or detected on this host.`);
    return {
      success: false,
      launched: false,
      ide: targetIde,
      workingDir,
      message: `${ideLabel} is not installed on this host machine`,
      deepLinkUrl,
      deepLink: deepLinkUrl,
      hostSpawned: false,
      error: `${ideLabel} is not installed on this host machine`,
    };
  }

  try {
    const child = child_process.spawn(plan.cmd, plan.args, {
      detached: true,
      stdio: "ignore",
    });
    child.unref();
    const appBaseName = path.basename(workingDir);
    logger.info(
      `Launched ${targetIde} targeting ${workingDir} via '${plan.cmd} ${plan.args.join(" ")}'`,
    );
    return {
      success: true,
      launched: true,
      ide: targetIde,
      workingDir,
      message: `Launched ${targetIde.toUpperCase()} for ${appBaseName}`,
      deepLinkUrl,
      deepLink: deepLinkUrl,
      hostSpawned: true,
    };
  } catch (err) {
    logger.warn(`Failed to spawn '${plan.cmd}': ${(err as Error).message}`);
    return {
      success: false,
      launched: false,
      ide: targetIde,
      workingDir,
      message: (err as Error).message,
      deepLinkUrl,
      deepLink: deepLinkUrl,
      hostSpawned: false,
      error: (err as Error).message,
    };
  }
}
