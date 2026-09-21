import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MapPin, Mountain } from "lucide-react";
import { PageHeader } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { MediaFrame } from "@/components/visual/MediaFrame";
import { PlaceCard } from "@/components/cards/PlaceCard";
import { StoryCard } from "@/components/cards/StoryCard";
import { getCity, getRegion, listPlaces, listStories, listArchitecture, listMedia } from "@/lib/data/queries";
import { formatNumber } from "@/lib/utils";

export async function generateStaticParams() {
  const { cities } = await import("@/data/cities");
  return cities.map((city) => ({ slug: city.slug }));
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = await getCity(slug);

  if (!city) notFound();

  const [region, places, stories, architecture, media] = await Promise.all([
    getRegion(city.regionSlug),
    listPlaces(),
    listStories(),
    listArchitecture(),
    listMedia(),
  ]);

  const cityPlaces = places.items.filter((place) => place.citySlug === city.slug);
  const cityStories = stories.items.filter((story) => story.citySlug === city.slug);
  const cityArchitecture = architecture.items.filter((entry) => entry.citySlug === city.slug);
  const cityMedia = media.items.filter((item) => item.citySlug === city.slug);

  return (
    <div>
      <PageHeader
        eyebrow="City"
        title={city.name}
        lede={city.summary}
      >
        <div className="mt-5 flex flex-wrap gap-2">
          {city.knownFor.map((keyword) => (
            <span key={keyword} className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-ink-200">{keyword}</span>
          ))}
        </div>
      </PageHeader>

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-850/80">
            <MediaFrame src={city.image} artwork={city.artwork} alt={city.name} aspect="16/9" rounded={false} priority />
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-6">
            <p className="text-[11px] uppercase tracking-wider3 text-gold-500">City profile</p>
            <div className="mt-4 space-y-4 text-sm text-ink-200">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-ink-200"><MapPin className="h-3.5 w-3.5 text-ink-500" /> {region?.name ?? "Ethiopia"}</div>
              <p className="leading-relaxed text-ink-300">{city.description}</p>
              {typeof city.elevationM === "number" && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-[11px] uppercase tracking-wider3 text-ink-400">Elevation</p>
                  <p className="mt-2 text-xl text-white">{formatNumber(city.elevationM)} m</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="mt-16">
          <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Landmarks</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {city.landmarks.map((landmark) => (
              <Badge key={landmark} tone="neutral">{landmark}</Badge>
            ))}
          </div>
        </section>

        {cityPlaces.length > 0 && (
          <section className="mt-16">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Places</p>
                <h2 className="mt-2 font-display text-3xl text-white">Nearby landmarks</h2>
              </div>
              <Link href="/places" className="inline-flex items-center gap-2 text-sm text-ink-200 hover:text-gold-400">See all <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {cityPlaces.slice(0, 4).map((place) => (
                <PlaceCard key={place.slug} place={place} regionName={region?.name} cityName={city.name} variant="wide" />
              ))}
            </div>
          </section>
        )}

        {cityStories.length > 0 && (
          <section className="mt-16">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Stories</p>
                <h2 className="mt-2 font-display text-3xl text-white">Local reporting</h2>
              </div>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {cityStories.slice(0, 3).map((story) => (
                <StoryCard key={story.slug} story={story} regionName={region?.name} />
              ))}
            </div>
          </section>
        )}

        {cityArchitecture.length > 0 && (
          <section className="mt-16">
            <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Architecture</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {cityArchitecture.slice(0, 4).map((entry) => (
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

        {cityMedia.length > 0 && (
          <section className="mt-16">
            <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Gallery</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {cityMedia.slice(0, 8).map((item) => (
                <span key={item.slug} className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-ink-300">{item.title}</span>
              ))}
            </div>
          </section>
        )}

        {!cityPlaces.length && !cityStories.length && !cityArchitecture.length && (
          <div className="mt-16 rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-ink-300">
            <Mountain className="mx-auto h-5 w-5 text-gold-400" />
            <p className="mt-3">This city is mapped, but it still needs local contributions to fill the story list.</p>
          </div>
        )}
      </div>
    </div>
  );
}
