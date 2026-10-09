"use client";

/**
 * @file apps/web/src/components/layout/tenant-modal.tsx
 * @description Modal dialog for creating and switching to a new workspace tenant identity.
 * @module @devlab/portal-web/components/layout/tenant-modal
 */

import React, { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  Label,
  Input,
  Button,
} from "@yuva-devlab/ui";
import { UI_COPY } from "@/lib/ui-copy";

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTenant: (name: string) => void;
}

export const TenantModal: React.FC<TenantModalProps> = ({ isOpen, onClose, onCreateTenant }) => {
  const [tenantName, setTenantName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tenantName.trim()) {
      onCreateTenant(tenantName.trim());
      setTenantName("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="text-primary size-4" />
              Create New Tenant
            </DialogTitle>
            <DialogDescription>
              Provision a new isolated workspace tenant identity for agentic swarms.
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="tenant-name-input">Tenant Name</Label>
              <Input
                id="tenant-name-input"
                placeholder="e.g., Production Swarm Cluster"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                required
                autoFocus
              />
            </div>
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {UI_COPY.COMMON.ACTIONS.CANCEL}
            </Button>
            <Button type="submit" disabled={!tenantName.trim()}>
              <Plus className="mr-1.5 size-4" />
              Create Tenant
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
