# NBS-012 COUNTRIES — report

**Task:** 10 country pages from the chat-verified registry, hub corrections, registry + ledger clean-up.
**Date:** 2026-10-22 · CC · done (unpushed)

Built `/nuclear-weapons-by-country/{united-states, russia, china, united-kingdom, france, india,
pakistan, north-korea, israel, iran}` from `research/country-facts.csv` (verified rows only).
Nine are arsenal data pages; Iran is a neutral status page. Every number traces to a verified row;
candidate and gap rows never render. No targeting language; the blast-radius section is about yields,
never places.

---

## 1. Verification (exact commands + results)

| Check | Command | Result |
|---|---|---|
| Production build | `npm run build` | **exit 0** (148 static pages; 10 country pages + per-country OG prerendered) |
| Tests | `npx vitest run` | **90 passed, 0 skipped** (17 files), incl. new `tests/country-pages.test.ts` (9 tests) |
| Keyword ledger | `check_ledger.py keyword-ledger.csv page-map.csv` | **RESULT: OK (77 warnings)** |
| Source registry | `check_sources.py data-sources.csv page-map.csv` | **RESULT: OK (2 warnings)** (GAP page carries its treatment; one pre-existing folded-blog pages_served warn) |
| Content dates | `NBS_DATE=2026-10-22 … update-content-dates.mjs` | 116 pages; 10 country pages created 2026-10-22; no drift |
| Impeccable hook | PostToolUse on every write | no deterministic design issues; **no new ignores** |

### New tests (`tests/country-pages.test.ts`)
- **Every emitted row maps to a VERIFIED `country-facts.csv` row** — and no candidate/gap value leaked (data-layer guarantee that the pages render verified-only).
- **Known candidate values never appear** in the generated data (`RDS-1`, `12,321`, `50 atmospheric + 160 underground`).
- **Extracted yields** are clean single kt (US `[8,90,300,335,400,455]`; NK falls back to test yield `250`; Israel/Pakistan empty → section omitted).
- **Every blast radius on a page equals `radiusDual()`/`radiusKm()`** for its yield.
- **No `<title>`, `<h1>`, meta description or OG title/description contains "attack" or "strike"** (all 10).
- **10 pages in the XML sitemap**; search index wires them in.
- **10 titles ≤60 and unique; 10 metas ≤155 and unique.**

### The 10 titles and direct-answer blocks
Saved verbatim in `reports/NBS-012/titles-and-answers.txt` (printed from the served HTML). Highlights:
- US — *How Many Nuclear Weapons Does the US Have? 5,042 (2026)* — "5,042 … 1,670 deployed on strategic launchers, about 100 more with allied or tactical aircraft, 3,700 in the stockpile, 1,342 retired. SIPRI's January 2026 count matches."
- Russia — *How Many Nukes Does Russia Have? 5,420 Warheads (2026)* — "5,420 … 1,796 deployed, 4,400 stockpile, 1,020 retired. SIPRI matches."
- Iran — *Does Iran Have Nukes? Iran's Nuclear Program in 2026* — "No. … FAS/SIPRI. The IAEA's last estimate, 13 June 2025, was 440.9 kg up to 60%; the Agency cannot state the current size, composition or location."

### JS-off, overflow, render evidence
- **JS-off:** all pages are server components; the served HTML (= view-source) carries the direct answer, warhead tables, delivery table/notes, blast-radius table, tests, treaties and FAQ. All 11 URLs (hub + 10) return 200 under `next start`.
- **Overflow:** every wide table (delivery, blast-radius, hub summary) sits in an `overflow-x-auto` wrapper; the 2-column warhead tables are narrow and don't need one. **Live 360/390 px render and PNG screenshots UNVERIFIED — no Chromium in the box;** server-rendered text evidence for Russia, North Korea and Iran saved under `reports/NBS-012/render-*.txt` in place of screenshots.
- **anti-slop:** no AI-vocab / throat-clearing / sales tells in the new copy; 1 rendered em-dash in the hub subtitle, 0 in the country template; FAQ/meta/OG em-dash-free.

---

## 2. content-page pre-publish checklist (data pages)

**Truth & sourcing** — ■ every figure traces to a verified `country-facts.csv` row (candidate/gap excluded by the generator); ■ attributions rendered from the registry via `<Cite>`/`<Sources>`; ■ no invented numbers; ■ gaps disclosed per page (§4); ■ derived blast radii labelled "calculated" → `/methodology`; ■ "Data as of 22 October 2026" + author on every page.

**Structure** — ■ data-page anatomy: H1 (the primary as a question) · intro · 40–60-word direct-answer (FAS total, the split, "as of early 2026", whether SIPRI agrees) · warhead table (FAS + SIPRI, retired kept distinct from reserve) · delivery table + notes with the Notebook date · blast-radius-of-warheads section (where a verified yield exists) · test history · treaty status · notes · FAQ · sources · sibling nav; ■ Iran is a status page (direct answer, what the IAEA knows/doesn't, dated 2025–2026 timeline, treaty, FAQ).

**Formatting** — ■ tables are real HTML, crawlable; ■ wide tables in contained scrollers; ■ dual units on blast radii (mi primary, km); ■ no naked numbers (each warhead/delivery figure sits in a labelled row; radii explained).

**Links** — ■ hub summary table links to all 10 country pages; ■ each page links to its siblings + up to the hub; ■ blast-radius rows deep-link `/nuclear-blast-radius?kt=` and the matching weapon page.

**Technical & compliance** — ■ schema per the supported list (Article + Dataset + FAQPage + BreadcrumbList; Iran: Article + FAQPage + Breadcrumb), breadcrumb Home → Nuclear weapons by country → {Country}; ■ no "attack"/"strike" in title/H1/meta/OG; ■ mobile overflow contained (live UNVERIFIED); ■ google-ai-content-policy pass (§3); ■ real-name author + reviewed date.

---

## 3. google-ai-content-policy — scaled-content check (per page)

The 10 pages share a template but **each carries unique verified data**: its own FAS/SIPRI warhead counts, its own Nuclear-Notebook delivery systems, its own test history and treaty record, and blast radii computed for its own warhead yields. This is the opposite of the doorway/keyword-swap pattern — no two pages render substantially similar content, and the data is not a generic model's output but transcribed from primary sources (FAS 2026, SIPRI YB2026 ch.8, the 2026 Nuclear Notebooks, IAEA GOV/2026/50, CRS, CTBTO). Iran is a distinct status page. Each answers a high-demand query ("how many nukes does {country} have", "does Iran have nukes") with a resolved, cited answer and a format (two-source table + computed blast radii) competitors' plain lists don't offer. **No hard-stop trigger.** PASS.

---

## 4. Gaps disclosed (per the sourcing report)

| Page | Disclosure on the page |
|---|---|
| China | "China has not published an official total number of tests, and secondary compilations differ, so this page does not assert a single total." (the candidate 45/47 are not rendered) |
| India | "No fetched source states an all-time total for India; the dated test events above are listed instead." |
| North Korea | "FAS does not estimate North Korea's launcher counts or a per-system warhead split; those figures are a source-level gap." |
| Pakistan | "Pakistan's per-system warhead allocation is published only as a table image and is not reproduced here; the systems and their ranges are listed above." |
| Israel | "Israel neither confirms nor denies its arsenal; the delivery figures are SIPRI's January 2024 data, the latest available." |
| United Kingdom | "The name of the last UK test was not captured from a fetched primary source." |
| Iran | Stockpile shown as the IAEA's 13 June 2025 estimate, explicitly not current; MOU terms beyond the no-weapons clause withheld (candidate). |

---

## 5. Hub corrections + facts-verified row 212

Hub (`/nuclear-weapons-by-country`), per the report:
- Sarmat no longer "operated"; stated as listed in the 2026 Notebook with no deployed launchers or warheads yet (cited to the Russian Nuclear Notebook).
- Retired (about 2,442) distinguished from reserve/central storage (about 5,733); "the remainder are reserves" removed.
- China projection reworded to "about 1,000 operational warheads by 2030, as quoted by FAS" (was "more than 1,000").
- Early-2026 counts re-cited to **SIPRI Yearbook 2026 ch. 8** (and the 2026 press release), not the 2023/2024 yearbooks.
- Uncited claims cut: China's motivation, the Dreadnought-timing parenthetical, the France cap increase, India's no-first-use, Pakistan's tactical-weapons policy, "amimut", "likely North Korean buildup". The UK's 260-warhead ceiling is kept, now cited to the UK Notebook. Israel's ambiguity is kept, cited to SIPRI 2026.
- Added the **country summary table**, each row linking to its country page.
- Footer "what a strike would do to a major city" → "the blast radius mapped on a major city".

`research/facts-verified.csv` row 212: the CTBT value corrected to **Russia's withdrawal took effect 3 November 2023 (UN C.N.463.2023; 8 November is the notification date)**, with the UN notification added to its source list and a dated note.

---

## 6. Reverse-link list (applied)

- **Hub → 10 country pages** (the "Every nuclear power at a glance" table rows).
- **Each country page → its 9 siblings + the hub** (sibling nav).
- **Each blast-radius row → `/nuclear-blast-radius?kt=<yield>` + `/methodology` + the matching weapon page** (US → W88/W87/W76, India → Smiling Buddha, North Korea → Hwasong-14).
- The hub is already surfaced in the Learn menu (Reference) and linked from `/nuclear-blast-radius`'s "nuclear missile blast radius" section (NBS-011), so the cluster is not orphaned.

---

## 7. Files

**New:** `scripts/build-countries.mjs`, `src/lib/data/countries.ts` (generated), `src/lib/data/countryView.ts`,
`src/app/nuclear-weapons-by-country/[country]/page.tsx`, `.../[country]/opengraph-image.tsx`,
`tests/country-pages.test.ts`, `reports/NBS-012-report.md` + `reports/NBS-012/`.

**Modified:** `research/sources.csv` (+37), `research/data-sources.csv` (arsenals-2026 updated; +8 country rows +1 GAP),
`src/lib/data/sources.ts` (regen), `scripts/build-sources.mjs` (skip non-verified domains),
`scripts/build-page-seo.mjs` (buildCountry) + `src/lib/seo/pageSeo.ts` (regen),
`research/page-map.csv` (10 live + data_source normalized), `research/keyword-ledger.csv` (9 discards + 1 moved),
`src/lib/data/livePages.ts` (regen), `src/app/sitemap.ts`, `src/lib/search/index.ts`,
`src/app/nuclear-weapons-by-country/page.tsx` (hub), `research/facts-verified.csv` (row 212),
`data/content-dates.json` (regen).

---

## 8. Adversarial review (5 lenses + verify pass)

A 10-agent workflow reviewed the 10 pages + hub across 5 lenses (data fidelity, blast-radii,
brand/policy, schema/SEO, mobile/sourcing/disclosure), each finding adversarially verified.
**4 confirmed, all fixed; 0 remaining.**

- **[major · FIXED] `&rsquo;` rendered literally in two headings** on all 9 arsenal pages. The blast-radius and test-history H2s put `&rsquo;` inside a `{…}` template literal, where JSX does not decode entities, so readers saw the literal string. Fixed to a real `’` (U+2019); built HTML now shows "the United States’s warheads" etc., 0 literal entities.
- **[major · FIXED] North Korea's NPT FAQ was broken.** NK has no single `treaty.npt` row (only `treaty.npt.accession`), so the fallback rendered "On the NPT, North Korea is: 1985-12-12." and omitted the 2003 withdrawal. `buildFaq` now composes accession + withdrawal: "North Korea acceded to the Non-Proliferation Treaty on 1985-12-12. It later announced its withdrawal (announced 2003-01-10; stated effective 2003-01-11)." — in both the visible FAQ and the FAQPage schema.
- **[minor · FIXED] Article JSON-LD had `description: ""`** on all 10 pages. Added `pageDescription()` and passed the real meta description into `articleSchema` on both templates.
- **[minor · FIXED] France direct answer read "A further up to 80 are retired."** Reworded to "Up to 80 more are retired and awaiting dismantlement." when the value carries an "up to" qualifier.

All other checks returned clean on verification: numbers trace to verified rows; no candidate/gap value
leaked; blast radii match `radiusKm()`; no attack/strike in title/H1/meta/OG; schema/breadcrumbs correct;
wide tables wrapped; gap disclosures and hub fixes present.

Final: `npm run build` exit 0 · `npx vitest run` **90 passed, 0 skipped**.
