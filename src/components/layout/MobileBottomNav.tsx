"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Compass, Search, Upload, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOBILE_NAV } from "@/lib/site";
import { isActivePath } from "@/components/layout/Navbar";

const ICONS: Record<string, typeof Compass> = {
  "/explore": Compass,
  "/stories": BookOpen,
  "/upload": Upload,
  "/search": Search,
  "/profile": UserIcon,
};

/**
 * Mobile bottom navigation. Four core destinations plus the upload CTA, which
 * is visually raised but still a plain link , no fake controls.
 */
export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
        {MOBILE_NAV.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = ICONS[item.href] ?? Compass;
          const isUpload = item.href === "/upload";
          const href = item.href;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-2.5 text-[10px] font-medium uppercase tracking-wider transition-colors",
                  active ? "text-gold-500" : "text-ink-300 hover:text-white",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
                    isUpload
                      ? "border-gold-500/50 bg-gold-500/15 text-gold-400"
                      : active
                        ? "border-transparent bg-white/[0.06]"
                        : "border-transparent",
                  )}
                >
                  <Icon aria-hidden className="h-4 w-4" />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
