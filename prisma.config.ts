import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "prisma/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiEnvPath = path.resolve(__dirname, "apps/api/.env");
if (fs.existsSync(apiEnvPath)) {
  dotenv.config({ path: apiEnvPath, override: false });
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "",
  },
});
