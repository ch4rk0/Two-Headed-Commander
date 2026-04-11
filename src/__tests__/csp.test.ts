/**
 * CSP (Content Security Policy) tests
 *
 * Validates that index.html's CSP contains every domain required for the
 * application to function: Firebase Auth (Google Sign-In popup + OAuth
 * exchange), Firestore, Analytics, and Fonts.
 *
 * These tests would have caught the auth/internal-error incident caused by
 * missing `apis.google.com` in script-src and `accounts.google.com` in
 * connect-src.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ── Parse CSP string into a directive → values map ──────────────────────────

function parseCSP(raw: string): Record<string, string[]> {
  const directives: Record<string, string[]> = {};
  raw.split(';').forEach(part => {
    const [name, ...values] = part.trim().split(/\s+/);
    if (name) directives[name.toLowerCase()] = values;
  });
  return directives;
}

// ── Load and parse index.html once ──────────────────────────────────────────

let csp: Record<string, string[]> = {};

beforeAll(() => {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf-8');
  const match = html.match(/Content-Security-Policy[^>]+content="([^"]+)"/);
  if (!match) throw new Error('No Content-Security-Policy meta tag found in index.html');
  csp = parseCSP(match[1]);
});

// ── script-src ───────────────────────────────────────────────────────────────

describe('CSP script-src', () => {
  it('allows apis.google.com (Firebase Auth loads gapi here)', () => {
    expect(csp['script-src']).toContain('https://apis.google.com');
  });

  it('allows googletagmanager.com (Google Analytics loader)', () => {
    expect(csp['script-src']).toContain('https://www.googletagmanager.com');
  });

  it('allows google-analytics.com (GA script)', () => {
    expect(csp['script-src']).toContain('https://www.google-analytics.com');
  });
});

// ── connect-src ──────────────────────────────────────────────────────────────

describe('CSP connect-src', () => {
  it('allows accounts.google.com (OAuth token exchange)', () => {
    // This was the missing entry that caused auth/internal-error.
    expect(csp['connect-src']).toContain('https://accounts.google.com');
  });

  it('allows *.googleapis.com (Firestore, Identity Toolkit, Secure Token)', () => {
    expect(csp['connect-src']).toContain('https://*.googleapis.com');
  });

  it('allows *.firebaseio.com (Realtime Database / Firebase internals)', () => {
    expect(csp['connect-src']).toContain('https://*.firebaseio.com');
  });

  it('allows *.firebaseapp.com (Firebase hosting / auth backend)', () => {
    expect(csp['connect-src']).toContain('https://*.firebaseapp.com');
  });

  it('allows firebasestorage.googleapis.com (image uploads)', () => {
    expect(csp['connect-src']).toContain('https://firebasestorage.googleapis.com');
  });

  it('allows api.scryfall.com (card images)', () => {
    expect(csp['connect-src']).toContain('https://api.scryfall.com');
  });

  it('allows google-analytics.com (Analytics events)', () => {
    expect(csp['connect-src']).toContain('https://www.google-analytics.com');
  });
});

// ── frame-src ────────────────────────────────────────────────────────────────

describe('CSP frame-src', () => {
  it('allows accounts.google.com (Google Sign-In popup / iframe)', () => {
    expect(csp['frame-src']).toContain('https://accounts.google.com');
  });

  it('allows *.firebaseapp.com (Firebase auth iframe)', () => {
    expect(csp['frame-src']).toContain('https://*.firebaseapp.com');
  });
});

// ── lockdown directives ───────────────────────────────────────────────────────

describe('CSP lockdown directives', () => {
  it("object-src is 'none' (no Flash / plugin execution)", () => {
    expect(csp['object-src']).toContain("'none'");
  });
});
