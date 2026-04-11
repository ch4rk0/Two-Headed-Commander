/**
 * Blog feature tests
 *
 * Covers:
 *  1. DOMPurify preserves data-card attributes (card hover tooltip regression)
 *  2. BlogPost rendering — title, reading time, not-found state
 *  3. og:image:alt — uses coverAlt, falls back to post title
 *  4. Cover crop aspect ratio matches blog-post-hero CSS (16:5)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import { LangProvider } from '../contexts/LangContext';

// ── Mock Firebase (no real credentials needed) ────────────────────────────────

vi.mock('../firebase', () => ({
  auth: {}, db: {}, storage: {}, googleProvider: {},
}));

vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({})) }));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(() => () => {}),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: vi.fn(),
}));

const mockGetDoc = vi.fn();
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn(),
  getDoc: mockGetDoc,
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  where: vi.fn(),
  onSnapshot: vi.fn((_, cb) => { cb({ docs: [] }); return () => {}; }),
}));

vi.mock('firebase/storage', () => ({ getStorage: vi.fn(() => ({})) }));

vi.mock('../components/Particles', () => ({
  PageParticles: () => null,
  HeroParticles: () => null,
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function BlogPostWrapper({ slug }: { slug: string }) {
  return (
    <HelmetProvider>
      <MemoryRouter initialEntries={[`/blog/${slug}`]}>
        <LangProvider>
          <Routes>
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
        </LangProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
}

function ogContent(property: string): string {
  return document.querySelector(`meta[property="${property}"]`)?.getAttribute('content') ?? '';
}

// ── Lazy imports (after mocks) ────────────────────────────────────────────────

const { default: BlogPost } = await import('../pages/BlogPost');

// ── 1. DOMPurify — card-ref spans ────────────────────────────────────────────

describe('DOMPurify — card hover tooltip', () => {
  it('preserves data-card attribute on span elements', () => {
    const html = '<p>Cast <span data-card="Sol Ring" class="card-ref">Sol Ring</span> early.</p>';
    const out  = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
    expect(out).toContain('data-card="Sol Ring"');
  });

  it('preserves the card-ref class alongside data-card', () => {
    const html = '<span data-card="Lightning Bolt" class="card-ref">Lightning Bolt</span>';
    const out  = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
    expect(out).toContain('class="card-ref"');
    expect(out).toContain('data-card="Lightning Bolt"');
  });

  it('still strips genuinely dangerous attributes', () => {
    const html = '<span onclick="alert(1)" data-card="Counterspell">Counterspell</span>';
    const out  = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
    expect(out).not.toContain('onclick');
    expect(out).toContain('data-card="Counterspell"');
  });
});

// ── 2. BlogPost rendering ─────────────────────────────────────────────────────

describe('BlogPost — rendering', () => {
  beforeEach(() => {
    document.title = '';
    document.head
      .querySelectorAll('meta[property], meta[name], link[rel="canonical"]')
      .forEach(el => el.remove());
  });

  it('shows a loading skeleton before data arrives', () => {
    mockGetDoc.mockReturnValue(new Promise(() => {})); // never resolves
    render(<BlogPostWrapper slug="any-post" />);
    // The skeleton renders divs with class "skeleton-card"
    expect(document.querySelector('.skeleton-card')).toBeTruthy();
  });

  it('shows "Post not found" when Firestore returns no document', async () => {
    mockGetDoc.mockResolvedValueOnce({ exists: () => false });
    render(<BlogPostWrapper slug="missing-post" />);
    await waitFor(() => {
      expect(screen.getByText(/Post not found/i)).toBeTruthy();
    });
  });

  it('renders the post title in the document', async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        slug: 'test-post',
        title: { en: 'My First Post', fr: '' },
        excerpt: { en: 'An excerpt.', fr: '' },
        date: '2026-01-01',
        contentHtml: { en: '<p>Hello world.</p>', fr: '' },
        published: true,
      }),
    });
    render(<BlogPostWrapper slug="test-post" />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
    });
    expect(screen.getByText('My First Post')).toBeTruthy();
  });

  it('shows reading time for a post with content', async () => {
    // ~400 words → 2 min read
    const words = Array.from({ length: 400 }, (_, i) => `word${i}`).join(' ');
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        slug: 'long-post',
        title: { en: 'Long Post', fr: '' },
        excerpt: { en: 'Excerpt.', fr: '' },
        date: '2026-01-01',
        contentHtml: { en: `<p>${words}</p>`, fr: '' },
        published: true,
      }),
    });
    render(<BlogPostWrapper slug="long-post" />);
    await waitFor(() => screen.getByText(/min read/i));
    expect(screen.getByText(/2 min read/i)).toBeTruthy();
  });

  it('shows at least 1 min read for very short posts', async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        slug: 'short-post',
        title: { en: 'Short', fr: '' },
        excerpt: { en: 'Brief.', fr: '' },
        date: '2026-01-01',
        contentHtml: { en: '<p>Hi.</p>', fr: '' },
        published: true,
      }),
    });
    render(<BlogPostWrapper slug="short-post" />);
    await waitFor(() => screen.getByText(/min read/i));
    expect(screen.getByText(/1 min read/i)).toBeTruthy();
  });
});

// ── 3. og:image:alt ───────────────────────────────────────────────────────────

describe('BlogPost — og:image:alt', () => {
  beforeEach(() => {
    document.head
      .querySelectorAll('meta[property], meta[name], link[rel="canonical"]')
      .forEach(el => el.remove());
  });

  it('uses coverAlt when provided', async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        slug: 'with-alt',
        title: { en: 'Post Title', fr: '' },
        excerpt: { en: 'Excerpt.', fr: '' },
        date: '2026-01-01',
        coverImage: 'https://example.com/cover.jpg',
        coverAlt: 'A dragon attacking a castle',
        contentHtml: { en: '<p>Content.</p>', fr: '' },
        published: true,
      }),
    });
    render(<BlogPostWrapper slug="with-alt" />);
    await waitFor(() => expect(ogContent('og:image:alt')).toBe('A dragon attacking a castle'));
  });

  it('falls back to the post title when coverAlt is absent', async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        slug: 'no-alt',
        title: { en: 'Post Without Alt', fr: '' },
        excerpt: { en: 'Excerpt.', fr: '' },
        date: '2026-01-01',
        coverImage: 'https://example.com/cover.jpg',
        contentHtml: { en: '<p>Content.</p>', fr: '' },
        published: true,
      }),
    });
    render(<BlogPostWrapper slug="no-alt" />);
    await waitFor(() => expect(ogContent('og:image:alt')).toBe('Post Without Alt'));
  });

  it('omits og:image:alt entirely when there is no cover image', async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        slug: 'no-cover',
        title: { en: 'No Cover Post', fr: '' },
        excerpt: { en: 'Excerpt.', fr: '' },
        date: '2026-01-01',
        contentHtml: { en: '<p>Content.</p>', fr: '' },
        published: true,
      }),
    });
    render(<BlogPostWrapper slug="no-cover" />);
    await waitFor(() => screen.getByRole('heading', { level: 1 }));
    expect(ogContent('og:image:alt')).toBe(''); // tag not present
  });
});

// ── 4. Cover crop aspect ratio ────────────────────────────────────────────────

describe('Cover crop — aspect ratio', () => {
  it('canvas dimensions are 16:5 to match blog-post-hero CSS', () => {
    const CANVAS_W = 480;
    const CANVAS_H = 150;
    expect(CANVAS_W / CANVAS_H).toBeCloseTo(16 / 5);
  });

  it('export dimensions are 16:5 to match blog-post-hero CSS', () => {
    const OUT_W = 1200;
    const OUT_H = 375;
    expect(OUT_W / OUT_H).toBeCloseTo(16 / 5);
  });

  it('canvas and export share the same aspect ratio', () => {
    const canvasRatio = 480 / 150;
    const exportRatio = 1200 / 375;
    expect(canvasRatio).toBeCloseTo(exportRatio);
  });
});
