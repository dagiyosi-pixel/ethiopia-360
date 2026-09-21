import { PageHeader } from "@/components/ui/SectionHeading";
import { RegionCard } from "@/components/cards/RegionCard";
import { regions } from "@/data/regions";

export default function RegionsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Regions"
        title="The geography of Ethiopia"
        lede="From the highland north to the lowland west and east, each region is a distinct ecological and cultural territory."
      />

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {regions.map((region) => (
            <RegionCard key={region.slug} region={region} contentCount={region.highlights.length * 7} size="lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
