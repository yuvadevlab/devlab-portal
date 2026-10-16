"use client";

/**
 * @file apps/web/src/components/layout/command-dialog.tsx
 * @description Quick command search modal (⌘K) for jumping across DB-driven portal destinations.
 * Fully built with @yuva-devlab/ui Dialog and Input primitives with zero hardcoded menus.
 * @module @devlab/portal-web/components/layout/command-dialog
 */

import React, { useState, useEffect } from "react";
import { Command, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  Button,
  Input,
} from "@yuva-devlab/ui";
import { UI_COPY } from "@/lib/ui-copy";
import type { NavigationItem } from "@/lib/api-client";
import { getNavIcon } from "./nav-icon";

interface CommandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabKey: string) => void;
  items?: NavigationItem[];
}

export const CommandDialog: React.FC<CommandDialogProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  items = [],
}) => {
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

  // Filter database-driven items dynamically based on search query
  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="text-primary size-4" />
            {UI_COPY.COMMON.COMMAND.TITLE}
          </DialogTitle>
          <DialogDescription>{UI_COPY.COMMON.COMMAND.DESCRIPTION}</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          <Input
            className="border-border bg-secondary text-foreground focus:border-primary w-full rounded-md border p-3 text-sm outline-none"
            placeholder={UI_COPY.COMMON.COMMAND.PLACEHOLDER}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />

          <div className="space-y-1">
            {filteredItems.map((item) => {
              const IconComponent = getNavIcon(item.icon);
              return (
                <Button
                  key={item.id || item.key}
                  variant="ghost"
                  className="w-full justify-start text-xs font-medium"
                  onClick={() => {
                    onNavigateTab(item.key);
                    onClose();
                  }}
                >
                  <IconComponent className="text-muted-foreground mr-2.5 size-4" />
                  {item.label}
                  <ChevronRight className="text-muted-foreground ml-auto size-3.5" />
                </Button>
              );
            })}
            {filteredItems.length === 0 && (
              <p className="text-muted-foreground py-4 text-center text-xs">
                {UI_COPY.COMMON.COMMAND.EMPTY}
              </p>
            )}
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};
