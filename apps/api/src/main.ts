/**
 * @file apps/api/src/main.ts
 * @description Bootstrap entrypoint for the DevLab Portal Control Plane API service.
 * @module @devlab/portal-api
 */

import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

// Attempt to load .env from multiple candidate paths across execution contexts
const candidateEnvPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "apps/api/.env"),
  path.resolve(__dirname, "../.env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, "../../../apps/api/.env"),
];

for (const envPath of candidateEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
  }
}

import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { OIDC_ROUTES } from "./common/constants/routes";
import { Logger, correlationMiddleware, requestLogger } from "@yuva-devlab/logger";

const logger = new Logger("PortalApiBootstrap");

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.use(correlationMiddleware({ serviceName: "devlab-portal-api" }));
  app.use(requestLogger(new Logger("HTTP")));

  const rawCorsOrigins =
    process.env.CORS_ALLOWED_ORIGINS || process.env.CORS_ORIGIN || process.env.PORTAL_ORIGIN || "";

  const allowedOriginsSet = new Set(
    rawCorsOrigins
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );

  const allowPreviews = process.env.CORS_ALLOW_PREVIEWS === "true";
  const previewRegex = /^https:\/\/[a-z0-9-]+-yuvadevlab\.vercel\.app$/;

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow non-browser requests (mobile, cURL, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOriginsSet.has(origin)) {
        return callback(null, true);
      }

      if (allowPreviews && previewRegex.test(origin)) {
        return callback(null, true);
      }

      callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Accept",
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "x-correlation-id",
      "X-Correlation-Id",
      "x-request-id",
      "X-Request-Id",
      "x-tenant-id",
      "X-Tenant-Id",
      "x-workspace-id",
      "X-Workspace-Id",
      "traceparent",
    ],
    exposedHeaders: ["x-correlation-id", "x-request-id"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port, "0.0.0.0");

  logger.info(`🚀 DevLab Portal API Control Plane listening on http://0.0.0.0:${port}`);
  logger.info(`🔑 OIDC JWKS discovery endpoint: http://localhost:${port}${OIDC_ROUTES.JWKS}`);
  logger.info(`📊 GraphQL Playground: http://localhost:${port}/graphql`);
}

bootstrap().catch((err: unknown) => {
  const details = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
  new Logger("Bootstrap").error(`FATAL BOOTSTRAP ERROR: ${details}`);
  process.exit(1);
});
