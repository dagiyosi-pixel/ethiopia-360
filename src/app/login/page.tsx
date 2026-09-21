import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/SectionHeading";

export default function LoginPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Sign in to Ethiopia//360"
        lede="Access your saved routes, uploads and community profile. In demo mode, you can continue as a local account without a Supabase project."
      />

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-lg rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-6 sm:p-8">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-ink-300">
              This build is configured for demo use by default, so sign-in and sign-up are presented as guided flows rather than a fully connected auth system.
            </div>
            <ButtonLink href="/" className="w-full justify-center">Return home</ButtonLink>
            <Link href="/signup" className="block text-center text-sm text-gold-400 hover:text-gold-300">Need an account? Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
