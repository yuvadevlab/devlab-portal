"use client";

import React, { useEffect, useState } from "react";
import { ChevronRight, Command } from "lucide-react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
} from "@yuva-devlab/ui";
import { getNavIcon } from "./nav-icon";

export interface NavigationCommandDialogItem {
  id?: string;
  key: string;
  label: string;
  icon?: string | null;
}

export interface NavigationCommandDialogCopy {
  title: string;
  description: string;
  placeholder: string;
  emptyResult: string;
}

export interface NavigationCommandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (key: string) => void;
  items: NavigationCommandDialogItem[];
  copy: NavigationCommandDialogCopy;
}

/**
 * Searchable keyboard-oriented dialog for navigating a supplied set of destinations.
 */
export function NavigationCommandDialog({
  isOpen,
  onClose,
  onSelectItem,
  items,
  copy,
}: NavigationCommandDialogProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k" && isOpen) {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const normalizedQuery = query.toLowerCase();
  const filteredItems = items.filter((item) => item.label.toLowerCase().includes(normalizedQuery));

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
        else setQuery("");
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="text-primary size-4" />
            {copy.title}
          </DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          <Input
            className="border-border bg-secondary text-foreground focus:border-primary w-full rounded-md border p-3 text-sm outline-none"
            placeholder={copy.placeholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoFocus
          />

          <div className="space-y-1">
            {filteredItems.map((item) => {
              const Icon = getNavIcon(item.icon);
              return (
                <Button
                  key={item.id || item.key}
                  variant="ghost"
                  className="w-full justify-start text-xs font-medium"
                  onClick={() => {
                    onSelectItem(item.key);
                    onClose();
                  }}
                >
                  <Icon className="text-muted-foreground mr-2.5 size-4" />
                  {item.label}
                  <ChevronRight className="text-muted-foreground ml-auto size-3.5" />
                </Button>
              );
            })}
            {filteredItems.length === 0 && (
              <p className="text-muted-foreground py-4 text-center text-xs">{copy.emptyResult}</p>
            )}
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
