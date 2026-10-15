# NBS-003 INTEGRITY — fix wave 1 report

_Date: 2026-10-15 · Repo: nuke-blast-simulator (branch master) · Scope: the code-side P0s from `reports/audit/SUMMARY.md` — effects engine, casualty/fallout withdrawal, methodology, fabricated author, privacy-vs-stack, robots `/_next/`, phantom ads.txt._

## 1. Effects engine — radii before → after

One shared module now owns every radius: `src/lib/calculations/effects.ts` (+ flags in `config.ts`). `blast.ts`/`thermal.ts`/`fallout.ts` are re-export shims; `casualties.ts`'s `calculateBlastResults` delegates to the engine. No radius coefficient or scaling table lives anywhere else (grep: `Math.pow(.*0\.(145|28|482|67|41))` → 0 hits in rendered code).

- **Fireball**: `0.145·W^0.4` → **`0.061·W^0.4`** (the §2.127 value was the contact-surface breakaway coefficient read as metres; corrected to the max air-burst fireball ≈ 2× breakaway).
- **Blast (20/5/1 psi) & thermal (1st/2nd/3rd°)**: power laws → **log-log interpolation through the Wikipedia "Effects of nuclear explosions" scaling table** (knots 1/20/1000/20000 kt), end-segment slope extended beyond the range.

Displayed radii (km), OLD → NEW:

| weapon | fireball | 20 psi | 5 psi | 1 psi | 3rd° burns |
|---|---|---|---|---|---|
| Little Boy 15 kt | 0.43 → **0.18** | 1.18 → **0.54** | 2.52 → **1.54** | 7.16 → **4.26** | 2.03 → **2.18** |
| Fat Man 21 kt | 0.49 → **0.21** | 1.32 → **0.61** | 2.81 → **1.73** | 8.00 → **4.78** | 2.33 → **2.55** |
| W76 100 kt | 0.91 → **0.38** | 2.20 → **1.06** | 4.71 → **2.89** | 13.4 → **7.98** | 4.43 → **4.77** |
| B83 1.2 Mt | 2.47 → **1.04** | 5.00 → **2.55** | 10.7 → **6.59** | 30.4 → **18.1** | 12.3 → **12.9** |
| Tsar Bomba 50 Mt | 11.0 → **4.62** | 17.1 → **8.64** | 36.6 → **23.1** | 104.1 → **64.1** | 56.6 → **54.1** |

Blast/fireball radii fell ~1.6–2.4× (fireball ~2.4×), matching the audit's benchmark gap. Thermal 3rd-degree barely moved (the old `0.67·W^0.41` already tracked the benchmark). **Note:** the brief listed Tsar 1 psi as 64.2 km; faithful log-log interpolation of the 17→47 km segment yields 64.14 → **64.1** to one decimal — the same value rounded differently, not a formula error. All other benchmark values match the brief exactly. Verified by `tests/effects.test.ts` (11 tests, 0 skipped).

## 2. Withdrawal flags (`src/lib/calculations/config.ts`) — all `false`

Owner decision 2026-10-15: unverified outputs are hidden until chat verifies them.

| flag | hides | surfaces cleared |
|---|---|---|
| `CASUALTIES` | fatality/injured/affected counts | weapon (44), city (100), scenario (250), compare (30) pages; the tool's ResultsPanel + ShareButton; home SSR copy; all FAQ/meta/JSON-LD |
| `FALLOUT` | lethal-fallout radius / plume | weapon & scenario tables; tool map; ResultsPanel |
| `RADIATION` | prompt-radiation rings | (never implemented) |
| `CRATER` | crater dimensions | (never implemented) |
| `SURFACE_BURST` | surface-burst radii + the air/surface toggle | weapon/scenario tables (surface column/table removed); `BurstTypeSelector` removed from the tool |
| `CONVENTIONAL_EFFECTS` | nuclear-scaled radii for non-nuclear weapons | 15 conventional weapon pages; compare pages pairing a conventional weapon show yields only |

Built-HTML scan (in the test suite) confirms 0 pages contain `Est. affected`, `Estimated total fatalities`, `immediate fatalities`, `Lethal fallout zone`, `Radioactive Fallout`, `population-density-based casualty`, or `local population density`.

## 3. Conventional weapons removed from the simulator (CONVENTIONAL_EFFECTS)

Removed from the weapon picker and their effect radii hidden (spec/history kept): **FOAB, MOAB, Grand Slam, Tallboy, GBU-57 MOP, FAB-5000, Blockbuster, BLU-82 Daisy Cutter, OFAB-5000, GBU-28, Mark 84, FAB-500, JDAM, Mark 82, Halifax Explosion** (15). `/weapons/<conventional>` now shows an "Effect radii not shown" notice. Compare pages pairing a conventional weapon (`little-boy-vs-moab`, `little-boy-vs-foab`, `fat-man-vs-moab`) show yields + history only.

## 4. Methodology & FAQ

- `/methodology` rewritten to print exactly what the code runs: the `0.061·W^0.4` fireball relation, the scaling table (rendered from the engine's own `SCALING_TABLE_KM` so it cannot drift), the interpolation rule, and the air-burst assumption, with links to atomicarchive (Glasstone & Dolan ch.2) and the Wikipedia effects article. The **fictional "precomputed global population grid"** claim is deleted; the page states plainly that casualty/fallout estimates are not shown pending a verified model.
- The **HowTo schema** was removed from `/methodology` and `/how-it-works` (dead rich result since 2023; it had carried the wrong formulas).
- `/faq` formula answer updated to the new relations; the false "all calculations run locally / no tracking" answer corrected to disclose GA4 + Mapbox; mortality-% legend entries de-numbered.
- A test asserts the engine constants equal the benchmark the methodology page renders.

## 5. Author & publisher identity

- Fabricated **"NukeBlastSimulator Editorial"** persona replaced everywhere with **Marko Visic** (Person schema: `name`, `url` /about, `image`, `alumniOf` University of Ljubljana, `hasCredential` BSc Physics, `knowsAbout`, `sameAs` LinkedIn). MPharm is listed on /about prose only; no "registered/licensed" wording.
- Verified: **499/499 prerendered pages contain "Marko Visic"; 0 contain "Editorial".**
- Visible byline **"By Marko Visic, BSc Physics"** (links to /about) on blog, weapon, compare, city and methodology pages. Visible `rel="me"` LinkedIn link on /about; headshot `/images/marko-visic.jpeg` used.
- Publisher Organization → **Moving Data Systems d.o.o.**, Smolnik 62, 2342 Ruše, Slovenia; WebSite name → **Nuke Blast Simulator**. `/about` and `/contact` now state who runs the site + address + email; /about adds a "How this site is made" (AI-assisted, every figure checked against primary sources, author-reviewed) paragraph and drops the TPNW endorsement (neutral education framing; Peace Resources page kept). "Last reviewed: May 2026" removed.

## 6. Privacy & consent

- `/privacy` rewritten to name exactly the stack trust.md found: **GA4** (ID G-XDZQYKGTE2, cookies, purpose, opt-out), **Mapbox** (tiles; IP processed), **Vercel** (hosting logs); controller Moving Data Systems d.o.o. + address + email; GDPR rights + Slovenian IP complaint route; international-transfer note. The false "no tracking cookies / no opt-out required" claims are gone (and the matching line in `/terms`). Static "Last updated: 15 October 2026".
- **Consent**: Google Consent Mode v2 — `analytics_storage` default-denied for EEA/UK/CH via a client-side `Europe/*` timezone heuristic (no middleware), set before gtag.js loads (`src/components/Analytics.tsx`). Minimal accept/reject banner + footer "Cookie settings" button (`src/components/consent/ConsentManager.tsx`). Marked in code as interim — a CMP replaces it on ad-network acceptance.

## 7. Robots & ads.txt

- `src/app/robots.ts`: removed `Disallow: /_next/` from the `*` rule (kept `/api/`, `/admin/`); AI search/training bots unchanged. Generated `/robots.txt` no longer blocks `/_next/`. `check_robots.py` → `RESULT: OK (0 warnings, 7 info)`.
- ads.txt: deleted all three sources of `google.com, pub-3093026304369835` — `public/ads.txt`, legacy `api/ads.txt.js`, and the active `src/app/ads.txt/route.ts`. `/ads.txt` now returns **404** (reversible; Raptive supplies its own on acceptance).

## 8. Files changed

New: `src/lib/calculations/effects.ts`, `config.ts`; `src/components/Byline.tsx`, `src/components/consent/ConsentManager.tsx`; `tests/effects.test.ts`. Deleted: `public/ads.txt`, `api/ads.txt.js`, `src/app/ads.txt/route.ts`. Modified: the 4 effect templates + their hubs, home, about, contact, privacy, terms, methodology, how-it-works, faq, blog (index + article), layout, robots, Analytics, HomeClient, BombSelector, ResultsPanel, ShareButton, Footer, blog/articles.ts, schemas.ts, blast/thermal/fallout/casualties.ts, package.json (+vitest, test script). `.DS_Store` untracked (was tracked but gitignored).

## 9. Verification

- `npm run build` → exit 0 (503 static routes). `npm test` (vitest) → **11 passed, 0 skipped**.
- Built HTML: 0 "Editorial"; 499/499 pages "Marko Visic"; 0 withdrawn casualty/fallout strings; `/weapons/little-boy` shows 0.54 / 1.54 / 4.26 km + 0.18 km fireball; `/weapons/tsar-bomba` shows 8.64 / 23.1 / 64.1 km + 4.62 km fireball; `/robots.txt` has no `/_next/`; `/ads.txt` → 404.

## 10. Skipped / deferred (out of this wave)

- Tsar 1 psi displays **64.1** km (faithful), not the brief's 64.2 — documented above, not a defect.
- /scenarios → city 308 consolidation, facts.csv verification, title/meta length, mobile/impeccable P1s, cosmetic dates (datePublished/dateModified still build-time) — later waves (NBS-004+).
- Owner checks: confirm the deployed Vercel commit = this one; confirm `info@nukeblastsimulator.com` receives mail; replace the interim consent banner with a CMP on ad-network acceptance.
