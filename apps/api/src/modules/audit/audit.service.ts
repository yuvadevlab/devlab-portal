/**
 * @file apps/api/src/modules/audit/audit.service.ts
 * @description Service managing immutable audit logs and governance queries.
 * @module @devlab/portal-api/audit
 */

import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { Logger } from "@yuva-devlab/logger";

@Injectable()
export class AuditService {
  private readonly logger = new Logger("AuditService");

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves paginated audit log entries with associated actor metadata.
   */
  async listLogs(limit = 50, offset = 0) {
    return this.prisma.auditLog.findMany({
      take: Math.min(limit, 100),
      skip: offset,
      orderBy: { createdAt: "desc" },
      include: {
        actor: {
          select: { id: true, email: true, name: true },
        },
      },
    });
  }

  /**
   * Appends an immutable audit event to PostgreSQL ledger.
   */
  async record(params: {
    action: string;
    actorId: string;
    targetType: string;
    targetId: string;
    metadata?: Record<string, unknown>;
  }) {
    this.logger.info(
      `Recording audit event: ${params.action} on ${params.targetType}:${params.targetId}`,
    );
    return this.prisma.auditLog.create({
      data: {
        action: params.action,
        actorId: params.actorId,
        targetType: params.targetType,
        targetId: params.targetId,
        metadata: (params.metadata ?? {}) as any,
      },
    });
  }
}
