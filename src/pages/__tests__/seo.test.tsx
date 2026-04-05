/**
 * SEO tests — verifies that each public page sets the correct
 * <title>, meta description, and canonical URL via react-helmet-async.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LangProvider } from '../../contexts/LangContext';
import type { ReactNode } from 'react';

// ── Mock Firebase so pages don't need real credentials ─────────────────────
vi.mock('../../firebase', () => ({
  auth: {},
  db: {},
  storage: {},
  googleProvider: {},
}));

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(() => () => {}),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn(),
  getDoc: vi.fn().mockResolvedValue({
    exists: () => true,
    data: () => ({
      title: { en: 'Test Post', fr: 'Article Test' },
      excerpt: { en: 'A test excerpt.', fr: 'Un extrait de test.' },
      date: '2026-01-01',
      contentHtml: { en: '<p>Content</p>', fr: '<p>Contenu</p>' },
      published: true,
      slug: 'test-post',
    }),
  }),
  // onSnapshot must pass a snapshot with a docs array
  onSnapshot: vi.fn((_, cb) => {
    cb({ docs: [], exists: () => false });
    return () => {};
  }),
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  where: vi.fn(),
}));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({})),
}));

// ── Mock heavy/canvas components ───────────────────────────────────────────
vi.mock('../../components/Particles', () => ({
  PageParticles: () => null,
  HeroParticles: () => null,
}));

// ── Helpers ────────────────────────────────────────────────────────────────
function Wrapper({ children, path = '/' }: { children: ReactNode; path?: string }) {
  return (
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <LangProvider>
          {children}
        </LangProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
}

function metaContent(name: string): string {
  return document.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ?? '';
}

function canonicalHref(): string {
  return document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
}

// ── Page imports (after mocks are declared) ────────────────────────────────
const { default: Home }       = await import('../Home');
const { default: HowToPlay }  = await import('../HowToPlay');
const { default: BannedList } = await import('../BannedList');
const { default: RunAnEvent } = await import('../RunAnEvent');
const { default: Blog }       = await import('../Blog');
const { default: BlogPost }   = await import('../BlogPost');
const { default: Privacy }    = await import('../Privacy');

// ── Tests ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  document.title = '';
  document.head.querySelectorAll('meta[name], meta[property], link[rel="canonical"]')
    .forEach(el => el.remove());
});

describe('Home page SEO', () => {
  it('sets the correct title', async () => {
    render(<Home />, { wrapper: ({ children }) => <Wrapper>{children}</Wrapper> });
    await waitFor(() => expect(document.title).toBe('Two-Headed Commander — 2v2 MTG Format'));
  });

  it('sets the correct meta description', async () => {
    render(<Home />, { wrapper: ({ children }) => <Wrapper>{children}</Wrapper> });
    await waitFor(() => expect(metaContent('description')).toContain('2 players, 4 commanders, 60 shared life'));
  });

  it('sets the canonical URL', async () => {
    render(<Home />, { wrapper: ({ children }) => <Wrapper>{children}</Wrapper> });
    await waitFor(() => expect(canonicalHref()).toBe('https://twoheadedcommander.com/'));
  });
});

describe('How to Play page SEO', () => {
  it('sets the correct title', async () => {
    render(<HowToPlay />, { wrapper: ({ children }) => <Wrapper path="/how-to-play">{children}</Wrapper> });
    await waitFor(() => expect(document.title).toBe('How to Play — Two-Headed Commander'));
  });

  it('sets the correct meta description', async () => {
    render(<HowToPlay />, { wrapper: ({ children }) => <Wrapper path="/how-to-play">{children}</Wrapper> });
    await waitFor(() => expect(metaContent('description')).toContain('shared life totals'));
  });

  it('sets the canonical URL', async () => {
    render(<HowToPlay />, { wrapper: ({ children }) => <Wrapper path="/how-to-play">{children}</Wrapper> });
    await waitFor(() => expect(canonicalHref()).toBe('https://twoheadedcommander.com/how-to-play'));
  });
});

describe('Banned List page SEO', () => {
  it('sets the correct title', async () => {
    render(<BannedList />, { wrapper: ({ children }) => <Wrapper path="/banned-list">{children}</Wrapper> });
    await waitFor(() => expect(document.title).toBe('Banned List — Two-Headed Commander'));
  });

  it('sets the correct meta description', async () => {
    render(<BannedList />, { wrapper: ({ children }) => <Wrapper path="/banned-list">{children}</Wrapper> });
    await waitFor(() => expect(metaContent('description')).toContain('banned list'));
  });

  it('sets the canonical URL', async () => {
    render(<BannedList />, { wrapper: ({ children }) => <Wrapper path="/banned-list">{children}</Wrapper> });
    await waitFor(() => expect(canonicalHref()).toBe('https://twoheadedcommander.com/banned-list'));
  });
});

describe('Run an Event page SEO', () => {
  it('sets the correct title', async () => {
    render(<RunAnEvent />, { wrapper: ({ children }) => <Wrapper path="/run-an-event">{children}</Wrapper> });
    await waitFor(() => expect(document.title).toBe('Run an Event — Two-Headed Commander'));
  });

  it('sets the correct meta description', async () => {
    render(<RunAnEvent />, { wrapper: ({ children }) => <Wrapper path="/run-an-event">{children}</Wrapper> });
    await waitFor(() => expect(metaContent('description')).toContain('local game store'));
  });

  it('sets the canonical URL', async () => {
    render(<RunAnEvent />, { wrapper: ({ children }) => <Wrapper path="/run-an-event">{children}</Wrapper> });
    await waitFor(() => expect(canonicalHref()).toBe('https://twoheadedcommander.com/run-an-event'));
  });
});

describe('Blog page SEO', () => {
  it('sets the correct title', async () => {
    render(<Blog />, { wrapper: ({ children }) => <Wrapper path="/blog">{children}</Wrapper> });
    await waitFor(() => expect(document.title).toBe('Blog — Two-Headed Commander'));
  });

  it('sets the correct meta description', async () => {
    render(<Blog />, { wrapper: ({ children }) => <Wrapper path="/blog">{children}</Wrapper> });
    await waitFor(() => expect(metaContent('description')).toContain('format thinking'));
  });

  it('sets the canonical URL', async () => {
    render(<Blog />, { wrapper: ({ children }) => <Wrapper path="/blog">{children}</Wrapper> });
    await waitFor(() => expect(canonicalHref()).toBe('https://twoheadedcommander.com/blog'));
  });
});

describe('Blog post page SEO', () => {
  it('sets a dynamic title from post data', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/blog/test-post']}>
          <LangProvider>
            <Routes>
              <Route path="/blog/:slug" element={<BlogPost />} />
            </Routes>
          </LangProvider>
        </MemoryRouter>
      </HelmetProvider>
    );
    await waitFor(() => {
      expect(document.title).toContain('Two-Headed Commander');
    });
  });
});

describe('Privacy page SEO', () => {
  it('sets the correct title', async () => {
    render(<Privacy />, { wrapper: ({ children }) => <Wrapper path="/privacy">{children}</Wrapper> });
    await waitFor(() => expect(document.title).toBe('Privacy Policy — Two-Headed Commander'));
  });

  it('sets the correct meta description', async () => {
    render(<Privacy />, { wrapper: ({ children }) => <Wrapper path="/privacy">{children}</Wrapper> });
    await waitFor(() => expect(metaContent('description')).toContain('Google Analytics'));
  });

  it('sets the canonical URL', async () => {
    render(<Privacy />, { wrapper: ({ children }) => <Wrapper path="/privacy">{children}</Wrapper> });
    await waitFor(() => expect(canonicalHref()).toBe('https://twoheadedcommander.com/privacy'));
  });
});
