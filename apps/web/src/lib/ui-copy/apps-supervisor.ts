/**
 * @file apps/web/src/lib/ui-copy/apps-supervisor.ts
 * @description Localized string catalog for process supervisor drawer and dependency selector.
 * @module @devlab/portal-web/ui-copy/apps-supervisor
 */

export const APPS_DEPENDENCY_SELECTOR_COPY = {
  LABEL: "Prerequisite Applications",
  SELECT_PLACEHOLDER: "+ Add prerequisite application...",
  ALL_SELECTED: "All available applications selected",
  CORE_BADGE: "Platform Core",
  REMOVE_ARIA: "Remove prerequisite",
  HINT: "Ecosystem applications that must be verified running before booting this service.",
  PORTAL_NAME: "DevLab Portal",
} as const;

export const APPS_SUPERVISOR_COPY = {
  DRAWER_TITLE_SUFFIX: "Process Supervisor",
  DRAWER_DESCRIPTION_SUFFIX: "Real-time process lifecycle & telemetry",
  MODE_LABEL: "Execution Mode",
  MODE_DEV: "Dev (HMR)",
  MODE_PROD: "Production (Build)",
  ACTION_START: "Start",
  ACTION_RESTART: "Restart",
  ACTION_STOP: "Stop",
  ACTION_CLOSE: "Close",
  ACTION_BUILD: "Build",
  ACTION_BUILDING: "Building…",
  ACTION_OPEN_IDE: "Open in IDE",
  ACTION_START_DEPS: "Start Prerequisites",
  ACTION_FAILED_PREFIX: "Action failed:",
  STATE_RUNNING: "RUNNING",
  STATE_STARTING: "STARTING",
  STATE_STOPPED: "STOPPED",
  STATE_CRASHED: "CRASHED",
  TELEMETRY_TITLE: "Process Telemetry",
  TELEMETRY_REFRESH: "Refresh",
  PID_LABEL: "PID",
  PGID_LABEL: "PGID",
  UPTIME_LABEL: "Uptime",
  PORTS_TITLE: "Bound TCP Ports",
  PORTS_LISTENING_SUFFIX: "Listening",
  PORT_LISTENING: "Listening",
  PORT_CLOSED: "Closed",
  TERMINAL_TITLE: "Circular Ring Buffer Logs",
  TERMINAL_EMPTY: 'No logs captured yet for this process. Click "Start" to launch.',
  TERMINAL_ENTRIES_SUFFIX: "entries",
  DEPS_TITLE: "Prerequisites",
  DEPS_ALL_RUNNING: "All prerequisites running",
  DEPS_MISSING: "Prerequisites stopped or unhealthy",
  DEACTIVATED_TITLE: "Application Deactivated:",
  DEACTIVATED_BANNER: "Kill switch is active. Execution is blocked until reactivated.",
  CANNOT_START_TOOLTIP: "Cannot start: Application is deactivated via Kill Switch",
  CANNOT_RESTART_TOOLTIP: "Cannot restart: Application is deactivated via Kill Switch",
} as const;
