# NBS-013 COUNTRY-FIX — report

**Task:** fix the defects chat found on the live country pages (NBS-012) plus six sitewide polish items.
**Date:** 2026-10-28 · CC · done (unpushed)

Chat's 2026-10-28 production check of NBS-012 (commit 69a0e33) found seven defects the passing tests
missed, plus a brand collision and five smaller sitewide issues. All are fixed, with new sitewide tests
that would have caught the first batch.

---

## 1. Verification (exact commands + results)

| Check | Command | Result |
|---|---|---|
| Production build | `npm run build` | **exit 0** (148 static pages) |
| Tests | `npx vitest run` | **98 passed, 0 skipped** (18 files) incl. new sitewide + country tests |
| Content dates | `NBS_DATE=2026-10-28 … update-content-dates.mjs` | 116 pages, 15 changed → 2026-10-28, datePublished preserved, no drift |
| Impeccable hook | PostToolUse on every write | no deterministic issues; **no new ignores** |

### New / updated tests
- **`sitewide-html.test.ts`** (scans every built page): every citation `[n]` resolves to a listed source on the same page; no page leaks raw `key=value` visible text (`/\b[a-z_]+=\d/`); the capitalized string "Nuclear Blast Simulator" (the competitor) appears on **no** page; the search structural entries derive from `PAGE_SEO` and carry no "fallout" claim.
- **`country-pages.test.ts`** (added): every country page has a **unique** intro (and the NBS-012 templated opener is gone); every country page has **4–6 FAQs**.

### VERIFY prints
Saved in `reports/NBS-013/verify-prints.txt`:
- **Iran page** first 2,500 chars — now prose: a direct No-answer, an "assessments" section, a plain-label stockpile table (marked "as of 13 June 2025 … cannot currently verify"), the HEU/60%/weapons-grade context cited to the NRC and NTI, and a dated full-sentence timeline.
- **Russia intro:** "Russia holds the world's largest nuclear arsenal, an estimated 5,420 warheads — about 44% of the world's roughly 12,187 … and more than any other country."
- **US intro:** "The United States has the world's second-largest nuclear arsenal, an estimated 5,042 warheads (about 41% …), and remains the only country ever to have used a nuclear weapon in war."
- **Russia delivery header:** System · Launchers · Yield · Warheads (4 columns, fits without desktop scroll).

---

## 2. The seven production defects (chat, 69a0e33) — fixed

1. **Broken citations (US [14], France [10], Iran [13]/[14]/[15]).** Cause: the citation collector is mutated during render, and across the separate section component functions React's registration order did not match DOM order, so `<Sources>` printed its list before the last `<Cite>`s registered. **Fix:** `createCitationsFrom(ids)` pre-registers every cited id (in DOM order) before any section renders; inline `<Cite>` then only looks the number up. Applied to the country pages **and** the four other pages the new sitewide test flagged (home, the examples, glossary and by-country hubs). Every citation now resolves (US 14/14, Iran 17/17, …).
2. **Iran data dump.** Rewritten as prose (§ above): plain-label stockpile table, dated full-sentence timeline with abbreviations spelled on first use (FEP, NPP, DIV, IFEP, HEU, E3), the 60%/HEU context (HEU = 20%+ U-235 per the NRC; weapons-grade ≈ 90% per NTI — two sources added), 6 FAQs with full cited answers, and a footer that describes only what the page uses.
3. **Raw-field leak (Russia "warheads=1,794").** `isStructured(value)` now treats any delivery value containing `=` as a structured/subtotal row, so the single-cell nonstrategic subtotal renders as a readable "Subtotal … 1,794" row, never raw text. New sitewide test forbids `key=value` in visible text.
4. **Templated intros.** Each of the nine arsenal pages now opens with a country-specific intro computed from verified rows: largest / second-largest, share of the world total, the only country ever to use a weapon in war (US), the only country to test this century (North Korea), never confirmed a test (Israel), the projected 2030 figure (China), the stockpile ceiling (UK). Every comparison is computed, never typed.
5. **Thin explanation.** A context paragraph puts each headline number in proportion (share of the world total, deployed vs stockpile, retired vs reserve). FAQs expanded to 4–6 per page with 40–80-word, self-contained, cited answers (how many; how it compares to the US and Russia; when it tested; what carries its weapons; NPT/CTBT).
6. **Oversized delivery tables.** Reduced to the four columns the brief names — System, Launchers, Warheads, and Yield (or Range where a country has no published yield) — dropping empty columns, wrapping (no fixed-width overflow) so they fit a desktop column, stacking as labelled cards on phones, with readable subtotal rows.
7. **Copy details.** Source labels read "FAS · beginning of 2026" (no nested parentheses); the US/UK possessives read "US warheads" / "US nuclear tests"; treaty and test dates are shown in human form ("1 July 1968") rather than ISO.

---

## 3. Sitewide polish (chat's check of 0ac9ec8)

8. **Brand.** "Nuclear Blast Simulator" (the exact name of the competitor nuclearblastsimulator.com) is gone as the site name — the /faq and /how-it-works titles, the home "What is…" H2 and FAQ, the OG frame label (`og.tsx`), the layout OG/Twitter titles, the weapons OG alt text, the search index, and `schemas.ts` (`SITE_NAME`, the Organization description, and the WebSite `alternateName`) all now say "Nuke Blast Simulator". **0** capitalized occurrences remain in the built HTML. Lowercase descriptive uses ("a nuclear blast simulator") are kept.
9. **Search index.** The structural/hub entries are now generated from `PAGE_SEO` (title/H1 + description) via `BASE_PATHS`, so they can't drift and can't reintroduce the stale "fallout" claim the / and /methodology entries carried.
10. **/nuclear-blast-radius.** The "(Prefilled with …)" note now shows the actual prefilled yield (from `?kt=`); the yield-chart axis labels were bumped to render ≥11 px at 390 px (font 26 in the 900-wide viewBox); the nested parentheses ("11 mi (17 km))") are gone — a paren-free "11 mi or 17 km" form (`radiusOr`) is used inside parentheses.
11. **OG images.** The by-country hub, the hubs with a headline count (weapons, cities, glossary, home) and the Tsar Bomba article now carry one real data point on their share image (world total ~12,187; 50 Mt; etc.), all computed from the data. Country-page OGs already carried their total (NBS-012).

Two sources added to `research/sources.csv` (regenerated into `sources.ts`): NRC glossary (HEU = 20%+ U-235) and NTI enrichment infographic (weapons-grade ≈ 90%).

---

## 4. Files

**New:** `tests/sitewide-html.test.ts`, `reports/NBS-013-report.md` + `reports/NBS-013/`.

**Modified:** `src/components/seo/Cite.tsx` (`createCitationsFrom`), `src/components/seo/citeText.tsx` (`collectCiteTokens`),
`src/app/nuclear-weapons-by-country/[country]/page.tsx` (citations, Iran rewrite, intros, context, FAQ, delivery redesign, copy),
`src/lib/data/countryView.ts` (`isStructured`, `cleanAsOf`, `humanizeDates`, `shortName`, `headingPoss`, `toInt`, `worldTotalFas`),
`src/app/nuclear-weapons-by-country/page.tsx` (hub pre-register), `src/app/page.tsx`, `src/app/examples/page.tsx`, `src/app/glossary/page.tsx` (pre-register + brand),
`src/lib/calculations/radius.ts` (`orProse`/`radiusOr`), `src/components/tools/BlastRadiusCalculator.tsx` (prefill note),
`src/components/tools/BlastRadiusDiagrams.tsx` (chart label fonts), `src/app/nuclear-blast-radius/page.tsx` (paren-free duals),
`src/lib/search/index.ts` (PAGE_SEO-derived), `src/lib/seo/{og.tsx,ogImage.tsx,schemas.ts,pageSeo.ts}`, `scripts/build-page-seo.mjs` (titles),
`src/app/{layout,weapons/[slug]/opengraph-image}.tsx`, `research/sources.csv` (+2) + `src/lib/data/sources.ts`, `tests/{country-pages,nuclear-blast-radius}.test.ts`, `data/content-dates.json`.

---

## 5. Adversarial review (4 lenses + verify pass)

A 12-agent workflow reviewed the fixes across 4 lenses (intro/FAQ facts, Iran quality, delivery/copy/brand,
citations/data/schema), each finding adversarially verified. **8 confirmed, all fixed; 0 remaining.**

- **[major · FIXED] North Korea's world-share read "about 0%."** 60 / 12,187 = 0.49% rounded to 0. A `sharePhrase()` helper now renders a sub-1% share as "less than 1%" (on the page and in the FAQ schema).
- **[major · FIXED] India's intro said India and Pakistan "both first tested in the 1990s."** India tested in 1974 (and the page's own FAQ said so). Reworded: "It first tested a nuclear device in 1974 and again in 1998…".
- **[major · FIXED] Iran's "Can the IAEA verify?" FAQ interpolated a raw value** ("…it is IAEA unable to discharge…"). Rewritten as grammatical prose.
- **[minor · FIXED] NPT and test FAQ answers fell below the 40-word floor.** Both builders now add a cited context sentence; the minimum is now 42 words (Iran NPT padded to 58).
- **[minor · FIXED] "IFEP" was printed bare.** The IAEA-verification section is now prose and describes it as "a fourth declared enrichment facility at Isfahan."
- **[minor · FIXED] Two Iran bulleted lists rendered raw row fragments.** The "assessments" and "what the IAEA can verify" sections are now prose paragraphs that weave the verified values.
- **[minor · FIXED] "the United States's" survived in two FAQ questions.** A `possSubjLower()` helper gives "the US's"; no "United States's" remains in visible text.
- **[minor · FIXED] Two source attributions carried ISO dates** ("page modified 2022-10-20"). Humanized in `sources.csv` to "20 October 2022" / "10 July 2026".

Final: `npm run build` exit 0 · `npx vitest run` **98 passed, 0 skipped**.
