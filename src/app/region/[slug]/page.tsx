import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MapPin, Mountain, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/SectionHeading";
import { Badge, MetaRow } from "@/components/ui/Badge";
import { MediaFrame } from "@/components/visual/MediaFrame";
import { PlaceCard } from "@/components/cards/PlaceCard";
import { StoryCard } from "@/components/cards/StoryCard";
import { CityCard } from "@/components/cards/CityCard";
import { getRegionBundle } from "@/lib/data/queries";
import { formatCompact, formatNumber } from "@/lib/utils";

export async function generateStaticParams() {
  const { regions } = await import("@/data/regions");
  return regions.map((region) => ({ slug: region.slug }));
}

export default async function RegionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bundle = await getRegionBundle(slug);

  if (!bundle) notFound();

  const { region, cities, places, stories, architecture, media, contributors } = bundle;

  return (
    <div>
      <PageHeader
        eyebrow="Region"
        title={region.name}
        lede={region.summary}
      >
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-ink-300">
          {region.languages.map((language) => (
            <span key={language} className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5">
              {language}
            </span>
          ))}
        </div>
      </PageHeader>

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-850/80">
            <MediaFrame src={region.image} artwork={region.artwork} alt={region.name} aspect="16/9" rounded={false} priority />
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-6">
            <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Quick facts</p>
            <div className="mt-5 space-y-4 text-sm text-ink-200">
              <MetaRow>
                <span className="inline-flex items-center gap-2"><Mountain className="h-3.5 w-3.5 text-ink-500" /> {region.landscape}</span>
              </MetaRow>
              <MetaRow>
                <span className="inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-ink-500" /> Capital: {region.capital}</span>
              </MetaRow>
              <div className="grid gap-3 sm:grid-cols-2">
                {region.stats.areaKm2 && <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3"><p className="text-[11px] uppercase tracking-wider3 text-ink-400">Area</p><p className="mt-2 text-xl text-white">{formatCompact(region.stats.areaKm2)} km²</p></div>}
                {region.stats.populationApprox && <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3"><p className="text-[11px] uppercase tracking-wider3 text-ink-400">Population</p><p className="mt-2 text-xl text-white">{formatCompact(region.stats.populationApprox)}</p></div>}
                {region.stats.elevationM && <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3"><p className="text-[11px] uppercase tracking-wider3 text-ink-400">Elevation</p><p className="mt-2 text-xl text-white">{formatNumber(region.stats.elevationM)} m</p></div>}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-14">
          <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Overview</p>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-300">{region.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {region.highlights.map((highlight) => (
              <Badge key={highlight} tone="neutral">{highlight}</Badge>
            ))}
          </div>
        </section>

        {cities.length > 0 && (
          <section className="mt-16">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Cities</p>
                <h2 className="mt-2 font-display text-3xl text-white">Urban anchors</h2>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {cities.map((city) => (
                <CityCard key={city.slug} city={city} regionName={region.name} contentCount={places.filter((p) => p.citySlug === city.slug).length + stories.filter((s) => s.citySlug === city.slug).length} />
              ))}
            </div>
          </section>
        )}

        {places.length > 0 && (
          <section className="mt-16">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Places</p>
                <h2 className="mt-2 font-display text-3xl text-white">Landmarks and local scenes</h2>
              </div>
              <Link href="/places" className="inline-flex items-center gap-2 text-sm text-ink-200 hover:text-gold-400">See all places <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {places.slice(0, 4).map((place) => (
                <PlaceCard key={place.slug} place={place} regionName={region.name} cityName={place.citySlug ? cities.find((city) => city.slug === place.citySlug)?.name : undefined} variant="wide" />
              ))}
            </div>
          </section>
        )}

        {stories.length > 0 && (
          <section className="mt-16">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Stories</p>
                <h2 className="mt-2 font-display text-3xl text-white">Voices from the region</h2>
              </div>
              <Link href="/stories" className="inline-flex items-center gap-2 text-sm text-ink-200 hover:text-gold-400">Read more <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {stories.slice(0, 3).map((story) => (
                <StoryCard key={story.slug} story={story} regionName={region.name} />
              ))}
            </div>
          </section>
        )}

        {architecture.length > 0 && (
          <section className="mt-16">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Architecture</p>
                <h2 className="mt-2 font-display text-3xl text-white">Built form</h2>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {architecture.slice(0, 4).map((entry) => (
                <Link key={entry.slug} href={`/architecture/${entry.slug}`} className="rounded-[1.25rem] border border-white/10 bg-ink-850/80 p-5 transition-colors hover:border-gold-500/40">
                  <div className="flex items-center justify-between gap-3">
                    <Badge tone="highland">{entry.category}</Badge>
                    <span className="text-[11px] uppercase tracking-wider2 text-ink-400">{entry.era}</span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl text-white">{entry.name}</h3>
                  <p className="mt-2 text-sm text-ink-300">{entry.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {media.length > 0 && (
          <section className="mt-16">
            <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Field notes</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {media.slice(0, 6).map((item) => (
                <span key={item.slug} className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-ink-300">{item.title}</span>
              ))}
            </div>
          </section>
        )}

        {contributors.length > 0 && (
          <section className="mt-16">
            <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Contributors</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {contributors.slice(0, 8).map((person) => (
                <Link key={person.id} href={`/profile/${person.username}`} className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-ink-200 hover:text-gold-400">{person.displayName}</Link>
              ))}
            </div>
          </section>
        )}

        {region.geoNote && (
          <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-ink-300">
            <Sparkles className="mb-2 h-4 w-4 text-gold-400" /> {region.geoNote}
          </div>
        )}
      </div>
    </div>
  );
}
