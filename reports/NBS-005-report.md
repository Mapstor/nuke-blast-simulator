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

---

# NBS-005 FACTS — report (part 2 of 2)

_Date: 2026-10-21 · continues part 1 above. Part 2 applies every remaining row of `research/facts-verified.csv`, adds the radius-prose helper, rebuilds `/resources`, extends engine citations, and lands four regression gates. All building and tested green._

## 8. Batches (committed in order)

- **Batch A — radius helper + engine citations + regenerate rows** (`cfdd81a1`). Added `src/lib/calculations/radius.ts` (`radiusKm(yield, effect)` + `formatRadiusProse` 2-sig-fig + `radiusText`, over `effects.ts`) and `src/components/seo/citeText.tsx` (`renderCited` parsing `{{c:ids}}` and `{{r:yield:effect}}` tokens in data-string prose). Wired blog, glossary, compare, home and methodology to the citation collector so their Sources lists include `effects-fireball` + `effects-blast-thermal`. Methodology's hand-written source list → generated `<Sources>`, interpolation-example radii computed via `radiusKm()`. Applied regenerate row 31 (home thermal: 3rd-degree ~4.8 km @100 kt, ~12 km @1 Mt).
- **Batch B — blog (108 rows)** (`202a7db5`). Every `/blog/*` row in `articles.ts`: 103 inline `{{c}}` citation tokens + 9 `{{r}}` radius tokens (e.g. 100 kt 5 psi → 2.9 km; W88 475→**455 kt** prose → 4.8 km). Corrected the five regenerate rows, the arsenal/treaty figures ("as of early 2026" + FAS/SIPRI), and removed the fabricated reference / unsourced mortality bands.
- **Batch C — glossary (46 rows)** (`9ef22c46`). 49 inline `{{c}}` tokens in `long`; regenerate row 239 via `{{r:15:burn2}}` / `{{r:1000:burn2}}` (2.8 km / 15 km). `short` kept plain (used in metadata/JSON-LD).
- **Batch D — core pages** (`bcc99acc`). home, `/faq`, `/how-it-works`, `/about`, compare template, weapon template (contact + methodology were already clean from NBS-003). Counts render from data (29 nuclear weapons = `bombs.filter(b => b.type!=='conventional' && b.id!=='custom').length`; glossary/city counts already data-driven); custom-yield range kept at 1–100,000 kt (matches the input); map stack stated as **Mapbox** (credit Mapbox + OpenStreetMap); removed every fatality-% band, surface-burst "40–50% smaller", the old power-law formulas/mortality table, "10 million °C / everything vaporized", and the `/faq` response-time promise; fixed strategic yields to "100–800 kt (a few exceed 1 Mt)" and the blast wave as an immediate effect.
- **Batch E — `/resources` rebuild** (`02d4192f`). Three treaty cards (NPT, CTBT, TPNW) with the verified group-B figures + inline `<Cite>` and links to the issuing authority; an "Official data sources" list (FAS, SIPRI, CTBTO, UN ODA) each linked to a URL already in `sources.ts`; removed the Einstein quote and every documentary/museum/textbook/advocacy entry (Peace Action, Mayors for Peace, ICAN) and every unsourced number. Contains the exact string **"188 states have signed and 179 have ratified"**.
- **Batch F — tests + gate fixes** (this commit). Four new regression gates + the content fixes they surfaced.

## 9. Regression gates (new)

- `tests/removed-strings.test.ts` — scans every prerendered HTML file (normalized: comments + tags stripped, entities decoded, en-dash/× canonicalized, lowercased, whitespace collapsed) against all 162 forbidden strings in `research/removed-strings.csv` (142 global + 20 path-scoped). **0 survive.**
- `tests/expected-weapons.test.ts` — `bombs.ts` vs `research/expected-weapons.csv` (43 records): yield/type/country/year per row; OFAB-5000 absent; mark-84 / mk-82 not dated 1956; 29 nuclear + 14 conventional, custom excluded.
- `tests/cities.test.ts` — 100 cities vs `research/cities-verified.csv`: population, year, definition, lat, lng.
- `tests/engine-sources.test.ts` — every radii page (home, methodology, each nuclear weapon, each city example, each both-nuclear comparison) lists both engine source URLs; a conventional weapon page lists neither (radii withdrawn).

The gate caught real misses, now fixed: "most residential buildings collapse" + stale "W76, 100 kt" on the `/examples` template; "can extend hundreds of kilometers" (physics blog); "everything is vaporized" (glossary fireball); "vaporizes everything" (`/faq`); and "45+"/withdrawn casualty+fallout+surface-burst claims in `/weapons` metadata, `/compare`, the `/weapons` dataset schema, and `src/lib/seo/schemas.ts` (WebSite + SoftwareApplication). `removed-strings.csv` and `expected-weapons.csv` were never edited to pass.

## 10. VERIFY (part 2)

- `npm run build` exit 0. `npx vitest run` → **42 passed, 0 skipped** across 7 files (effects 11, sources 15, content-dates 4, removed-strings 3, expected-weapons 4, cities 2, engine-sources 3).
- Curl (`next start`): `/weapons/w88` → **455 kilotons**; `/weapons/w76` → **90 kilotons**; `/weapons/halifax-explosion` → **2.9 kilotons** + **Canada**; `/blog/four-kill-mechanisms` → "5 PSI radius of about **2.9 km**"; `/blog/physics-of-nuclear-blast` → **455 kt** and **4.8 km**; `/resources` contains "**188 states have signed and 179 have ratified**" and **0** "Peace Action"; `/contact` → **0** "business days", **0** "Within 24 hours". (Weapon pages render yields as "kilotons"; the verified values 455 / 90 / 2.9 are correct — the VERIFY shorthand "kt" differs only in unit abbreviation.)
- Every facts row accounted for: 424 rows = part-1 data (bombs 380–424, footer 378–379, cities, data-sources) + part-2 blog (108) + glossary (46) + core/home/faq/how-it-works/methodology/about/compare/weapon-template (161) + `/resources` (27) + `/sources` (35, generated in part 1). `obsolete`/`rebuild`/`internal` "confirm-gone" rows are enforced by the removed-strings gate. Row 44 (`/about` "13,000 warheads") was already removed in NBS-003 (confirmed absent).

## 11. Content dates
Re-ran `scripts/update-content-dates.mjs` (`NBS_DATE=2026-10-21`) after the final build. Drift test green.
