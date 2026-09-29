import { PageHeader } from "@/components/ui/SectionHeading";
import { RegionCard } from "@/components/cards/RegionCard";
import { PlaceCard } from "@/components/cards/PlaceCard";
import { stories } from "@/data/stories";
import { places } from "@/data/places";
import { regions } from "@/data/regions";
import { cities } from "@/data/cities";
import { StoryCard } from "@/components/cards/StoryCard";

export default function ExplorePage() {
  const featured = regions.slice(0, 6);
  const chosenPlaces = places.filter((place) => place.featured).slice(0, 4);
  const recentStories = stories.slice(0, 3);

  return (
    <div>
      <PageHeader
        eyebrow="Explore"
        title="Map the country through place and memory"
        lede="A visual atlas of Ethiopia’s regions, cities, communities and landscapes , designed to feel like a living guide rather than a static archive."
      />

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8 lg:py-12">
        <section className="rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-5 sm:p-6">
          <div className="mb-6 flex flex-col gap-4 rounded-[1.5rem] border border-gold-500/20 bg-[radial-gradient(circle_at_top,_rgba(226,179,84,0.16),_transparent_40%),linear-gradient(135deg,_rgba(12,17,25,0.9),_rgba(7,10,17,0.8))] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Explore by map</p>
              <h2 className="mt-2 font-display text-3xl text-white">Discover Ethiopia geographically</h2>
              <p className="mt-2 max-w-2xl text-sm text-ink-300">Browse regions, cities and landmark places from one clear overview of the country.</p>
            </div>
            <a href="/map" className="inline-flex items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-2.5 text-sm font-medium text-gold-200 transition-colors hover:bg-gold-500/15">Open the map</a>
          </div>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Atlas</p>
              <h2 className="mt-2 font-display text-3xl text-white">Regional overview</h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((region) => (
              <RegionCard key={region.slug} region={region} contentCount={region.highlights.length * 6} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Cities</p>
              <h2 className="mt-2 font-display text-3xl text-white">Urban anchors</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cities.slice(0, 8).map((city) => (
              <div key={city.slug} className="rounded-xl2 border border-white/[0.08] bg-ink-850/70 p-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-lg text-white">{city.name}</h3>
                    <p className="ethiopic text-xs text-ink-400">{city.nameAm}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-ink-300">{city.summary}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-3xl text-white">Places worth exploring</h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {chosenPlaces.map((place) => (
              <PlaceCard
                key={place.slug}
                place={place}
                regionName={regions.find((region) => region.slug === place.regionSlug)?.name}
                cityName={cities.find((city) => city.slug === place.citySlug)?.name}
                variant="wide"
              />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-3xl text-white">Latest notes</h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {recentStories.map((story) => (
              <StoryCard key={story.slug} story={story} regionName={regions.find((region) => region.slug === story.regionSlug)?.name} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
