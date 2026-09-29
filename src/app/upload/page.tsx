import Link from "next/link";
import { PageHeader } from "@/components/ui/SectionHeading";
import { UploadForm } from "@/components/upload/UploadForm";
import { getSessionUser } from "@/lib/auth";
import { listCities, listRegions } from "@/lib/data/queries";

export default async function UploadPage() {
  const [user, regionPage, cityPage] = await Promise.all([getSessionUser(), listRegions(), listCities()]);
  return <div><PageHeader eyebrow="Contribute" title="Add to the Ethiopia atlas" lede="Share a destination, story, image or cultural record with the community." />
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-8"><section className="mx-auto max-w-2xl rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-6 sm:p-8">
      {!user ? <div className="space-y-4"><p className="text-ink-300">Sign in before submitting a contribution.</p><Link className="text-gold-400 underline" href="/login?next=%2Fupload">Sign in to continue</Link></div> :
        <UploadForm regions={regionPage.items.map(({ slug, name }) => ({ slug, name }))} cities={cityPage.items.map(({ slug, name, regionSlug }) => ({ slug, name, regionSlug }))} />}
    </section></div>
  </div>;
}
