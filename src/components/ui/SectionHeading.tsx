import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Editorial section header. Used instead of bare <h2> so every section of the
 * page shares the same rhythm: eyebrow, display heading, optional lede + link.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  action,
  align = "left",
  className,
  size = "md",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  action?: { href: string; label: string };
  align?: "left" | "center";
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl space-y-3", align === "center" && "mx-auto text-center")}>
        {eyebrow && (
          <p className="text-[11px] font-medium uppercase tracking-wider3 text-gold-500">{eyebrow}</p>
        )}
        <h2
          className={cn(
            "text-balance font-display font-normal leading-[1.08] tracking-tightest text-white",
            size === "lg" ? "text-3xl sm:text-4xl lg:text-5xl" : "text-2xl sm:text-3xl lg:text-4xl",
          )}
        >
          {title}
        </h2>
        {lede && <p className="max-w-xl text-sm leading-relaxed text-ink-300 sm:text-[15px]">{lede}</p>}
      </div>

      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-2 text-sm text-ink-200 transition-colors hover:text-gold-400"
        >
          {action.label}
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  );
}

/** Horizontal Ethiopian-inspired hairline used between major sections. */
export function PatternDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative h-px w-full overflow-hidden bg-white/[0.08]", className)}>
      <div className="absolute inset-y-0 left-1/2 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-500/70 to-transparent" />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("relative overflow-hidden border-b border-white/[0.08]", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-contour-faint"
      />
      <div className="relative mx-auto max-w-shell px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20">
        {eyebrow && (
          <p className="text-[11px] font-medium uppercase tracking-wider3 text-gold-500">{eyebrow}</p>
        )}
        <h1 className="mt-4 max-w-3xl text-balance font-display text-4xl leading-[1.05] tracking-tightest text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {lede && (
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-300 sm:text-base">{lede}</p>
        )}
        {children}
      </div>
    </header>
  );
}
