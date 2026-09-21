"use client";

import { useState, useTransition } from "react";
import { Flag, UserPlus, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { submitReportAction, toggleFollowAction } from "@/lib/actions/community";

export function FollowButton({
  userId,
  initiallyFollowing = false,
  size = "sm",
  className,
}: {
  userId: string;
  initiallyFollowing?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  const [following, setFollowing] = useState(initiallyFollowing);
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  function onClick() {
    const next = !following;
    setFollowing(next);
    startTransition(async () => {
      const result = await toggleFollowAction(userId);
      if (!result.ok) {
        setFollowing(!next);
        toast({
          tone: result.code === "unauthenticated" ? "info" : "error",
          message: result.code === "unauthenticated" ? "Sign in to follow contributors." : result.message,
        });
        return;
      }
      if (result.local) {
        toast({
          tone: "info",
          message: result.message,
          detail: "Connect Supabase in .env.local to keep this follow.",
        });
      }
    });
  }

  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={following}
      variant={following ? "outline" : "primary"}
      size={size}
      className={cn(className)}
    >
      {following ? (
        <UserCheck aria-hidden className="h-3.5 w-3.5" />
      ) : (
        <UserPlus aria-hidden className="h-3.5 w-3.5" />
      )}
      {following ? "Following" : "Follow"}
    </Button>
  );
}

const REASONS = [
  { value: "spam", label: "Spam or advertising" },
  { value: "harassment", label: "Harassment or abuse" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "misinformation", label: "Incorrect or misleading information" },
  { value: "copyright", label: "Copyright issue" },
  { value: "other", label: "Something else" },
] as const;

export function ReportButton({
  targetType,
  targetId,
  label = "Report",
  className,
}: {
  targetType: "post" | "comment" | "profile";
  targetId: string;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("spam");
  const [detail, setDetail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData();
    form.set("targetType", targetType);
    form.set("targetId", targetId);
    form.set("reason", reason);
    form.set("detail", detail);

    startTransition(async () => {
      const result = await submitReportAction(form);
      if (!result.ok) {
        setError(result.message);
        toast({ tone: "error", message: "Report not sent", detail: result.message });
        return;
      }
      setError(null);
      setOpen(false);
      setDetail("");
      toast({ tone: "success", message: result.message });
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-1.5 text-xs text-ink-400 transition-colors hover:text-rift-400",
          className,
        )}
      >
        <Flag aria-hidden className="h-3.5 w-3.5" />
        {label}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Report content"
        description="Reports go to the moderation queue for review."
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" type="submit" form="report-form" disabled={pending}>
              {pending ? "Sending…" : "Submit report"}
            </Button>
          </>
        }
      >
        <form id="report-form" onSubmit={submit} className="space-y-4">
          <fieldset className="space-y-2">
            <legend className="field-label">Why are you reporting this?</legend>
            {REASONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 px-3 py-2.5 text-sm text-ink-100 transition-colors hover:border-white/25"
              >
                <input
                  type="radio"
                  name="reason"
                  value={option.value}
                  checked={reason === option.value}
                  onChange={() => setReason(option.value)}
                  className="h-4 w-4 accent-[#e2b354]"
                />
                {option.label}
              </label>
            ))}
          </fieldset>

          <div>
            <label htmlFor="report-detail" className="field-label">
              Anything else? (optional)
            </label>
            <textarea
              id="report-detail"
              value={detail}
              onChange={(event) => setDetail(event.target.value)}
              rows={3}
              maxLength={1000}
              className="field resize-y"
            />
          </div>

          {error && (
            <p role="alert" className="text-xs leading-relaxed text-rift-400">
              {error}
            </p>
          )}
        </form>
      </Modal>
    </>
  );
}
