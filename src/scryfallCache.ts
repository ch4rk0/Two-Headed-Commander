/**
 * Scryfall image cache
 *
 * - Persists card name → CDN image URL in localStorage (7-day TTL)
 * - Deduplicates in-flight requests for the same card
 * - Throttles API calls to ≤ 1 per 80 ms to respect Scryfall's rate limit
 */

const CACHE_KEY = 'scryfall_img_v1';
const TTL_MS    = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CacheEntry { url: string; ts: number }
type CacheStore = Record<string, CacheEntry>;

function readStore(): CacheStore {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}'); } catch { return {}; }
}

function writeStore(store: CacheStore) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(store)); } catch {}
}

// In-flight deduplication
const inFlight = new Map<string, Promise<string>>();

// Serial queue: each request waits for the previous one + 80 ms gap
let tail: Promise<unknown> = Promise.resolve();

export async function getCardImageUrl(name: string): Promise<string> {
  const store = readStore();
  const entry = store[name];
  if (entry && Date.now() - entry.ts < TTL_MS) return entry.url;

  // Re-use an already-running request for the same card
  const running = inFlight.get(name);
  if (running) return running;

  const promise = tail
    .then(() => new Promise<void>(r => setTimeout(r, 80)))
    .then(async (): Promise<string> => {
      try {
        const res = await fetch(
          `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(name)}`
        );
        if (!res.ok) return '';
        const data = await res.json();
        const url: string =
          data.image_uris?.normal ??
          data.card_faces?.[0]?.image_uris?.normal ??
          '';
        if (url) {
          const fresh = readStore();
          fresh[name] = { url, ts: Date.now() };
          writeStore(fresh);
        }
        return url;
      } catch {
        return '';
      }
    })
    .finally(() => inFlight.delete(name));

  // Advance the tail (don't let a rejection break the queue)
  tail = promise.catch(() => {});
  inFlight.set(name, promise);
  return promise;
}
