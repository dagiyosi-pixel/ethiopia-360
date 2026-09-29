import Link from "next/link";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import type { Story } from "@/types";
import { MediaFrame } from "@/components/visual/MediaFrame";
import { Badge, Dot, MetaRow } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { cn, formatCompact, formatDate } from "@/lib/utils";
import type { Contributor } from "@/types";

/**
 * Story card , typography-forward rather than image-forward: the headline does
 * the work, and the visual is used as a band or a small tile depending on the
 * variant. This is what keeps story listings from looking like photo grids.
 */
export function StoryCard({
  story,
  author,
  regionName,
  className,
  variant = "standard",
}: {
  story: Story;
  author?: Contributor | null;
  regionName?: string;
  className?: string;
  variant?: "feature" | "standard" | "compact";
}) {
  if (variant === "feature") {
    return (
      <Link
        href={`/story/${story.slug}`}
        className={cn("premium-card group relative block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/20", className)}
      >
        <MediaFrame
          src={story.image}
          artwork={story.artwork}
          alt={story.title}
          aspect="16/9"
          rounded={false}
          scrim
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
          <Badge tone="gold" className="mb-4 self-start bg-ink-950/60">
            Featured story
          </Badge>
          <h3 className="max-w-2xl font-display text-2xl leading-tight text-white transition-colors group-hover:text-gold-400 sm:text-3xl lg:text-4xl">
            {story.title}
          </h3>
          {story.titleAm && <p className="ethiopic mt-2 text-sm text-ink-200">{story.titleAm}</p>}
          <p className="mt-3 hidden max-w-xl text-sm leading-relaxed text-ink-200 sm:block">
            {story.excerpt}
          </p>
          <StoryMeta story={story} author={author} regionName={regionName} className="mt-4" />
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/story/${story.slug}`}
        className={cn(
          "group flex gap-4 border-b border-white/[0.08] py-4 transition-colors last:border-0 hover:border-white/20",
          className,
        )}
      >
        <MediaFrame
          src={story.image}
          artwork={story.artwork}
          alt={story.title}
          aspect="1/1"
          rounded
          sizes="80px"
          className="h-16 w-16 shrink-0"
        />
        <div className="min-w-0">
          <h3 className="line-clamp-2 font-display text-base leading-snug text-white transition-colors group-hover:text-gold-400">
            {story.title}
          </h3>
          <MetaRow className="mt-1.5">
            {author && <span>{author.displayName}</span>}
            <Dot />
            <span>{story.readMinutes} min read</span>
          </MetaRow>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/story/${story.slug}`}
      className={cn(
        "premium-card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/20",
        className,
      )}
    >
      <MediaFrame
        src={story.image}
        artwork={story.artwork}
        alt={story.title}
        aspect="16/9"
        rounded={false}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="text-[11px] font-medium uppercase tracking-wider2 text-gold-500">
          {story.category}
        </span>
        <h3 className="font-display text-xl leading-tight text-white transition-colors group-hover:text-gold-400">
          {story.title}
        </h3>
        <p className="line-clamp-3 text-[13px] leading-relaxed text-ink-300">{story.excerpt}</p>
        <StoryMeta story={story} author={author} regionName={regionName} className="mt-auto pt-2" />
      </div>
    </Link>
  );
}

function StoryMeta({
  story,
  author,
  regionName,
  className,
}: {
  story: Story;
  author?: Contributor | null;
  regionName?: string;
  className?: string;
}) {
  return (
    <MetaRow className={className}>
      {author && (
        <span className="inline-flex items-center gap-2">
          <Avatar name={author.displayName} artwork={author.avatar} size="xs" />
          {author.displayName}
        </span>
      )}
      {regionName && (
        <>
          <Dot />
          <span>{regionName}</span>
        </>
      )}
      <Dot />
      <span className="inline-flex items-center gap-1.5">
        <Heart aria-hidden className="h-3.5 w-3.5 text-ink-500" />
        {formatCompact(story.likes)}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <MessageCircle aria-hidden className="h-3.5 w-3.5 text-ink-500" />
        {formatCompact(story.comments)}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Bookmark aria-hidden className="h-3.5 w-3.5 text-ink-500" />
        {formatCompact(story.saves)}
      </span>
      <Dot />
      <span>{formatDate(story.publishedAt)}</span>
    </MetaRow>
  );
}
