/**
 * @file apps/api/src/prisma/prisma.module.ts
 * @description Global module exporting PrismaService singleton.
 * @module @devlab/portal-api/prisma
 */

import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service.js";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
