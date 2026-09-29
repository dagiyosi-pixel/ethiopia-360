import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ExternalLink, Heart, MapPin, MessageCircle, Navigation, Tag } from "lucide-react";
import { PageHeader } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { MediaFrame } from "@/components/visual/MediaFrame";
import { StoryCard } from "@/components/cards/StoryCard";
import { getPlace, getRelatedPlaces, getRegion, getCity, listStories } from "@/lib/data/queries";
import { formatCompact } from "@/lib/utils";
import { googleMapsDirectionsHref, googleMapsPlaceHref, markerMapHref } from "@/lib/map-links";

export async function generateStaticParams() {
  const { places } = await import("@/data/places");
  return places.map((place) => ({ slug: place.slug }));
}

export default async function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = await getPlace(slug);

  if (!place) notFound();

  const [region, city, stories, related] = await Promise.all([
    getRegion(place.regionSlug),
    place.citySlug ? getCity(place.citySlug) : null,
    listStories(),
    getRelatedPlaces(place.slug, 3),
  ]);

  const relatedStories = stories.items.filter((story) => story.regionSlug === place.regionSlug || story.citySlug === place.citySlug).slice(0, 3);

  return (
    <div>
      <PageHeader
        eyebrow="Place"
        title={place.name}
        lede={place.summary}
      >
        {place.nameAm && <p className="ethiopic mt-4 text-lg text-ink-200">{place.nameAm}</p>}
      </PageHeader>

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-850/80">
            <MediaFrame src={place.image} artwork={place.artwork} alt={place.imageAlt ?? place.name} aspect="16/9" rounded={false} priority />
            {place.imageSource && place.image && (
              <p className="p-3 text-xs leading-relaxed text-ink-400">
                {place.imageSubject ? `${place.imageSubject}. ` : ""}{place.imageSource}
              </p>
            )}
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-6">
            <div className="flex flex-wrap gap-2">
              <Badge tone="highland">{place.category}</Badge>
              {region && <Badge tone="neutral">{region.name}</Badge>}
              {city && <Badge tone="neutral">{city.name}</Badge>}
            </div>
            <dl className="mt-5 space-y-4 text-sm text-ink-200">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-ink-500" /> {city?.name ?? region?.name ?? "Ethiopia"}</div>
              <div className="flex items-center gap-2"><Heart className="h-4 w-4 text-ink-500" /> {formatCompact(place.likes)} likes</div>
              <div className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-ink-500" /> {formatCompact(place.comments)} comments</div>
            </dl>
            {place.coords && <div className="mt-5 flex flex-wrap gap-2">
              <Link href={markerMapHref("place", place.slug, "place")} className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-3.5 py-2 text-xs text-gold-200 hover:bg-gold-500/20"><MapPin aria-hidden className="h-3.5 w-3.5" /> View on our map</Link>
              <a href={googleMapsPlaceHref(place.coords)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs text-ink-100 hover:border-gold-500/50">Google Maps <ExternalLink aria-hidden className="h-3.5 w-3.5" /></a>
              <a href={googleMapsDirectionsHref(place.coords)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs text-ink-100 hover:border-gold-500/50">Directions <Navigation aria-hidden className="h-3.5 w-3.5" /></a>
            </div>}
            <div className="mt-6 flex flex-wrap gap-2">
              {place.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1 text-[10px] uppercase tracking-wider2 text-ink-300">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-14">
          <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Description</p>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-ink-300">
            {place.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        {relatedStories.length > 0 && (
          <section className="mt-16">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Stories</p>
                <h2 className="mt-2 font-display text-3xl text-white">Related reading</h2>
              </div>
              <Link href="/stories" className="inline-flex items-center gap-2 text-sm text-ink-200 hover:text-gold-400">Browse stories <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {relatedStories.map((story) => (
                <StoryCard key={story.slug} story={story} regionName={region?.name} />
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-16">
            <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Nearby</p>
            <div className="mt-5 grid gap-5 lg:grid-cols-3">
              {related.map((item) => (
                <Link key={item.slug} href={`/place/${item.slug}`} className="rounded-[1.25rem] border border-white/10 bg-ink-850/80 p-4 transition-colors hover:border-gold-500/40">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider2 text-gold-500"><Tag className="h-3.5 w-3.5" /> {item.category}</div>
                  <h3 className="mt-3 font-display text-xl text-white">{item.name}</h3>
                  <p className="mt-2 text-sm text-ink-300">{item.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
