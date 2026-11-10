"use client";

/**
 * @file apps/web/src/features/apps/components/settings-drawer/settings-callbacks-section.tsx
 * @description Dynamic list editor for authorized OAuth2 redirect and callback URLs.
 * @module @devlab/portal-web/features/apps/components/settings-drawer
 */

import React from "react";
import { Plus, X } from "lucide-react";
import { Button, Input, Label } from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";

interface SettingsCallbacksSectionProps {
  callbacks: string[];
  onUpdateCallback: (index: number, val: string) => void;
  onRemoveCallback: (index: number) => void;
  onAddCallback: () => void;
}

export const SettingsCallbacksSection: React.FC<SettingsCallbacksSectionProps> = ({
  callbacks,
  onUpdateCallback,
  onRemoveCallback,
  onAddCallback,
}) => {
  return (
    <div className="callbacks-list pt-tight">
      <Label className="form-field-label">{UI_COPY.APPS.DRAWER.CALLBACKS_LABEL}</Label>
      <div className="callbacks-list">
        {callbacks.map((c, i) => (
          <div className="callback-item-row" key={i}>
            <Input
              type="url"
              value={c}
              onChange={(e) => onUpdateCallback(i, e.target.value)}
              placeholder={UI_COPY.APPS.WIZARD.FIELDS.CALLBACK_PLACEHOLDER}
              required
              className="form-field-input-mono callback-input"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={UI_COPY.APPS.DRAWER.REMOVE_CALLBACK_ARIA}
              className="callback-remove-btn"
              onClick={() => onRemoveCallback(i)}
            >
              <X className="callback-remove-icon" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAddCallback}
        className="callback-add-btn"
      >
        <Plus className="btn-icon" />
        {UI_COPY.APPS.DRAWER.ADD_CALLBACK_BTN}
      </Button>
    </div>
  );
};
