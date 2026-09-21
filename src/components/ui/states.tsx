import Link from "next/link";
import type { ReactNode } from "react";
import { AlertTriangle, Compass, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/Button";

/* --------------------------------- loading -------------------------------- */

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer rounded-lg bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.09)_37%,rgba(255,255,255,0.04)_63%)] bg-[length:200%_100%]",
        className,
      )}
    />
  );
}

export function LoadingState({
  label = "Loading…",
  rows = 3,
  className,
}: {
  label?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)} role="status" aria-live="polite">
      <p className="text-xs uppercase tracking-wider2 text-ink-400">{label}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl2 border border-white/[0.08] bg-ink-850 p-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function InlineSpinner({ className }: { className?: string }) {
  return <Loader2 aria-hidden className={cn("h-4 w-4 animate-spin", className)} />;
}

/* ---------------------------------- empty --------------------------------- */

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl3 border border-dashed border-white/[0.12] bg-ink-850/60 px-6 py-14 text-center",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:48px_48px]"
      />
      <div className="relative mx-auto max-w-md space-y-4">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-gold-500">
          {icon ?? <Compass aria-hidden className="h-5 w-5" />}
        </div>
        <h3 className="font-display text-xl text-white">{title}</h3>
        {description && <p className="text-sm leading-relaxed text-ink-300">{description}</p>}
        {action && (
          <ButtonLink href={action.href} size="sm" className="mt-2">
            {action.label}
          </ButtonLink>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- error --------------------------------- */

export function ErrorState({
  title = "Something went wrong",
  description,
  retry,
  className,
}: {
  title?: string;
  description?: string;
  retry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl3 border border-rift-500/30 bg-rift-600/10 px-6 py-10 text-center",
        className,
      )}
      role="alert"
    >
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-rift-500/40 bg-rift-600/20 text-rift-400">
        <AlertTriangle aria-hidden className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-display text-xl text-white">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-lg text-sm text-ink-200">{description}</p>}
      {retry && (
        <Button variant="outline" size="sm" className="mt-5" onClick={retry}>
          <RefreshCw aria-hidden className="h-3.5 w-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}

/* -------------------------------- not found ------------------------------- */

export function NotFoundState({
  title,
  description,
  suggestions,
}: {
  title: string;
  description: string;
  suggestions?: { href: string; label: string }[];
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-wider3 text-gold-500">Not found</p>
      <h1 className="mt-4 font-display text-4xl text-white sm:text-5xl">{title}</h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-300">{description}</p>
      {suggestions && suggestions.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {suggestions.map((s) => (
            <ButtonLink key={s.href} href={s.href} variant="outline" size="sm">
              {s.label}
            </ButtonLink>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------- demo notice ------------------------------ */

export function DemoNotice({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <aside
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-gold-500/25 bg-gold-500/[0.06] px-4 py-3 text-[13px]",
        className,
      )}
    >
      <span className="rounded-full border border-gold-500/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider2 text-gold-400">
        Demo data
      </span>
      <span className="text-ink-200">{children}</span>
    </aside>
  );
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-ink-400">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-2">
          {index > 0 && <span aria-hidden>/</span>}
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-ink-100">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink-200">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
