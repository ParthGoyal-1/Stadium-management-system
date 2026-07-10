import React, { useState, useEffect, useCallback } from "react";
import { UserRole } from "../types";

interface UseRoleAccessProps {
  onRoleChange: (role: UserRole) => void;
  addSystemNotification: (message: string, type?: "info" | "success" | "alert") => void;
}

export function useRoleAccess({ onRoleChange, addSystemNotification }: UseRoleAccessProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Clean form values when modal opens/closes
  useEffect(() => {
    if (!isSettingsOpen) {
      setPendingRole(null);
      setPasswordInput("");
      setPasswordError(null);
    }
  }, [isSettingsOpen]);

  // Handle password submissions securely
  const handlePasswordSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingRole) return;
    
    const requiredPassword = pendingRole === "volunteer" ? "volunteer" : "organizer";
    if (passwordInput.trim().toLowerCase() === requiredPassword) {
      onRoleChange(pendingRole);
      addSystemNotification(
        `Access Granted. Switched to ${pendingRole === 'volunteer' ? 'Volunteer' : 'Organizer'} Portal.`,
        "success"
      );
      setPendingRole(null);
      setPasswordInput("");
      setPasswordError(null);
    } else {
      setPasswordError(`Incorrect password. (Hint: password is "${requiredPassword}")`);
    }
  }, [pendingRole, passwordInput, onRoleChange, addSystemNotification]);

  // Trap focus and close settings on ESC key press
  useEffect(() => {
    if (!isSettingsOpen) return;

    const panel = document.getElementById("settings-panel");
    if (panel) {
      const focusable = panel.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) {
        setTimeout(() => {
          (focusable[0] as HTMLElement).focus();
        }, 50);
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSettingsOpen(false);
        return;
      }

      if (e.key === "Tab") {
        const panelEl = document.getElementById("settings-panel");
        if (!panelEl) return;
        const focusableElements = panelEl.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const first = focusableElements[0] as HTMLElement;
        const last = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSettingsOpen]);

  return {
    isSettingsOpen,
    setIsSettingsOpen,
    pendingRole,
    setPendingRole,
    passwordInput,
    setPasswordInput,
    passwordError,
    setPasswordError,
    handlePasswordSubmit,
  };
}
