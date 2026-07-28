# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

AcidBot is a web companion for **maimai DX (international version)**, the arcade rhythm game. It scrapes a player's score data from the official `maimaidx-eng.com` mobile site, enriches it with chart constant data, and computes the player's **Best 50** rating (b35 + b15), per-level score sheets, and a skill radar. It works alongside the AcidBot Discord bot.

## Commands

Package manager is **pnpm** (`packageManager: pnpm@10.33.0`); Node v24+.

```bash
pnpm dev      # next dev --turbopack
pnpm build    # next build --turbopack
pnpm start    # production server
pnpm lint     # eslint
pnpm format   # prettier --write .
pnpm test             # vitest run (one-shot)
pnpm test:watch       # vitest (watch mode)
pnpm test:coverage    # vitest run --coverage (v8)
```

Tests use **Vitest** (`vitest.config.ts`): node environment, `@` alias mirrored from tsconfig, and a small `load` plugin that stubs static-asset imports (the rating-plate PNGs that `src/lib/util.ts` imports) so pure logic stays importable. Tests are co-located as `*.test.ts`. The suite targets the pure rating/parsing core — `getRatingByAchievement`, `parseDate`/`isNewByDate`, `getLevelConst`, `parseProfileBlock`, `extractScore`, `determineRank`, `truncateByWidth` — i.e. no DB or network. When touching the rank-factor tables in `consts.ts` or the Cheerio selectors in `extractScore`, run the tests; the assertions encode the expected maimai rating math and DOM shapes.

Required env (`.env.local`): `SITE_LINK`, `AUTH_SECRET`, `AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET`, `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET`, `MONGODB_URI`.

## Stack

Next.js 16 (canary, App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 + daisyUI · MongoDB (native driver) · Auth.js (next-auth v5 beta) · Zod · Cheerio. Path alias `@/*` → `./src/*`.

## Core data flow (the heart of the app)

A user authenticates to the Sega arcade network with a **`clal` token** — a 64-char Sega Aime cookie the user extracts themselves via a bookmarklet (see the Clal guide pages). The request pipeline:

1. **`src/lib/fetchPage.ts`** — takes the `clal` token and a URL (or list of URLs). It performs the Sega `common_auth/login` redirect handshake into a `tough-cookie` jar (via `fetch-cookie`), then fetches the target pages **sequentially** with adaptive delay + retry/backoff (don't parallelize these — the upstream rate-limits). Returns an array of raw HTML strings, or an error _message string_ on failure (note: not a throw — callers currently treat any failure as an invalid token; see the `TODO`s about distinguishing this from upstream maintenance).
2. **`src/lib/util.ts` → `extractScore($, source)`** — Cheerio-parses the maimai HTML into `MaimaiSongScore[]`. The `source` arg (`'getB50'` | `'getLevel'`) matters because DX/STD markers live in different DOM positions on the two page types. Icon → meaning mapping lives in `src/lib/consts.ts` (`SYNC_RULES`, `COMBO_RULES`, `DX_RULES`, `DIFF_RULES`).
3. **Enrichment** — scraped song titles are looked up in the `maimaiIntlSongInfo` MongoDB collection to get chart constants (`*_lev_*_i` fields) and jacket image URLs.
4. **Rating** — `src/app/api/_shared/util.ts → getRatingByAchievement()` applies the rank factor tables in `RANK_DEFINITIONS` to `achievement × levelConst`. `isNewByDate()` splits charts into **b15** ("new", added on/after the Prism Plus release `20250724`) vs **b35** ("old"); each list is sorted by rating and sliced to 15/35.

Shared rating/parsing helpers live in `src/app/api/_shared/util.ts` (`getLevelConst`, `getRatingByAchievement`, `isNewByDate`, `parseProfileBlock`, `toProxiedUrl`). Reuse these rather than reimplementing rank math.

## API surface (two versions coexist)

- **`/api/v1/*`** — original endpoints, consumed by this site's own frontend (`src/app/pages/b50`, `src/app/pages/lv-score`, etc.). `v1/b50` **streams NDJSON** via `ReadableStream`: it emits `{type: 'status'|'progress'|'error'|'data'}` packets (newline-delimited) so the UI can show a live progress bar while the ~5 score pages download. The client reads this with `res.body.getReader()`.
- **`/api/v2/users/[id]/...`** — newer RESTful + public API (b50, sheets/level, b50/profile, b50/image). Validates query params with **Zod**, returns structured errors from `src/app/api/v2/_shared/types.ts` (`ErrorCode` enum + ready-made `ErrorResponse` objects like `InvalidClalToken`, `MalformedRequest`). `src/proxy.ts` adds permissive **CORS** only for `/api/v2`. v2 b50 results are persisted to the `userB50` collection (upsert by user `_id`); passing `old=true` returns that cached copy instead of re-scraping.

OpenAPI specs: `src/app/api/v1/openapi.yaml`, `src/app/api/v2/openapi.yaml`.

## Auth & middleware

- **`src/auth.ts`** — NextAuth with the MongoDB adapter, GitHub + Google providers, **database session strategy**. `session.user.id`/`clal` are surfaced to the client via the session callback. (The adapter type is cast through `unknown` to dodge a `@auth/core` version mismatch in the lockfile — leave that cast.)
- **`src/proxy.ts`** — this is the **Next.js middleware** (Next 16 renamed `middleware.ts` → `proxy.ts`; the exported function is `proxy`). It handles v2 CORS/preflight, gates protected pages on a session (returns 403 JSON otherwise), and seeds a non-httpOnly `clal` cookie from the user's stored profile so the client can read it. The `config.matcher` excludes static asset paths.

## Song data ingestion

Chart constants and metadata come from the external **[zvuc/otoge-db](https://github.com/zvuc/otoge-db)** project, not maintained here. `.github/workflows/update-song.yml` runs **daily at 00:00 UTC**: it clones otoge-db, runs its `fetch-intl` updater, then `scripts/parseMaimaiConstants.ts` drops & re-inserts the `maimaiIntlSongInfo` and `maimaiJpSongInfo` collections in MongoDB. The script is compiled standalone via `tsconfig.scripts.json` (`tsc --project tsconfig.scripts.json`).

MongoDB collections referenced in code: `user`/`users` (auth), `userB50` (cached results), `maimaiIntlSongInfo` / `maimaiJpSongInfo` (chart data), `songTags`.

## Frontend conventions

- Routes live under `src/app/pages/*` (each as `page.tsx` + a co-located client component). Reusable UI in `src/app/components/`.
- B50/level result **images** are rendered client-side from DOM (`html-to-image`) — see `B50ImageRenderer`, `LvScoreImageRenderer`, `src/lib/captureUtils.ts`. External jacket/avatar images are routed through `/api/v1/images/proxy` (`toProxiedUrl`) to avoid CORS/hotlink issues; allowed remote hosts are also whitelisted in `next.config.ts`.

## Code style

ESLint (`eslint.config.mjs`) extends `next/core-web-vitals` + `next/typescript` + prettier, and **enforces single quotes** and `react/jsx-curly-brace-presence: always` for props. Prettier: **4-space** indent, single quotes, semicolons, `es5` trailing commas. Run `pnpm format` before committing.
