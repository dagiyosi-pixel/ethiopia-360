import { PageHeader } from "@/components/ui/SectionHeading";
import { history } from "@/data/history";
import { Badge } from "@/components/ui/Badge";

export default function HistoryPage() {
  return (
    <div>
      <PageHeader
        eyebrow="History"
        title="A long record of peoples, trade and change"
        lede="The timeline focuses on major historical shifts and enduring places: empires, religious change, architecture and trade routes."
      />

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8">
        <div className="space-y-5">
          {history.map((entry) => (
            <article key={entry.slug} className="rounded-xl3 border border-white/[0.08] bg-ink-850/75 p-5">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="nile">{entry.kind}</Badge>
                <span className="text-sm text-ink-300">{entry.period}</span>
              </div>
              <h2 className="mt-4 font-display text-2xl text-white">{entry.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{entry.summary}</p>
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
