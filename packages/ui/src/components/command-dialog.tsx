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
      <DialogContent className="cmd-dialog-content">
        <DialogHeader>
          <DialogTitle className="cmd-dialog-title">
            <Command className="cmd-dialog-title-icon" />
            {copy.title}
          </DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>

        <DialogBody className="cmd-dialog-body">
          <Input
            className="cmd-dialog-input"
            placeholder={copy.placeholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoFocus
          />

          <div className="cmd-dialog-list">
            {filteredItems.map((item) => {
              const Icon = getNavIcon(item.icon);
              return (
                <Button
                  key={item.id || item.key}
                  variant="ghost"
                  className="cmd-dialog-item"
                  onClick={() => {
                    onSelectItem(item.key);
                    onClose();
                  }}
                >
                  <Icon className="cmd-dialog-item-icon" />
                  <span className="cmd-dialog-item-label">{item.label}</span>
                  <ChevronRight className="cmd-dialog-item-arrow" />
                </Button>
              );
            })}
            {filteredItems.length === 0 && <p className="cmd-dialog-empty">{copy.emptyResult}</p>}
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
