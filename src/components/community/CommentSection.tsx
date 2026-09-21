"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { Comment, Contributor } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/states";
import { useToast } from "@/components/ui/Toast";
import { addCommentAction, type SocialTarget } from "@/lib/actions/community";
import { sanitizeText } from "@/lib/sanitize";

/**
 * Comments. Server-rendered comments are passed in; a successful post appends
 * locally and the server action revalidates the page. When there is no database
 * the action returns `unconfigured` and the draft is kept in the box so nothing
 * a visitor typed is lost.
 */
export function CommentSection({
  targetId,
  targetType,
  targetPath,
  comments,
  authors,
  signedIn,
  className,
}: {
  targetId: string;
  targetType: SocialTarget;
  targetPath: string;
  comments: Comment[];
  authors: Record<string, Contributor | undefined>;
  signedIn: boolean;
  className?: string;
}) {
  const [items, setItems] = useState(comments);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned = sanitizeText(body, 2000);
    if (cleaned.length < 2) {
      setError("Write something a bit longer.");
      return;
    }
    setError(null);

    const form = new FormData();
    form.set("targetType", targetType);
    form.set("targetId", targetId);
    form.set("body", cleaned);
    form.set("revalidate", targetPath);

    startTransition(async () => {
      const result = await addCommentAction(form);
      if (!result.ok) {
        setError(result.message);
        toast({ tone: "error", message: "Comment not posted", detail: result.message });
        return;
      }
      setItems((prev) => [
        {
          id: result.data?.id ?? `local-${Date.now()}`,
          targetType: targetType === "post" ? "post" : targetType,
          targetId,
          authorId: "you",
          body: cleaned,
          createdAt: new Date().toISOString(),
          likes: 0,
          parentId: null,
          status: "published",
        },
        ...prev,
      ]);
      setBody("");
      toast({ tone: "success", message: "Comment posted" });
    });
  }

  return (
    <section className={cn("space-y-6", className)} aria-labelledby="comments-heading">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="comments-heading" className="font-display text-xl text-white">
          Comments
        </h2>
        <span className="text-xs text-ink-400">
          {items.length} {items.length === 1 ? "comment" : "comments"}
        </span>
      </div>

      {signedIn ? (
        <form onSubmit={submit} className="space-y-3">
          <label htmlFor="comment-body" className="sr-only">
            Write a comment
          </label>
          <textarea
            id="comment-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="Add context, a correction or a memory…"
            className="field resize-y"
            aria-describedby={error ? "comment-error" : undefined}
          />
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-ink-400">{body.length}/2000</p>
            <Button type="submit" size="sm" disabled={pending}>
              <Send aria-hidden className="h-3.5 w-3.5" />
              {pending ? "Posting…" : "Post comment"}
            </Button>
          </div>
          {error && (
            <p id="comment-error" role="alert" className="text-xs text-rift-400">
              {error}
            </p>
          )}
        </form>
      ) : (
        <div className="flex flex-wrap items-center gap-3 rounded-xl2 border border-white/10 bg-ink-850/60 px-4 py-3.5 text-sm text-ink-300">
          <Link href={`/login?next=${encodeURIComponent(targetPath)}`} className="text-gold-400 hover:underline">
            Sign in
          </Link>
          to join the conversation.
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState
          title="No comments here yet."
          description="Be the first person to add context to this entry."
          className="py-10"
        />
      ) : (
        <ul className="space-y-5">
          {items.map((comment) => {
            const author = authors[comment.authorId];
            const name = author?.displayName ?? "Contributor";
            return (
              <li key={comment.id} className="flex gap-4">
                <Avatar name={name} artwork={author?.avatar} size="sm" className="mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-sm font-medium text-white">{name}</span>
                    <span className="text-xs text-ink-400">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="mt-1.5 whitespace-pre-line text-[13px] leading-relaxed text-ink-200">
                    {comment.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
