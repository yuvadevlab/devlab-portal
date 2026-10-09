"use client";

/**
 * @file apps/web/src/components/layout/command-dialog.tsx
 * @description Quick command search modal (⌘K) for jumping across portal destinations.
 * @module @devlab/portal-web/components/layout/command-dialog
 */

import React, { useState, useEffect } from "react";
import {
  Command,
  Grid2X2,
  KeyRound,
  ShieldCheck,
  Users,
  Settings2,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  Button,
} from "@yuva-devlab/ui";
import { TabKey } from "@/lib/constants/enums";
import { UI_COPY } from "@/lib/ui-copy";

interface CommandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabKey) => void;
}

export const CommandDialog: React.FC<CommandDialogProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const navigationItems = [
    { key: TabKey.APPS, label: UI_COPY.COMMON.TABS.APPS, icon: Grid2X2 },
    { key: TabKey.IAM, label: UI_COPY.COMMON.TABS.IAM, icon: KeyRound },
    { key: TabKey.AUDIT, label: UI_COPY.COMMON.TABS.AUDIT, icon: ShieldCheck },
    { key: TabKey.TEAM, label: UI_COPY.COMMON.TABS.TEAM, icon: Users },
    { key: TabKey.SETTINGS, label: UI_COPY.COMMON.TABS.SETTINGS, icon: Settings2 },
  ];

  const filteredItems = navigationItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="text-primary size-4" />
            Search DevLab Portal
          </DialogTitle>
          <DialogDescription>
            Quickly navigate across ecosystem applications, keys, and security ledgers.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          <input
            className="border-border bg-secondary text-foreground focus:border-primary w-full rounded-md border p-3 text-sm outline-none"
            placeholder="Where would you like to go?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />

          <div className="space-y-1">
            {filteredItems.map((item) => (
              <Button
                key={item.key}
                variant="ghost"
                className="w-full justify-start text-xs font-medium"
                onClick={() => {
                  onNavigateTab(item.key);
                  onClose();
                }}
              >
                <item.icon className="text-muted-foreground mr-2.5 size-4" />
                {item.label}
                <ChevronRight className="text-muted-foreground ml-auto size-3.5" />
              </Button>
            ))}
            {filteredItems.length === 0 && (
              <p className="text-muted-foreground py-4 text-center text-xs">
                No matching navigation destinations found.
              </p>
            )}
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};
