"use client";

import * as React from "react";
import { cn } from "./utils";

interface ToastItem {
  id: number;
  title?: string;
  description?: string;
  tone?: "default" | "success" | "error";
}

interface Ctx {
  toast: (t: Omit<ToastItem, "id">) => void;
}

const ToastCtx = React.createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const toast = React.useCallback((t: Omit<ToastItem, "id">) => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { ...t, id }]);
    setTimeout(() => {
      setItems((s) => s.filter((i) => i.id !== id));
    }, 4000);
  }, []);
  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
        {items.map((i) => (
          <div
            key={i.id}
            className={cn(
              "rounded-xl border px-4 py-3 glass-strong animate-fade-in-up",
              i.tone === "success" && "border-leaf-500/40",
              i.tone === "error" && "border-red-400/40",
              !i.tone || (i.tone === "default" && "border-leaf-700/15"),
            )}
          >
            {i.title ? <div className="text-sm font-medium text-fg">{i.title}</div> : null}
            {i.description ? (
              <div className="text-xs text-fg-dim mt-0.5">{i.description}</div>
            ) : null}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const c = React.useContext(ToastCtx);
  if (!c) {
    return {
      toast: (t: Omit<ToastItem, "id">) => {
        if (typeof window !== "undefined") {
          console.log("[toast]", t.title, t.description);
        }
      },
    };
  }
  return c;
}