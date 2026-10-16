/**
 * @file apps/api/src/main.ts
 * @description Bootstrap entrypoint for the DevLab Portal Control Plane API service.
 * @module @devlab/portal-api
 */

import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";

// Load environment variables from local or parent directory
const candidateEnvs = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../../.env"),
];
for (const p of candidateEnvs) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p, override: false });
    if (process.env.DATABASE_URL) break;
  }
}

import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { Logger } from "@yuva-devlab/logger";

const logger = new Logger("PortalApiBootstrap");

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configuredOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
    : [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3005",
        "http://localhost:3020",
        "http://localhost:3025",
      ];

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow non-browser requests (mobile, cURL, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // Allow any local DevLab development port (3000-3099) or explicitly configured origin
      const isLocalhost =
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin === "http://localhost" ||
        origin === "http://127.0.0.1";

      if (isLocalhost || configuredOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  const port = process.env.PORT || 3015;
  await app.listen(port);

  logger.info(`🚀 DevLab Portal API Control Plane listening on http://localhost:${port}`);
  logger.info(`🔑 OIDC JWKS discovery endpoint: http://localhost:${port}/.well-known/jwks.json`);
  logger.info(`📊 GraphQL Playground: http://localhost:${port}/graphql`);
}

bootstrap().catch((err) => {
  new Logger("Bootstrap").error("FATAL BOOTSTRAP ERROR:", err);
  process.exit(1);
});
