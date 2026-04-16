"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastVariant = "error" | "success" | "info";

type ToastInput = {
  message: string;
  variant?: ToastVariant;
  durationMs?: number;
};

type ToastRecord = {
  id: number;
  message: string;
  variant: ToastVariant;
  isLeaving?: boolean;
};

type ToastContextValue = {
  showToast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const showToast = useCallback(({ message, variant = "error", durationMs = 2800 }: ToastInput) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, isLeaving: true } : toast)));
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 220);
    }, Math.max(600, durationMs - 220));
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-5 z-120 flex flex-col items-center gap-2 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[260px] max-w-[min(92vw,680px)] rounded-full border px-5 py-3 text-center text-sm font-semibold shadow-[0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl ${
              toast.isLeaving ? "animate-toast-out" : "animate-toast-in"
            } ${
              toast.variant === "error"
                ? "border-red-300/20 bg-red-500/15 text-red-100"
                : toast.variant === "success"
                  ? "border-emerald-300/20 bg-emerald-500/15 text-emerald-100"
                  : "border-white/20 bg-neutral-900/80 text-white"
            }`}
            role="status"
            aria-live="polite"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
