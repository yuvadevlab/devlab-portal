"use client";

/**
 * @file apps/web/src/components/layout/tenant-modal.tsx
 * @description Modal dialog for creating and switching to a new workspace tenant identity.
 * Fully built with @devlab-portal/ui Dialog, Label, Input, and Button primitives.
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
} from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTenant: (name: string) => void;
}

export const TenantModal: React.FC<TenantModalProps> = ({ isOpen, onClose, onCreateTenant }) => {
  const [tenantName, setTenantName] = useState("");

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (tenantName.trim()) {
      onCreateTenant(tenantName.trim());
      setTenantName("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="tenant-modal-content">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="tenant-modal-title">
              <Plus className="tenant-modal-icon" />
              {UI_COPY.COMMON.TENANT_MODAL.TITLE}
            </DialogTitle>
            <DialogDescription>{UI_COPY.COMMON.TENANT_MODAL.DESCRIPTION}</DialogDescription>
          </DialogHeader>

          <DialogBody className="tenant-modal-body">
            <div className="form-field-group">
              <Label htmlFor="tenant-name-input" className="form-field-label">
                {UI_COPY.COMMON.TENANT_MODAL.NAME_LABEL}
              </Label>
              <Input
                id="tenant-name-input"
                className="form-field-input"
                placeholder={UI_COPY.COMMON.TENANT_MODAL.NAME_PLACEHOLDER}
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                required
                autoFocus
              />
            </div>
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="modal-footer-btn">
              {UI_COPY.COMMON.ACTIONS.CANCEL}
            </Button>
            <Button
              type="submit"
              disabled={!tenantName.trim()}
              className="modal-footer-btn modal-footer-btn-primary"
            >
              <Plus className="button-icon-prefix" />
              {UI_COPY.COMMON.TENANT_MODAL.SUBMIT_BTN}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
