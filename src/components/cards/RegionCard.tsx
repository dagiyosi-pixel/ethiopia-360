import Link from "next/link";
import { ArrowUpRight, Mountain } from "lucide-react";
import type { Region } from "@/types";
import { MediaFrame } from "@/components/visual/MediaFrame";
import { MetaRow } from "@/components/ui/Badge";
import { cn, formatCompact } from "@/lib/utils";

/**
 * Region card — location-forward: a full-bleed visual, the region name in both
 * scripts, and the count of contributions so the card communicates volume.
 */
export function RegionCard({
  region,
  contentCount,
  className,
  size = "md",
}: {
  region: Region;
  contentCount?: number;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <Link
      href={`/region/${region.slug}`}
      className={cn(
        "premium-card group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/20",
        className,
      )}
    >
      <MediaFrame
        src={region.image}
        artwork={region.artwork}
        alt={`${region.name} — generated regional artwork`}
        aspect={size === "lg" ? "16/9" : "4/3"}
        scrim
        rounded={false}
        className="transition-transform"
      >
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
          <div>
            <h3 className="font-display text-xl leading-tight text-white sm:text-2xl">{region.name}</h3>
            <p className="ethiopic mt-1 text-sm text-ink-200">{region.nameAm}</p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-ink-950/50 text-white transition-colors group-hover:border-gold-500/60 group-hover:text-gold-400">
            <ArrowUpRight aria-hidden className="h-4 w-4" />
          </span>
        </div>
      </MediaFrame>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-sm leading-relaxed text-ink-300">{region.summary}</p>
        <MetaRow className="mt-auto">
          <span className="inline-flex items-center gap-1.5">
            <Mountain aria-hidden className="h-3.5 w-3.5 text-ink-500" />
            {region.landscape}
          </span>
          {typeof contentCount === "number" && (
            <span className="text-ink-400">
              {formatCompact(contentCount)} {contentCount === 1 ? "contribution" : "contributions"}
            </span>
          )}
        </MetaRow>
      </div>
    </Link>
  );
}
