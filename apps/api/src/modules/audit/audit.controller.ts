/**
 * @file apps/api/src/modules/audit/audit.controller.ts
 * @description REST endpoint providing paginated access to the security audit ledger.
 * @module @devlab/portal-api/audit
 */

import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AuditService } from "./audit.service";
import { AuthGuard } from "../auth/auth.guard";
import { Logger } from "@yuva-devlab/logger";

@Controller("api/v1/audit-logs")
export class AuditController {
  private readonly logger = new Logger("AuditController");

  constructor(private readonly auditService: AuditService) {}

  @Get()
  @UseGuards(AuthGuard)
  async listLogs(
    @CurrentUser() user: { sub: string; role?: string; tenant_id?: string },
    @Query("limit") limit?: string,
    @Query("offset") offset?: string,
  ) {
    this.logger.info(`[listLogs] Fetching audit logs for actor=${user?.sub}`);
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;
    return this.auditService.listLogs(parsedLimit, parsedOffset, user);
  }
}
