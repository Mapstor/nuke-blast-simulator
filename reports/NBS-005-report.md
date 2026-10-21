# NBS-005 FACTS — report (part 1 of 2)

_Date: 2026-10-21 · Repo: nuke-blast-simulator (branch master)._

**Honest scope note.** NBS-005 is large (424 verified facts + 100 cities + 44 weapons + a citation system + four page rebuilds). This commit is **part 1: the citation system + every deterministic data correction + the explicit gate fixes**, all building and tested green. The row-by-row application of the remaining *prose* claims (blog, glossary, and the content/FAQ/how-it-works pages), the `/resources` rebuild, the engine citations on compare/home/methodology, and the full distinctive-string gate are **part 2 (NBS-005 cont.)** — listed at the end. Nothing here was marked done that was not verified.

## 1. Citation system — DONE
- `scripts/build-sources.mjs` generates `src/lib/data/sources.ts` (248 sources = 240 from `research/sources.csv` + 8 data-domain from `research/data-sources.csv`, incl. the engine ids `effects-fireball`/`effects-blast-thermal`). No duplicate ids.
- `src/components/seo/Cite.tsx`: server-side `<Cite c ids="a;b" />` (superscript `[n]` links, first-use numbering) + `<Sources c />` (numbered list, each attribution linked to its deep URL). No client JS. `ENGINE_SOURCE_IDS` exported.
- Wired on **weapon pages** (per-weapon `sources[]` + engine sources → Sources list) and **city pages** (per-city `source_ids` + engine → Sources list).
- Tests (`tests/sources.test.ts`): every id used by weapon/city data resolves in `sources.ts`; no duplicate ids; every source has url + attribution.

## 2. Weapons — DONE (rows 380–424)
`scripts/build-bombs.mjs` applies hand-checked field overrides (never auto-parsed) + `sources[]` to all weapons. 44 weapons (29 nuclear + tests, 14 conventional + `custom`). Key diffs:

| id | field | old → new |
|---|---|---|
| w88 | yield | 475 → **455 kt** |
| w76 | yield | 100 → **90 kt** (current W76-1) |
| w80 | yield/year | 150 kt / 1979 → 150 kt / **1981** |
| orange-herald | type | fusion → **fission** |
| halifax-explosion | yield/country | 0.0029 kt / "Accidental" → **2.9 kt / Canada** |
| blockbuster | yield/country | 0.004 / UK → **0.0014 kt** |
| blu-82 | yield | 0.0075 → **0.0057 kt** |
| fab-5000 | yield/country/year | 0.003 → **0.0032 kt / USSR / 1943** |
| grand-slam | yield | 0.0095 → **0.0066 kt** |
| jdam / mark-84 / mk-82 | yield | 0.0009/0.0009/0.0002 → **0.00043 / 0.00043 / 0.00009 kt** |
| gbu-57 | yield | 0.0026 → **0.0024 kt** |
| hwasong-14 | name | "Hwasong-14 Warhead" → **"North Korea 2017 Test"** |
| soviet-test-219, castle-yankee, b61, b83, chagai-i, davy-crockett, foab, fab-500, tallboy, w54, gbu-28 | description | corrected per verified_value |

**OFAB-5000 removed** (no source confirms it). `/weapons/ofab-5000` → **308 → /weapons** (`data/weapon-redirects.json`). No compare pair contained it. Weapon/picker counts recompute from data.

## 3. Cities — DONE (100 rows)
`scripts/build-cities.mjs` merges `research/cities-verified.csv` (verified population / area / density / coordinates + `source_ids`) into the records, keeping region. City pages now show **"Population 8,584,629 (2025, city proper)"** with `<Cite>`, density only where `area_km2` is known (dubai/baghdad have none → no density), and a Sources list. 24 descriptions corrected from the notes (Pentagon→Arlington removed; Tokyo/Delhi/Vancouver/Atlanta/Bogotá/São Paulo/Bangkok/Nairobi/Salvador etc.). Corrected coordinates move each ground-zero point (e.g. Chongqing, previously ~38 km off). Samples: New York 8,584,629 (2025); Accra 284,124 (2021).

## 4. Explicit gate fixes — DONE
- Arsenal article: **"12,500 warheads" → "about 12,187"** (×3) and **"roughly 89%" → "about 86%"** (group-B / FAS, early 2026).
- Built HTML contains **0** of "12,500", "Broido", "2019 FERC" (Broido/2019-FERC were already absent; the only FERC source is the correct 2020 FERC-725N citation).
- `/sources` **regenerated** from the registry, grouped (Effects physics · Weapons and tests · Cities), listing only cited ids; hand-written reading list deleted.
- `/about`: Einstein quote removed; named-org data-source list removed → links `/sources`; "How this site is made" uses row 39's wording ("Every figure on this site links to the source it comes from").
- Footer: data-list → link to `/sources`.

## 5. Content dates
Re-ran `scripts/update-content-dates.mjs`: 246 pages, earliest datePublished 2025-10-30, dateModified 2026-10-21 for the 177 pages this wave changed / 2026-10-15 for 69 unchanged. Drift test green.

## 6. VERIFY (this part)
- `npm run build` exit 0 (251 static routes). `npm test` → **30 passed, 0 skipped** (effects 11, sources 15, content-dates 4).
- Curl: w88 455 kt · halifax 2.9 kt + Canada · orange-herald fission · /weapons/ofab-5000 → 308 /weapons · NY 8,584,629 (2025, city proper) · Accra 284,124 · /sources grouped & generated · weapon/city Sources lists render with engine attribution.

## 7. REMAINING — NBS-005 cont. (part 2), NOT done
- **Prose rows not yet applied**: correct (106, add inline `<Cite>`), correct-minor (85), wrong (~27 outside bombs/arsenal), outdated (~13 outside w76/w88), unverifiable (36), regenerate (19), obsolete (42 confirm-gone), internal (11), keep (11), policy (6: remove contact/FAQ response-time promises; keep age guidance), fabricated-reference (1, confirm gone). Chiefly in `src/lib/blog/articles.ts` (8 articles), `src/lib/data/glossary.ts` (~40 terms), and `/faq`, `/how-it-works`, `/methodology`, `/`, compare template.
- `/resources` rebuild (official orgs + treaty-status group-B, cited; remove reading lists).
- Engine `<Cite>` on compare, home, methodology (so **every** radii page lists the engine sources — currently only weapon + city pages do).
- The distinctive-string VERIFY test over **all 95** wrong/outdated/unverifiable/fabricated rows (only the arsenal gate strings are confirmed removed so far).
- Then re-run build-sources/update-content-dates, and `/sources` will expand to the newly-cited arsenal/treaty/history/winter/glossary ids.
- Rows not located: none attempted beyond the applied set; the remaining rows are deferred, not lost.
