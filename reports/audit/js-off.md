# Phase 3 — JS-Off / Server-HTML SEO-Visibility Audit

**Audit date:** 2026-10-15 · **Method:** READ-ONLY. For one URL per template, `curl -s http://localhost:4317<path>` returns the raw server HTML — this IS the JS-off view (and what crawlers/LLMs that don't execute JS see). The interactive map is loaded via `next/dynamic` with `ssr:false`, so with JS off it renders only a shell (`<div>Initializing map...</div>`). Each page was grepped for real `<table>` markup, computed radius numbers (e.g. `10.99 km`), and explanatory prose. First-100-visible-words quotes are from `reports/audit/tools/corpus/<safe>.txt`.

**Test definition — PASS** = the page's core data story (computed effect radii and/or substantive factual prose) is present in the server HTML as real text/tables, so a non-JS crawler gets the answer. **FAIL** = server HTML is only an empty interactive-tool/map shell with no data.

---

## Summary Table

| Template | URL tested | Answer block? | Real data table? | Radii in HTML? | Methodology/prose? | Verdict |
|---|---|---|---|---|---|---|
| home | `/` | FAQ `<details>` Q&A only | No (0 `<table>`) | **No** (only weapon-yield kt in dropdown) | Partial (FAQ prose) | **FAIL** (tool shell) |
| weapon | `/weapons/tsar-bomba` | Yes (Overview) | Yes (1 table, air/surface) | **Yes** (10.99–104.12 km) | Yes | **PASS** |
| city | `/examples/houston` | Yes (About Houston) | Yes (4 tables) | **Yes** (0.43–13.39 km + casualties) | Yes (links methodology) | **PASS** |
| scenario | `/scenarios/tsar-bomba-on-new-york` | Yes (About this scenario) | Yes (2 tables, air/surface) | **Yes** (10.99–909 km + casualties) | Yes | **PASS** |
| compare | `/compare/little-boy-vs-fat-man` | Yes (Verdict) | Yes (1 side-by-side table) | **Yes** (0.43–8.00 km + fatalities) | Yes | **PASS** |
| blog | `/blog/modern-nuclear-arsenals-2026` | Yes (lede) | No (prose article) | No (not applicable) | Yes (full article prose) | **PASS** |
| glossary | `/glossary/fireball` | Yes (definition) | No | No (not applicable) | Yes (definition + related terms) | **PASS** |
| hub | `/weapons` | Yes (intro) | Yes (3 directory tables) | No (lists yields, not radii) | Yes (intro prose) | **PASS** |
| legal | `/methodology` | Yes | Yes (1 table) | Formulas + example radii (0.33/0.41 km) | Yes (full formula prose) | **PASS** |

**8 of 9 templates PASS. The home page (the primary ranking target / brand term) is the only FAIL — it is a pure tool shell.**

---

## home — `/` — **FAIL (empty tool shell)**

- **(a) Direct-answer block:** Partial. No computed-result block; there IS an FAQ section of `<details><summary>` Q&A rendered in HTML (e.g. "How accurate is the nuclear blast simulator?" → *"The simulator uses scaling-law formulas from 'The Effects of Nuclear Weapons' (Glasstone & Dolan, 1977)…"*). This is the only substantive answer content.
- **(b) Real data table:** **No.** `grep '<table'` = 0.
- **(c) Computed effect radii in HTML:** **No.** 0 occurrences of a numeric `km` value. The 25 `radius` hits are all in the `<title>`, meta description, keywords, OG/Twitter tags and JSON-LD `featureList` — i.e. marketing/schema chrome, not rendered data. The only visible numbers are the weapon-selector dropdown yields (`50,000 kt`, `15 kt`, …).
- **(d) Methodology/prose:** Only the FAQ answers (marketing/explanatory), no effect data.
- **(e) Empty map/tool shell:** **Yes** — server HTML contains `<div class="text-green-400">Initializing map...</div>` plus the empty target/weapon-picker controls. The map is `ssr:false`, so JS-off = blank map + idle form. No detonation result is computable without JS.
- **First 100 words:** *"Nuclear Blast Simulator — Interactive Nuke Map & Blast Radius Calculator · Initializing map... · Target Location · Click map to select · Selected Weapon · No weapon selected · Select Weapon · ☢️ Choose a bomb... · 🇷🇺 Tsar Bomba (50,000 kt) · 🇺🇸 Castle Bravo (15,000 kt) …"* (the rest is the weapon dropdown list).

**Verdict: FAIL.** The flagship URL exposes no answer and no numbers to a non-JS crawler — just the tool chrome and a map placeholder. All the site's data value lives on the detail templates below, not on `/`.

---

## weapon — `/weapons/tsar-bomba` — **PASS**

- (a) Yes — "Overview" direct-answer block. (b) Yes — 1 real `<table>` (4 `<th>`, 21 `<td>`) with Air burst / Surface burst columns. (c) **Yes** — fireball 10.99 km, severe 17.13 km, moderate 36.60 km, light 104.12 km, 3rd° 56.58 km, 2nd° 101.33 km, surface-burst column, fallout ~909.4 km. (d) Yes — cites Glasstone & Dolan 1977 and explains air vs surface burst.
- **First 100 words:** *"Overview · Largest nuclear weapon ever tested. With a yield of 50 megatons, the Tsar Bomba is 3,333× more powerful than the Hiroshima bomb. As a thermonuclear (hydrogen bomb) weapon, it derives its energy from a fission primary that ignites a much larger fusion secondary stage. Tsar Bomba Blast Effects · The table below shows the calculated radius of each effect zone for an air burst … and a surface burst … Formulas are scaling laws from The Effects of Nuclear Weapons (Glasstone & Dolan, 1977). Effect zone / Air burst / Surface burst / Fireball radius 10.99 km 8.79 km …"*

**Verdict: PASS** — full data story (prose + table + radii) in server HTML.

---

## city — `/examples/houston` — **PASS**

- (a) Yes — "About Houston" block. (b) Yes — 4 `<table>`s (16 `<th>`, 60 `<td>`), one per scenario weapon. (c) **Yes** — radii 0.43–13.39 km plus per-zone estimated-affected counts (e.g. Fireball 0.43 km ~865; Light blast 7.16 km ~10,590). (d) Yes — explains density-based estimates and links the methodology page.
- **First 100 words:** *"About Houston · The largest city in Texas and home to the United States' largest medical center and a major energy industry hub. Below are four scenario calculations using historical and modern nuclear weapons. Each row shows the radius of an effect zone in kilometers and a rough order-of-magnitude estimate of people inside that zone … Numbers are educational approximations — see the methodology page … Little Boy on Houston (15 kt) · USA · 1945 · Hiroshima bomb · Effect zone / Radius / Est. affected · Fireball (vaporization, 100% fatal) 0.43 km ~865 …"*

**Verdict: PASS.**

---

## scenario — `/scenarios/tsar-bomba-on-new-york` — **PASS**

- (a) Yes — "About this scenario" block. (b) Yes — 2 `<table>`s (air-burst + surface-burst; 7 `<th>`, 30 `<td>`). (c) **Yes** — radii 10.99–104.12 km, surface values, fallout ~909 km, plus large casualty counts per zone (e.g. ~3,793,690). (d) Yes — explains the weapon, city density (~10,000/km²), and air vs surface burst.
- **First 100 words:** *"About this scenario · This page calculates what would happen if the Tsar Bomba (USSR, 1961) detonated over New York (USA). Largest nuclear weapon ever tested. The most populous city in the United States and a global financial capital … about 10,000 people per km² … The Tsar Bomba delivers 50 Mt of explosive yield — 3,333× more powerful than the Hiroshima bomb. The tables below show calculated effect radii for an air burst … and a surface burst (which produces massive fallout). Air-burst effects (Tsar Bomba over New York) · Effect zone / Radius / Est. affected …"*

**Verdict: PASS.**

---

## compare — `/compare/little-boy-vs-fat-man` — **PASS**

- (a) Yes — "Verdict" direct-answer block. (b) Yes — 1 side-by-side `<table>` (4 `<th>`, 21 `<td>`). (c) **Yes** — both weapons' radii (fireball 0.43/0.49 km … light 7.16/8.00 km … 2nd° 3.64/4.18 km) plus immediate-fatality estimates (~96,377 etc.). (d) Yes — context prose per weapon.
- **First 100 words:** *"Little Boy · USA · 1945 · pure fission · 15 kt · Hiroshima bomb. Fat Man · USA · 1945 · pure fission · 21 kt · Nagasaki bomb. Verdict · The Fat Man is 1.4× more powerful than the Little Boy by yield. Both weapons are described in detail below, with side-by-side blast and thermal radii, casualty estimates at a reference urban density, and historical context. Blast & thermal effects (air burst) · Effect zone / Little Boy / Fat Man · Yield 15 kt 21 kt · Fireball radius 0.43 km 0.49 km …"*

**Verdict: PASS.**

---

## blog — `/blog/modern-nuclear-arsenals-2026` — **PASS**

- (a) Yes — article lede IS the direct answer. (b) No table (prose article — not expected). (c) No computed effect radii (not applicable to this template; it is an editorial article, and it cites arsenal figures instead). (d) **Yes** — full article prose rendered server-side.
- **First 100 words:** *"As of early 2026, nine states are believed to possess nuclear weapons: the United States, Russia, China, the United Kingdom, France, India, Pakistan, North Korea, and Israel (which has never officially confirmed). Their combined warhead inventory is approximately 12,500 — down from a Cold War peak of around 70,000 in 1986, but climbing again as China, Russia, and North Korea modernize and expand. Estimates draw on SIPRI, FAS, and Bulletin of the Atomic Scientists. The big two: the United States and Russia … roughly 89% of the world's nuclear weapons. Russia's arsenal is estimated at about …"*

**Verdict: PASS** — complete article text in server HTML.

---

## glossary — `/glossary/fireball` — **PASS**

- (a) Yes — the definition is the direct answer. (b) No table (not applicable). (c) No numeric radii, but it states the scaling relationship in prose ("Fireball radius scales roughly with yield to the 0.4 power"). (d) **Yes** — definition + "Related terms" cross-links rendered server-side.
- **First 100 words:** *"The fireball forms within microseconds of a nuclear detonation as the X-ray flux from the bomb superheats the surrounding air into plasma. Within the fireball radius, everything is vaporized; the plasma sphere also acts as the source of the thermal radiation pulse and the initial blast wave. Fireball radius scales roughly with yield to the 0.4 power. Related terms · Thermal Radiation · The intense pulse of light and infrared radiation emitted by the fireball … Overpressure · The pressure above atmospheric pressure produced by the blast wave … (PSI). Air Burst · A nuclear detonation above the ground at optimal altitude …"*

**Verdict: PASS.**

---

## hub — `/weapons` — **PASS**

- (a) Yes — intro block. (b) Yes — 3 directory `<table>`s (21 `<th>`, 90 `<td>`): columns Weapon / Country / Year / Yield / Type / Historical Use (and Notes). (c) No computed effect radii here (hub lists weapon yields, not blast radii — by design it links out to the per-weapon pages that carry the radii). (d) Yes — intro prose.
- **First 100 words:** *"Nuclear Weapons Database · Historical Educational Data · This database contains historical information about nuclear weapons for educational purposes only. Data is compiled from declassified sources and public research. Browse All 44 Weapons · Click any weapon for its detailed profile, including computed blast radius, thermal radiation effects, historical context, and a one-click simulator preset. Browse below by yield class — from sub-kiloton tactical devices to the 50-megaton Tsar Bomba. Multi-megaton (≥ 5 Mt) (8) · Tsar Bomba 50 Mt USSR · 1961 · B41 25 Mt USA · 1960 · Soviet Test 219 24.2 Mt USSR · 1962 …"*

**Verdict: PASS** — the directory table and all 44 weapon rows are in server HTML.

---

## legal — `/methodology` — **PASS**

- (a) Yes — "Scientific Methodology" block. (b) Yes — 1 `<table>` (3 `<th>`, 14 `<td>`). (c) Yes — formulas plus example radii (`0.33 km`, `0.41 km`). (d) **Yes** — full formula/explanatory prose rendered server-side.
- **First 100 words:** *"Scientific Methodology · Blast Effect Calculations · The simulator uses scientifically validated scaling-law formulas derived from nuclear weapons testing data and the seminal work The Effects of Nuclear Weapons by Glasstone & Dolan (3rd edition, 1977). All formulas express radius as a function of weapon yield in kilotons. Fireball Radius · Radius (km) = 0.28 × Yield^0.33 · The fireball vaporizes everything within this radius. Temperatures exceed 10 million°C … Air Blast Zones · 20 PSI (Severe): 0.28 × Yield^0.33 km … 5 PSI (Moderate): 1.03 × Yield^0.33 km … 1 PSI (Light): 2.93 × Yield^0.33 km …"*

**Verdict: PASS** for the JS-off visibility test (formulas and table are fully in server HTML).

> **Side note (out of scope for the JS-off test, flagged for the factual-accuracy phase — do NOT fix here):** the formulas *printed* on `/methodology` do not match the confirmed effects engine. The page shows Fireball `0.28 × Yield^0.33` and Severe blast `0.28 × Yield^0.33`, whereas `blast.ts:6-7,16` uses Fireball `0.145·W^0.4` and Severe `0.482·W^0.33`. So the published methodology both disagrees with the code and self-duplicates fireball = severe-blast. This is a content-accuracy defect, not a visibility defect.

---

## Bottom line
JS-off server HTML is strong on every **detail/content template** — weapon, city, scenario, compare, blog, glossary, hub and methodology all ship their full data story (prose + tables + computed radii/casualties) without JS. The single failure is the **home page `/`**, which is a pure interactive-tool shell ("Initializing map…" + empty form) with no computed numbers and no table — the one URL whose data value is entirely JS-gated.
