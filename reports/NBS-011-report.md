# NBS-011 BLAST-RADIUS — report

**Task:** Build `/nuclear-blast-radius` (T1 tool page), point the 7 folded glossary URLs at it, link it in.
**Date:** 2026-10-22 · CC · done (unpushed)

/ nuclear-blast-radius is a tool page: a yield calculator (button-gated results) above the fold,
a cited 1 kt–50 Mt radius chart, and extensive explanation below. Air burst at optimum height only;
no casualty, fallout or surface-burst numbers (owner decision / EFFECTS_FLAGS). No cities and no
targeting language anywhere (PRODUCT.md): examples are yields and named weapons.

---

## 1. Verification (exact commands + results)

| Check | Command | Result |
|---|---|---|
| Production build | `npm run build` | **exit 0** (106 live pages + 21 opengraph-image routes; `/nuclear-blast-radius` prerendered static) |
| Tests | `npx vitest run` | **81 passed, 0 skipped** (16 files), incl. new `tests/nuclear-blast-radius.test.ts` (15 tests) |
| Keyword ledger | `python3 …/kw-research/scripts/check_ledger.py` | **RESULT: OK (77 warnings)** (baseline; `nuclear-blast-radius` has 1 primary + 5 secondary + 211 tertiary) |
| Content dates | `NBS_DATE=2026-10-22 … update-content-dates.mjs` | 106 pages, new page `datePublished`/`dateModified` = 2026-10-22; no drift |
| Impeccable hook | PostToolUse on every write | no deterministic design issues; **no new ignores** |

### The 7 folded glossary URLs — 308 one-hop → `/nuclear-blast-radius#term` → 200
Served by `next start -p 4321`, `curl --max-redirs …`:

```
/glossary/air-burst            308 -> …/nuclear-blast-radius#air-burst            | final=200 hops=1
/glossary/fireball             308 -> …/nuclear-blast-radius#fireball             | final=200 hops=1
/glossary/overpressure         308 -> …/nuclear-blast-radius#overpressure         | final=200 hops=1
/glossary/psi                  308 -> …/nuclear-blast-radius#psi                  | final=200 hops=1
/glossary/second-degree-burns  308 -> …/nuclear-blast-radius#second-degree-burns  | final=200 hops=1
/glossary/surface-burst        308 -> …/nuclear-blast-radius#surface-burst        | final=200 hops=1
/glossary/thermal-radiation    308 -> …/nuclear-blast-radius#thermal-radiation    | final=200 hops=1
```
`redirects.test.ts` holds the counts (251 scenario + 1 weapon + 142 fold = 394), all permanent, one hop,
ending at a built page, none in the sitemap. `/glossary` keeps all definitions; the 7 effect terms there
now link to their matching section on this page.

### Title / H1 / meta (from served HTML)
```
<title>Nuclear Blast Radius Calculator and Chart (1 kt to 50 Mt)</title>   (57 chars ≤ 60; tokens nuclear/blast/radius)
<h1>Nuclear Blast Radius Calculator</h1>
<meta name="description" content="Nuclear blast radius calculator and chart, 1 kt to 50 Mt in miles and km. A 1-megaton air burst flattens buildings out to about 3.9 mi (6.2 km)."> (144 chars ≤ 155; one engine number)
<link rel="canonical" href="https://nukeblastsimulator.com/nuclear-blast-radius">  (no ?kt)
og:image AND twitter:image both set (file-based opengraph-image: title + "3.9 mi" / "6.2 km")
```

### The 5 psi column (every value = radiusKm(kt,'psi5'), engine-derived, present in server HTML)
```
1 kt                 0.37 mi (0.60 km)
10 kt                0.83 mi (1.34 km)
15 kt  Little Boy    0.96 mi (1.54 km)
21 kt  Fat Man       1.07 mi (1.73 km)
100 kt               1.80 mi (2.89 km)
300 kt W87           2.59 mi (4.16 km)
455 kt W88           2.97 mi (4.78 km)
1 Mt                 3.85 mi (6.20 km)
1.2 Mt B83           4.10 mi (6.59 km)
10 Mt                8.36 mi (13.5 km)
15 Mt  Castle Bravo  9.59 mi (15.4 km)
50 Mt  Tsar Bomba    14.4 mi (23.1 km)
```
`tests/nuclear-blast-radius.test.ts` recomputes **every** table cell (12 yields × 7 rings) from
`effectRadiiKm()`/`radiusKm()` and asserts the exact dual string is in the built HTML — no cell can be a
typed literal that drifts from the engine.

### Sitemap + search
- Sitemap: `https://nukeblastsimulator.com/nuclear-blast-radius` present exactly once (`sitemap-live.test.ts` ties the sitemap to the page-map live set; `nuclear-blast-radius.test.ts` asserts the URL).
- Search index: `basePages` entry present (`src/lib/search/index.ts`).

### JS-off (crawlable twin)
Server-rendered HTML contains the data story without JavaScript: the wedge table ("Nuclear blast radius
chart: 1 kt to 50 Mt"), the "Worked example: a 1-megaton air burst" + static bar chart, and "How to read
your results" covering every ring. Evidence: `reports/NBS-011/render-text.txt`, `reports/NBS-011/wedge-table.html`.

### Mobile / overflow (static audit)
No page-level horizontal overflow risk at 360/390 px: the wedge table is the only horizontal scroller and
is inside an `overflow-x-auto` wrapper; both SVGs are responsive (`viewBox` + `width:100%;height:auto` +
`max-width`); no fixed-width containers; no unbroken strings > 40 chars. **Live-browser 360/390 px render
and PNG screenshots are UNVERIFIED — no Chromium in the box** (standing repo limitation; see §4 of DEVLOG).
HTML render evidence saved under `reports/NBS-011/` in place of screenshots.

---

## 2. content-page pre-publish checklist (every line)

**Truth & sourcing** — ■ every number traces to the engine (`effects-fireball`, `effects-blast-thermal`)
or the registry (OTA for psi→damage, Glasstone for scaling exponents); ■ attribution deep links resolve
(Sources list renders them); ■ hook carries no invented stat (direct-answer uses engine numbers); ■ gaps
disclosed (casualty/fallout/surface withheld, stated in methodology block); ■ derived values labelled
"calculated from scaling laws" → `/methodology`; ■ "Data as of 22 October 2026" + honest dateModified.

**Structure & content** — ■ tool-page compressed hook (2 lines) above the tool; ■ 40–60-word direct-answer
block, "nuclear blast radius" bolded; ■ H2s in demand order, fan-out covered (what it means, fireball,
overpressure/psi, thermal/burns, air vs surface, scaling, how-far, missile, uses, FAQ, methodology);
tertiary phrasings placed (how far does a nuke reach, nuke range, blast radius in miles, icbm blast radius,
how big is a nuclear explosion …); ■ wedge visible (the 1 kt–50 Mt chart); ■ FAQ demand-ordered, answers
self-contained; ■ use-case section (4 scenarios) linking the tool; ■ length ~2,000 words below the tool,
not padded.

**Formatting** — ■ no paragraph > 4 sentences; bold skim layer; ■ 2 stat callouts with in-box attribution;
■ TOC jump links (> 1,500 words); ■ dual units miles primary, km parenthetical, conversions computed from
the km value (`KM_TO_MI`); ■ no naked numbers (context pattern).

**Visuals** — ■ exactly 2 purpose-built SVGs (hero concentric rings for a 1 Mt air burst; supporting 5 psi
vs yield on a log yield axis with 7 weapons marked), both engine-valued; data charts extra (worked-example
bars, results bars); collision QA run statically — labels live in spaced legends/axes, never over strokes;
■ **hero flagged for Marko's spot-check** (no browser render in the box); ■ explicit dimensions on SVGs
(CLS); ■ OG distinct + data-bearing + legible.

**Tool pages** — ■ tool above the fold, button-gated results; results panel extensive (headline 5 psi radius,
bar chart, every ring explained + compared, assumptions, next-step links incl. matching weapon when yield
matches); ■ crawlable twin present; ■ JS-off test passes.

**Links** — ■ contextual anchors from the ledger plan (simulator `/`, weapons little-boy/fat-man/w88/b83/
tsar-bomba/castle-bravo/w76/w87/b61, `/compare`, `/methodology`, `/nuclear-weapons-by-country`,
`/glossary/fallout`, `/glossary`); ■ hub link + one related block at end; ■ reverse-link list applied (§4).

**Technical & compliance** — ■ schema per the supported list (Article, Dataset, FAQPage, BreadcrumbList),
matches visible content, no aggregateRating, no HowTo/FAQ rich-result reliance; ■ mobile overflow audited
(live UNVERIFIED, no browser); ■ CWV sanity (inline SVG hero, small button-gated client island, no map →
low LCP/INP risk); ■ google-ai-content-policy check passed (§3); ■ YMYL-adjacent author credential +
disclosure present; ■ real-name author (Byline + site Person schema) + reviewed date.

---

## 3. google-ai-content-policy — non-commodity test (single page, not scaled)

1. **Unique data slice:** every ring for 1 kt–50 Mt computed by the site's own scaling-law engine, plus a
   live calculator — original computation, not a keyword swapped into a template.
2. **Non-commodity insight:** one cited table of all seven rings at every yield, plus the specific finding
   that heat outruns blast at the top end (50 Mt 1st-degree burns 45 mi > 1 psi 40 mi). Beyond generic prose.
3. **User-intent match:** answers "how big is the blast radius" with the tool, the chart and plain-English
   explanations of each ring; the reader leaves resolved.
4. **Verified-or-omitted:** every number is engine- or registry-sourced; casualty/fallout/surface withheld.
5. **Fan-out check:** not a keyword-variant — the canonical tool page, SPLIT from the simulator per the
   2026-10-22 SERP (1 shared top-10 URL) and merging "how far does a nuke reach"; one owner per keyword
   (check_ledger OK).
6. **Format/UX differentiator:** interactive calculator + computed chart + two SVGs a plain article cannot
   offer.

No hard-stop triggers (no doorway, no template-flat siblings, no fabricated author claims). **PASS.**

Anti-slop pass: new copy carries no AI-vocab / throat-clearing / sales tells; 3 rendered em dashes across
~2,150 words (cap ≈ 7), none in the direct-answer block, FAQ answers, meta description or alt text.

---

## 4. Reverse-link injection list (applied this ship)

| From (existing surface) | Anchor / link | Status |
|---|---|---|
| Home `/` (below the map, server SEO section) | "nuclear blast radius calculator and chart" | applied |
| Every weapon page radius section `weapons/[slug]` | "Compare every yield on the blast radius chart →" (`?kt={yield}` deep link) | applied |
| `/compare` "See also" | "blast radius calculator" | applied |
| `/how-it-works` Educational Purpose | "blast radius calculator" | applied |
| Blog article footer `blog/[slug]` (incl. the Tsar Bomba article) | "blast radius calculator" | applied |
| `/glossary` — 7 effect terms (fireball, overpressure, psi, thermal-radiation, second-degree-burns, air-burst, surface-burst) | term links to `/nuclear-blast-radius#term` | applied |
| `/glossary` — yield, kiloton, megaton | term links to `/nuclear-blast-radius` | applied |
| Learn mega-menu → Reference | "Blast Radius Calculator" | applied |
| Client search index | `page` entry | applied |
| XML sitemap | `/nuclear-blast-radius` (priority 0.9) | applied |

Deep-link contract: country/weapon pages link with `?kt=<yield>`; the calculator prefills from it; the
canonical stays `/nuclear-blast-radius`.

---

## 5. Files

**New:** `src/app/nuclear-blast-radius/page.tsx`, `.../opengraph-image.tsx`,
`src/components/tools/BlastRadiusCalculator.tsx`, `src/components/tools/BlastRadiusDiagrams.tsx`,
`tests/nuclear-blast-radius.test.ts`, `reports/NBS-011/*`.

**Modified:** `src/lib/calculations/effects.ts` (+ `KM_TO_MI`, `formatRadiusMi`, `formatRadiusDual`),
`src/lib/calculations/radius.ts` (+ `milesProse`, `dualProse`, `radiusDual`),
`scripts/generate-fold-redirects.mjs` (7 terms → `#term`) + `data/fold-redirects.json`,
`research/page-map.csv` (status approved→live), `src/lib/data/livePages.ts` (regen),
`scripts/build-page-seo.mjs` (+ OVERRIDE) + `src/lib/seo/pageSeo.ts` (regen),
`src/app/sitemap.ts`, `src/lib/search/index.ts`, `src/lib/menu/main-menu.ts`,
`src/app/page.tsx`, `src/app/weapons/[slug]/page.tsx`, `src/app/glossary/page.tsx`,
`src/app/compare/page.tsx`, `src/app/how-it-works/page.tsx`, `src/app/blog/[slug]/page.tsx`,
`data/content-dates.json` (regen, NBS_DATE 2026-10-22).

---

## 6. Adversarial review (5 lenses + verify pass)

Ran a 9-agent workflow: 5 independent review lenses (engine-value correctness, brand/policy,
schema, mobile/a11y, prose/structure), each finding adversarially verified. **1 confirmed finding
(major), now fixed; 0 remaining.**

**[major · FIXED] Results bar chart scaled to the wrong ring below ~140 kt.**
`BlastRadiusCalculator.tsx` hard-coded `maxRadius = result.r.thermal1stDegree`, assuming 1st-degree
burns is always the widest ring. The engine's own table makes the **1 psi ring wider than the
1st-degree-burn ring for every yield below ~140 kt** (1 kt: 1.70 vs 1.10 km; 15 kt Little Boy: 4.26 vs
3.69; 21 kt Fat Man: 4.78 vs 4.28; 100 kt: 7.98 vs 7.82). For those yields — which the page actively
invites (set 15 kt / 21 kt) — the 1 psi bar width exceeded 100% (clipped by `overflow-hidden`) and the
caption "widest ring (1st-degree burns)" was false.
_Fix:_ `maxRadius = Math.max(...RINGS.map(r => result.r[key]))` (true max per yield); caption → "widest
ring at this yield"; the 1st-degree blurb reworded so it no longer asserts the 1 psi comparison at small
yields. Pinned by a new crossover regression test (`nuclear-blast-radius.test.ts`): 1 psi > 1st-degree
burns at 1/15/21/100 kt, and the reverse at 1/15/50 Mt. (The server `WorkedExampleBars` already used
`Math.max` and the hero SVG sorts, so neither was affected.)

All other checks came back clean on verification: every radius value (table, prose, FAQ, SVG legends, OG
image) recomputes to the engine exactly; the "~18×" (17.58) and "tenfold" (10.33) comparisons are correct;
no city/targeting language; withheld effects absent; schema well-formed and matches content; no nested
anchors; 7 section anchors present; dual units consistent.

Final: `npm run build` exit 0 · `npx vitest run` **81 passed, 0 skipped** (16 files).
