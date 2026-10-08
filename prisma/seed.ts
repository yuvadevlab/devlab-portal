/**
 * @file prisma/seed.ts
 * @description Database seeder populating initial super admin and application blueprints.
 * @module devlab-portal/prisma
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Executes database seeding with idempotent upsert operations.
 */
async function main(): Promise<void> {
  console.log("🌱 Starting DevLab Portal database seed...");

  // 1. Seed Super Admin User
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "DevLab@2026!Admin";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@devlab.internal" },
    update: {
      name: "Platform Super Admin",
      role: "super_admin",
      isActive: true,
    },
    create: {
      email: "admin@devlab.internal",
      name: "Platform Super Admin",
      passwordHash,
      role: "super_admin",
      isActive: true,
    },
  });

  console.log(`✅ Seeded Super Admin: ${superAdmin.email} (${superAdmin.id})`);

  // 2. Seed Registered Apps
  const apps = [
    {
      appId: "finai",
      name: "FinAI Studio",
      slug: "finai",
      description: "Financial Intelligence Agentic Assistant",
      originUrl: "http://localhost:3000",
      callbackUrls: ["http://localhost:3000/api/auth/callback", "http://localhost:3000"],
      healthUrl: "http://localhost:3002/api/v1/health",
      environment: "local_dev" as const,
      isActive: true,
      clientSecret: "devlab_finai_secret_2026",
    },
    {
      appId: "orchestrai",
      name: "OrchestrAI",
      slug: "orchestrai",
      description: "Distributed Autonomous Multi-Agent Swarm Orchestrator",
      originUrl: "http://localhost:3001",
      callbackUrls: ["http://localhost:3001/api/auth/callback", "http://localhost:3001"],
      healthUrl: "http://localhost:3000/api/v1/health",
      environment: "local_dev" as const,
      isActive: true,
      clientSecret: "devlab_orchestrai_secret_2026",
    },
  ];

  for (const app of apps) {
    const secretHash = await bcrypt.hash(app.clientSecret, 10);

    const record = await prisma.registeredApp.upsert({
      where: { appId: app.appId },
      update: {
        name: app.name,
        slug: app.slug,
        description: app.description,
        originUrl: app.originUrl,
        callbackUrls: app.callbackUrls,
        healthUrl: app.healthUrl,
        environment: app.environment,
        isActive: app.isActive,
      },
      create: {
        appId: app.appId,
        name: app.name,
        slug: app.slug,
        description: app.description,
        originUrl: app.originUrl,
        callbackUrls: app.callbackUrls,
        healthUrl: app.healthUrl,
        environment: app.environment,
        isActive: app.isActive,
        clientSecretHash: secretHash,
      },
    });

    console.log(`✅ Seeded Registered App: ${record.name} [${record.appId}]`);
  }

  console.log("🌱 Database seeding completed successfully.");
}

main()
  .catch((err) => {
    console.error("❌ Seed failure:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
