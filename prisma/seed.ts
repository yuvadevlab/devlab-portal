/**
 * @file prisma/seed.ts
 * @description Database seeder populating initial workspace tenant, default super admin, and navigation menu.
 * Idempotent upserts preserve all existing database records without emptying or dropping data.
 * @module devlab-portal/prisma
 */

import { PrismaClient, Role } from "./generated";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { INITIAL_TENANT, NAVIGATION_ITEMS, AppAccessScope, ECOSYSTEM_APPS } from "./seed-data";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  console.log("🌱 Starting DevLab Portal database seed...");

  // 1. Seed Active Workspace Tenant (idempotent upsert)
  const tenant = await prisma.tenant.upsert({
    where: { slug: INITIAL_TENANT.slug },
    update: INITIAL_TENANT,
    create: INITIAL_TENANT,
  });
  console.log(`✅ Seeded Tenant: ${tenant.name} (${tenant.id})`);

  // 2. Seed Single Default Super Admin User (idempotent upsert)
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "DevLab@2026!Admin";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@devlab.internal" },
    update: {
      name: "Platform Super Admin",
      role: Role.super_admin,
      isActive: true,
      allowedApps: [AppAccessScope.ALL],
      tenantId: tenant.id,
    },
    create: {
      email: "admin@devlab.internal",
      name: "Platform Super Admin",
      passwordHash,
      role: Role.super_admin,
      isActive: true,
      allowedApps: [AppAccessScope.ALL],
      tenantId: tenant.id,
    },
  });
  console.log(`✅ Seeded Default User: ${superAdmin.email}`);

  // 3. Seed Dynamic Navigation Menu Items (idempotent upsert)
  for (const item of NAVIGATION_ITEMS) {
    const record = await prisma.navigationItem.upsert({
      where: { key: item.key },
      update: item,
      create: item,
    });
    console.log(`✅ Seeded Navigation Menu Item: [${record.key}] ${record.label}`);
  }

  // 4. Seed Registered Ecosystem Applications (idempotent upsert)
  const defaultSecretHash = await bcrypt.hash("devlab_secret_token_default", 10);
  for (const app of ECOSYSTEM_APPS) {
    await prisma.registeredApp.upsert({
      where: { appId: app.appId },
      update: {
        name: app.name,
        originUrl: app.originUrl,
        apiUrl: app.apiUrl,
        callbackUrls: [...app.callbackUrls],
        healthUrl: app.healthUrl,
        themeColor: app.themeColor,
      },
      create: {
        appId: app.appId,
        name: app.name,
        slug: app.slug,
        description: app.description,
        originUrl: app.originUrl,
        apiUrl: app.apiUrl,
        callbackUrls: [...app.callbackUrls],
        healthUrl: app.healthUrl,
        themeColor: app.themeColor,
        environment: app.environment,
        isActive: app.isActive,
        tenantId: tenant.id,
        clientSecretHash: defaultSecretHash,
      },
    });
    console.log(`✅ Seeded Registered App: [${app.appId}] ${app.name}`);
  }

  // 5. Seed Initial Bootstrap Audit Log if not already present
  const existingAudit = await prisma.auditLog.findFirst({
    where: { action: "system.bootstrapped", targetId: "Control Plane" },
  });
  if (!existingAudit) {
    await prisma.auditLog.create({
      data: {
        action: "system.bootstrapped",
        actorId: superAdmin.id,
        targetType: "system",
        targetId: "Control Plane",
        metadata: { environment: "development", initializedBy: superAdmin.email },
      },
    });
    console.log("✅ Seeded Initial Audit Log");
  }

  console.log(
    "🌱 Database seeding completed successfully (all existing database records preserved).",
  );
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
