import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-gold-500 text-ink-950 hover:bg-gold-400 focus-visible:outline-gold-400 shadow-[0_18px_50px_-24px_rgba(226,179,84,0.7)] hover:shadow-[0_22px_60px_-24px_rgba(226,179,84,0.8)]",
  secondary: "bg-ink-700 text-ink-100 hover:bg-ink-600 border border-white/10 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.9)]",
  outline: "border border-white/15 text-ink-100 hover:border-gold-500/60 hover:text-white hover:bg-white/[0.02]",
  ghost: "text-ink-200 hover:text-white hover:bg-white/5",
  danger: "bg-rift-600 text-white hover:bg-rift-500 shadow-[0_18px_50px_-24px_rgba(182,66,67,0.75)]",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-[15px] gap-2.5 py-3.5",
};

const BASE =
  "inline-flex items-center justify-center rounded-full font-medium tracking-tight transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:-translate-y-0.5";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size; children: ReactNode }) {
  return (
    <button className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size; children: ReactNode }) {
  return (
    <Link className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...props}>
      {children}
    </Link>
  );
}
