import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { getContributorByUsername, getPlacesByContributor, getStoriesByAuthor } from "@/lib/data/queries";
import { PlaceCard } from "@/components/cards/PlaceCard";
import { StoryCard } from "@/components/cards/StoryCard";

export async function generateStaticParams() {
  const { contributors } = await import("@/data/contributors");
  return contributors.map((person) => ({ username: person.username }));
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const contributor = await getContributorByUsername(username);

  if (!contributor) notFound();

  const [places, stories] = await Promise.all([
    getPlacesByContributor(contributor.id),
    getStoriesByAuthor(contributor.id),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Contributor"
        title={contributor.displayName}
        lede={contributor.bio}
      >
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Badge tone="gold">{contributor.role}</Badge>
          {contributor.verified && <Badge tone="neutral">Verified</Badge>}
        </div>
      </PageHeader>

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-6">
            <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Profile</p>
            <div className="mt-4 space-y-3 text-sm text-ink-200">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-ink-500" /> {contributor.location}</div>
              <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-ink-500" /> {contributor.contributions} contributions</div>
              <div className="text-ink-300">@{contributor.username}</div>
            </div>
          </div>

          <div className="space-y-10">
            {places.length > 0 && (
              <section>
                <div className="mb-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Places</p>
                    <h2 className="mt-2 font-display text-3xl text-white">Published places</h2>
                  </div>
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                  {places.slice(0, 2).map((place) => (
                    <PlaceCard key={place.slug} place={place} variant="wide" />
                  ))}
                </div>
              </section>
            )}

            {stories.length > 0 && (
              <section>
                <div className="mb-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Stories</p>
                    <h2 className="mt-2 font-display text-3xl text-white">Recent writing</h2>
                  </div>
                  <Link href="/stories" className="inline-flex items-center gap-2 text-sm text-ink-200 hover:text-gold-400">Browse all <ArrowRight className="h-4 w-4" /></Link>
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                  {stories.slice(0, 2).map((story) => (
                    <StoryCard key={story.slug} story={story} />
                  ))}
                </div>
              </section>
            )}

            {!places.length && !stories.length && (
              <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-ink-300">
                This contributor has not published any places or stories yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
