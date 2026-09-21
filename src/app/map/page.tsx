"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import Link from "next/link";
import { Compass, LocateFixed, MapPin } from "lucide-react";
import { regions } from "@/data/regions";
import { cities } from "@/data/cities";
import { places } from "@/data/places";

const EthiopiaMap = dynamic(
  () => import("@/components/map/EthiopiaMap").then((mod) => mod.EthiopiaMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[560px] items-center justify-center rounded-[1.5rem] border border-white/10 bg-ink-900/80 text-sm text-ink-300">
        Loading map…
      </div>
    ),
  },
);

const regionItems = regions.slice(0, 12);

export default function MapPage() {
  const overview = useMemo(
    () => [
      { label: "Regions", value: regions.length },
      { label: "Cities", value: cities.length },
      { label: "Places", value: places.length },
    ],
    [],
  );

  return (
    <main className="mx-auto max-w-shell px-4 pb-24 pt-5 sm:px-8 lg:pb-28">
      <section className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(226,179,84,0.14),_transparent_35%),linear-gradient(135deg,#0a0e18,#04060b_45%,#090d16)] p-5 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Map</p>
            <h1 className="mt-2 font-display text-4xl text-white sm:text-5xl">Explore Ethiopia by geography</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1.5 text-xs text-gold-200">
            <Compass aria-hidden className="h-3.5 w-3.5" />
            Regional guide
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {overview.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[11px] uppercase tracking-wider3 text-ink-400">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-3">
          <MapPin aria-hidden className="h-5 w-5 text-gold-400" />
          <h2 className="font-display text-2xl text-white">Interactive Ethiopia map</h2>
        </div>
        <EthiopiaMap />
      </section>

      <section className="mt-10 rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-4 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <MapPin aria-hidden className="h-5 w-5 text-gold-400" />
          <h2 className="font-display text-2xl text-white">Regional map overview</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {regionItems.map((region) => (
            <Link
              key={region.slug}
              href={`/region/${region.slug}`}
              className="group rounded-2xl border border-white/[0.08] bg-ink-900/60 p-4 transition-colors hover:border-gold-500/40 hover:bg-gold-500/[0.04]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xl text-white">{region.name}</p>
                  <p className="ethiopic mt-1 text-xs text-ink-400">{region.nameAm}</p>
                </div>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-ink-200 transition-colors group-hover:border-gold-500/30 group-hover:text-gold-400">
                  <LocateFixed aria-hidden className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-300">{region.summary}</p>
              <p className="mt-4 text-xs uppercase tracking-wider3 text-gold-500">Capital: {region.capital}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-4 sm:p-6">
        <h2 className="font-display text-2xl text-white">Quick destinations</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {places.filter((place) => place.featured).slice(0, 8).map((place) => (
            <Link
              key={place.slug}
              href={`/place/${place.slug}`}
              className="rounded-2xl border border-white/[0.08] bg-ink-900/60 p-4 transition-colors hover:border-gold-500/40"
            >
              <p className="text-xs uppercase tracking-wider3 text-gold-500">{place.category}</p>
              <p className="mt-2 font-display text-xl text-white">{place.name}</p>
              <p className="mt-2 text-sm text-ink-300">{place.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
