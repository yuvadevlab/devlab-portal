/**
 * @file apps/api/src/modules/supervisor/supervisor.service.ts
 * @description Multi-tenant process supervisor service managing process lifecycles and telemetry.
 * @module @devlab/portal-api/supervisor
 */

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Logger } from "@yuva-devlab/logger";
import {
  ProcessSupervisor,
  PortProber,
  type AppProcessConfig,
  type ProcessStatus,
  type ProcessLogEntry,
  type PortStatus,
  type ExecutionMode,
  type DependencyStatus,
} from "@yuva-devlab/supervisor";
import { resolveAppProcessConfig } from "./supervisor.constants";
import { launchHostIde, type LaunchIdeResult } from "./supervisor-ide-launcher";
import { RegisterProcessDto } from "./dto/register-process.dto";

@Injectable()
export class SupervisorService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger("SupervisorService");
  private readonly supervisor: ProcessSupervisor;
  private readonly registeredConfigs = new Map<string, AppProcessConfig>();
  private readonly appTenants = new Map<string, string>();

  constructor(private readonly prisma: PrismaService) {
    this.supervisor = new ProcessSupervisor({
      maxLogBufferSize: 3000,
      healthPollIntervalMs: 500,
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.supervisor.init();
      this.logger.info("[onModuleInit] Process Supervisor initialized successfully");
    } catch (err) {
      this.logger.error("[onModuleInit] Failed to initialize process supervisor", err);
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.info("[onModuleDestroy] Shutting down managed processes on module destroy...");
    await this.supervisor.shutdownAll();
  }

  async ensureAppRegistered(appId: string, tenantId?: string): Promise<AppProcessConfig | null> {
    const existing = this.registeredConfigs.get(appId) ?? this.supervisor.getConfig(appId);
    if (existing) return existing;

    try {
      const app = await this.prisma.registeredApp.findUnique({ where: { appId } });
      if (!app) return null;

      this.assertTenantAccess(appId, tenantId ?? app.tenantId ?? undefined);
      const config = resolveAppProcessConfig(app);
      this.registerApp(config, app.tenantId ?? tenantId);
      return config;
    } catch (err) {
      this.logger.warn(
        `[ensureAppRegistered] Could not auto-register "${appId}": ${(err as Error).message}`,
      );
      return null;
    }
  }

  registerApp(config: AppProcessConfig, tenantId?: string): void {
    this.supervisor.registerApp(config);
    this.registeredConfigs.set(config.appId, config);
    if (tenantId) this.appTenants.set(config.appId, tenantId);
    this.logger.info(`[registerApp] Process registered: ${config.appId} (${tenantId ?? "system"})`);
  }

  registerAppFromDto(dto: RegisterProcessDto): { success: boolean; appId: string } {
    this.logger.info(`[registerAppFromDto] Registering process from DTO: ${dto.appId}`);
    this.registerApp(dto, dto.tenantId);
    return { success: true, appId: dto.appId };
  }

  async unregisterApp(appId: string, tenantId?: string): Promise<void> {
    this.logger.info(`[unregisterApp] Unregistering process: ${appId}`);
    this.assertTenantAccess(appId, tenantId);
    await this.supervisor.stop(appId, true).catch(() => {});
    this.supervisor.unregisterApp(appId);
    this.registeredConfigs.delete(appId);
    this.appTenants.delete(appId);
  }

  async getAllStatuses(tenantId?: string): Promise<ProcessStatus[]> {
    try {
      const apps = await this.prisma.registeredApp.findMany({
        where: tenantId ? { tenantId } : {},
      });
      for (const app of apps) {
        if (!this.registeredConfigs.has(app.appId)) {
          await this.ensureAppRegistered(app.appId, app.tenantId ?? tenantId);
        }
      }
    } catch (err) {
      this.logger.warn(
        `[getAllStatuses] Could not sync tenant apps from DB: ${(err as Error).message}`,
      );
    }

    const statuses = await this.supervisor.getAllStatuses();
    return tenantId
      ? statuses.filter((s: ProcessStatus) => this.appTenants.get(s.appId) === tenantId)
      : statuses;
  }

  async getStatus(appId: string, tenantId?: string): Promise<ProcessStatus> {
    await this.resolveOrThrow(appId, tenantId);
    return this.supervisor.getStatus(appId);
  }

  async checkDependencies(appId: string, tenantId?: string): Promise<DependencyStatus[]> {
    this.logger.info(`[checkDependencies] Inspecting prerequisites for ${appId}`);
    await this.resolveOrThrow(appId, tenantId);
    return this.supervisor.checkDependencies(appId);
  }

  async startProcess(
    appId: string,
    tenantId?: string,
    mode?: ExecutionMode,
    cascade = false,
  ): Promise<ProcessStatus> {
    const start = Date.now();
    await this.assertAppActive(appId);
    const config = await this.resolveOrThrow(appId, tenantId);

    if (cascade && config.dependsOn && config.dependsOn.length > 0) {
      for (const depId of config.dependsOn) {
        await this.ensureAppRegistered(depId, tenantId);
        const depStatus = await this.supervisor.getStatus(depId);
        if (depStatus.state !== "RUNNING") {
          this.logger.info(
            `[startProcess] Cascade-starting prerequisite app: ${depId} for ${appId}`,
          );
          await this.supervisor.start(depId, mode);
        }
      }
    }

    this.logger.info(
      `[startProcess] Starting process: ${appId} (mode=${mode || "dev"}) in ${config.workingDir}`,
    );
    const status = await this.supervisor.start(appId, mode);
    this.logger.info(
      `[startProcess] Process ${appId} state=${status.state} (took ${Date.now() - start}ms)`,
    );
    return status;
  }

  async buildProcess(
    appId: string,
    tenantId?: string,
  ): Promise<{ success: boolean; exitCode: number }> {
    const start = Date.now();
    const config = await this.resolveOrThrow(appId, tenantId);
    this.logger.info(`[buildProcess] Building process: ${appId} in ${config.workingDir}`);
    const result = await this.supervisor.build(appId);
    this.logger.info(
      `[buildProcess] Process ${appId} build exitCode=${result.exitCode} (${Date.now() - start}ms)`,
    );
    return result;
  }

  async openInIde(appId: string, ide?: string, tenantId?: string): Promise<LaunchIdeResult> {
    const config = await this.resolveOrThrow(appId, tenantId);
    this.logger.info(`[openInIde] Launching IDE "${ide || "antigravity"}" for ${appId}`);
    return launchHostIde(config.workingDir, ide || "antigravity");
  }

  async stopProcess(appId: string, tenantId?: string, force = false): Promise<ProcessStatus> {
    this.logger.info(`[stopProcess] Stopping process: ${appId} (force=${force})`);
    this.assertTenantAccess(appId, tenantId);
    await this.ensureAppRegistered(appId, tenantId);
    return this.supervisor.stop(appId, force);
  }

  async restartProcess(
    appId: string,
    tenantId?: string,
    mode?: ExecutionMode,
  ): Promise<ProcessStatus> {
    this.logger.info(`[restartProcess] Restarting process: ${appId} (mode=${mode || "dev"})`);
    await this.assertAppActive(appId);
    this.assertTenantAccess(appId, tenantId);
    await this.ensureAppRegistered(appId, tenantId);
    return this.supervisor.restart(appId, mode);
  }

  getLogs(appId: string, limit = 200, tenantId?: string): ProcessLogEntry[] {
    this.assertTenantAccess(appId, tenantId);
    return this.supervisor.getLogs(appId, limit);
  }

  async probePorts(ports?: readonly number[], tenantId?: string): Promise<PortStatus[]> {
    if (ports && ports.length > 0) return PortProber.checkPorts(ports);
    const configs = tenantId
      ? Array.from(this.registeredConfigs.values()).filter(
          (c) => this.appTenants.get(c.appId) === tenantId,
        )
      : Array.from(this.registeredConfigs.values());
    const targetPorts = Array.from(new Set(configs.flatMap((c) => c.ports || [])));
    return targetPorts.length === 0 ? [] : PortProber.checkPorts(targetPorts);
  }

  onStateChange(listener: (status: ProcessStatus) => void): void {
    this.supervisor.on("state", listener);
  }

  onLog(listener: (entry: ProcessLogEntry) => void): void {
    this.supervisor.on("log", listener);
  }

  private async assertAppActive(appId: string): Promise<void> {
    const app = await this.prisma.registeredApp.findUnique({
      where: { appId },
      select: { isActive: true, name: true, maintenanceNote: true },
    });
    if (app && !app.isActive) {
      this.logger.warn(
        `[assertAppActive] Rejected process execution for "${appId}": Deactivated via kill-switch`,
      );
      throw new ForbiddenException(
        `Application "${app.name || appId}" is deactivated via Platform Kill-Switch${
          app.maintenanceNote ? ` (${app.maintenanceNote})` : ""
        }. Reactivate in Applications catalog to run.`,
      );
    }
  }

  private async resolveOrThrow(appId: string, tenantId?: string): Promise<AppProcessConfig> {
    this.assertTenantAccess(appId, tenantId);
    const config =
      this.registeredConfigs.get(appId) ??
      this.supervisor.getConfig(appId) ??
      (await this.ensureAppRegistered(appId, tenantId));
    if (!config) {
      this.logger.warn(`[resolveOrThrow] Process with ID "${appId}" is not registered`);
      throw new NotFoundException(`Process with ID "${appId}" is not registered`);
    }
    return config;
  }

  private assertTenantAccess(appId: string, tenantId?: string): void {
    if (tenantId && this.appTenants.has(appId) && this.appTenants.get(appId) !== tenantId) {
      this.logger.warn(
        `[assertTenantAccess] Forbidden tenant access to "${appId}" for tenant "${tenantId}"`,
      );
      throw new ForbiddenException(
        `App process "${appId}" does not belong to tenant "${tenantId}"`,
      );
    }
  }
}
