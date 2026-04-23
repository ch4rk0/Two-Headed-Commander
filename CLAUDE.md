# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start Vite dev server (localhost:5173)
npm run build      # type-check + production build → dist/
npm run test       # run all Vitest unit tests
npm run lint       # ESLint

# Run a single test file
npx vitest run src/__tests__/blog.test.tsx
```

Deployment is automatic: every push to `main` triggers `.github/workflows/deploy.yml`, which builds and pushes `dist/` to the `gh-pages` branch, served at `twoheadedcommander.com`.

## Architecture

### Tech stack
React 18 + TypeScript + Vite. Firebase (Firestore + Storage + Auth). React Router v7. No state management library — context + custom hooks only.

### Data layer
All Firestore reads/writes go through custom hooks in `src/hooks/`. Never call Firestore directly from components.

- `useBannedCards` — live `onSnapshot` on `banned_cards/list` (single document holding `cards[]` and `watchlist[]`)
- `useBlogPosts` — blog posts collection
- `useCardDiscussion` / `useAllDiscussions` — per-card community discussion threads

**Firestore schema:**
- `banned_cards/list` — `{ cards: BannedCard[], watchlist: WatchlistCard[] }` (single doc, arrays within)
- `blog_posts/{slug}` — `{ title, excerpt, contentHtml, published, date, ... }` (all fields bilingual: `{ en, fr }`)
- `config/allowed_emails` — `{ emails: string[], superadmin: string }` — drives all admin access
- `card_discussions/{cardName}` — admin-only discussion threads per banned card

Types are defined in `src/data/banned-cards.seed.ts` (`BannedCard`, `WatchlistCard`, `BanReason`).

### Auth & admin access
`AuthContext` (`src/contexts/AuthContext.tsx`) handles Google OAuth via Firebase. On sign-in it reads `config/allowed_emails` and signs the user out immediately if their email isn't listed. `isAdmin` / `isSuperAdmin` flags flow from this context.

Admin routes live under `/admin/*` and are wrapped by `AdminLayout`, which renders a login screen if `!isAdmin`. Write access is also enforced server-side in `firestore.rules` — every write rule re-checks the allowed emails list. Client-side checks are UI convenience only.

Only the superadmin (single email in `config/allowed_emails.superadmin`) can manage the admin user list (`/admin/users`).

### Internationalisation
All UI strings are in `LangContext` (`src/contexts/LangContext.tsx`) as a flat key→string map for `en` and `fr`. Access via `useLang()` → `T('key')`. Blog post content and ban reasons are stored as `{ en: string; fr: string }` objects in Firestore and in-component constants.

### Public pages
All public pages are lazy-loaded chunks. `BannedList` is the most complex: it fetches via `useBannedCards`, renders card tiles with pill badges and optional stamps (`new-ban-stamp`, `unbanned-stamp`), and supports category filtering + search. Card images are resolved from `/public/images/cards/` with a Scryfall API fallback cached in `localStorage` (`scryfallCache.ts`).

Blog HTML content is rendered with `dangerouslySetInnerHTML` — always sanitized with `DOMPurify` before render.

### Admin pages
- `BanListEditor` — CRUD for banned cards; writes the entire `cards[]` array back on each save
- `WatchlistEditor` — same pattern for `watchlist[]`
- `BlogEditor` — TipTap rich-text editor; saves to `blog_posts/{slug}`
- `UserManager` — superadmin only; reads/writes `config/allowed_emails`

### Styling
Single CSS file: `src/styles/index.css`. CSS custom properties for the colour palette (dark theme). No CSS modules or Tailwind.

---

## Adversarial Review

Persona: skeptical senior engineer. Run after every implementation. Fix Blockers before committing.

**Design:** single responsibility per function/module? concerns separated (UI/logic/data)? hidden global state or side effects?

**Clean code:** self-explanatory names? no magic values or unexplained booleans? functions small and flat?

**Data/state:** Firestore writes update the full array atomically (`updateDoc` with the whole `cards[]`) — missing that pattern? Firestore document shapes leaking into UI instead of typed DTOs from `banned-cards.seed.ts`? state mutated directly?

**Security:** user input unvalidated in queries/URLs/HTML? `dangerouslySetInnerHTML` without DOMPurify? new Firestore collections missing rules in `firestore.rules`? auth enforced at Firestore rules level, not just UI?

**Reliability:** error paths handled silently instead of surfacing to the user? unhandled promises? `onSnapshot` unsubscribed on unmount?

**Testability:** logic testable in isolation? side effects mockable? regression test exists for this behaviour?

**Performance:** `onSnapshot` used where a one-time `getDoc` would suffice? card images fetched without checking the Scryfall cache first? recomputed per-render instead of memoized?

Output: **Pass** — or ranked list: **Blocker / Warning / Suggestion**.
