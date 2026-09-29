import Link from "next/link";
import { DEMO_MODE_ENABLED } from "@/lib/env";
import { PageHeader } from "@/components/ui/SectionHeading";
import { SignInForm } from "@/components/auth/AuthForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <div><PageHeader eyebrow="Account" title="Sign in to Ethiopia//360" lede="Access your saved routes, uploads and community profile." />
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-8"><div className="mx-auto max-w-lg rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-6 sm:p-8">
      <SignInForm next={next} demoEnabled={DEMO_MODE_ENABLED} />
      <Link href="/signup" className="mt-6 block text-center text-sm text-gold-400 hover:text-gold-300">Need an account? Create one</Link>
    </div></div>
  </div>;
}
