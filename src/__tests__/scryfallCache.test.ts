/**
 * scryfallCache tests
 *
 * Covers:
 *  1. Cache hit  — returns stored URL, never calls fetch
 *  2. Cache miss — fetches from Scryfall, stores result in localStorage
 *  3. Expired entry — re-fetches after TTL
 *  4. In-flight deduplication — two concurrent calls for the same card → one fetch
 *  5. Network error — returns '' without throwing
 *  6. Non-OK response — returns '' without throwing
 *  7. Double-faced card — falls back to card_faces[0] image URI
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Helpers ───────────────────────────────────────────────────────────────────

const CACHE_KEY = 'scryfall_img_v1';
const TTL_MS    = 7 * 24 * 60 * 60 * 1000;

function mockScryfallOk(imageUrl: string) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ image_uris: { normal: imageUrl } }),
  }));
}

function mockScryfallDfc(imageUrl: string) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ card_faces: [{ image_uris: { normal: imageUrl } }] }),
  }));
}

function mockScryfallFail(status = 404) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status }));
}

function mockScryfallNetworkError() {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
}

function seedCache(name: string, url: string, tsOffset = 0) {
  const store = { [name]: { url, ts: Date.now() + tsOffset } };
  localStorage.setItem(CACHE_KEY, JSON.stringify(store));
}

// ── Module isolation ──────────────────────────────────────────────────────────
// The cache module has top-level mutable state (inFlight map, tail promise).
// Re-importing via resetModules gives a clean slate for each test.

let getCardImageUrl: (name: string) => Promise<string>;

beforeEach(async () => {
  vi.useFakeTimers();
  localStorage.clear();
  vi.resetModules();
  ({ getCardImageUrl } = await import('../scryfallCache'));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

// ── 1. Cache hit ──────────────────────────────────────────────────────────────

describe('cache hit', () => {
  it('returns the cached URL without calling fetch', async () => {
    seedCache('Sol Ring', 'https://cdn.example.com/sol-ring.jpg');
    mockScryfallOk('https://cdn.example.com/other.jpg');

    const promise = getCardImageUrl('Sol Ring');
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe('https://cdn.example.com/sol-ring.jpg');
    expect(fetch).not.toHaveBeenCalled();
  });
});

// ── 2. Cache miss ─────────────────────────────────────────────────────────────

describe('cache miss', () => {
  it('fetches from Scryfall and returns the image URL', async () => {
    mockScryfallOk('https://cdn.example.com/counterspell.jpg');

    const promise = getCardImageUrl('Counterspell');
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe('https://cdn.example.com/counterspell.jpg');
    expect(fetch).toHaveBeenCalledOnce();
  });

  it('stores the result in localStorage for future calls', async () => {
    mockScryfallOk('https://cdn.example.com/mox-pearl.jpg');

    const promise = getCardImageUrl('Mox Pearl');
    await vi.runAllTimersAsync();
    await promise;

    const stored = JSON.parse(localStorage.getItem(CACHE_KEY)!);
    expect(stored['Mox Pearl']?.url).toBe('https://cdn.example.com/mox-pearl.jpg');
  });
});

// ── 3. Expired entry ──────────────────────────────────────────────────────────

describe('expired cache entry', () => {
  it('re-fetches when the TTL has elapsed', async () => {
    seedCache('Black Lotus', 'https://cdn.example.com/old.jpg', -(TTL_MS + 1000));
    mockScryfallOk('https://cdn.example.com/fresh.jpg');

    const promise = getCardImageUrl('Black Lotus');
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe('https://cdn.example.com/fresh.jpg');
    expect(fetch).toHaveBeenCalledOnce();
  });
});

// ── 4. In-flight deduplication ────────────────────────────────────────────────

describe('in-flight deduplication', () => {
  it('issues only one fetch when the same card is requested concurrently', async () => {
    mockScryfallOk('https://cdn.example.com/lightning-bolt.jpg');

    const p1 = getCardImageUrl('Lightning Bolt');
    const p2 = getCardImageUrl('Lightning Bolt');
    await vi.runAllTimersAsync();
    const [r1, r2] = await Promise.all([p1, p2]);

    expect(fetch).toHaveBeenCalledOnce();
    expect(r1).toBe('https://cdn.example.com/lightning-bolt.jpg');
    expect(r2).toBe('https://cdn.example.com/lightning-bolt.jpg');
  });
});

// ── 5. Network error ──────────────────────────────────────────────────────────

describe('network error', () => {
  it('returns an empty string without throwing', async () => {
    mockScryfallNetworkError();

    const promise = getCardImageUrl('Dark Ritual');
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe('');
  });
});

// ── 6. Non-OK response ────────────────────────────────────────────────────────

describe('non-OK response', () => {
  it('returns an empty string for a 404', async () => {
    mockScryfallFail(404);

    const promise = getCardImageUrl('Fake Card Name');
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe('');
  });

  it('does not write a failed lookup to localStorage', async () => {
    mockScryfallFail(404);

    const promise = getCardImageUrl('Another Fake Card');
    await vi.runAllTimersAsync();
    await promise;

    const stored = JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}');
    expect(stored['Another Fake Card']).toBeUndefined();
  });
});

// ── 7. Double-faced card ──────────────────────────────────────────────────────

describe('double-faced card', () => {
  it('uses the front face image when image_uris is absent', async () => {
    mockScryfallDfc('https://cdn.example.com/delver-front.jpg');

    const promise = getCardImageUrl('Delver of Secrets');
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe('https://cdn.example.com/delver-front.jpg');
  });
});
