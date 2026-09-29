import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, MapPin, Navigation } from "lucide-react";
import { MediaCard } from "@/components/cards/MediaCard";
import { MediaFrame } from "@/components/visual/MediaFrame";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/SectionHeading";
import { getMediaBundle } from "@/lib/data/queries";
import { googleMapsDirectionsHref, googleMapsPlaceHref } from "@/lib/map-links";

export async function generateStaticParams() {
  const { media } = await import("@/data/media");
  return media.map((item) => ({ slug: item.slug }));
}

export default async function MediaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bundle = await getMediaBundle(slug);

  if (!bundle) notFound();

  const { item, author, city, region, related, provenance } = bundle;
  const markerId = `${item.type}:${item.slug}`;

  return (
    <div>
      <PageHeader eyebrow={item.type === "video" ? "Video" : "Photo"} title={item.title} lede={item.caption}>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-ink-300">
          <Badge tone={provenance === "community" ? "highland" : "neutral"}>
            {provenance === "community" ? "Community contribution" : "Curated record"}
          </Badge>
          {author && (
            <Link href={`/profile/${author.username}`} className="hover:text-gold-400">
              By {author.displayName}
            </Link>
          )}
        </div>
      </PageHeader>

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-850/80">
            {item.type === "video" && item.src ? (
              <video
                className="aspect-video w-full bg-ink-950 object-contain"
                controls
                playsInline
                preload="metadata"
                poster={item.poster ?? undefined}
              >
                <source src={item.src} />
                Your browser does not support embedded video.
              </video>
            ) : (
              <MediaFrame
                src={item.type === "photo" ? item.src : item.poster}
                artwork={item.artwork}
                alt={item.imageAlt ?? item.title}
                aspect="16/9"
                rounded={false}
                priority
              />
            )}
          </div>

          <aside className="rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-6">
            <p className="text-[11px] uppercase tracking-wider3 text-gold-500">About this record</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge tone="neutral">{item.category}</Badge>
              {city && <Badge tone="neutral">{city.name}</Badge>}
              {region && <Badge tone="neutral">{region.name}</Badge>}
            </div>

            {(city || region) && (
              <div className="mt-6 flex items-start gap-2 text-sm text-ink-200">
                <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <span>{[city?.name, region?.name].filter(Boolean).join(", ")}</span>
              </div>
            )}

            {item.imageSource && (
              <p className="mt-5 text-xs leading-relaxed text-ink-400">
                Image credit: {item.imageSource}
                {item.imageSubject ? ` · Subject: ${item.imageSubject}` : ""}
              </p>
            )}

            {item.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1 text-[10px] uppercase tracking-wider2 text-ink-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {item.coords && <div className="mt-7 flex flex-wrap gap-2">
              <Link href={`/map?marker=${encodeURIComponent(markerId)}&filter=${item.type}`} className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-2.5 text-sm text-gold-200 transition-colors hover:bg-gold-500/20"><MapPin aria-hidden className="h-4 w-4" /> Show on our map</Link>
              <a href={googleMapsPlaceHref(item.coords)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm text-ink-100 hover:border-gold-500/50">Google Maps <ExternalLink aria-hidden className="h-4 w-4" /></a>
              <a href={googleMapsDirectionsHref(item.coords)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm text-ink-100 hover:border-gold-500/50">Directions <Navigation aria-hidden className="h-4 w-4" /></a>
            </div>}
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Continue exploring</p>
                <h2 className="mt-2 font-display text-3xl text-white">Related media</h2>
              </div>
              <Link href="/gallery" className="inline-flex items-center gap-2 text-sm text-ink-200 hover:text-gold-400">
                <ArrowLeft aria-hidden className="h-4 w-4" /> All media
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {related.map((relatedItem) => (
                <MediaCard key={relatedItem.slug} item={relatedItem} showMeta={false} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
