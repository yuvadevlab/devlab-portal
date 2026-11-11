/**
 * @file apps/api/src/modules/supervisor/supervisor.service.ts
 * @description Multi-tenant process supervisor service managing process lifecycles and telemetry.
 * @module @devlab/portal-api/supervisor
 */

import { Injectable, NotFoundException, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Logger } from "@yuva-devlab/logger";
import {
  ProcessSupervisor,
  type AppProcessConfig,
  type ProcessStatus,
  type ProcessLogEntry,
  type PortStatus,
  type ExecutionMode,
  type DependencyStatus,
} from "@yuva-devlab/supervisor";
import {
  resolveAppProcessConfig,
  DEVLAB_PORTAL_CORE_CONFIG,
  isPortalCoreApp,
} from "./supervisor.constants";
import {
  buildPortalCoreStatus,
  normalizePortalDependency,
  assertNotPortalCore,
  cascadeStartPrerequisites,
  probeConfiguredPorts,
} from "./supervisor-host";
import { assertTenantAccess, assertAppActive } from "./supervisor-guards";
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
      this.registerApp(DEVLAB_PORTAL_CORE_CONFIG);
      this.logger.info("[onModuleInit] Process Supervisor initialized with DevLab Portal Core");
    } catch (err) {
      this.logger.error("[onModuleInit] Failed to initialize process supervisor", err);
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.info("[onModuleDestroy] Shutting down managed processes on module destroy...");
    await this.supervisor.shutdownAll();
  }

  async ensureAppRegistered(appId: string, tenantId?: string): Promise<AppProcessConfig | null> {
    if (isPortalCoreApp(appId)) {
      this.registeredConfigs.set(appId, DEVLAB_PORTAL_CORE_CONFIG);
      this.supervisor.registerApp(DEVLAB_PORTAL_CORE_CONFIG);
      return DEVLAB_PORTAL_CORE_CONFIG;
    }

    const existing = this.registeredConfigs.get(appId) ?? this.supervisor.getConfig(appId);
    if (existing) return existing;

    try {
      const app = await this.prisma.registeredApp.findUnique({ where: { appId } });
      if (!app) return null;

      assertTenantAccess(
        this.appTenants,
        appId,
        tenantId ?? app.tenantId ?? undefined,
        this.logger,
      );
      const config = resolveAppProcessConfig(app);
      this.registerApp(config, app.tenantId ?? tenantId);
      return config;
    } catch (err) {
      this.logger.warn(
        `[ensureAppRegistered] Auto-register failed for "${appId}": ${(err as Error).message}`,
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
    assertTenantAccess(this.appTenants, appId, tenantId, this.logger);
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
      this.logger.warn(`[getAllStatuses] Sync error: ${(err as Error).message}`);
    }

    const statuses = await this.supervisor.getAllStatuses();
    return tenantId
      ? statuses.filter((s: ProcessStatus) => this.appTenants.get(s.appId) === tenantId)
      : statuses;
  }

  async getStatus(appId: string, tenantId?: string): Promise<ProcessStatus> {
    if (isPortalCoreApp(appId)) return buildPortalCoreStatus();
    await this.resolveOrThrow(appId, tenantId);
    return this.supervisor.getStatus(appId);
  }

  async checkDependencies(appId: string, tenantId?: string): Promise<DependencyStatus[]> {
    this.logger.info(`[checkDependencies] Inspecting prerequisites for ${appId}`);
    await this.resolveOrThrow(appId, tenantId);
    const deps = await this.supervisor.checkDependencies(appId);
    return deps.map((dep) => normalizePortalDependency(dep));
  }

  async startProcess(
    appId: string,
    tenantId?: string,
    mode?: ExecutionMode,
    cascade = false,
  ): Promise<ProcessStatus> {
    if (isPortalCoreApp(appId)) return this.getStatus(appId, tenantId);
    const start = Date.now();
    await assertAppActive(this.prisma, appId, this.logger);
    const config = await this.resolveOrThrow(appId, tenantId);

    if (cascade) {
      await cascadeStartPrerequisites(
        this.supervisor,
        (id) => this.ensureAppRegistered(id, tenantId),
        config.dependsOn,
        mode,
        this.logger,
      );
    }

    this.logger.info(
      `[startProcess] Starting: ${appId} (mode=${mode || "dev"}) in ${config.workingDir}`,
    );
    const status = await this.supervisor.start(appId, mode);
    this.logger.info(
      `[startProcess] Process ${appId} state=${status.state} (${Date.now() - start}ms)`,
    );
    return status;
  }

  async buildProcess(
    appId: string,
    tenantId?: string,
  ): Promise<{ success: boolean; exitCode: number }> {
    const start = Date.now();
    const config = await this.resolveOrThrow(appId, tenantId);
    this.logger.info(`[buildProcess] Building: ${appId} in ${config.workingDir}`);
    const result = await this.supervisor.build(appId);
    this.logger.info(
      `[buildProcess] Process ${appId} exitCode=${result.exitCode} (${Date.now() - start}ms)`,
    );
    return result;
  }

  async openInIde(appId: string, ide?: string, tenantId?: string): Promise<LaunchIdeResult> {
    const config = await this.resolveOrThrow(appId, tenantId);
    this.logger.info(`[openInIde] Launching IDE "${ide || "antigravity"}" for ${appId}`);
    return launchHostIde(config.workingDir, ide || "antigravity");
  }

  async stopProcess(appId: string, tenantId?: string, force = false): Promise<ProcessStatus> {
    assertNotPortalCore(appId, "stop");
    this.logger.info(`[stopProcess] Stopping: ${appId} (force=${force})`);
    assertTenantAccess(this.appTenants, appId, tenantId, this.logger);
    await this.ensureAppRegistered(appId, tenantId);
    return this.supervisor.stop(appId, force);
  }

  async restartProcess(
    appId: string,
    tenantId?: string,
    mode?: ExecutionMode,
  ): Promise<ProcessStatus> {
    assertNotPortalCore(appId, "restart");
    this.logger.info(`[restartProcess] Restarting: ${appId} (mode=${mode || "dev"})`);
    await assertAppActive(this.prisma, appId, this.logger);
    assertTenantAccess(this.appTenants, appId, tenantId, this.logger);
    await this.ensureAppRegistered(appId, tenantId);
    return this.supervisor.restart(appId, mode);
  }

  getLogs(appId: string, limit = 200, tenantId?: string): ProcessLogEntry[] {
    assertTenantAccess(this.appTenants, appId, tenantId, this.logger);
    return this.supervisor.getLogs(appId, limit);
  }

  async probePorts(ports?: readonly number[], tenantId?: string): Promise<PortStatus[]> {
    const configs = tenantId
      ? Array.from(this.registeredConfigs.values()).filter(
          (c) => this.appTenants.get(c.appId) === tenantId,
        )
      : Array.from(this.registeredConfigs.values());
    return probeConfiguredPorts(configs, ports);
  }

  onStateChange(listener: (status: ProcessStatus) => void): void {
    this.supervisor.on("state", listener);
  }

  onLog(listener: (entry: ProcessLogEntry) => void): void {
    this.supervisor.on("log", listener);
  }

  private async resolveOrThrow(appId: string, tenantId?: string): Promise<AppProcessConfig> {
    if (isPortalCoreApp(appId)) return DEVLAB_PORTAL_CORE_CONFIG;
    assertTenantAccess(this.appTenants, appId, tenantId, this.logger);
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
}
