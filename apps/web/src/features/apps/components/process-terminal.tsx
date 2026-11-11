"use client";

/**
 * @file apps/web/src/features/apps/components/process-terminal.tsx
 * @description Monospace streaming log viewer showing timestamped stdout and stderr from process ring buffers.
 * @module @devlab/portal-web/features/apps/components
 */

import React from "react";
import { Terminal } from "lucide-react";
import { UI_COPY } from "@/lib/ui-copy";
import type { ProcessLogEntry } from "../types";

interface ProcessTerminalProps {
  logs: ProcessLogEntry[];
}

export const ProcessTerminal: React.FC<ProcessTerminalProps> = ({ logs }) => {
  const getLevelStyle = (level: string): { color: string; backgroundColor: string } => {
    switch (level) {
      case "error":
        return { color: "#fb7185", backgroundColor: "rgba(136, 19, 55, 0.4)" };
      case "warn":
        return { color: "#fbbf24", backgroundColor: "rgba(120, 53, 15, 0.4)" };
      case "debug":
        return { color: "#60a5fa", backgroundColor: "rgba(30, 58, 138, 0.4)" };
      default:
        return { color: "#34d399", backgroundColor: "rgba(6, 78, 59, 0.4)" };
    }
  };

  return (
    <div className="supervisor-terminal-wrap">
      <div className="supervisor-terminal-header">
        <span className="supervisor-terminal-title">
          <Terminal className="terminal-title-icon" /> {UI_COPY.APPS.SUPERVISOR.TERMINAL_TITLE}
        </span>
        <span className="supervisor-terminal-count">
          {logs.length} {UI_COPY.APPS.SUPERVISOR.TERMINAL_ENTRIES_SUFFIX}
        </span>
      </div>
      <div className="supervisor-terminal">
        {logs.length === 0 ? (
          <div className="supervisor-terminal-empty">{UI_COPY.APPS.SUPERVISOR.TERMINAL_EMPTY}</div>
        ) : (
          logs.map((log) => {
            const levelStyle = getLevelStyle(log.level);
            return (
              <div key={log.id} className="supervisor-terminal-line">
                <span className="supervisor-log-time">{log.timestamp.slice(11, 19)}</span>
                <span className="supervisor-log-level" style={levelStyle}>
                  {log.level}
                </span>
                <span className="supervisor-log-msg">{log.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
