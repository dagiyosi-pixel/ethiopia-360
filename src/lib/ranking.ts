/**
 * Content ranking.
 *
 * Deliberately simple and transparent for v1: recency, engagement and a small
 * boost for editorial picks. Weights live in one place so the model can be
 * swapped for a real recommender later without touching any component.
 */

export interface Engagement {
  likes?: number;
  comments?: number;
  saves?: number;
  views?: number;
}

export const RANKING_WEIGHTS = {
  like: 3,
  comment: 5,
  save: 4,
  view: 0.15,
  /** Half-life of the recency decay, in days. */
  halfLifeDays: 45,
  featuredBoost: 1.35,
} as const;

/** Relative engagement weight, ignoring time. */
export function engagementScore(item: Engagement): number {
  const w = RANKING_WEIGHTS;
  return (
    (item.likes ?? 0) * w.like +
    (item.comments ?? 0) * w.comment +
    (item.saves ?? 0) * w.save +
    (item.views ?? 0) * w.view
  );
}

export function recencyFactor(date: string | Date, now = new Date()): number {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return 0.5;
  const days = Math.max(0, (now.getTime() - d.getTime()) / 86_400_000);
  return Math.pow(0.5, days / RANKING_WEIGHTS.halfLifeDays);
}

export function trendingScore(
  item: Engagement & { createdAt?: string; publishedAt?: string; featured?: boolean },
  now = new Date(),
): number {
  const dateStr = item.publishedAt ?? item.createdAt ?? "";
  const base = engagementScore(item) * recencyFactor(dateStr || now, now);
  return item.featured ? base * RANKING_WEIGHTS.featuredBoost : base;
}

export function rankByTrending<T extends Engagement & { createdAt?: string; publishedAt?: string; featured?: boolean }>(
  items: T[],
  now = new Date(),
): T[] {
  return [...items].sort((a, b) => trendingScore(b, now) - trendingScore(a, now));
}

export function rankByLatest<T extends { createdAt?: string; publishedAt?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const da = new Date(a.publishedAt ?? a.createdAt ?? 0).getTime();
    const db = new Date(b.publishedAt ?? b.createdAt ?? 0).getTime();
    return db - da;
  });
}
