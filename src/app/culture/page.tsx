import Link from "next/link";
import { PageHeader } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { listContributors, listCulture } from "@/lib/data/queries";

export default async function CulturePage() {
  const [{ items: cultureTopics }, { items: contributors }] = await Promise.all([listCulture(), listContributors()]);
  return (
    <div>
      <PageHeader
        eyebrow="Culture"
        title="Food, language, ritual and the everyday"
        lede="Culture is a map of lived practice: language, migration, coffee, clothing and ritual all tell the same story in different forms."
      />

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {cultureTopics.map((topic) => (
            <article id={topic.slug} key={topic.slug} className="rounded-xl3 border border-white/[0.08] bg-ink-850/75 p-5">
              <div className="flex items-center justify-between gap-3">
                <Badge tone="gold">{topic.category}</Badge>
                <span className="text-xs uppercase tracking-wider2 text-ink-400">Topic</span>
              </div>
              <h2 className="mt-4 font-display text-2xl text-white">{topic.name}</h2>
              {topic.nameAm && <p className="ethiopic mt-1 text-sm text-ink-300">{topic.nameAm}</p>}
              <p className="mt-3 text-sm leading-relaxed text-ink-300">{topic.summary}</p>
              {topic.coords && <Link className="mt-3 inline-block text-sm text-gold-400 hover:text-gold-300" href={`/map?marker=culture%3A${encodeURIComponent(topic.slug)}&filter=culture`}>Find this location on the map →</Link>}
              <div className="mt-4 flex flex-wrap gap-2">
                {topic.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/[0.08] px-2.5 py-1 text-[10px] uppercase tracking-wider2 text-ink-300">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-ink-400">
                Contributor: {contributors.find((person) => person.id === topic.contributorId)?.displayName ?? "Community archive"}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
