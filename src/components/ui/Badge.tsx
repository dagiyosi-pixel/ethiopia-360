import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "gold" | "rift" | "highland" | "nile" | "muted";

const TONES: Record<Tone, string> = {
  neutral: "border-white/[0.12] bg-white/[0.04] text-ink-100",
  gold: "border-gold-500/35 bg-gold-500/10 text-gold-400",
  rift: "border-rift-500/35 bg-rift-500/10 text-rift-400",
  highland: "border-highland-500/35 bg-highland-500/10 text-highland-400",
  nile: "border-nile-500/35 bg-nile-500/10 text-nile-400",
  muted: "border-white/[0.08] bg-transparent text-ink-300",
};

export function Badge({
  children,
  tone = "neutral",
  className,
  as: Tag = "span",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  as?: "span" | "div" | "li";
}) {
  return (
    <Tag
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider2",
        TONES[tone],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Small labels used for region/city/category metadata rows. */
export function MetaRow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-300", className)}>
      {children}
    </div>
  );
}

export function Dot() {
  return <span aria-hidden className="text-ink-500">·</span>;
}
