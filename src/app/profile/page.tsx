import Link from "next/link";
import { ArrowRight, MapPin, UserRound } from "lucide-react";
import { PageHeader } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { contributors } from "@/data/contributors";

export default function ProfileDirectoryPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Community"
        title="Contributors"
        lede="Meet the people documenting Ethiopia through photographs, stories, architecture, music and field research."
      >
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge tone="gold">Local voices</Badge>
          <Badge tone="neutral">10 contributors</Badge>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {contributors.map((person) => (
            <Link
              key={person.username}
              href={`/profile/${person.username}`}
              className="group rounded-[1.5rem] border border-white/10 bg-ink-850/80 p-5 transition-colors hover:border-gold-500/40 hover:bg-ink-800"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold-500/25 to-white/5 text-sm font-semibold text-gold-300">
                    {person.displayName
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <h2 className="font-display text-xl text-white">{person.displayName}</h2>
                    <p className="text-sm text-ink-400">@{person.username}</p>
                  </div>
                </div>
                {person.verified && <Badge tone="gold">Verified</Badge>}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-ink-300">{person.bio}</p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-400">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {person.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="h-3.5 w-3.5" />
                  {person.role}
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-ink-200">
                <span>{person.contributions} contributions</span>
                <span className="inline-flex items-center gap-1 text-gold-400 group-hover:text-gold-300">
                  View profile <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
