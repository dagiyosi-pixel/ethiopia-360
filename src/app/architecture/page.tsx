import Link from "next/link";
import { PageHeader } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { listArchitecture } from "@/lib/data/queries";

export default async function ArchitecturePage() {
  const { items: architectureEntries } = await listArchitecture();
  return (
    <div>
      <PageHeader
        eyebrow="Architecture"
        title="Built form across Ethiopia"
        lede="Architecture here is not only monumental. It is also everyday, conversational and tied to local material, climate and ritual."
      />

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {architectureEntries.map((entry) => (
            <article key={entry.slug} className="rounded-xl3 border border-white/[0.08] bg-ink-850/75 p-5">
              <div className="flex items-center justify-between gap-3">
                <Badge tone="highland">{entry.category}</Badge>
                <span className="text-xs uppercase tracking-wider2 text-ink-400">{entry.era}</span>
              </div>
              <h2 className="mt-4 font-display text-2xl text-white">{entry.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{entry.summary}</p>
              <Link href={`/architecture/${entry.slug}`} className="mt-3 inline-block text-sm text-gold-400 hover:text-gold-300">Explore this building →</Link>
              {entry.coords && <Link className="ml-4 inline-block text-sm text-gold-400 hover:text-gold-300" href={`/map?marker=architecture%3A${encodeURIComponent(entry.slug)}&filter=architecture`}>Find it on the map</Link>}
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/[0.08] px-2.5 py-1 text-[10px] uppercase tracking-wider2 text-ink-300">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
