import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Heart, MapPin } from "lucide-react";
import { PageHeader } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { MediaFrame } from "@/components/visual/MediaFrame";
import { getArchitectureEntry, getCity, getRegion } from "@/lib/data/queries";
import { formatCompact } from "@/lib/utils";

export async function generateStaticParams() {
  const { architectureEntries } = await import("@/data/architecture");
  return architectureEntries.map((entry) => ({ slug: entry.slug }));
}

export default async function ArchitectureDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getArchitectureEntry(slug);

  if (!entry) notFound();

  const [region, city] = await Promise.all([getRegion(entry.regionSlug), entry.citySlug ? getCity(entry.citySlug) : null]);

  return (
    <div>
      <PageHeader
        eyebrow="Architecture"
        title={entry.name}
        lede={entry.summary}
      >
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge tone="highland">{entry.category}</Badge>
          <Badge tone="neutral">{entry.era}</Badge>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-850/80">
            <MediaFrame src={entry.image} artwork={entry.artwork} alt={entry.name} aspect="16/9" rounded={false} priority />
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-6">
            <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Context</p>
            <div className="mt-4 space-y-3 text-sm text-ink-200">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-ink-500" /> {city?.name ?? region?.name ?? "Ethiopia"}</div>
              {region && <div>Region: {region.name}</div>}
              <div className="flex items-center gap-2"><Heart className="h-4 w-4 text-ink-500" /> {formatCompact(entry.likes)} likes</div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1 text-[10px] uppercase tracking-wider2 text-ink-300">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-14 max-w-3xl">
          <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Reading</p>
          <div className="mt-4 space-y-5 text-base leading-relaxed text-ink-300">
            {entry.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <div className="mt-12 flex justify-start">
          <Link href="/architecture" className="inline-flex items-center gap-2 text-sm text-ink-200 hover:text-gold-400">Back to architecture <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </div>
  );
}
