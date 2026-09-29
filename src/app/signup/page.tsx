import Link from "next/link";
import { PageHeader } from "@/components/ui/SectionHeading";
import { SignUpForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return <div><PageHeader eyebrow="Account" title="Create your account" lede="Join the atlas, follow contributors and start building a public record of Ethiopia." />
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-8"><div className="mx-auto max-w-lg rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-6 sm:p-8">
      <SignUpForm />
      <Link href="/login" className="mt-6 block text-center text-sm text-gold-400 hover:text-gold-300">Already have an account? Sign in</Link>
    </div></div>
  </div>;
}
