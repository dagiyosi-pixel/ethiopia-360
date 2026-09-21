import Link from "next/link";
import { ArrowRight, Compass, MapPinned, Mountain, Sparkles, Star } from "lucide-react";
import { cities } from "@/data/cities";
import { places } from "@/data/places";
import { regions } from "@/data/regions";
import { stories } from "@/data/stories";
import { RegionCard } from "@/components/cards/RegionCard";
import { CityCard } from "@/components/cards/CityCard";
import { PlaceCard } from "@/components/cards/PlaceCard";
import { StoryCard } from "@/components/cards/StoryCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { formatCompact } from "@/lib/utils";

const featuredRegions = regions.slice(0, 4);
const featuredPlaces = places.filter((place) => place.featured).slice(0, 3);
const featuredStories = stories.filter((story) => story.featured).slice(0, 3);
const topCities = cities.slice(0, 4);

export default function HomePage() {
  return (
    <div className="mx-auto max-w-shell px-4 pb-24 pt-5 sm:px-8 lg:pb-28">
      <section className="reveal relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(226,179,84,0.14),_transparent_35%),linear-gradient(135deg,#0a0e18,#04060b_45%,#090d16)] px-5 py-8 shadow-soft sm:px-8 lg:px-10 lg:py-12">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-faint opacity-60" />
        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <Badge tone="gold" className="mb-5 border-gold-500/40 bg-gold-500/10 text-gold-400">
              Community atlas · Ethiopia
            </Badge>
            <h1 className="max-w-3xl font-display text-4xl leading-[0.95] tracking-tightest text-white sm:text-5xl lg:text-7xl">
              One country.<br />
              <span className="text-gold-400">Thousands of stories.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-200 sm:text-lg">
              Discover the places, people, rituals and architecture that shape Ethiopia — from the plateaus of the north to the forests of the south, captured by residents and visitors alike.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/map" size="lg">
                Explore the map
              </ButtonLink>
              <ButtonLink href="/stories" variant="outline" size="lg">
                Read stories
              </ButtonLink>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-ink-300">
              {[
                { label: "Regions", value: formatCompact(regions.length) },
                { label: "Places", value: formatCompact(places.length) },
                { label: "Stories", value: formatCompact(stories.length) },
              ].map((item) => (
                <div key={item.label} className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-2">
                  <span className="text-white">{item.value}</span> {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card rounded-[1.5rem] border border-white/10 bg-ink-900/70 p-4 shadow-lift">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Live map</p>
                <h2 className="mt-1 font-display text-2xl text-white">Ethiopia // 360</h2>
              </div>
              <div className="rounded-full border border-highland-500/30 bg-highland-500/10 px-2 py-1 text-[11px] text-highland-300">
                Map-ready
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { label: "Highlands", value: "Tigray · Amhara · Oromia", icon: Mountain },
                { label: "Rift & lakes", value: "Hawassa · Lake Tana · Afar", icon: MapPinned },
                { label: "Culture pulse", value: "Coffee, music, faith, festival", icon: Sparkles },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3">
                  <div className="mt-0.5 rounded-full border border-gold-500/30 bg-gold-500/10 p-2 text-gold-400">
                    <Icon aria-hidden className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider3 text-ink-400">{label}</p>
                    <p className="mt-1 text-sm text-ink-200">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="reveal mt-16">
        <SectionHeading
          eyebrow="Featured regions"
          title="Where the story starts"
          lede="Every region is treated as a living landscape: geography, language, memory and contribution all sit on the same map."
          action={{ href: "/explore/regions", label: "Browse all regions" }}
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredRegions.map((region) => (
            <RegionCard key={region.slug} region={region} contentCount={Math.max(10, Math.round(region.highlights.length * 11))} />
          ))}
        </div>
      </section>

      <section className="mt-20">
        <SectionHeading
          eyebrow="Focal points"
          title="Places worth lingering on"
          lede="From pilgrimage sites to market streets, the platform is built around the places people actually experience and return to."
          action={{ href: "/places", label: "Open places" }}
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {featuredPlaces.map((place) => (
            <PlaceCard key={place.slug} place={place} regionName={regions.find((region) => region.slug === place.regionSlug)?.name} cityName={cities.find((city) => city.slug === place.citySlug)?.name} />
          ))}
        </div>
      </section>

      <section className="mt-20">
        <SectionHeading
          eyebrow="Voices"
          title="Fresh reporting from the field"
          lede="Essays, photo notes and short essays make the atlas feel lived-in instead of merely informational."
          action={{ href: "/stories", label: "Read all stories" }}
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {featuredStories.map((story) => (
            <StoryCard
              key={story.slug}
              story={story}
              author={stories.length ? undefined : undefined}
              regionName={regions.find((region) => region.slug === story.regionSlug)?.name}
            />
          ))}
        </div>
      </section>

      <section className="mt-20">
        <SectionHeading
          eyebrow="Cities"
          title="Urban anchors"
          action={{ href: "/map", label: "Explore map" }}
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {topCities.map((city) => (
            <CityCard key={city.slug} city={city} regionName={regions.find((region) => region.slug === city.regionSlug)?.name} contentCount={14} />
          ))}
        </div>
      </section>

      <section className="reveal mt-20 rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Explore by theme</p>
            <h2 className="mt-2 font-display text-3xl text-white sm:text-4xl">Curated pathways through Ethiopia</h2>
          </div>
          <Link href="/search" className="inline-flex items-center gap-2 text-sm text-ink-200 hover:text-gold-400">
            Search everything <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Heritage", "/places"],
            ["Culture", "/culture"],
            ["Architecture", "/architecture"],
            ["History", "/history"],
          ].map(([label, href]) => (
            <Link key={label} href={href} className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition-colors hover:border-gold-500/40 hover:bg-gold-500/5">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-white">{label}</span>
                <Star aria-hidden className="h-4 w-4 text-gold-400 transition-transform group-hover:scale-110" />
              </div>
              <p className="mt-3 text-sm text-ink-300">Dive into the places, rituals and built forms that define the landscape.</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
