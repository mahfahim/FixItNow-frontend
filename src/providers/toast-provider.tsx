// src/providers/toast-provider.tsx
"use client";

import React, { createContext, useContext, useCallback } from "react";
import { Toaster, toast as baseToast } from "@/components/ui/toast";

export type ToastType = "success" | "error" | "info" | "warning" | "loading";

interface ToastOptions {
  type?: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (options: ToastOptions) => void;
  success: (title: string, description?: string, duration?: number) => void;
  error: (title: string, description?: string, duration?: number) => void;
  info: (title: string, description?: string, duration?: number) => void;
  warning: (title: string, description?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const addToast = useCallback(
    ({ type = "info", title, description, duration = 1000 }: ToastOptions) => {
      if (typeof baseToast?.add === "function") {
        baseToast.add({
          title,
          description,
          type,
          timeout: duration,
        });
      }
    },
    []
  );

  const success = useCallback(
    (title: string, description?: string, duration?: number) =>
      addToast({ type: "success", title, description, duration }),
    [addToast]
  );
  const error = useCallback(
    (title: string, description?: string, duration?: number) =>
      addToast({ type: "error", title, description, duration }),
    [addToast]
  );
  const info = useCallback(
    (title: string, description?: string, duration?: number) =>
      addToast({ type: "info", title, description, duration }),
    [addToast]
  );
  const warning = useCallback(
    (title: string, description?: string, duration?: number) =>
      addToast({ type: "warning", title, description, duration }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info, warning }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}