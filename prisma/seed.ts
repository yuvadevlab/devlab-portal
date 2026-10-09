/**
 * @file prisma/seed.ts
 * @description Database seeder populating initial super admin and server-driven navigation items.
 * Adheres strictly to Rule 7 (zero synthetic app entities) and Rule 8 (dynamic navigation configuration).
 * @module devlab-portal/prisma
 */

import { PrismaClient } from "./generated/index.js";
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

  // 2. Seed Dynamic Navigation Items (DB-Driven Menus)
  const navigationItems = [
    {
      key: "apps",
      label: "Ecosystem Apps & Services",
      icon: "Grid2X2",
      order: 1,
      isEnabled: true,
    },
    {
      key: "iam",
      label: "IAM & API Keys",
      icon: "KeyRound",
      order: 2,
      isEnabled: true,
    },
    {
      key: "audit",
      label: "Security & Audit Ledger",
      icon: "ShieldCheck",
      order: 3,
      isEnabled: true,
    },
    {
      key: "team",
      label: "Team & Permissions",
      icon: "Users",
      order: 4,
      isEnabled: true,
    },
    {
      key: "settings",
      label: "Settings & JWKS",
      icon: "Settings2",
      order: 5,
      isEnabled: true,
    },
  ];

  for (const item of navigationItems) {
    const record = await prisma.navigationItem.upsert({
      where: { key: item.key },
      update: {
        label: item.label,
        icon: item.icon,
        order: item.order,
        isEnabled: item.isEnabled,
      },
      create: {
        key: item.key,
        label: item.label,
        icon: item.icon,
        order: item.order,
        isEnabled: item.isEnabled,
      },
    });
    console.log(
      `✅ Seeded Navigation Item: [${record.key}] ${record.label} (order: ${record.order})`,
    );
  }

  // 3. Seed Initial Audit Logs
  const initialAuditLogs = [
    {
      action: "system.bootstrapped",
      targetType: "system",
      targetId: "Control Plane",
      metadata: { environment: "development", initializedBy: superAdmin.email },
    },
    {
      action: "navigation.configured",
      targetType: "navigation",
      targetId: "Navigation Items",
      metadata: { count: navigationItems.length },
    },
  ];

  for (const log of initialAuditLogs) {
    const existing = await prisma.auditLog.findFirst({
      where: { action: log.action, targetId: log.targetId },
    });
    if (!existing) {
      await prisma.auditLog.create({
        data: {
          action: log.action,
          actorId: superAdmin.id,
          targetType: log.targetType,
          targetId: log.targetId,
          metadata: log.metadata,
        },
      });
      console.log(`✅ Seeded Audit Log: ${log.action} on ${log.targetId}`);
    }
  }

  console.log("🌱 Database seeding completed successfully. Zero synthetic apps seeded.");
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
