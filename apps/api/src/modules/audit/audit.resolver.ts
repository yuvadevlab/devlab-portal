/**
 * @file apps/api/src/modules/audit/audit.resolver.ts
 * @description GraphQL resolver providing audit logs queries for IAM studio and dashboards.
 * @module @devlab/portal-api/audit
 */

import { Resolver, Query, Args, Int } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { AuditService } from "./audit.service.js";
import { AuthGuard } from "../auth/auth.guard.js";
import { AuditLogType } from "./dto/audit.dto.js";

@Resolver(() => AuditLogType)
export class AuditResolver {
  constructor(private readonly auditService: AuditService) {}

  @Query(() => [AuditLogType], { name: "auditLogs" })
  @UseGuards(AuthGuard)
  async getAuditLogs(
    @Args("limit", { type: () => Int, defaultValue: 50 }) limit: number,
    @Args("offset", { type: () => Int, defaultValue: 0 }) offset: number,
  ) {
    return this.auditService.listLogs(limit, offset);
  }
}
