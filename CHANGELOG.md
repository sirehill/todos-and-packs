## v0.17.0 (2025-11-06)
- Promote v0.16.1 collection updates to major release.

## v0.16.1 (2025-11-06)
- Collection list now shows card images like Pack Opener
- Uncollected items render with a '?' placeholder card

## 0.14.0
- Major version: duplicate removal now grants rarity-based energy (and updates the local energy).
- Server: `/api/remove-duplicates` returns `{ removed, awarded }` with per-rarity rates.
- Client: shows “You got X energy” and adds X to energy.

## 0.13.1
- Removing duplicates now **grants energy** based on duplicate rarity:
  - COMMON=1, UNCOMMON=2, RARE=5, EPIC=10, LEGENDARY=20 (override with NEXT_PUBLIC_DUST_RATE_* env).
- After removal, the UI shows “You got X energy” and **adds X to the current energy**.
\n## 0.13.0
- Major version: includes always-visible **Duplicates** section and blue **Remove duplicates** action.
- API: `/api/remove-duplicates` sets all stacks to qty=1 for the current user.
- Button disabled when duplicates = 0. No energy changes.

## 0.12.1
- Added **Remove duplicates** button (blue) in the Duplicates section.
- Action reduces all stacks to qty=1 for the current user. No energy changes.
- Button is visible at all times; disabled when duplicates = 0.

## 0.12.0
- Major version milestone.
- Includes new **Home Duplicates** section (always visible, even with 0 duplicates).
- Positioned below the pack opener and above collection lists.
- No dusting/energy mechanics yet — display only.

# Changelog

## [0.1.0] - 2025-11-04
### Added
- Preview → Confirm → Commit pack opening flow
- Flip animation on card reveal
- SQLite-safe Prisma schema (rarity/result/pity stored as strings)
- Auto-create user on first open (API upsert)
- NextAuth v4 with user id in session
- Real `.env` in repo for local dev
- `next.config.mjs` (no TS config issues)
- One-command bootstrap: `npm run setup` + Windows `setup.bat`

### Notes
- Dev login uses Credentials provider (email only, no password) for local use.
- Pity system uses simple thresholds; configurable via seed.
- `PackPreview` rows are cleaned on commit; no TTL job yet (future).

## [0.11.0] - 2025-11-04
### Added
- Lists page shows per-list progress bar (owned/total).
- Item tiles display quantity owned (e.g., x3).

### Changed
- Pack opener moved below list title, above items grid.
- Card preview styled to resemble playing cards (rounded corners, aspect ratio, shadow).

## [0.11.1] - 2025-11-04
### Fixed
- Flip animation and front card faces now visible after opening packs (CSS transform fix).

## [0.11.2] - 2025-11-04
### Fixed
- Card fronts still hidden on some browsers: moved to per-face transforms with vendor prefixes and added perspective wrapper.

## [0.11.3] - 2025-11-04
### Fixed
- Rewrote flip to simple, robust pattern: `.card-inner.is-flipped` rotates 180°, front is pre-rotated 180°.
- Switched gradual reveal to staggered `setTimeout` for reliability.

## [0.11.4] - 2025-11-04
### Fixed
- Cards still appeared blue on some setups. Replaced flip with prefixed classes and an opacity crossfade fallback.
- Front face now guaranteed to become visible after flip even if `backface-visibility` is ignored by the engine.

## [0.11.5] - 2025-11-04
### Fixed
- Front text appearing mirrored after flip. Replaced parent rotation with per-face ±90° tween + opacity crossfade to ensure correct orientation on all browsers.

## [0.11.6] - 2025-11-04
### Fixed
- Front text still mirrored on some GPUs. Replaced flip with **zero-rotation fade/scale** animation (no 3D transforms), making mirroring impossible.

## [0.11.7] - 2025-11-04
### Fixed
- Build error caused by malformed JSX nesting in pack-opener.tsx.
- Cards now display with correct fade/scale animation and upright front text.

## [0.11.8] - 2025-11-04
### Fixed
- Replaced `pack-opener.tsx` with a clean, validated component to eliminate JSX parse errors.
- Keeps safer fade+scale reveal (no mirrored text), staggered timing, and proper nesting.

## [0.2.0] - 2025-11-04
### Stable Release
- First stable release of Packs & Lists.
- Includes working login, list collection, pack opening, staggered reveal, and non-mirrored fade/scale animation.

## [0.21.0] - 2025-11-04
### Added
- Animated rarity borders: Common (gray), Rare (blue glow), Epic (purple shimmer), Legendary (gold pulse).
- Soft confetti effect when a pack contains EPIC or LEGENDARY cards.

## [0.21.1] - 2025-11-04
### Fixed
- Rarity glow/shimmer moved to the outer wrapper (not clipped by overflow) with stronger keyframed effects.
- Confetti increased in size and particle count; z-index raised for visibility above UI.

## [0.23.0] - 2025-11-04
### Added
- **UNCOMMON** now has its own green border + gentle glow (distinct from COMMON).

### Changed
- **Equal drop rates for testing**: COMMON/UNCOMMON/RARE/EPIC/LEGENDARY all set to 20% in `prisma/seed.ts`.
  - After updating, run `npm run prisma:migrate` (if schema changed) and `npm run db:seed` to reseed.

## [0.24.0] - 2025-11-04
### Fixed
- **UNCOMMON** now uses a distinct green border & glow; mapping is **case-insensitive**.
- **Confetti** reliably triggers for EPIC/LEGENDARY (rarity normalized to uppercase).

### Changed
- **Test drop rates**: all rarities set to 20% in `prisma/seed.ts`. Re-run `npm run db:seed` to apply.

## [0.25.0] - 2025-11-04
### Fixed
- **UNCOMMON** now uses a **green** wrapper border (wrapper-only border; inner border removed) and animates distinctly.
- **Confetti** check uses normalized rarity and fires after preview reliably.
- **Drop rates** are forced to **20% each at runtime** in `/api/preview-pack` (no reseed needed) for testing.

*Note:* Replace the runtime equal-rates with DB rates later by removing the fixed `dropTable` in preview route.

## [0.25.1] - 2025-11-04
### Fixed
- Resolved JSX/TS syntax error caused by stray braces in `pack-opener.tsx` rarity helpers.

## [0.26.0] - 2025-11-04
### Fixed
- Syntax errors in `pack-opener.tsx` resolved by fully rewriting the component header and helper functions.
- Keeps: wrapper-only border with UNCOMMON green glow, runtime 20% drop rates, and confetti on EPIC/LEGENDARY.

## [0.26.1] - 2025-11-04
### Fixed
- Resolved syntax error in `/api/preview-pack/route.ts` by removing a stray assignment and cleanly defining a single `dropTable` (20% each) in test mode.

## [0.26.2] - 2025-11-04
### Fixed
- Rewrote `/api/preview-pack` to always return valid JSON (try/catch) and to use in-memory equal test rates (20% each).
- Falls back to a temporary `previewId` if `packPreview` model is absent to avoid client JSON parsing errors.

## [0.3.0] - 2025-11-04
- Baseline release created from v0.26.2. All changes after v0.26.2 are ignored in this branch.

## [0.3.1] - 2025-11-04
### Fixed
- "invalid preview" after Confirm: server now accepts `cards` in POST body and falls back to it when no preview record exists.
- Client now sends `{ previewId, cards }` during Confirm, so it works even without a Preview table.

## [0.3.2] - 2025-11-04
### Fixed
- "user not found" on Confirm: the commit endpoint now **auto-creates a user** using the session email if the user record doesn't exist yet.

## [0.3.3] - 2025-11-04
### Fixed
- "user not found" on Confirm: endpoint now **auto-creates** a user and supports a **DEV fallback email** via `.env` (`DEV_SEED_EMAIL`, default `dev@local.test`) when no NextAuth session is present.

## [0.4.0] - 2025-11-04
### Stable milestone
- Promoted v0.3.3 (working user commit flow and local dev fallback) to stable v0.4.

## [0.4.3] - 2025-11-04
### Revert
- Reverted to **v0.4** baseline with no functional changes. This version matches v0.4 exactly.

## [0.4.4] - 2025-11-04
### Added
- **Open Pack** on the **Home page** (top of the lists), using the same PackOpener component.
- Simple selector to choose which list's pack to open (defaults to the first list's first packType).
- The existing **Open Pack** on each list page remains unchanged.

## [0.4.5] - 2025-11-04
### Fixed
- Replaced a literal "\n" string in Home JSX with an actual newline so JSX parses correctly.
- Ensured `openerOptions` exists and `packTypes` are included in the Home lists query.

## [0.4.6] - 2025-11-04
### Fixed
- Replaced Home page with a clean, valid server component.
- `<HomePackOpener>` now renders **inside** the return block at the top of Home.
- Lists are fetched with `packTypes` so the opener has a valid `packTypeId`.

## [0.4.7] - 2025-11-04
### Fixed
- Home page Prisma query now uses `packs` (which exists on your `List` model) instead of `packTypes`.
- The Open Pack selector now pulls the first pack id from each list via `l.packs?.[0]?.id`.

## [0.5.0] - 2025-11-04
### Stable Release
- Promoted from v0.4.7 as the **v0.5.0 stable milestone**.
- Home page now includes an **Open Pack** selector that lets users choose a list and open packs directly.
- Confirmed fully working with pack previews, confirmations, and user sync.

## [0.5.1] - 2025-11-04
### Added
- **Home page progress bars** showing completion for each list (owned / total and %).
- Uses NextAuth session email or `.env` DEV fallback to compute per-user progress.

## [0.6.0] - 2025-11-04
### Stable Release
- Promoted v0.5.1 (home progress bars, working home opener) to **v0.6.0**.

## [0.6.1] - 2025-11-04
### Changed
- Moved **Welcome** and instruction text to the very top of the Home page.
- Added a light gray divider line between the intro and the Open Pack section for clarity.


## 0.14.1
- Add pixel-art images for Animals & Countries (32x32) under `/public/`.
- New `PixelArtImage` component for crisp scaling.
- Typed manifests `src/data/animalImages.ts`, `src/data/countryImages.ts` + `imageLookup.ts`.
- Cards now display images in the pack opener UI.


## 0.14.2
- Fix compile error in HomePackOpener by replacing truncated code with a valid implementation.


## 0.14.3
- Removed `clsx` dependency from PixelArtImage to prevent missing module errors.


## 0.14.4
- Clear cards when changing pack selection to prevent mismatched image lookups.
- Image lookup now falls back across manifests (Animals/Countries) if primary map misses.


## 0.14.4
- Restore list refresh after opening a pack by calling `router.refresh()` when the reveal finishes.


## 0.15.0
- Major version release consolidating all pixel-art integration and bug fixes.
- Restores list refresh after pack opening.
- Stable base for next features (confirmation modal, breakdown display, toast animations, server sync, etc.).
