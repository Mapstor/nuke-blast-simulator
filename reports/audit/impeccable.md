# Impeccable Audit — NBS-002 (READ-ONLY, findings only)

**Scope:** 4 URLs — `/`, `/weapons/tsar-bomba`, `/examples/houston`, `/blog/modern-nuclear-arsenals-2026`
**Date:** 2026-10-15 · **Mode per surface:** `/` = Persuade/Operate hybrid · weapon/example/blog pages = Read.
**Nothing was modified.** No fixes applied; this is an audit.

---

## Launcher status — ran partially; LIVE BROWSER UNAVAILABLE

- `bash /workspace/.claude/skills/impeccable/scripts/impeccable context` **DID run** (exit 0) and returned project context (incumbent visual system, no PRODUCT.md/DESIGN.md, manual-detector mode, no image converters).
- The launcher binary itself works (`node` present, `impeccable --help` lists `detect`/`ignores`/etc.). **But the `audit` verb is a skill flow, not a launcher subcommand** (`impeccable audit` → "Unknown command"), so the audit is performed by reading source + rendered HTML as the skill directs.
- **The live-browser scan is UNAVAILABLE in this sandbox.** `impeccable detect --json http://localhost:4317/` errors: *"No Chrome, Chromium, Edge, or Brave installation found for URL scanning."* `which chromium/google-chrome` → none; `DISPLAY` empty; no image converter (cwebp/sips/magick/ffmpeg). No `prefers-reduced-motion`, DOM-contrast, rendered-overflow, or screenshot evidence could be captured.

**Consequence:** Every finding below is derived from (a) the production-rendered HTML via `curl http://localhost:4317<path>`, (b) component/page source under `src/`, (c) the CSS (`globals.css`, `military-theme.css`, `explosion.css`, `bomb-cursor.css`, `blast-animation.css`) and `tailwind.config.ts`, and (d) arithmetic WCAG contrast computation. Contrast ratios are **computed** (reliable). Anything depending on actual rendered geometry at 390px, real touch behavior, focus-ring rendering, or CLS measurement is tagged **UNVERIFIED (no live browser)**.

---

## Site-wide findings (apply to all 4 URLs)

These come from `layout.tsx`, `MilitaryHeader.tsx`, `Footer.tsx`, and the shared CSS — every page inherits them.

- **[P1] Duplicate `<meta name="viewport">` on every page.** `layout.tsx:73` hand-writes `width=device-width, initial-scale=1, viewport-fit=cover`, and Next.js also auto-injects its default `width=device-width, initial-scale=1`. Rendered HTML confirms **two** viewport metas on all 4 URLs. Browsers honor the *last* one, which is Next's default **without** `viewport-fit=cover` → the intended safe-area (notch/home-indicator) opt-in is silently dropped. Should be set via Next's `viewport` export, not a manual `<meta>`.
- **[P2] No `prefers-reduced-motion` anywhere** (`grep` → 0 hits). There are **8 infinite CSS animations** (`bombFloat`, `bombPulse`, `reticleSpin`, `reticlePulse`, `shimmer`, `.detonation-marker` pulse) plus one-shot but heavy explosion keyframes (`explosion.css`: multi-layer fireball with `filter: blur()+brightness()`, shockwave, mushroom cloud). WCAG 2.3.3 / users with vestibular sensitivity get no reduced alternative. The looping bomb-cursor + reticle run continuously whenever a weapon is selected.
- **[P2] No custom focus-visible styling in CSS** (`grep focus-visible|outline` in `*.css` → none). Interactive controls rely on the browser default outline; several buttons use `focus:outline-none` siblings elsewhere. Only `BombSelector` and `sources` use a Tailwind `focus:` ring. Keyboard focus visibility across the mega-menu buttons, footer links, and card links is **UNVERIFIED (no live browser)** but at risk given the dark theme + default thin outline.
- **[P3] Dead/undefined utility class `terminal-font`.** Applied to the logo wordmark (`MilitaryHeader.tsx:123,222`) but **defined nowhere** in any CSS or Tailwind config. The logo silently falls back to the default sans stack; the intended "terminal" typeface for the brand never loads. No functional break, but the brand type treatment is a no-op.
- **[P3] Footer copyright uses `text-gray-500` (3.67:1 on `gray-900`)** — **fails WCAG AA (4.5:1) for normal-size text**, passes only the 3:1 large-text bar. `Footer.tsx:77`. All other theme text passes comfortably (green-400 10.2:1, green-300 12.6:1, yellow-400 11.6:1, green-300/70 6.7:1).
- **[P2] Mobile drawer uses hard-coded `top-[57px]`** (`MilitaryHeader.tsx:263`) to clear the mobile bar. The bar height is `py-3` + a `text-base` wordmark (~48–57px), so this is a magic number that will mis-align if the logo line-height or padding changes, and it is **not** derived from the actual header. Low risk today, brittle. **UNVERIFIED at 390px (no live browser).**
- **[P1] Mobile header hides on scroll-down via `-translate-y-full`** (`MilitaryHeader.tsx:111-113`) but the header is `sticky top-0`, not fixed — the hide animation is purely visual. Combined with the body-scroll-lock toggling `document.body.style.overflow` (header + SearchPalette both write it), there is a **shared-global-style hazard**: closing the search palette sets `overflow:'unset'` which can stomp the drawer's lock if both are open. Interaction is **UNVERIFIED (no live browser)** but the code path is a real conflict.

**Positives (site-wide):** `<html lang="en">` present; single `<h1>` per page; breadcrumb `<nav aria-label>` on all article templates; tables wrapped in `overflow-x-auto`; mega-menu buttons carry `aria-expanded`/`aria-haspopup`/`aria-controls`; mobile menu button has dynamic `aria-label`; ESC + ⌘K handlers; CTA contrast (black on green-500) 9.2:1.

---

## 1. `/` (Homepage — simulator + SEO content)

**Template:** `app/page.tsx` + `HomeClient.tsx` (client simulator) + server `<article>` SEO block.

### Findings
- **[P1] Primary `<h1>` is `sr-only`** (`page.tsx:113`). Visually the page opens straight into the simulator with **no visible page title**; the only on-screen large heading is the `<h2>` "What is the Nuclear Blast Simulator?" far below the fold. Acceptable for SEO, but visually the hero/tool has no titled anchor and the heading hierarchy starts (visually) at H2.
- **[P1] "Back to the Simulator" CTA is `<a href="#">`** (`page.tsx:391-396`). `#` scrolls to the top of the *document*, not to the map/simulator, and appends `#` to the URL. On a long page this lands the user on the `sr-only` h1 region, not the interactive tool. Dead-ish anchor; should target the simulator section id.
- **[P1] `MapWrapper` treats ANY window `error` event as a map failure** (`MapWrapper.tsx:31-36`): `window.addEventListener('error', () => setMapError(true))`. A single unrelated client error (an extension, an image 404, a third-party script) swaps the entire map for the red "Map failed to load" + full `window.location.reload()` button. Over-broad error capture degrades the core tool.
- **[P2] `console.log` on every `MapWrapper` render** (`MapWrapper.tsx:80-81`, 2 statements) logging window dimensions + the container ref each render — dev noise shipped to production, runs on every re-render.
- **[P2] Layout-shift / LCP risk from the lazy map.** The map is `next/dynamic({ ssr:false })` with a pulse-placeholder. The container gets `minHeight: 300px` (`MapWrapper.tsx:88`) but the mobile/desktop wrappers rely on `absolute inset-0` inside `flex-1`/`min-h-screen` parents. Because the server HTML renders **no map and no reserved map box** (SSR disabled), the first paint is the pulse placeholder and the real map/tiles paint later → **CLS and a slow LCP are plausible**. The LCP element is likely map tiles or the large green placeholder text, not an optimized image. **UNVERIFIED (no live browser / no Lighthouse).**
- **[P2] `cursor: none !important` on the whole Leaflet map when a weapon is selected** (`bomb-cursor.css:4-9`) replaces the system cursor with a floating bomb SVG. On a **hybrid/touch-laptop or trackpad user** this removes the real pointer; if the bomb-cursor component fails to mount, the user has *no* visible cursor over the map. Desktop-only concern (mobile has no cursor).
- **[P2] Mobile simulator results overlay is a `max-h-48` (192px) scroll box** pinned `bottom-14` (`HomeClient.tsx:54`). Seven effect zones + share button inside 192px over the map is very cramped on a 390px-tall-ish viewport region; it scrolls, so it's an annoyance, not a block. **Overflow/overlap with the top BombSelector card at 390px is UNVERIFIED (no live browser).**
- **[P2] `<select>` weapon picker option labels are long** (`{flag} {name} ({yield} kt)`, `BombSelector.tsx:29`). Native `<select>` is the most accessible choice (good), but on a 384px (`w-96`) desktop sidebar / narrower mobile the longest options (e.g. Tsar Bomba 50,000 kt) rely on native truncation. Not a defect; noted.
- **[P3] Horizontal-overflow surface:** desktop-only `max-w-[1400px]` header and two `w-96` (384px) sidebars live behind `hidden lg:flex`, so they don't apply at 390px. No fixed-px widths are exposed in the mobile tree. **No overflow found in source; 390px render UNVERIFIED (no live browser).**

**Positives:** Server-rendered SEO `<article>` is fully crawlable without JS; clean H2/H3 hierarchy in the content block; FAQ via native `<details>`; map placeholder has a loading affordance and an error-recovery button; no raw `<img>` (no broken-image or unsized-image LCP element in markup).

---

## 2. `/weapons/tsar-bomba`

**Template:** `app/weapons/[slug]/page.tsx`. Mode: Read.

### Findings
- **[P2] Effects table has no reserved horizontal affordance cue, only `overflow-x-auto`.** The table is `w-full text-sm md:text-base` with 3 columns inside `max-w-4xl` → fits 390px fine (3 short numeric columns), so overflow is low-risk here; the `overflow-x-auto` wrapper is correct defensive styling. **No fixed widths. 390px render UNVERIFIED (no live browser).**
- **[P2] The whole content column is `max-w-4xl mx-auto p-8`** (`page.tsx:192`). `p-8` = 32px padding on each side; at 390px that leaves ~326px of content, which is fine, but `p-8` is not reduced at the mobile breakpoint (no `p-4 md:p-8`), so mobile loses ~16px more than necessary on each edge. Minor density issue.
- **[P3] FAQ `<details>`/`<summary>` tap target.** `summary` is `font-semibold cursor-pointer` with the parent card `p-4`; the clickable summary row is text-height (~24px) — **below the 44px touch-target guidance** for the summary text itself, though the card padding gives a larger effective area. **UNVERIFIED (no live browser).**
- **[P3] Breadcrumb separator `/` is a bare text node** (`page.tsx:195,197`) inside the nav, read aloud by screen readers as "slash"; cosmetic a11y nit.

**Positives:** Exemplary heading order (single H1 → H2 sections); descriptive `<title>`/meta; breadcrumb `nav[aria-label]`; table in `overflow-x-auto`; `<details>` FAQ; `PrevNext` is a labeled `<nav>`; strong contrast throughout (yellow-400 headings 11.6:1, green-300 body 12.6:1). **Note (content, not design):** the displayed radii are the known effects-engine over-estimates (fireball ~2.4×, blast ~1.6–2.4× high) — flagged in the engine audit, NOT a design finding, do not fix here.

---

## 3. `/examples/houston`

**Template:** `app/examples/[slug]/page.tsx`. Mode: Read. **Four** effect tables (one per weapon scenario) + a related-cities grid of ~99 links.

### Findings
- **[P1] Casualty tables carry a built-in logic artifact surfaced as UI: "Est. affected" can read `~0` or look inconsistent** because zone deaths are computed as subtractions between overlapping concentric zones (`page.tsx:117-120`, `Math.max(0, …)`). For small weapons on dense Houston the severe/moderate deltas can clamp to 0, so a row can show a large radius next to `~0` affected — visually confusing to a reader. (Root cause is the casualties double-count/subtract model in the engine; **report only, do not fix**.)
- **[P2] Four stacked `overflow-x-auto` tables + "About" + "Limitations" + 99-card "Other City Scenarios" grid makes this the longest/heaviest of the four pages** (rendered HTML 143 KB, ~2.7× the others). The "Other City Scenarios" grid renders **every other preset city** (`presetLocations.filter(... )`, ~99 `<Link>` cards) with no pagination/virtualization → long DOM, lots of tap targets stacked on mobile (`grid` → 1 col at base). Scroll-cost / tap-density annoyance on mobile. **UNVERIFIED layout at 390px (no live browser).**
- **[P2] Scenario action buttons `px-4 py-2 … text-sm`** (`page.tsx:279,285`) → ~32px tall, **under the 44px touch-target guidance**. Two side-by-side in a `flex-wrap` row; they wrap at narrow widths (good) but remain short. **UNVERIFIED tap size (no live browser).**
- **[P3] "Limitations" callout** uses `bg-yellow-900/20 border-l-4 border-yellow-400` with `text-green-300` body — green text on a yellow-tinted panel; contrast still passes (panel is mostly dark), but the yellow/green mix is the only place the palette fights itself. Cosmetic.
- **[P3] Same `p-8`-not-responsive padding and bare `/` breadcrumb separators** as the weapon page.

**Positives:** Clean H1→H2 structure even with 4 repeated scenario sections; every table wrapped; strong contrast; good internal linking; `<details>` FAQ; labeled `PrevNext`. The "Est. affected" column correctly uses an em-dash for the thermal row instead of a fake number.

---

## 4. `/blog/modern-nuclear-arsenals-2026`

**Template:** `app/blog/[slug]/page.tsx` + `ArticleBody.tsx`. Mode: Read. Narrowest column (`max-w-3xl`).

### Findings
- **[P2] `ArticleBody` wraps content in `className="prose-lg"` but Tailwind Typography is NOT installed** (`tailwind.config.ts` `plugins: []`). `prose-lg` is therefore an **inert class** — the "readable prose" defaults (measure, spacing, link styling) never apply; all type styling is the manual per-block classes instead. Not broken (blocks are hand-styled), but the intent (typographic prose rhythm) is a no-op, and any block type not hand-handled would be unstyled.
- **[P2] `RenderBlock` only handles `p`, `h3`, `list`, `quote`.** There is **no `h4`/code/image/table block type**, and the `switch` has no `default` → an unknown block type renders `undefined` (nothing). Content-model fragility: a future block silently disappears. Headings inside the body are limited to `h3` under section `h2` — fine for hierarchy, but there is no sub-structure below h3.
- **[P2] Article date is cosmetic-fresh.** Header shows `datePublished` and an "Updated" `<time>` when `dateModified` differs; per project facts `articleSchema` defaults `dateModified=new Date()` (today) → the schema freshness can disagree with the visible date. Design-surface note: the visible byline reads "By {author}" where the site-wide author persona is the collective "Editorial Team" / `NukeBlastSimulator.com`, not a named human (trust/E-E-A-T concern). **Report only.**
- **[P3] `h1` is `text-4xl md:text-5xl` with `leading-tight`** — large and good, but the description sits in `text-yellow-400 text-lg` directly under it, so **two high-emphasis colors (green H1 + yellow dek) stack**; the dek competes with the title. Minor hierarchy nit.
- **[P3] Blockquote uses `italic` green on `bg-yellow-900/10`** — same green-on-yellow-tint as the examples callout; passes contrast, cosmetic.

**Positives:** Clean single H1 → section H2 → H3; `<time datetime>` is machine-readable; byline + reading-time; related-articles grid; narrow `max-w-3xl` measure is good for reading; labeled breadcrumb and `PrevNext`; no raw images to go unsized.

---

## Prioritized issue list

### P0 — Blocking
*(none found — no finding prevents task completion in source review)*

### P1 — Major (fix before release)
1. **Duplicate `<meta name="viewport">` site-wide** — Next default overrides the manual `viewport-fit=cover`, dropping safe-area support. (`layout.tsx:73`) · Category: Responsive · → `/impeccable adapt`
2. **`MapWrapper` catches ALL window errors as map failure** → any unrelated JS error nukes the core tool and offers a full page reload. (`MapWrapper.tsx:31-36`) · Category: Implementation Integrity · → `/impeccable harden`
3. **Homepage "Back to the Simulator" CTA `href="#"`** scrolls to document top, not the simulator. (`page.tsx:391`) · Category: Implementation Integrity · → `/impeccable clarify`
4. **Visible heading hierarchy on `/` starts at H2** (`h1` is `sr-only`); the tool has no visible titled anchor. (`page.tsx:113`) · Category: A11y/Hierarchy · → `/impeccable layout`
5. **Mobile header hide-on-scroll + shared `document.body.style.overflow` writes** between header drawer and SearchPalette create a global-style stomp. (`MilitaryHeader.tsx:88-91`, `SearchPalette.tsx:47-53`) · Category: Implementation Integrity · → `/impeccable harden` · *UNVERIFIED (no live browser)*

### P2 — Minor (next pass)
6. **No `prefers-reduced-motion`** for 8 infinite + heavy explosion animations. · → `/impeccable animate`
7. **No custom focus-visible styling in CSS**; keyboard focus visibility at risk on dark theme. · *UNVERIFIED (no live browser)* · → `/impeccable harden`
8. **`console.log` in `MapWrapper` every render** shipped to prod. · → `/impeccable optimize`
9. **Lazy map = CLS/LCP risk** (SSR-off, placeholder-then-tiles, no reserved box in SSR HTML). · *UNVERIFIED (no live browser)* · → `/impeccable optimize`
10. **Touch targets < 44px**: scenario action buttons (`py-2`), FAQ `<summary>` rows, mobile results overlay controls. · *UNVERIFIED sizes (no live browser)* · → `/impeccable adapt`
11. **`/examples/houston` weight**: 4 tables + ~99-card city grid, no pagination, 143 KB HTML, dense mobile tap stack. · → `/impeccable distill`
12. **`prose-lg` inert** (Tailwind Typography not installed) and `RenderBlock` has no `default`/limited block types. (`ArticleBody.tsx`) · → `/impeccable typeset`
13. **Mobile drawer hard-coded `top-[57px]`** magic offset. · *UNVERIFIED at 390px* · → `/impeccable adapt`
14. **`cursor: none` over the whole map** when a weapon is selected (hybrid-pointer hazard). · → `/impeccable harden`
15. **Non-responsive `p-8`** on article templates eats mobile width. · → `/impeccable layout`

### P3 — Polish
16. Dead `terminal-font` class (brand type never loads).
17. Footer `text-gray-500` copyright 3.67:1 (fails AA normal-text).
18. ResultsPanel inline `#808080` light-blast label on black ≈ 3.3:1 (fails AA; computed from hardcoded hex).
19. Bare `/` breadcrumb separators read as "slash" by SR.
20. Green-text-on-yellow-tint callouts/blockquotes (cosmetic palette clash).
21. Blog H1 + yellow dek stack two high-emphasis colors.

---

## Patterns & systemic notes
- **Global mutable state for scroll-lock** is written from two components (header + search) without coordination → recurring stomp risk.
- **"Declared-but-inert" styling** recurs: `terminal-font` (undefined), `prose-lg` (plugin absent), manual viewport meta (overridden). The design intent exists in markup but never renders.
- **Touch targets trend small** (`py-1.5`/`py-2`, `text-sm` buttons and summaries) across article templates.
- **Contrast is a strength**, not a weakness: computed ratios pass AA almost everywhere; the only failures are two low-emphasis spots (`gray-500` footer, `#808080` results label).
- **Over-broad defensive code** (`window` error → map failure) is the single riskiest implementation pattern.

## Recommended command order
1. `/impeccable harden` (P1 error-capture + scroll-lock + focus + cursor) → 2. `/impeccable adapt` (viewport meta, touch targets, drawer offset) → 3. `/impeccable layout` (visible H1, padding) → 4. `/impeccable optimize` (console.log, lazy-map CLS) → 5. `/impeccable animate` (reduced-motion) → 6. `/impeccable typeset` (prose/block model) → 7. `/impeccable distill` (/examples weight) → 8. `/impeccable polish` (final).

*Re-run a live `impeccable detect`/screenshot pass once a Chromium browser is available to confirm all UNVERIFIED (no live browser) items — especially 390px overflow, touch-target geometry, focus rings, and lazy-map CLS.*
