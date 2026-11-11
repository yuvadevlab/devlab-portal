/**
 * @file apps/api/src/main.ts
 * @description Bootstrap entrypoint for the DevLab Portal Control Plane API service.
 * @module @devlab/portal-api
 */

import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(__dirname, "../.env"), override: false });

import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
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
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "x-correlation-id",
      "x-request-id",
      "x-tenant-id",
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

  const port = process.env.PORT || 3015;
  await app.listen(port);

  logger.info(`🚀 DevLab Portal API Control Plane listening on http://localhost:${port}`);
  logger.info(`🔑 OIDC JWKS discovery endpoint: http://localhost:${port}/.well-known/jwks.json`);
  logger.info(`📊 GraphQL Playground: http://localhost:${port}/graphql`);
}

bootstrap().catch((err: unknown) => {
  const details = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
  new Logger("Bootstrap").error(`FATAL BOOTSTRAP ERROR: ${details}`);
  process.exit(1);
});
