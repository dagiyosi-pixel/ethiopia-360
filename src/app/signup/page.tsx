import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/SectionHeading";

export default function SignupPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Create your account"
        lede="Join the atlas, follow contributors and start building a public record of Ethiopia."
      />

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-lg rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-6 sm:p-8">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-ink-300">
              In the current demo configuration, account creation is intentionally guided and not backed by a live Supabase project unless the environment is configured.
            </div>
            <ButtonLink href="/" className="w-full justify-center">Back to home</ButtonLink>
            <Link href="/login" className="block text-center text-sm text-gold-400 hover:text-gold-300">Already have an account? Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
