import { PageHeader } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Account settings"
        lede="The profile and account settings flows are scaffolded for the authenticated app, but this build remains in demo mode without a live database connection."
      />

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-xl rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-6 sm:p-8">
          <p className="text-sm leading-relaxed text-ink-300">
            Use this page as the central profile settings shell for future account editing, saved content and contributor settings.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/explore">Back to explore</ButtonLink>
            <ButtonLink href="/upload" variant="outline">Upload content</ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
