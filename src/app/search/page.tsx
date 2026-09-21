import { PageHeader } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { SearchKind, SEARCH_KINDS } from "@/lib/data/search";

export default function SearchPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Search"
        title="Find places, stories and people"
        lede="The index is designed to surface thematic matches from across the atlas."
      />

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8">
        <div className="rounded-[1.5rem] border border-white/10 bg-ink-850/80 p-6">
          <div className="flex flex-wrap gap-2">
            {SEARCH_KINDS.map((set) => (
              <Badge key={set.value} tone={set.value === "all" ? "gold" : "neutral"}>
                {set.label}
              </Badge>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-ink-900/80 px-4 py-3 text-sm text-ink-300">
            Search is wired to the country atlas data model and ready for a production search box once the project gets its live content layer.
          </div>
        </div>
      </div>
    </div>
  );
}
