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
import { AppModule } from "./app.module.js";
import { Logger } from "@yuva-devlab/logger";

const logger = new Logger("PortalApiBootstrap");

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
    : ["http://localhost:3000", "http://localhost:3001", "http://localhost:3005"];

  app.enableCors({
    origin: corsOrigins,
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
