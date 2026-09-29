import Link from "next/link";
import { FOOTER_COLUMNS, SITE } from "@/lib/site";
import { PatternDivider } from "@/components/ui/SectionHeading";

const GEO_ATTRIBUTION =
  "Region boundaries: geoBoundaries (ETH ADM1, CC BY 4.0). Map data and tiles © OpenStreetMap contributors.";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-white/[0.08] bg-ink-900/60">
      <div className="mx-auto max-w-shell px-5 pb-28 pt-16 sm:px-8 sm:pb-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="space-y-5">
            <Link href="/" className="inline-flex flex-col leading-none">
              <span className="font-display text-lg tracking-tight text-white">
                ETHIOPIA<span className="text-gold-500">{"//"}</span>360
              </span>
              <span className="ethiopic mt-1 text-xs text-ink-400">ኢትዮጵያ · ሕያው መዝገብ</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-ink-300">
              A community-built record of Ethiopia. Photographs, stories, places and knowledge,
              contributed by the people who live them.
            </p>
            <p className="text-xs leading-relaxed text-ink-400">
              Demo content in this build is clearly labelled and is not verified reporting. Replace
              it with sourced contributions before publishing.
            </p>
          </div>

          <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-3">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h2 className="text-[11px] font-medium uppercase tracking-wider3 text-gold-500">
                  {column.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-ink-300 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <PatternDivider className="my-10" />

        <div className="flex flex-col gap-4 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. Built as an open cultural archive.
          </p>
          <p className="max-w-xl sm:text-right">{GEO_ATTRIBUTION}</p>
        </div>
      </div>
    </footer>
  );
}
