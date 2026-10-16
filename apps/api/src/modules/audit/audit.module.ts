/**
 * @file apps/api/src/modules/audit/audit.module.ts
 * @description Module encapsulating security audit logging and query capabilities.
 * @module @devlab/portal-api/audit
 */

import { Module } from "@nestjs/common";
import { AuditService } from "./audit.service";
import { AuditController } from "./audit.controller";
import { AuditResolver } from "./audit.resolver";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [AuditController],
  providers: [AuditService, AuditResolver],
  exports: [AuditService],
})
export class AuditModule {}
