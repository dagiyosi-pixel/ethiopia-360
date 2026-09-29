"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { submitUploadAction, type UploadOutcome } from "@/lib/actions/upload";

const inputClass = "mt-1 w-full rounded-xl border border-white/15 bg-ink-900 px-3 py-2.5 text-ink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400";
const TYPES = ["photo", "video", "story", "place", "history", "culture", "architecture", "event"] as const;

export function UploadForm({ regions, cities }: { regions: { slug: string; name: string }[]; cities: { slug: string; name: string; regionSlug: string }[] }) {
  const [state, action, pending] = useActionState<UploadOutcome | undefined, FormData>(async (_previous, form) => submitUploadAction(form), undefined);
  return <form action={action} className="space-y-5">
    <label className="block text-sm">What are you contributing?
      <select name="type" defaultValue="photo" className={inputClass}>{TYPES.map((type) => <option key={type} value={type}>{type[0].toUpperCase() + type.slice(1)}</option>)}</select>
    </label>
    <label className="block text-sm">Title<input name="title" required minLength={3} maxLength={140} className={inputClass} /></label>
    <label className="block text-sm">Description<textarea name="description" rows={4} maxLength={4000} className={inputClass} /></label>
    <label className="block text-sm">Story text (required for stories)<textarea name="storyBody" rows={7} maxLength={20000} className={inputClass} /></label>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm">Region<select name="regionSlug" required className={inputClass}><option value="">Choose a region</option>{regions.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}</select></label>
      <label className="block text-sm">City (optional)<select name="citySlug" defaultValue="" className={inputClass}><option value="">Choose a city</option>{cities.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
    </div>
    <label className="block text-sm">Exact coordinates (optional, latitude, longitude)<input name="coords" placeholder="9.03, 38.74" inputMode="decimal" className={inputClass} /></label>
    <label className="block text-sm">Category<select name="category" defaultValue="photos" className={inputClass}>{["places", "stories", "photos", "videos", "history", "culture", "architecture", "food", "events"].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
    <label className="block text-sm">Tags (comma separated)<input name="tags" className={inputClass} placeholder="heritage, travel" /></label>
    <label className="block text-sm">Image or video (photos/videos require a file)<input name="file" type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif,image/heic,video/mp4,video/webm,video/quicktime" className={`${inputClass} file:mr-3 file:rounded-full file:border-0 file:bg-gold-500 file:px-4 file:py-2 file:text-ink-950`} /></label>
    <label className="block text-sm">Image/source credit (optional)<input name="attribution" maxLength={240} className={inputClass} /></label>
    {state?.fieldErrors && <ul className="list-inside list-disc text-sm text-rift-300">{Object.entries(state.fieldErrors).map(([field, message]) => <li key={field}>{field}: {message}</li>)}</ul>}
    {state && <p role={state.ok ? "status" : "alert"} className={`text-sm ${state.ok ? "text-emerald-200" : "text-rift-300"}`}>{state.message}</p>}
    <p className="text-xs leading-relaxed text-ink-400">Contributions are submitted for review. They appear publicly after approval. A location is optional; items without exact coordinates are never plotted at an invented point.</p>
    <Button disabled={pending} className="w-full">{pending ? "Submitting…" : "Submit contribution"}</Button>
  </form>;
}
