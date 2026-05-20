"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
  leaving?: boolean;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Start leave animation before removing
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
      );
    }, 3500);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const icons: Record<ToastType, string> = {
    success: "✓",
    error: "✕",
    info: "i",
  };

  const colors: Record<ToastType, { bg: string; icon: string; bar: string }> = {
    success: { bg: "#F0FDF4", icon: "#16A34A", bar: "#16A34A" },
    error:   { bg: "#FEF2F2", icon: "#DC2626", bar: "#DC2626" },
    info:    { bg: "var(--hunter-purple-faint)", icon: "var(--hunter-purple)", bar: "var(--hunter-purple)" },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "0.625rem",
          maxWidth: "360px",
          width: "calc(100vw - 3rem)",
          pointerEvents: "none",
        }}
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const c = colors[toast.type];
          return (
            <div
              key={toast.id}
              className={toast.leaving ? "toast-leave" : "toast-enter"}
              style={{
                background: c.bg,
                border: `1px solid ${c.icon}22`,
                borderRadius: "var(--radius-lg)",
                padding: "0.875rem 1rem",
                boxShadow: "var(--shadow-lg)",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                pointerEvents: "all",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Icon */}
              <span
                style={{
                  width: "1.4rem",
                  height: "1.4rem",
                  borderRadius: "50%",
                  background: c.icon,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: "1px",
                }}
              >
                {icons[toast.type]}
              </span>

              {/* Message */}
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "var(--foreground)",
                  lineHeight: 1.5,
                }}
              >
                {toast.message}
              </p>

              {/* Progress bar */}
              <span
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: "2px",
                  width: "100%",
                  background: c.bar,
                  opacity: 0.4,
                  animation: "shrink-bar 3.5s linear forwards",
                }}
              />
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes shrink-bar {
          from { transform: scaleX(1); transform-origin: left; }
          to   { transform: scaleX(0); transform-origin: left; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}