import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Bookmark, Clock3, ExternalLink, Heart, MapPin, MessageCircle, Navigation } from "lucide-react";
import { PageHeader } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { MediaFrame } from "@/components/visual/MediaFrame";
import { StoryCard } from "@/components/cards/StoryCard";
import { getStory, getContributor, getRelatedStories, getRegion } from "@/lib/data/queries";
import { formatCompact } from "@/lib/utils";
import { googleMapsDirectionsHref, googleMapsPlaceHref, markerMapHref } from "@/lib/map-links";

export async function generateStaticParams() {
  const { stories } = await import("@/data/stories");
  return stories.map((story) => ({ slug: story.slug }));
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await getStory(slug);

  if (!story) notFound();

  const [author, region, related] = await Promise.all([
    story.authorId ? getContributor(story.authorId) : null,
    story.regionSlug ? getRegion(story.regionSlug) : null,
    getRelatedStories(story.slug, 3),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Story"
        title={story.title}
        lede={story.excerpt}
      >
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-ink-300">
          {author && <span>By {author.displayName}</span>}
          {region && <span>{region.name}</span>}
          <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-ink-500" /> {story.readMinutes} min read</span>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-850/80">
            <MediaFrame src={story.image} artwork={story.artwork} alt={story.title} aspect="16/9" rounded={false} priority />
          </div>
          <aside className="rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-6">
            <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Stats</p>
            <div className="mt-5 space-y-3 text-sm text-ink-200">
              <div className="flex items-center gap-2"><Heart className="h-4 w-4 text-ink-500" /> {formatCompact(story.likes)} likes</div>
              <div className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-ink-500" /> {formatCompact(story.comments)} comments</div>
              <div className="flex items-center gap-2"><Bookmark className="h-4 w-4 text-ink-500" /> {formatCompact(story.saves)} saves</div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {story.tags.map((tag) => (
                <Badge key={tag} tone="neutral">{tag}</Badge>
              ))}
            </div>
            {story.coords && <div className="mt-6 flex flex-wrap gap-2">
              <Link href={markerMapHref("story", story.slug, "story")} className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-3.5 py-2 text-xs text-gold-200 hover:bg-gold-500/20"><MapPin aria-hidden className="h-3.5 w-3.5" /> View on map</Link>
              <a href={googleMapsPlaceHref(story.coords)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs text-ink-100 hover:border-gold-500/50">Google Maps <ExternalLink aria-hidden className="h-3.5 w-3.5" /></a>
              <a href={googleMapsDirectionsHref(story.coords)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs text-ink-100 hover:border-gold-500/50">Directions <Navigation aria-hidden className="h-3.5 w-3.5" /></a>
            </div>}
          </aside>
        </div>

        <article className="mx-auto mt-12 max-w-3xl">
          <div className="space-y-6 text-lg leading-relaxed text-ink-200">
            {story.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>

        {related.length > 0 && (
          <section className="mt-16">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Continue reading</p>
                <h2 className="mt-2 font-display text-3xl text-white">More field notes</h2>
              </div>
              <Link href="/stories" className="inline-flex items-center gap-2 text-sm text-ink-200 hover:text-gold-400">View all <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {related.map((item) => (
                <StoryCard key={item.slug} story={item} regionName={item.regionSlug ? region?.name : undefined} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
