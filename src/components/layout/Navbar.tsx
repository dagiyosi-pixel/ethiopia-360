"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV, SECONDARY_NAV } from "@/lib/site";
import { UserMenu, type UserMenuUser } from "@/components/layout/UserMenu";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ButtonLink } from "@/components/ui/Button";

export function isActivePath(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-1">
      {PRIMARY_NAV.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative rounded-full px-3.5 py-2 text-[13px] font-medium tracking-tight transition-all duration-200",
                active ? "text-white bg-white/[0.03]" : "text-ink-200 hover:text-white hover:bg-white/[0.02]",
              )}
            >
              {item.label}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-3 -bottom-0.5 h-px origin-left bg-gold-500 transition-transform duration-300",
                  active ? "scale-x-100" : "scale-x-0",
                )}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function Navbar({ user }: { user: UserMenuUser | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-white/10 bg-ink-950/85 backdrop-blur-xl"
          : "border-transparent bg-ink-950/40 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-shell items-center gap-3 px-4 sm:h-18 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="ETHIOPIA//360 , home">
          <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden>
            <circle cx="20" cy="20" r="18.5" fill="none" stroke="rgba(255,255,255,0.14)" />
            <path
              d="M20 3.5 L26 20 L20 36.5 L14 20 Z"
              fill="none"
              stroke="#e2b354"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path d="M20 9 L23.4 20 L20 31 L16.6 20 Z" fill="#e2b354" fillOpacity="0.16" />
            <circle cx="20" cy="20" r="2.2" fill="#e2b354" />
          </svg>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[15px] tracking-tight text-white sm:text-base">
              ETHIOPIA<span className="text-gold-500">{"//"}</span>360
            </span>
            <span className="ethiopic hidden text-[10px] tracking-wide text-ink-400 sm:block">
              ኢትዮጵያ · ሕያው መዝገብ
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-6 hidden lg:block">
          <NavLinks />
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/search"
            className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-[13px] text-ink-300 transition-colors hover:border-white/25 hover:text-white"
          >
            <Search aria-hidden className="h-4 w-4" />
            <span className="hidden md:inline">Search</span>
          </Link>

          <ButtonLink href="/upload" size="sm" className="hidden sm:inline-flex">
            <Upload aria-hidden className="h-3.5 w-3.5" />
            Upload
          </ButtonLink>

          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden items-center gap-1 sm:flex">
              <Link
                href="/login"
                className="rounded-full px-3 py-2 text-[13px] text-ink-200 transition-colors hover:text-white"
              >
                Sign in
              </Link>
              <ButtonLink href="/signup" variant="outline" size="sm">
                Join
              </ButtonLink>
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-full border border-white/10 p-2 text-ink-200 transition-colors hover:text-white lg:hidden"
          >
            {open ? <X aria-hidden className="h-4 w-4" /> : <Menu aria-hidden className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="animate-fade-in border-t border-white/[0.08] bg-ink-950/95 px-4 pb-8 pt-4 backdrop-blur-xl lg:hidden"
        >
          <ul className="grid gap-1">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-baseline justify-between rounded-xl px-3 py-3 transition-colors hover:bg-white/5"
                >
                  <span className="text-base text-white">{item.label}</span>
                  <span className="ethiopic text-xs text-ink-400">{item.labelAm}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {SECONDARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-white/10 px-3 py-2.5 text-center text-xs text-ink-200 transition-colors hover:border-white/25 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <ButtonLink href="/upload" size="sm" className="flex-1 justify-center">
              <Upload aria-hidden className="h-3.5 w-3.5" />
              Upload
            </ButtonLink>
            {user ? (
              <ButtonLink href={`/profile/${user.username}`} variant="outline" size="sm">
                {user.displayName.split(" ")[0]}
              </ButtonLink>
            ) : (
              <>
                <ButtonLink href="/login" variant="outline" size="sm">
                  Sign in
                </ButtonLink>
                <ButtonLink href="/signup" variant="outline" size="sm">
                  Join
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      )}

      <MobileBottomNav />
    </header>
  );
}
