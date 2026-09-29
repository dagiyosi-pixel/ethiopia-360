"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastTone = "success" | "error" | "info";

export interface Toast {
  id: string;
  tone: ToastTone;
  message: string;
  /** Optional longer explanation, e.g. which env var is missing. */
  detail?: string;
}

interface ToastContextValue {
  toast: (input: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_STYLES: Record<ToastTone, string> = {
  success: "border-highland-500/40 bg-highland-600/15",
  error: "border-rift-500/45 bg-rift-600/15",
  info: "border-nile-500/40 bg-nile-500/15",
};

const TONE_ICON: Record<ToastTone, ReactNode> = {
  success: <CheckCircle2 aria-hidden className="h-4 w-4 text-highland-400" />,
  error: <TriangleAlert aria-hidden className="h-4 w-4 text-rift-400" />,
  info: <Info aria-hidden className="h-4 w-4 text-nile-400" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (input: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).slice(2);
      setItems((prev) => [...prev.slice(-3), { ...input, id }]);
      const timer = setTimeout(() => dismiss(id), input.tone === "error" ? 8000 : 4500);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((timer) => clearTimeout(timer));
      map.clear();
    };
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed bottom-24 left-1/2 z-[60] flex w-[min(92vw,26rem)] -translate-x-1/2 flex-col gap-2 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto animate-fade-up rounded-2xl border px-4 py-3 backdrop-blur-md",
              TONE_STYLES[item.tone],
            )}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5">{TONE_ICON[item.tone]}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium leading-snug text-white">{item.message}</p>
                {item.detail && (
                  <p className="mt-1 text-xs leading-relaxed text-ink-300">{item.detail}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="Dismiss notification"
                className="shrink-0 rounded-full p-1 text-ink-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X aria-hidden className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Never throw from a UI helper , fall back to console so a missing provider
    // degrades rather than crashing a page.
    return {
      toast: ({ message, detail }) => console.info(`[toast] ${message}`, detail ?? ""),
      dismiss: () => {},
    };
  }
  return ctx;
}
