type Bucket = number[];

const buckets = new Map<string, Bucket>();

export type RateLimitOptions = {
  windowMs: number;
  max: number;
};

export function tryConsume(key: string, opts: RateLimitOptions): boolean {
  const now = Date.now();
  const cutoff = now - opts.windowMs;
  const existing = buckets.get(key) ?? [];
  const pruned = existing.filter((t) => t > cutoff);
  if (pruned.length >= opts.max) {
    buckets.set(key, pruned);
    return false;
  }
  pruned.push(now);
  buckets.set(key, pruned);
  return true;
}

export const ADD_SONG_LIMIT: RateLimitOptions = {
  windowMs: 60_000,
  max: 5,
};
