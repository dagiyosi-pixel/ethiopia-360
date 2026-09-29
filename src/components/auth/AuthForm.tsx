"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { signInAction, signUpAction, startDemoSessionAction } from "@/lib/actions/auth";

type State = { error?: string; fieldErrors?: Record<string, string>; notice?: string; demoMode?: boolean };
const inputClass = "mt-1 w-full rounded-xl border border-white/15 bg-ink-900 px-3 py-2.5 text-ink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400";

export function SignInForm({ next = "/explore", demoEnabled }: { next?: string; demoEnabled: boolean }) {
  const [state, action, pending] = useActionState<State | undefined, FormData>(signInAction, undefined);
  return <form action={action} className="space-y-4">
    <input type="hidden" name="next" value={next} />
    <label className="block text-sm">Email<input required type="email" name="email" autoComplete="email" className={inputClass} />{state?.fieldErrors?.email && <span className="text-rift-300">{state.fieldErrors.email}</span>}</label>
    <label className="block text-sm">Password<input required type="password" name="password" autoComplete="current-password" className={inputClass} />{state?.fieldErrors?.password && <span className="text-rift-300">{state.fieldErrors.password}</span>}</label>
    {state?.error && <p role="alert" className="text-sm text-rift-300">{state.error}</p>}
    <Button disabled={pending} className="w-full">{pending ? "Signing in…" : "Sign in"}</Button>
    {demoEnabled && <div className="border-t border-white/10 pt-4"><p className="mb-3 text-sm text-ink-300">Explore with a local demo account. Demo changes are not saved.</p><button formAction={startDemoSessionAction} className="w-full rounded-full border border-white/15 px-5 py-3 text-sm hover:border-gold-500/60">Continue as demo explorer</button></div>}
  </form>;
}

export function SignUpForm() {
  const [state, action, pending] = useActionState<State | undefined, FormData>(signUpAction, undefined);
  if (state?.notice) return <p role="status" className="rounded-xl border border-emerald-400/30 p-4 text-emerald-200">{state.notice}</p>;
  return <form action={action} className="space-y-4">
    <label className="block text-sm">Display name<input required name="displayName" autoComplete="name" className={inputClass} />{state?.fieldErrors?.displayName && <span className="text-rift-300">{state.fieldErrors.displayName}</span>}</label>
    <label className="block text-sm">Username<input required name="username" autoComplete="username" className={inputClass} />{state?.fieldErrors?.username && <span className="text-rift-300">{state.fieldErrors.username}</span>}</label>
    <label className="block text-sm">Email<input required type="email" name="email" autoComplete="email" className={inputClass} />{state?.fieldErrors?.email && <span className="text-rift-300">{state.fieldErrors.email}</span>}</label>
    <label className="block text-sm">Password<input required minLength={8} type="password" name="password" autoComplete="new-password" className={inputClass} />{state?.fieldErrors?.password && <span className="text-rift-300">{state.fieldErrors.password}</span>}</label>
    {state?.error && <p role="alert" className="text-sm text-rift-300">{state.error}</p>}
    <Button disabled={pending} className="w-full">{pending ? "Creating account…" : "Create account"}</Button>
  </form>;
}
