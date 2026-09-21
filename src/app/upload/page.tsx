import { PageHeader } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";

export default function UploadPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Contribute"
        title="Upload a place, story or photo"
        lede="This workspace includes the upload flow and validation layer, but the current build is running in demo mode without a live Supabase storage bucket."
      />

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-xl rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-6 sm:p-8">
          <p className="text-sm leading-relaxed text-ink-300">
            Upload actions are intentionally gated until a Supabase project is configured. The interface is fully wired for future publishing, but it will not complete an upload until the project is connected.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/explore">Explore the atlas</ButtonLink>
            <ButtonLink href="/stories" variant="outline">Read stories</ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
