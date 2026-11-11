/**
 * @file apps/api/src/modules/supervisor/supervisor.controller.ts
 * @description REST API controller for tenant-scoped process lifecycle, IDE launch, and dependency inspection.
 * @module @devlab/portal-api/supervisor
 */

import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import fs from "node:fs";
import { SupervisorService } from "./supervisor.service";
import { RegisterProcessDto } from "./dto/register-process.dto";
import { resolveWorkingDirectory } from "./supervisor.constants";
import { Logger } from "@yuva-devlab/logger";
import type {
  ProcessStatus,
  ProcessLogEntry,
  PortStatus,
  ExecutionMode,
  DependencyStatus,
} from "@yuva-devlab/supervisor";
import type { LaunchIdeResult } from "./supervisor-ide-launcher";

@Controller("api/v1/supervisor")
export class SupervisorController {
  private readonly logger = new Logger("SupervisorController");

  constructor(private readonly supervisorService: SupervisorService) {}

  /**
   * Retrieves status snapshots for registered processes, optionally scoped to a tenant.
   */
  @Get("status")
  async getAllStatuses(@Query("tenantId") tenantId?: string): Promise<ProcessStatus[]> {
    this.logger.info(
      `[getAllStatuses] Querying all process statuses (tenant=${tenantId || "all"})`,
    );
    return this.supervisorService.getAllStatuses(tenantId);
  }

  /**
   * Retrieves status snapshot for a single process with tenant validation.
   */
  @Get("status/:id")
  async getStatus(
    @Param("id") id: string,
    @Query("tenantId") tenantId?: string,
  ): Promise<ProcessStatus> {
    this.logger.info(
      `[getStatus] Querying status for process="${id}" (tenant=${tenantId || "default"})`,
    );
    return this.supervisorService.getStatus(id, tenantId);
  }

  /**
   * Inspects dependency status for an application's declared prerequisites.
   */
  @Get("dependencies/:id")
  async getDependencies(
    @Param("id") id: string,
    @Query("tenantId") tenantId?: string,
  ): Promise<DependencyStatus[]> {
    this.logger.info(`[getDependencies] Checking dependencies for process="${id}"`);
    return this.supervisorService.checkDependencies(id, tenantId);
  }

  /**
   * Registers a new application process dynamically under a tenant.
   */
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async registerProcess(
    @Body() dto: RegisterProcessDto,
  ): Promise<{ success: boolean; appId: string }> {
    this.logger.info(
      `[registerProcess] Registering process="${dto.appId}" (tenant=${dto.tenantId || "none"})`,
    );
    return this.supervisorService.registerAppFromDto(dto);
  }

  /**
   * Unregisters a supervised process, stopping it if running.
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async unregisterProcess(
    @Param("id") id: string,
    @Query("tenantId") tenantId?: string,
  ): Promise<{ success: boolean; appId: string }> {
    this.logger.info(`[unregisterProcess] Unregistering process="${id}"`);
    await this.supervisorService.unregisterApp(id, tenantId);
    return { success: true, appId: id };
  }

  /**
   * Starts a process by identifier with execution mode and optional dependency cascade.
   */
  @Post("start/:id")
  @HttpCode(HttpStatus.OK)
  async startProcess(
    @Param("id") id: string,
    @Query("tenantId") tenantId?: string,
    @Query("mode") mode?: ExecutionMode,
    @Query("cascade") cascade?: string,
  ): Promise<ProcessStatus> {
    const shouldCascade = cascade === "true" || cascade === "1";
    this.logger.info(
      `[startProcess] Starting process="${id}" (mode=${mode || "dev"}, cascade=${shouldCascade})`,
    );
    return this.supervisorService.startProcess(id, tenantId, mode, shouldCascade);
  }

  /**
   * Executes on-demand production build command for an application.
   */
  @Post("build/:id")
  @HttpCode(HttpStatus.OK)
  async buildProcess(
    @Param("id") id: string,
    @Query("tenantId") tenantId?: string,
  ): Promise<{ success: boolean; exitCode: number }> {
    this.logger.info(`[buildProcess] Triggering build for process="${id}"`);
    return this.supervisorService.buildProcess(id, tenantId);
  }

  /**
   * Launches host IDE (Antigravity, VS Code, Cursor) targeting application working directory.
   */
  @Post("open-ide/:id")
  @HttpCode(HttpStatus.OK)
  async openInIde(
    @Param("id") id: string,
    @Body() body?: { ide?: string },
    @Query("tenantId") tenantId?: string,
  ): Promise<LaunchIdeResult> {
    this.logger.info(`[openInIde] Opening process="${id}" in IDE="${body?.ide || "antigravity"}"`);
    return this.supervisorService.openInIde(id, body?.ide, tenantId);
  }

  /**
   * Validates whether a given filesystem directory path exists on the host.
   */
  @Post("validate-path")
  @HttpCode(HttpStatus.OK)
  validatePath(@Body() body: { path: string }): {
    exists: boolean;
    path: string;
    isDirectory: boolean;
  } {
    const rawPath = body.path || "";
    const resolved = resolveWorkingDirectory(rawPath);
    let exists = false;
    let isDirectory = false;
    try {
      exists = fs.existsSync(resolved);
      if (exists) {
        isDirectory = fs.statSync(resolved).isDirectory();
      }
    } catch {
      // Ignore filesystem inspection errors
    }
    this.logger.info(`[validatePath] Path="${resolved}" exists=${exists} isDir=${isDirectory}`);
    return { exists, path: resolved, isDirectory };
  }

  /**
   * Stops an active process gracefully.
   */
  @Post("stop/:id")
  @HttpCode(HttpStatus.OK)
  async stopProcess(
    @Param("id") id: string,
    @Query("tenantId") tenantId?: string,
  ): Promise<ProcessStatus> {
    this.logger.info(`[stopProcess] Stopping process="${id}"`);
    return this.supervisorService.stopProcess(id, tenantId);
  }

  /**
   * Restarts an existing process.
   */
  @Post("restart/:id")
  @HttpCode(HttpStatus.OK)
  async restartProcess(
    @Param("id") id: string,
    @Query("tenantId") tenantId?: string,
    @Query("mode") mode?: ExecutionMode,
  ): Promise<ProcessStatus> {
    this.logger.info(`[restartProcess] Restarting process="${id}" (mode=${mode || "dev"})`);
    return this.supervisorService.restartProcess(id, tenantId, mode);
  }

  /**
   * Returns recent buffered logs for a process.
   */
  @Get("logs/:id")
  getLogs(
    @Param("id") id: string,
    @Query("limit", new ParseIntPipe({ optional: true })) limit?: number,
    @Query("tenantId") tenantId?: string,
  ): ProcessLogEntry[] {
    return this.supervisorService.getLogs(id, limit || 200, tenantId);
  }

  /**
   * Probes port occupancy for registered apps or explicit tenant ports.
   */
  @Get("ports")
  async probePorts(@Query("tenantId") tenantId?: string): Promise<PortStatus[]> {
    this.logger.info(`[probePorts] Probing port occupancy`);
    return this.supervisorService.probePorts(undefined, tenantId);
  }
}
