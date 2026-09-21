import type { Artwork, ArtworkPalette } from "@/types";
import { cn, hashString } from "@/lib/utils";

/**
 * Deterministic generated artwork.
 *
 * Seed content has no photographs yet, so instead of shipping fake images or
 * grey boxes, every item gets a generated composition derived from its own
 * seed: topographic contours, terraces, stelae, weave or arch geometry.
 * The result is stable (same seed => same image), cheap (inline SVG, no network
 * requests) and honest — none of it claims to be a photograph.
 *
 * Once a real asset URL exists, `MediaFrame` renders that instead.
 */

const PALETTES: Record<ArtworkPalette, { from: string; to: string; line: string; accent: string }> = {
  highland: { from: "#08211c", to: "#0c2f27", line: "#3fb98c", accent: "#e2b354" },
  rift: { from: "#22100a", to: "#2e170d", line: "#e0703f", accent: "#f0cc73" },
  danakil: { from: "#241705", to: "#30200a", line: "#e2b354", accent: "#e0703f" },
  nile: { from: "#061a26", to: "#0a2536", line: "#5aa9e6", accent: "#3fb98c" },
  entoto: { from: "#101425", to: "#171c31", line: "#9aa8c2", accent: "#e2b354" },
  harar: { from: "#1c1220", to: "#28182c", line: "#c4542a", accent: "#f0cc73" },
  gold: { from: "#1d1608", to: "#2a200c", line: "#e2b354", accent: "#f0cc73" },
  basalt: { from: "#0d1014", to: "#161a20", line: "#6b7a97", accent: "#c4542a" },
};

interface ArtworkProps {
  artwork: Artwork;
  className?: string;
  /** Adds a bottom gradient so overlaid text stays legible. */
  scrim?: boolean;
  title?: string;
}

export function GeneratedArtwork({ artwork, className, scrim = false, title }: ArtworkProps) {
  const palette = PALETTES[artwork.palette] ?? PALETTES.basalt;
  const h = hashString(`${artwork.palette}-${artwork.seed}`);
  const id = `art${h.toString(36)}`;
  const motif = artwork.motif ?? "contour";

  /** Deterministic pseudo-random — no Math.random anywhere. */
  const rnd = (index: number, mod: number) =>
    (((h >> (index % 12)) ^ (index * 2654435761)) >>> 0) % mod;

  const contours = Array.from({ length: 7 }, (_, i) => {
    const amp = 10 + rnd(i + 3, 26);
    const y = 190 + i * 15;
    return `M -20 ${y} C ${60 + amp} ${y - amp * (1 + (i % 3) * 0.4)}, ${150 - amp} ${
      y + amp * 0.6
    }, 240 ${y - amp * 0.3} S 360 ${y + amp * 0.5}, 430 ${y - amp * 0.2}`;
  });

  const terraces = Array.from({ length: 9 }, (_, i) => ({
    y: 92 + i * 22 + rnd(i, 6),
    w: 240 + rnd(i + 5, 140),
  }));

  const stelae = Array.from({ length: 4 }, (_, i) => ({
    x: 60 + i * 78 + rnd(i + 7, 18),
    w: 16 + rnd(i, 16),
    h: 90 + rnd(i + 2, 120),
  }));

  const arches = Array.from({ length: 5 }, (_, i) => ({
    x: 30 + i * 74,
    w: 46 + rnd(i, 14),
  }));

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={title ? `${title} — generated placeholder artwork` : "Generated placeholder artwork"}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={palette.from} />
          <stop offset="100%" stopColor={palette.to} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.72" cy="0.18" r="0.7">
          <stop offset="0%" stopColor={palette.accent} stopOpacity="0.34" />
          <stop offset="60%" stopColor={palette.accent} stopOpacity="0.05" />
          <stop offset="100%" stopColor={palette.accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="45%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>
        <pattern
          id={`${id}-weave`}
          width="34"
          height="34"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <path d="M0 17 H34 M17 0 V34" stroke={palette.line} strokeOpacity="0.28" strokeWidth="1.2" />
          <path d="M0 0 L34 34 M34 0 L0 34" stroke={palette.accent} strokeOpacity="0.16" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="400" height="300" fill={`url(#${id}-bg)`} />
      <rect width="400" height="300" fill={`url(#${id}-glow)`} />
      <rect
        width="400"
        height="300"
        fill={`url(#${id}-weave)`}
        opacity={motif === "weave" ? 0.5 : 0.12}
      />
      {motif === "contour" &&
        contours.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={i % 3 === 0 ? palette.accent : palette.line}
            strokeOpacity={0.16 + (i % 4) * 0.06}
            strokeWidth={i % 3 === 0 ? 1.4 : 1}
          />
        ))}

      {motif === "terrace" &&
        terraces.map((t, i) => (
          <path
            key={i}
            d={`M ${200 - t.w / 2} ${t.y} Q 200 ${t.y - 12}, ${200 + t.w / 2} ${t.y}`}
            fill="none"
            stroke={i % 2 ? palette.line : palette.accent}
            strokeOpacity="0.28"
            strokeWidth="1.6"
          />
        ))}

      {motif === "tower" &&
        stelae.map((s, i) => (
          <g key={i} opacity={0.85}>
            <rect
              x={s.x}
              y={300 - s.h}
              width={s.w}
              height={s.h}
              fill={palette.from}
              stroke={palette.line}
              strokeOpacity="0.45"
            />
            <rect
              x={s.x + 4}
              y={300 - s.h + 16}
              width={s.w - 8}
              height={s.h - 46}
              fill={palette.accent}
              fillOpacity="0.08"
              stroke={palette.accent}
              strokeOpacity="0.3"
            />
          </g>
        ))}

      {motif === "arch" &&
        arches.map((a, i) => (
          <path
            key={i}
            d={`M ${a.x} 300 V 190 A ${a.w / 2} ${a.w / 2} 0 0 1 ${a.x + a.w} 190 V 300`}
            fill={palette.from}
            fillOpacity="0.7"
            stroke={i % 2 ? palette.accent : palette.line}
            strokeOpacity="0.4"
            strokeWidth="1.4"
          />
        ))}

      {motif === "coffee" &&
        Array.from({ length: 14 }, (_, i) => {
          const cx = 30 + rnd(i, 350);
          const cy = 40 + rnd(i + 4, 220);
          const r = 7 + rnd(i + 9, 12);
          return (
            <g key={i}>
              <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.78} fill={palette.accent} fillOpacity="0.22" />
              <path
                d={`M ${cx - r * 0.7} ${cy} Q ${cx} ${cy - r * 0.5}, ${cx + r * 0.7} ${cy}`}
                fill="none"
                stroke={palette.line}
                strokeOpacity="0.5"
                strokeWidth="1"
              />
            </g>
          );
        })}

      {scrim && <rect width="400" height="300" fill={`url(#${id}-fade)`} />}
      <rect
        x="0.5"
        y="0.5"
        width="399"
        height="299"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.06"
      />
    </svg>
  );
}
