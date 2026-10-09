/**
 * @file apps/web/src/lib/logger.ts
 * @description Client-safe structured logger for the DevLab Portal Web Next.js application.
 * @module @devlab/portal-web/lib/logger
 */

/* eslint-disable no-console */

/**
 * Structured logger utility for Next.js browser client runtime.
 * Avoids Node.js built-ins (`fs`, `path`) to guarantee seamless client bundling.
 */
export const logger = {
  info: (message: string, ...args: unknown[]): void => {
    console.info(`[PortalWeb:INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]): void => {
    console.warn(`[PortalWeb:WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]): void => {
    console.error(`[PortalWeb:ERROR] ${message}`, ...args);
  },
  debug: (message: string, ...args: unknown[]): void => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[PortalWeb:DEBUG] ${message}`, ...args);
    }
  },
};
