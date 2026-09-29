"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogOut, Settings, Upload, User as UserIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { signOutAction } from "@/lib/actions/auth";

export interface UserMenuUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  demo?: boolean;
}

export function UserMenu({ user }: { user: UserMenuUser }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-1.5 rounded-full border border-white/10 py-1 pl-1 pr-2 transition-colors hover:border-white/25"
      >
        <Avatar name={user.displayName} src={user.avatarUrl} size="xs" />
        <ChevronDown
          aria-hidden
          className={cn("h-3.5 w-3.5 text-ink-300 transition-transform", open && "rotate-180")}
        />
        <span className="sr-only">Account menu for {user.displayName}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.6rem)] w-60 animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-ink-850/95 p-1.5 shadow-lift backdrop-blur-xl"
        >
          <div className="border-b border-white/[0.08] px-3 py-2.5">
            <p className="truncate text-sm font-medium text-white">{user.displayName}</p>
            <p className="truncate text-xs text-ink-400">@{user.username}</p>
            {user.demo && (
              <p className="mt-1.5 inline-flex rounded-full border border-gold-500/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider2 text-gold-400">
                Local demo account
              </p>
            )}
          </div>

          <Link
            href={`/profile/${user.username}`}
            role="menuitem"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-ink-100 transition-colors hover:bg-white/5"
            onClick={() => setOpen(false)}
          >
            <UserIcon aria-hidden className="h-4 w-4 text-ink-300" />
            Your profile
          </Link>
          <Link
            href="/upload"
            role="menuitem"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-ink-100 transition-colors hover:bg-white/5"
            onClick={() => setOpen(false)}
          >
            <Upload aria-hidden className="h-4 w-4 text-ink-300" />
            Upload content
          </Link>
          <Link
            href="/settings"
            role="menuitem"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-ink-100 transition-colors hover:bg-white/5"
            onClick={() => setOpen(false)}
          >
            <Settings aria-hidden className="h-4 w-4 text-ink-300" />
            Account settings
          </Link>

          <form action={signOutAction} className="border-t border-white/[0.08] pt-1.5">
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] text-rift-400 transition-colors hover:bg-rift-600/10"
            >
              <LogOut aria-hidden className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
