"use client";

import { useCallback, useState, useTransition } from "react";
import type { SocialResult } from "@/lib/actions/community";
import { useToast } from "@/components/ui/Toast";

/**
 * Shared optimistic toggle used by like / save / follow.
 *
 * The server action is the source of truth. When it reports that nothing was
 * persisted (no database configured) the UI still reflects the change locally
 * but tells the user plainly, so an interaction never silently pretends to have
 * been saved.
 */
export function useToggleAction({
  initialActive = false,
  initialCount,
  onToggle,
  requiresAuthMessage = "Sign in to do that.",
}: {
  initialActive?: boolean;
  initialCount?: number | null;
  onToggle: (next: boolean) => Promise<SocialResult>;
  requiresAuthMessage?: string;
}) {
  const [active, setActive] = useState(initialActive);
  const [count, setCount] = useState<number | null>(initialCount ?? null);
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  const toggle = useCallback(
    (event?: React.MouseEvent) => {
      event?.preventDefault();
      event?.stopPropagation();

      const next = !active;
      setActive(next);
      setCount((current) => (current === null ? current : Math.max(0, current + (next ? 1 : -1))));

      startTransition(async () => {
        const result = await onToggle(next);

        if (!result.ok) {
          // Revert , never leave the UI implying something succeeded.
          setActive(!next);
          setCount((current) => (current === null ? current : Math.max(0, current + (next ? -1 : 1))));
          toast({
            tone: result.code === "unauthenticated" ? "info" : "error",
            message: result.code === "unauthenticated" ? requiresAuthMessage : result.message,
            detail: result.code === "unauthenticated" ? undefined : result.message,
          });
          return;
        }

        if (result.local) {
          toast({
            tone: "info",
            message: result.message,
            detail: "Connect Supabase in .env.local to persist this for your account.",
          });
        }
      });
    },
    [active, onToggle, requiresAuthMessage, toast],
  );

  return { active, count, pending, toggle };
}
