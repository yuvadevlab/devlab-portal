/**
 * @file apps/api/src/modules/audit/audit.module.ts
 * @description Module encapsulating security audit logging and query capabilities.
 * @module @devlab/portal-api/audit
 */

import { Module } from "@nestjs/common";
import { AuditService } from "./audit.service.js";
import { AuditController } from "./audit.controller.js";
import { AuditResolver } from "./audit.resolver.js";
import { AuthModule } from "../auth/auth.module.js";

@Module({
  imports: [AuthModule],
  controllers: [AuditController],
  providers: [AuditService, AuditResolver],
  exports: [AuditService],
})
export class AuditModule {}
