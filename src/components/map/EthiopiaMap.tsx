"use client";

import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { places } from "@/data/places";

const featuredPlaces = places.filter((place) => place.featured).slice(0, 12);

const markerColor = {
  nature: "#f2b95b",
  heritage: "#90caf9",
  urban: "#7ae0c4",
  religious: "#fbbf24",
  market: "#f9a8d4",
  landmark: "#c4b5fd",
} as const;

export function EthiopiaMap() {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-ink-900/80">
      <MapContainer
        center={[9.15, 39.8]}
        zoom={6}
        scrollWheelZoom
        className="h-[560px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {featuredPlaces.map((place) => (
          <CircleMarker
            key={place.slug}
            center={[place.coords.lat, place.coords.lng]}
            radius={Math.max(8, Math.min(18, 9 + place.likes / 220))}
            pathOptions={{
              color: markerColor[place.category],
              fillColor: markerColor[place.category],
              fillOpacity: 0.7,
              weight: 2,
            }}
          >
            <Popup>
              <div className="min-w-[220px] text-ink-900">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-900">
                    {place.category}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    {place.regionSlug}
                  </span>
                </div>

                <p className="font-display text-lg text-slate-900">{place.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{place.summary}</p>

                <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-slate-500">
                  <span>{place.likes.toLocaleString()} likes</span>
                  <span>{place.views.toLocaleString()} views</span>
                </div>

                <Link
                  href={`/place/${place.slug}`}
                  className="mt-3 inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-700"
                >
                  Open details
                </Link>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
