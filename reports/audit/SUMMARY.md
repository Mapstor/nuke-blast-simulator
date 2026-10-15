# NBS-002 AUDIT — SUMMARY (nukeblastsimulator.com)

Read-only audit, 2026-10-15. Site-audit Phases 0–2 (inventory + prioritized findings). **No fix plan — chat writes the waves.** Every finding lists path(s) + the evidence file under `reports/audit/`.

## Folder contents (`reports/audit/`)
`SUMMARY.md` (this) · `inventory.csv` (498 URLs × 22 cols) · `links.csv` (23,369 link rows) · `weapons.csv` (45) · `cities.csv` (100) · `facts.csv` (424 claims) · `analysis.json` (SEO aggregates) · `build.txt` (route table) · `engine.md` · `js-off.md` · `technical.md` · `trust.md` · `duplicates.md` · `prose.md` · `impeccable.md` · `tools/` (crawl/analyze/extract scripts + corpus + robots/sitemap snapshots).

## Stack & production state
- Next.js **15.5.14**, App Router, React 18.3.1, TS 5.3.3, Tailwind 3.4, zustand, framer-motion. **Both** Leaflet and Mapbox shipped (dead-code risk); map via `next/dynamic ssr:false`. Node v20.20.2. Build: `npm run build` → **exit 0, 504 prerendered pages**. Prod server `next start -p 4317` → crawl of 498 URLs all HTTP 200.
- Third-party: GA4 `G-XDZQYKGTE2` (single gtag.js, no GTM) · GSC verified · Mapbox GL · **no AdSense script loads** (but `ads.txt` publishes `pub-3093026304369835`) · `llms.txt` present (no-op). Env names: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GSC_VERIFICATION`, `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`.
- **Owner check (cannot verify from box):** that the deployed Vercel commit = origin/master (HEAD `eaf0b664`, 2026-05-05). No `vercel.json` rules, no middleware, no redirects in `next.config.js`.

## URL inventory — 498 indexable URLs (route tree = sitemap = crawl; 0 sitemap-/route-/crawl-only; 0 internal 404s)
| template | count | median words | notes |
|---|---|---|---|
| home | 1 | 1721 | tool shell; data JS-gated |
| weapon `/weapons/[slug]` | 44 | 375 | thin, templated |
| city `/examples/[slug]` | 100 | 916 | near-duplicate (mean J 0.63) |
| scenario `/scenarios/[scenario]` | 250 | 556 | 10 bombs × 25 cities, templated |
| compare `/compare/[slug]` | 30 | 395 | thin |
| glossary `/glossary/[slug]` | 50 | 104 | very thin (63–149 words) |
| blog `/blog/[slug]` | 8 | 971 | real articles |
| hub | 6 | 628 | /weapons /examples /scenarios /compare /glossary /blog |
| legal/info | 9 | 417 | about, methodology, how-it-works, faq, sources, resources, contact, privacy, terms |
**Clean:** 0 duplicate titles, 0 duplicate descriptions, 0 missing/multiple H1, 0 missing descriptions, 0 noindex, 0 canonical mismatches, 0 JSON-LD parse errors.

---

## P0 — breaks trust or rankings
1. **Effect radii run ~1.6–2.4× over benchmark (fireball ~2.4×).** The engine (`src/lib/calculations/blast.ts:6-42`) uses `fireball 0.145·W^0.4`, `blast 0.482/1.03/2.93·W^0.33`, `thermal 0.67/1.2·W^0.41` vs Glasstone & Dolan 1977 §2.127 + the Wikipedia scaling table. These inflated numbers are baked into the server HTML of all 424 weapon/city/scenario/compare pages and into FAQ JSON-LD (e.g. Tsar Bomba fireball shown as **10.99 km**). → `engine.md`, `facts.csv`, `js-off.md`
2. **`/methodology` publishes WRONG formulas that contradict the code and `/faq`.** It prints `fireball = 0.28·W^0.33` and `severe = 0.28·W^0.33` (identical, both wrong) while the code uses `0.145·W^0.4` / `0.482·W^0.33`, and `/faq` prints the *correct* values — the site contradicts itself. The wrong formulas are also serialized into `howToSchema` JSON-LD. `src/app/methodology/page.tsx:20,24,79,92` vs `blast.ts:6,16`; `src/app/faq/page.tsx:310-311`. → `engine.md` (MM-1/2/3)
3. **Casualty counts are structurally unsound.** Casualties sum full `π·r²` disks over overlapping concentric zones with no ring-differencing → population counted up to ~7× near ground zero (`casualties.ts:37-41,106-156`). Two divergent paths exist (engine zeros casualties; page templates re-derive but **drop thermal deaths** from totals), and `/methodology` claims a **fictional "precomputed global population grid"** (`methodology/page.tsx:36`) — the code uses one scalar density. → `engine.md` §3, MM-4/5
4. **Fabricated author persona site-wide; no real human.** Every byline/author/Person schema = collective "NukeBlastSimulator Editorial" (`src/lib/seo/schemas.ts:108-132,214`; `layout.tsx:26` author = the domain). Owner **Marko Visic appears nowhere** (0 hits in src/HTML); no credentials/sameAs/rel=me. Raptive "invented persona" decline trigger; E-E-A-T failure on a sensitive topic. → `trust.md`, `technical.md`
5. **Privacy policy contradicts the live stack.** GA4 runs site-wide yet Privacy never names it and **falsely states "No tracking cookies", "no opt-out required since there's no tracking"** (`src/app/privacy/page.tsx:120,159`; same in Terms). No consent mechanism. → `trust.md` §3
6. **72% of factual claims are uncited (306/424).** Hard numbers across blog, weapon, glossary, FAQ pages carry `source: none` (e.g. EMP/arsenal/casualty figures). Raptive: "one wrong figure can sink the review; every figure traces to a source." Chat must verify each against primary sources. → `facts.csv`
7. **`robots.txt` blocks `/_next/` for `User-Agent: *`** (`src/app/robots.ts:31`) → Googlebot/Bingbot cannot fetch render-critical JS/CSS; the client-rendered home simulator + all maps are exposed. (AI bots are exempted.) → `technical.md` §1

## P1 — hurts
8. **Near-duplicate city pages at scale:** 100 city pages, mean Jaccard **0.634**, **61/100 have a ≥0.8 near-duplicate twin** (max kyiv↔warsaw 0.851). Scaled-content risk. → `duplicates.md`
9. **250 thin, templated scenario pages** (mean J 0.28, 537–579 words of mostly boilerplate) + **50 very thin glossary pages** (63–149 words) + thin weapon (375)/compare (395) pages. Consolidation candidate (chat proposal: 308 scenarios → city pages). → `duplicates.md`, `analysis.json`
10. **Cosmetic / uniform dates.** `datePublished` hardcoded `'2025-10-22'` on all 425 content pages; `dateModified = new Date()` (today) sitewide; sitemap `lastModified = new Date()`; all 8 blog posts share `2026-04-29`; About/Privacy render `new Date()` as "Last reviewed". `schemas.ts:211-212`, `sitemap.ts:37`, `blog/articles.ts`. → `trust.md` §5, `technical.md` §5
11. **Home page fails the JS-off test** — the flagship URL is a pure tool shell ("Initializing map…"), 0 tables, 0 computed numbers in server HTML (8/9 other templates PASS). `src/app/page.tsx` + `HomeClient.tsx`. → `js-off.md`
12. **Title brand-suffix bloat:** 492/498 titles >60 chars, 448 >70, from the 25-char ` | NukeBlastSimulator.com` suffix (`layout.tsx:22`). **428/498 meta descriptions >160 chars.** → `technical.md` §4, `analysis.json`
13. **15 hub/legal pages have 0 in-content inlinks** (6 hubs + 9 legal) — linked only by boilerplate nav, which Google discounts. → `technical.md` §6
14. **`ads.txt` phantom ad network:** publishes `google.com, pub-3093026304369835` with no ad script installed; 3 redundant ads.txt sources (`public/ads.txt`, legacy `api/ads.txt.js`, active `src/app/ads.txt/route.ts`). Domain/advertising red flag. → `trust.md` §3
15. **Mobile/UX code defects** (design review, no live browser): duplicate `<meta viewport>` drops `viewport-fit=cover` (`layout.tsx:73`); `MapWrapper` treats ANY window error as map failure (`MapWrapper.tsx:31-36`); home "Back to Simulator" CTA is `href="#"` (`page.tsx:391`); visible H1 is `sr-only` on `/`; shared `document.body.overflow` scroll-lock stomp between header & search. → `impeccable.md` P1
16. **Prose slop above target** on `/about` (11.9 tells/1k), `/` (5.3), `/examples/houston` (7.5); only `/weapons/tsar-bomba` and the blog meet ≤2. → `prose.md`

## P2 — polish
17. **FAQPage JSON-LD on ~433 pages is a dead rich result** (deprecated) — keep content, drop the inert markup (`schemas.ts:155-168`). → `technical.md` §5
18. **No web app manifest** (no `site.webmanifest`, no `rel=manifest`); custom 404 lacks the global nav chrome; About TPNW advocacy sentence (`about/page.tsx:171-174`) reads as uncredentialed political position. → `trust.md` §4
19. **`llms.txt` repeats the wrong methodology formulas** (fireball `0.28·W^0.33`) — if kept, it propagates the error to AI crawlers. `public/llms.txt`. → `trust.md` §4
20. **Engine/content mismatches:** documented legend colors ≠ `BLAST_COLORS` (`how-it-works`/`faq` vs `constants.ts:10-16`); "all calculations run locally in your browser" false for the 4 SSR templates; unenforced "1–100,000 kt" / "10 million °C" prose; no crater/EMP/initial-radiation formula despite prose. → `engine.md` MM-6/7/8
21. **Perf/a11y polish:** `og-image.png` 127 KB; no `prefers-reduced-motion` (8 infinite animations); `console.log` shipped in `MapWrapper`; `prose-lg`/Tailwind-Typography inert and dead `terminal-font` class; footer `text-gray-500` + `#808080` label fail WCAG AA. → `impeccable.md` P2/P3, `technical.md` §7
22. **Dead code:** `thermal.ts`/`fallout.ts` re-export shims; legacy `calculateCasualties`/`MORTALITY_RATES`; both map libraries shipped; unused `og-image.svg`. → `engine.md` P2

---
**Bottom line:** plumbing is strong (clean metadata, canonicals, sitemap parity, 0 broken internal links, 8/9 templates server-render their data). The blockers are **integrity** (inflated physics, self-contradicting methodology, double-counted casualties, 72% uncited figures) and **trust** (fabricated author, false privacy policy) — all P0 for both rankings and a Raptive application. Fix order per site-audit Phase 3: P0 integrity → consolidation+redirects → trust frame → technical SEO → mobile → prose.
