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

  const configuredOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
    : [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "http://localhost:3030",
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

      // Allow any local DevLab development port (3000-3099), Vercel deployments, or explicitly configured origins
      const isLocalhost =
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin === "http://localhost" ||
        origin === "http://127.0.0.1";

      const isVercel =
        origin.endsWith(".vercel.app") || /^https:\/\/([a-z0-9-]+)\.vercel\.app$/.test(origin);

      if (isLocalhost || isVercel || configuredOrigins.includes(origin)) {
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
