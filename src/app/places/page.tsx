import { PageHeader } from "@/components/ui/SectionHeading";
import { PlaceCard } from "@/components/cards/PlaceCard";
import { places } from "@/data/places";
import { cities } from "@/data/cities";
import { regions } from "@/data/regions";

export default function PlacesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Places"
        title="Landmarks, natural wonders and living streets"
        lede="A curated list of places that show the diversity of Ethiopia’s landscapes, histories and everyday routines."
      />

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {places.map((place) => (
            <PlaceCard
              key={place.slug}
              place={place}
              regionName={regions.find((region) => region.slug === place.regionSlug)?.name}
              cityName={cities.find((city) => city.slug === place.citySlug)?.name}
              variant="wide"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
