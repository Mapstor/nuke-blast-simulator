# NBS-002 Phase 4 — Effects Engine Audit (`engine.md`)

READ-ONLY audit. No source was modified. All file:line references are to the code as read on 2026-10-15.

The effects engine lives entirely in `src/lib/calculations/blast.ts`. `thermal.ts` and `fallout.ts` are pure re-export shims (they add nothing):

- `src/lib/calculations/fallout.ts:3-5` — `import { calculateFallout } from './blast'; export { calculateFallout }`
- `src/lib/calculations/thermal.ts:3-5` — `import { calculateThermalRadiation } from './blast'; export { calculateThermalRadiation }`

Casualties live in `src/lib/calculations/casualties.ts`. Display constants live in `src/lib/data/constants.ts`.

---

## 1) Every effect formula and constant (file:line, units, burst handling)

All radii are in **kilometers**, computed as a function of **yield in kilotons (`yieldKt`)**. Burst handling is a flat multiplier, never an altitude-dependent model.

### Fireball — `blast.ts:3-8`
```
const baseRadius = 0.145 * Math.pow(yieldKt, 0.4)            // blast.ts:6
return burstType === 'surface' ? baseRadius * 0.8 : baseRadius  // blast.ts:7
```
- Formula: **R_fireball = 0.145 · W^0.4 km**
- Surface multiplier: **×0.8**; air: ×1.0 (default).

### Air blast (overpressure) — `blast.ts:10-20`
```
const multiplier = burstType === 'surface' ? 0.55 : 1.0      // blast.ts:13
severe:   0.482 * Math.pow(yieldKt, 0.33) * multiplier  // 20 PSI   blast.ts:16
moderate: 1.03  * Math.pow(yieldKt, 0.33) * multiplier  //  5 PSI   blast.ts:17
light:    2.93  * Math.pow(yieldKt, 0.33) * multiplier  //  1 PSI   blast.ts:18
```
- Severe (20 PSI): **0.482 · W^0.33 km**
- Moderate (5 PSI): **1.03 · W^0.33 km**
- Light (1 PSI): **2.93 · W^0.33 km**
- Surface multiplier: **×0.55** on all three; air: ×1.0.

### Thermal radiation (burns) — `blast.ts:22-31`
```
const multiplier = burstType === 'surface' ? 0.6 : 1.0       // blast.ts:25
thirdDegree:  0.67 * Math.pow(yieldKt, 0.41) * multiplier  // blast.ts:28
secondDegree: 1.2  * Math.pow(yieldKt, 0.41) * multiplier  // blast.ts:29
```
- 3rd-degree burns: **0.67 · W^0.41 km**
- 2nd-degree burns: **1.2 · W^0.41 km**
- Surface multiplier: **×0.6**; air: ×1.0.

### Fallout — `blast.ts:33-44`
```
if (burstType === 'air')  return 0.1  * Math.pow(yieldKt, 0.2)   // blast.ts:38
else                       return 12.0 * Math.pow(yieldKt, 0.4)  // blast.ts:42
```
- Air burst: **R = 0.1 · W^0.2 km** (effectively negligible — e.g. 100 kt → 0.25 km).
- Surface burst: **R = 12.0 · W^0.4 km** (branch, not a multiplier — a wholly different equation).
- Note the two branches cross-over scale completely differently; this is a lethal-zone-near-GZ radius, not a downwind plume.

### Crater
- **No crater formula exists anywhere in the engine.** A crater is *mentioned* in prose only (FAQ `faq/page.tsx:34,180` "Creates large crater"; comments `blast.ts:12`), but no `calculateCrater`/crater radius is ever computed or rendered.

### Radiation (prompt/initial nuclear radiation)
- **No initial/prompt-radiation (neutron/gamma dose) formula exists.** The only "radiation" modeled is the fallout *radius* above. FAQ/how-it-works prose references EMP, initial radiation, nuclear winter — none are computed.

### Casualty mortality / injury rates
- `calculateNuclearCasualties` zone rates — `casualties.ts:106-153`: Fireball mort 1.0/inj 0.0; Severe 0.98/0.02; Moderate 0.50/0.40; Light 0.05/0.45; 3rd° 0.95/0.05; 2nd° 0.20/0.70; Fallout surface 0.50/0.40, air 0.10/0.20.
- `calculateConventionalCasualties` — `casualties.ts:56-89`: blastRadius `0.8·W^0.33` (`:63`), severeRadius `0.3·W^0.33` (`:64`), fragmentationRadius `1.2·W^0.33` (`:65`); Direct-blast 0.95/0.05, Severe 0.60/0.35, Fragmentation 0.15/0.50.
- Legacy `MORTALITY_RATES` — `casualties.ts:238-246`: fireball 1.0, severe 0.98, moderate 0.50, light 0.05, thermal3rd 0.95, thermal2nd 0.20, **fallout 0.30** (unused by the live path; only relevant because `/methodology` publishes "fallout 30%").

### Display / map constants — `constants.ts`
- `DEFAULT_MAP_CENTER = { lat: 40.7128, lng: -74.0060 }` (NYC) — `constants.ts:3-6`. (Note: the store overrides this with geographic-center-of-USA `{39.8283,-98.5795}` at `simulatorStore.ts:63`.)
- `DEFAULT_MAP_ZOOM = 10` — `constants.ts:8`. (Store overrides with `zoom: 3.5` at `simulatorStore.ts:64`.)
- `BLAST_COLORS` — `constants.ts:10-17`: fireball `#ff0000`, severe `#ff6600`, moderate `#ff9900`, light `#ffcc00`, thermal `#cc00ff`, fallout `#00cc66`.
- `BLAST_OPACITY` — `constants.ts:19-26`: fireball 0.5, severe 0.4, moderate 0.3, light 0.2, thermal 0.2, fallout 0.15.
- **Color mismatch vs. prose:** `BLAST_COLORS.fireball = #ff0000` (red) and `.severe = #ff6600` (orange), but `/how-it-works` and `/faq` prose say fireball = **yellow `#ffff00`**, severe = **red `#ff0000`**, moderate = **orange `#ff8800`**, light = **gray `#808080`** (`how-it-works/page.tsx:103,110,117,124`; `faq/page.tsx:191,198,205,212`). The legend colors on those pages are hardcoded and do **not** import `BLAST_COLORS`, so the documented legend does not match the constants the map actually uses.

---

## 2) Consumer table — effect → formula → every consumer, and SSR vs client

`W` = yield in kt. "SSR" = value present in server-rendered HTML (verified against `reports/audit/tools/corpus/*.txt`). Four static page templates all call `blast.ts` **at build/server render time** and emit `.toFixed(2)` km strings into HTML. The home-page interactive tool computes the same numbers **client-side only** (zero km radii in `corpus/home.txt`).

| Effect | Formula (file:line) | Consumers | SSR? |
|---|---|---|---|
| Fireball | `0.145·W^0.4`×{1,0.8} `blast.ts:6-7` | Weapons table `weapons/[slug]/page.tsx:130-131,247-248`; weapon FAQ `:148`; Examples table `examples/[slug]/page.tsx:112,249`; Examples FAQ `:167`; Scenario tables `scenarios/[scenario]/page.tsx:116-117,257,311`; Scenario FAQ `:158,167,173`; Compare table `compare/[slug]/page.tsx:117-118,261`; interactive `ResultsPanel.tsx:38` via store | **Yes** (all 4 templates); home = **client only** |
| Severe 20 PSI | `0.482·W^0.33`×{1,0.55} `blast.ts:16` | Weapons `:132-133,252-253`; weapon FAQ `:148` (moderate/light only); Examples `:113,254`; Scenario `:118-119,262,312`; Scenario FAQ `:167,173`; Compare `:119-122,262`, Compare FAQ `:154`; `ResultsPanel.tsx:50` | **Yes**; home client |
| Moderate 5 PSI | `1.03·W^0.33`×{1,0.55} `blast.ts:17` | same tables; Weapons FAQ `:148`; Examples FAQ `:145,148`; Scenario FAQ `:159,167,173`; Compare FAQ `:153`; `ResultsPanel.tsx:62` | **Yes**; home client |
| Light 1 PSI | `2.93·W^0.33`×{1,0.55} `blast.ts:18` | same tables; Weapons FAQ `:148`; Scenario FAQ `:160,167,173`; `ResultsPanel.tsx:74` | **Yes**; home client |
| 3rd° thermal | `0.67·W^0.41`×{1,0.6} `blast.ts:28` | Weapons `:134-135,267-268`; weapon FAQ `:165`; Examples `:114,269`; Examples FAQ `:148,167`; Scenario `:120-121,277,315`; Scenario FAQ `:173`; Compare `:121-122,265`, Compare FAQ `:155`; `ResultsPanel.tsx:86` | **Yes**; home client |
| 2nd° thermal | `1.2·W^0.41`×{1,0.6} `blast.ts:29` | Weapons `:271-273`; weapon FAQ `:165`; Scenario `:281-283`; Compare `:266`; `ResultsPanel.tsx:98` | **Yes**; home client |
| Fallout | air `0.1·W^0.2` / surf `12.0·W^0.4` `blast.ts:38,42` | Weapons surface col `:136,276-278`; Scenario surface table + FAQ `:122,316,174`; `ResultsPanel.tsx:102` (only if `blastCircles.fallout` present) | **Yes** (weapons/scenarios surface); home client |
| Casualties | `π·r²·density·mortality` differenced across rings — see §3 | Examples `:116-120`, Examples FAQ `:145,148,156,159`; Scenario `:125-136`, Scenario FAQ `:161,166-167`, body `:289-291`; Compare `:125-132`, Compare FAQ `:160-161`, body `:283,288`; interactive path `calculateDensityBasedCasualties` `casualties.ts:36-41` (overlapping, non-differenced) | **Yes** (example/scenario/compare); home client |
| BLAST_COLORS / BLAST_OPACITY | `constants.ts:10-26` | map overlay components (client) | client only |

**Meta descriptions:** none embed computed radii — they use yield text, country, population, density only (`weapons/[slug]/page.tsx:98-101`, `examples/[slug]/page.tsx:78-79`, `scenarios/[scenario]/page.tsx:93-94`, `compare/[slug]/page.tsx:90-91`).

**JSON-LD:** `articleSchema` + `faqPageSchema` + `breadcrumbSchema` on every template. The FAQ answers that **do** contain radii (weapon `:144-168`, examples `:139-176`, scenario `:154-180`, compare `:142-177`) are serialized verbatim into `faqPageSchema` → radii are published as structured data. `/methodology` additionally publishes a `howToSchema` whose step text contains formulas (see §5 — these are the **wrong** formulas).

**OG images** (`og.tsx` + 4 `opengraph-image.tsx`): render **no computed radii** — only yield (`formatYieldShort`), city population, and density. `og.tsx:209-213`, `weapons/.../opengraph-image.tsx:25`, `examples/...:25-26`, `scenarios/...:30-31`, `compare/...:29-30`.

**Interactive tool path:** `HomeClient.tsx` is `'use client'`; `simulatorStore.calculateBlastEffects` (`simulatorStore.ts:106-125`) `require`s `calculateBlastResults` and stores results in `blastCircles`; `ResultsPanel.tsx:38-102` renders the radii. All client-side — confirmed 0 km radii in `corpus/home.txt`.

---

## 3) Casualty model — overlapping-concentric double-count & hardcoded density

**Two different casualty code paths exist, and they double-count in two different ways.**

**(a) Engine path — `calculateDensityBasedCasualties` (`casualties.ts:27-53`), used by the interactive tool via `calculateNuclearCasualties`/`calculateBlastResults`.** For every zone independently:
```
const area = Math.PI * Math.pow(zone.radius, 2)   // casualties.ts:37
const totalPopulation = Math.round(area * density)            // :38
const fatalities       = Math.round(totalPopulation * zone.mortalityRate)  // :39
const survivorsWithInjuries = Math.round(totalPopulation * zone.injuryRate) // :40
```
The zones (`casualties.ts:106-153`) are **overlapping concentric disks** — fireball, severe, moderate, light, 3rd°, 2nd°, fallout — each the **full `π·r²` disk from ground zero**, not an annulus. Because the light-blast disk (`2.93·W^0.33`) contains the moderate disk contains the severe disk contains the fireball, and the thermal disks overlap all of them, a single person near GZ is counted in **every** zone they fall inside. Summing zone casualties therefore **double/triple/…-counts** the same population (up to ~7× near the center). Nothing in `calculateNuclearCasualties` subtracts inner rings; the live engine path has no de-overlap step.

**(b) Page-template path — `fatalitiesIn()` / `estimateFatalities()`** (`scenarios/[scenario]/page.tsx:78-81`, `compare/[slug]/page.tsx:75-78`, `examples/[slug]/page.tsx:64-67`). These authors *noticed* the overlap and hand-rolled a **ring-differencing** scheme, e.g. scenario `:126-135`:
```
severeDeaths   = max(0, fatalitiesIn(severe, d, 0.98) - fireballDeaths)
moderateDeaths = max(0, fatalitiesIn(moderate, d, 0.5) - fatalitiesIn(severe, d, 0.5))
lightInjured   = max(0, fatalitiesIn(light, d, 0.05) - fatalitiesIn(moderate, d, 0.05))
```
This subtracts the inner disk from the outer, so the displayed per-ring numbers do **not** double-count blast zones — **but it is inconsistent with the engine (a)**, and it still **ignores thermal overlap entirely** (thermal 3rd°/2nd° deaths are never added into the fatality total: scenario `fatalitiesTotal = fireball+severe+moderate`, `:136`, omits thermal, even though 3rd° burns at 95% mortality would kill people the blast rings missed). So the two code paths produce **different casualty numbers for the same weapon+density**, and neither is internally consistent with the mortality table on `/methodology`.

**Hardcoded default density.** `calculateConventionalCasualties` (`casualties.ts:60`) and `calculateNuclearCasualties` (`casualties.ts:97`) both default `density = 10000` people/km². The interactive tool reaches the engine via `calculateBlastResults` (`casualties.ts:159-235`), which **returns all casualty fields hardcoded to 0** (`:169-171, 229-233` etc.) — i.e. the live simulator's `ResultsPanel` shows **radii only; casualty counts are structurally zeroed**, never populated from density. The page templates bypass this and compute casualties themselves using the **city's own density** (`city.density`, e.g. `scenarios/[scenario]/page.tsx:125`) or a fixed `REFERENCE_DENSITY = 8000` on compare pages (`compare/[slug]/page.tsx:27`). So "10,000/km²" is the dead default; the numbers users actually see come from `city.density` (scenario/examples) or 8,000 (compare).

---

## 4) Confirm each chat finding against the code (quoted)

1. **Fireball `0.145·W^0.4`** — CONFIRMED. `blast.ts:6`: `const baseRadius = 0.145 * Math.pow(yieldKt, 0.4)`.
2. **Blast `0.482 / 1.03 / 2.93 · W^0.33`** — CONFIRMED. `blast.ts:16-18`: `0.482 * Math.pow(yieldKt, 0.33)` / `1.03 * Math.pow(yieldKt, 0.33)` / `2.93 * Math.pow(yieldKt, 0.33)`.
3. **3rd° thermal `0.67·W^0.41`** — CONFIRMED. `blast.ts:28`: `0.67 * Math.pow(yieldKt, 0.41)` (2nd° `1.2·W^0.41` at `:29`).
4. **Casualties = density × ring-area × mortality** — CONFIRMED. `casualties.ts:37-39`: `area = Math.PI * Math.pow(zone.radius, 2)` → `totalPopulation = Math.round(area * density)` → `fatalities = Math.round(totalPopulation * zone.mortalityRate)`. Overlapping concentric disks summed → double-count (§3). Default density 10000 at `casualties.ts:60,97`.
5. **Burst multipliers** — CONFIRMED: fireball ×0.8 (`blast.ts:7`), blast ×0.55 (`blast.ts:13`), thermal ×0.6 (`blast.ts:25`), fallout surface branch `12.0·W^0.4` (`blast.ts:42`).

---

## 5) METHODOLOGY / CODE MISMATCH (the headline finding)

The engine computes radii one way; **`/methodology` tells the public a different, inconsistent set of formulas** — and both the visible page AND the `howToSchema` JSON-LD publish the wrong numbers. These are *stated claims that the code does not use*:

**MM-1 (P0) — Fireball formula on `/methodology` is wrong and inconsistent with the code and with the rest of the site.**
- `/methodology` says **`Radius (km) = 0.28 × Yield^0.33`** — `methodology/page.tsx:20` (step text) and `:79` (visible `<code>`): `Radius (km) = 0.28 × Yield` `<sup>0.33</sup>`. Confirmed in SSR (`corpus/methodology.txt`: "Fireball RadiusRadius (km) = 0.28 × Yield0.33").
- The code uses **`0.145 × Yield^0.4`** (`blast.ts:6`). These differ in both coefficient **and exponent**. For Tsar Bomba (50 Mt) the code/weapon page renders **10.99 km** (verified `0.145·50000^0.4 = 10.99`, matches `corpus/weapons__tsar-bomba.txt`) while `/methodology` implies **9.95 km** (`0.28·50000^0.33`). The methodology formula contradicts the numbers on every weapon/scenario page.
- The *correct* code formula **is** quoted on `/faq` (`faq/page.tsx:310`: "Fireball radius = 0.145 × Yield^0.4 km") — so the site contradicts **itself**: `/faq` says `0.145·W^0.4`, `/methodology` says `0.28·W^0.33`.

**MM-2 (P0) — Severe (20 PSI) formula on `/methodology` is wrong.**
- `/methodology` says **20 PSI severe = `0.28 × Yield^0.33`** — step text `methodology/page.tsx:24` and visible list `:92`. This makes severe-blast **identical to the (wrong) fireball** radius and ~1.7× smaller than what the code emits.
- Code uses **`0.482 × Yield^0.33`** (`blast.ts:16`). `/faq` again has the correct value (`faq/page.tsx:311`: "Severe blast = 0.482 × Yield^0.33 km"). So `/methodology` disagrees with both the code and `/faq`.
- (Moderate `1.03·W^0.33`, light `2.93·W^0.33`, 3rd° `0.67·W^0.41`, 2nd° `1.2·W^0.41` on `/methodology` `:24,28,96,100,110,114` **do** match the code.)

**MM-3 (P1) — The wrong formulas are also emitted as structured data.** `/methodology`'s `calculationSteps` array (`methodology/page.tsx:17-38`) is passed verbatim into `howToSchema(... steps: calculationSteps)` (`:52-57`), which serializes each step's `text` into `HowToStep.text` JSON-LD (`schemas.ts:184-188`). So Google/LLMs ingest `fireball = 0.28·W^0.33` and `severe = 0.28·W^0.33` as machine-readable claims — compounding MM-1/MM-2 beyond the visible page.

**MM-4 (P1) — `/methodology` claims a population grid that does not exist.** `methodology/page.tsx:36`: "Density is sampled from a precomputed global population grid for the detonation point and surrounding area." No such grid exists in the engine. `calculateDensityBasedCasualties` takes a **single scalar `density`** (`casualties.ts:27`); page templates pass one hardcoded number (`city.density`, or `REFERENCE_DENSITY = 8000`, or the dead default `10000`). There is no per-cell sampling anywhere.

**MM-5 (P1) — `/methodology` publishes a fallout mortality (30%) the live engine never uses, and omits the engine's actual fallout rates.** Methodology table `methodology/page.tsx:32,141` lists "Fallout (24–48h) 30%". The engine's fallout mortality is **0.50 (surface) / 0.10 (air)** (`casualties.ts:150`); 0.30 only appears in the unused legacy `MORTALITY_RATES.fallout` (`casualties.ts:245`). The casualty-math prose (`methodology/page.tsx:36`, `π × radius² × density × mortality_rate`) matches the code shape but **omits that zones are summed as overlapping disks** (the double-count in §3), so the stated method understates nothing but misrepresents how totals are formed.

**MM-6 (P1) — `/faq` and `/how-it-works` claim "all calculations run locally in your browser," which is false for the 498 static pages.** `faq/page.tsx:73-74` ("All blast calculations run locally in your browser … never transmitted to our servers") and `:367`, plus `how-it-works/page.tsx:32`. True only for the home interactive tool (`HomeClient` client path). Every weapon/examples/scenario/compare page computes its radii and casualties **server-side at build time** (`blast.ts`/`casualties.ts` invoked in async server components) and ships them baked into the HTML (verified in corpus). The privacy claim is correct for *user-chosen* detonations on the map, but the blanket "all calculations run locally" is contradicted by the SSR pipeline.

**MM-7 (P2) — Legend color claims contradict `BLAST_COLORS`.** `/how-it-works` and `/faq` document the map legend as fireball **yellow**, severe **red**, moderate **orange `#ff8800`**, light **gray `#808080`** (`how-it-works/page.tsx:103-126`; `faq/page.tsx:191-215`), but `constants.ts:10-16` defines fireball **red `#ff0000`**, severe **orange `#ff6600`**, moderate `#ff9900`, light `#ffcc00`. The legend swatches are hardcoded literals, not imports of `BLAST_COLORS`, so the documented legend is one palette and the live map another.

**MM-8 (P2) — `/how-it-works` claims a custom-yield range of 1–100,000 kt** (`how-it-works/page.tsx:20`) and air/surface burst; the engine imposes no such bounds (formulas accept any `yieldKt`), and the store default custom yield is 100 (`simulatorStore.ts:9,57`). Cosmetic claim, not enforced in the engine. Also note `/methodology`'s "10 million°C" and `/how-it-works` "temperatures exceed 10 million°C" are prose only — no temperature is ever computed.

**No fallout/crater/EMP/initial-radiation engine to mismatch:** FAQ/how-it-works describe EMP, nuclear winter, initial radiation, cratering, and downwind fallout plumes (`faq/page.tsx:44,49,34`; `how-it-works/page.tsx:45`), none of which the engine computes — the only "radiation" output is the fallout *radius* (§1).

---

## P0 / P1 / P2 engine findings

**P0**
- MM-1: `/methodology` fireball formula `0.28·W^0.33` contradicts code `0.145·W^0.4` (`methodology/page.tsx:20,79` vs `blast.ts:6`) and contradicts `/faq`.
- MM-2: `/methodology` severe-blast formula `0.28·W^0.33` contradicts code `0.482·W^0.33` (`methodology/page.tsx:24,92` vs `blast.ts:16`); also makes severe == fireball.
- Casualty overlapping-concentric double-count: engine sums full `π·r²` disks per zone with no ring-differencing (`casualties.ts:37-41,106-156`) → population counted up to ~7× near GZ.

**P1**
- MM-3: wrong fireball/severe formulas serialized into `howToSchema` JSON-LD (`methodology/page.tsx:52-57` → `schemas.ts:184-188`).
- MM-4: "precomputed global population grid" claim is fictional; engine uses a single scalar density (`methodology/page.tsx:36` vs `casualties.ts:27`).
- MM-5: methodology fallout mortality 30% is unused legacy; live engine uses 0.50/0.10 (`methodology/page.tsx:32,141` vs `casualties.ts:150,245`).
- MM-6: "all calculations run locally in your browser" false for the 4 SSR templates (`faq/page.tsx:73`, `how-it-works/page.tsx:32`).
- Two divergent casualty paths: engine path zeros casualties in `calculateBlastResults` (`casualties.ts:169-233`) while page templates re-derive with ring-differencing and omit thermal (`scenarios/[scenario]/page.tsx:126-136`) → inconsistent numbers, thermal deaths dropped from totals.

**P2**
- MM-7: documented legend colors ≠ `BLAST_COLORS` (`how-it-works/page.tsx:103-126`, `faq/page.tsx:191-215` vs `constants.ts:10-16`).
- MM-8: custom-yield "1–100,000 kt" and "10 million°C" are unenforced/uncomputed prose claims.
- Dead/unused code: `thermal.ts`/`fallout.ts` are pass-through shims; `calculateCasualties` (`casualties.ts:15-24`) and `MORTALITY_RATES` (`:238`) are legacy; `DEFAULT_MAP_CENTER`/`DEFAULT_MAP_ZOOM` overridden by store (`constants.ts:3-8` vs `simulatorStore.ts:63-64`).
- No crater, EMP, initial-radiation, or temperature formula exists despite prose describing them.
