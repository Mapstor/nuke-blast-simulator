# NBS-014 RETARGET — report

**Task:** retarget six T1 live pages to the 2026-10-28 KWP deep-dive using chat-verified facts, and fix the live citation errors the deep-dive found.
**Date:** 2026-10-28 · CC · done (unpushed)

Pages: `/blog/hiroshima-nagasaki-80-years-of-data`, `/weapons/little-boy`, `/weapons/fat-man`, `/blog/tsar-bomba-largest-test-ever`, `/weapons/tsar-bomba`, `/glossary/hydrogen-bomb`, `/blog/four-kill-mechanisms`.

---

## 1. Verification (exact commands + results)

| Check | Command | Result |
|---|---|---|
| Production build | `npm run build` | **exit 0** (148 pages) |
| Tests | `npx vitest run` | **104 passed, 0 skipped** (19 files) incl. new `retarget-2026-10-28.test.ts` |
| Keyword ledger | `check_ledger.py` | **RESULT OK** (77 pre-existing no-secondary warnings) |
| Data sources | `check_sources.py` | **RESULT OK** (2 pre-existing warnings) |
| Content dates | `NBS_DATE=2026-10-28 … update-content-dates.mjs` | 116 pages, changed → 2026-10-28, datePublished preserved, 0 pruned |
| Impeccable hook | PostToolUse on every write | no deterministic issues; **no new ignores** |

### New / updated tests (`tests/retarget-2026-10-28.test.ts`)
- **Every added number resolves to a verified row:** 21 curated figures across the 7 pages are (a) present in the built HTML and (b) traced to a `status=verified` row of `research/retarget-facts-2026-10-28.csv`.
- **No "kill" on the four-kill page:** `<title>`, `<h1>`, meta description, `og:title` and `og:description` contain no word "kill"; title and H1 carry the "nuclear explosion" primary.
- **Hiroshima title** contains every non-stopword token of the new primary ("how many people died in hiroshima" → many/people/died/hiroshima).
- The NBS-013 sitewide tests stay green: every citation resolves on every built page; no `key=value`; no competitor brand name.

### VERIFY prints
`reports/NBS-014/verify-prints.txt` — the 7 pages' title (length), H1, meta (length) and full H2 list, confirming the demand-ordered headings and the ≤60 / ≤155 limits.

---

## 2. What changed, per page

1. **`/blog/hiroshima-nagasaki-80-years-of-data`** — retargeted to **"how many people died in hiroshima"** (27,100). New H1/title "How Many People Died in Hiroshima and Nagasaki?"; a 40–60-word direct answer; H2s in demand order (death toll per city as a cited table; when the bombs were dropped; why the US bombed Hiroshima; the survivors; radioactive today; 80 years of RERF data); 7 FAQs. Fixed live citation errors: the 140,000 figure now also cites the City of Hiroshima; "8:15 / Enola Gay" re-cited to the NPS + City of Hiroshima (not RERF); Kokura shown as smoke/haze/cloud attributed by source.
2. **`/weapons/little-boy`** — added "How big was the Hiroshima bomb?" (dimensions, the disclosed weight range, 15 kt, engine radii) + 4 FAQs.
3. **`/weapons/fat-man`** — added the drop record (11:02 a.m., 9 Aug 1945, Bockscar, Sweeney, 503 m) and a physical description (dimensions, weight range, implosion-type plutonium) + 6 FAQs.
4. **`/blog/tsar-bomba-largest-test-ever`** — H2s: the explosion (film released August 2020, flash 1,000 km, pressure wave circled the Earth three times); how big the bomb was; where and when tested; the mushroom cloud (64–67 km, attributed); 50 Mt vs the 100 Mt design; 7 FAQs. Fixed: the 1,000 km flash and the "three times" pressure wave re-cited to Sublette; aircraft distance 45 km (was 50); the "commercial airliner" comparison replaced with Sublette's fireball-reach wording; "Khrushchev personally ordered the substitution" cut.
5. **`/weapons/tsar-bomba`** — added a "Where and when Tsar Bomba was tested" section aligned to the article's facts/citations, linking the article for the history.
6. **`/glossary/hydrogen-bomb`** — upgraded from a one-paragraph stub to a full page (page-map archetype `article`): H2s (how a thermonuclear bomb works — the ANS concept sentence only; which countries have hydrogen bombs, as a cited table linking each country page; who invented it; the first test; how powerful) + two SVGs + 6 FAQs.
7. **`/blog/four-kill-mechanisms`** — retargeted to **"nuclear explosion"** (18,100). "kill" removed from title ("Nuclear Explosion: What Happens, Second by Second"), H1 ("What Happens in a Nuclear Explosion"), meta and OG; **slug kept pending the owner**. H2s: what happens in order (Glasstone & Dolan 1-Mt timeline) + the timeline SVG; how hot; how big (→ /nuclear-blast-radius); sound & shock wave; underwater & in space (Crossroads Baker 21 kt, Starfish Prime 1.4 Mt → EMP article); how bright the flash; what causes it; where the energy goes + the energy-split SVG; 6 FAQs. Fixed: the G&D timeline/temperature/blast figures all cite the DTIC scan of §2.40/§7.03 (not the chapter-1 id); no Tsar-Bomba-flash-as-G&D-fact.

---

## 3. State / disclose / cut log (per `research/retarget-sourcing-2026-10-28.md`)

- **Hiroshima/Nagasaki** — STATE: 140,000 (±10,000, museum) and more than 70,000 / 73,884 (Nagasaki City), RERF 90k–166k and 60k–80k, 91,105 hibakusha (avg 86.66), 8:15 / 600 m / 43 s, 11:02, Tibbets/Enola Gay, Sweeney/Bockscar, Potsdam 26 Jul, the three Truman quotes, UNODA "two". DISCLOSE: the NPS "killed or grievously wounded" figures are shown as not-a-death-count and **never summed**; Kokura obscurant attributed (smoke/haze/clouds); the name registers (353,639 / 202,053) shown only with the "list of names, not a death toll" definition. CUT: nothing invented; GAP (no official multi-year toll) stated as "the exact number will never be known."
- **Little Boy / Fat Man** — STATE: 10 ft × 28 in / 10 ft 8 in × 60 in, 15 kt / 21 kt (DOE/NV-209 Rev. 16), gun-type uranium / implosion-type plutonium, burst 600 m / 503 m. DISCLOSE: weight as a range with each source (8,900 / ~9,000 / 9,700 lb; 10,000 / 10,300 / 10,800 lb). CUT: the museum "20,000-ton" yields and 1,800 ft burst heights (Truman's "20,000 tons of TNT" kept only as a quoted 1945 claim). GAP: Fat Man's release time (not stated).
- **Tsar Bomba** — STATE: 30 Oct 1961 11:32 Moscow, Mityushikha Bay / D-2 / Sukhoy Nos, Durnovtsev, 10,500 m → 4,000 m, 8 m × 2.1 m, ~27 t (24.5–27.5), 50 Mt vs 100 Mt design, flash 1,000 km, pressure wave ×3, film August 2020. DISCLOSE: aircraft Tu-95V (AHF/Wellerstein) vs Tu-95N (Sublette); cloud 64 km (Sublette) / 67 km (Wellerstein) / ~40 mi (AHF, WWII Museum); US estimate up to ~57 Mt. FIX: 45 km not 50 km; Sublette's fireball-reach wording replaces "commercial airliner". CUT: "Khrushchev personally ordered the substitution".
- **Hydrogen bomb** — STATE: Teller & Ulam / LAMS-1225 9 Mar 1951; the ANS one-line concept only; Sakharov; Ivy Mike 1 Nov 1952 10.4 Mt; Joe-4 12 Aug 1953 400 kt; RDS-37 22 Nov 1955 1.6 Mt; Grapple X 8 Nov 1957 1.8 Mt; Test No. 6 17 Jun 1967 3.3 Mt; Canopus 24 Aug 1968 2.6 Mt; India ~43 kt 1998; North Korea ~250 kt 2017. DISCLOSE: the UK 15 May 1957 Grapple fell short (0.3 Mt) and Grapple X is the first UK thermonuclear test; India disputed (Santhanam "fizzle"); North Korea NORSAR 250 kt and "seismic data can't tell fission from fusion". CUT: the UN/CTBTO 50–100 kt figure (candidate — not stated); the Atomic Archive "June 14, 1967" China date; the uncited "Modern strategic warheads are all thermonuclear".
- **Nuclear explosion (four-kill)** — STATE (G&D, 1 Mt): the explosion definition; energy split 50/35/5/10; fireball <1 µs / 440 ft @0.7 ms / 5,700 ft @10 s; flash at the speed of light; initial radiation ~1 min; shock front 3 mi @10 s, 12 mi @50 s, ~1,150 ft/s; cloud 3 mi @30 s, 5 mi @~1 min, max ~10 min; Starfish Prime 1.4 Mt @400 km; Crossroads Baker 21 kt, 90 ft underwater. DISCLOSE: the Navy's 23 kt for Baker (page uses DOE's 21 kt). FIX: section citations corrected to the DTIC G&D scan.

**Safety:** museum-level facts only. No fissile masses, no internal-structure or device-design detail, no device-diagram SVG; "how it works" is the one-sentence ANS concept.

---

## 4. Reverse-link list (keywords owned elsewhere → links to their owner)

- Hiroshima article → `/weapons/little-boy`, `/weapons/fat-man` (the blast-radius cluster).
- Four-kill article → `/nuclear-blast-radius` (owns "how big is a nuclear explosion"), `/blog/emp-high-altitude-nuclear-burst` (owns "nuclear explosion in space"), `/blog/how-nuclear-weapons-work`.
- Tsar article → `/compare/tsar-bomba-vs-little-boy` (owns "Tsar Bomba vs Hiroshima"), `/weapons/tsar-bomba`, `/nuclear-blast-radius?kt=50000`.
- Tsar weapon page → `/blog/tsar-bomba-largest-test-ever` (the history).
- Hydrogen-bomb page → each country's `/nuclear-weapons-by-country/*` page (table), `/weapons/ivy-mike`, `/glossary#teller-ulam`, `/nuclear-blast-radius?kt=…`.
- Little Boy / Fat Man → `/nuclear-blast-radius?kt=15` / `?kt=21`.

---

## 5. Content-page pre-publish checklist (all 7 pages)

- **One primary per page, headings in demand order** — ledger primaries: hiroshima "how many people died in hiroshima", four-kill "nuclear explosion", hydrogen-bomb "hydrogen bomb", little-boy "hiroshima bomb blast radius", fat-man "fat man", tsar article "tsar bomba", tsar weapon "tsar bomba blast radius". H2s follow the volume order (verify-prints).
- **Title ≤60 / meta ≤155, unique, primary tokens kept** — generator validated 0 problems; verify-prints shows every length.
- **Direct answer first** — each page and each H2 opens with a self-contained sentence (GEO).
- **Every number cited and traceable** — all figures resolve to a verified retarget-facts row (test) or the engine; prose radii use `{{r}}` tokens.
- **FAQ = question-form keywords, 40–80-word self-contained cited answers** — rendered + FAPage schema (plain text).
- **JS-off crawlable** — all content is in the SSR HTML (the tests read the prerendered files).
- **No targeting/attack language, no casualty/fallout output** — neutral verbs; only computed blast/thermal radii and historical sourced death tolls.
- **0 horizontal overflow at 360 / 390 px** — static inspection; tables scroll inside `overflow-x-auto`, SVGs are `width:100%`.

---

## 6. Adversarial review (4 lenses, read-only agents)

Four independent agents reviewed facts/citations, anti-slop/policy, citation-resolution/schema/SEO integrity, and the SVGs. **The integrity lens found 0 hard defects** (all citations resolve — the NBS-013 bug did not recur; FAQ schema is plain; no "kill"; no folded/404 links). Confirmed findings, all **FIXED**:

- **[facts] Castle Bravo 15 Mt / "largest US test"** was stated with no supporting citation (the NWW2M cite covers Tsar only). Re-cited to the DOE/NV-209 catalogue (`us-doe-nnsa-nevada-field-office-united-states-nu`).
- **[facts] Nagasaki register 202,053** was cited to the Hiroshima/definition sources but not its own; added `jiji-press-nippon-com-register-of-nagasaki-a-bom`.
- **[anti-slop] Little Boy / Fat Man generic FAQ** ("Is X bigger than the Hiroshima bomb?", "comparable in yield to the Hiroshima bomb") was circular/misleading because those weapons **are** the Hiroshima/Nagasaki bombs. Suppressed the two self-referential generic entries for the reference bombs (their extras FAQ cover yield/power) and gave their Overview a bespoke comparison.
- **[svg] Mobile label sizes** — all four diagrams were redrawn at a 680-wide viewBox with 24–30px labels and collision-free legends (the first-test chart became horizontal log-scale bars), so every label renders ≥ ~11px inside the article column.
- **[seo] four-kill OG metric** "85%" was a hardcoded literal; it is now summed from the `ENERGY` split data (blast + thermal) so it can't drift.

Re-verified after the fixes: `npm run build` exit 0, **104 tests pass**, both checkers OK.

---

## 7. Honest gaps

- **No Chromium in the box:** the live 360/390 px render, the new diagrams and the delivery/FAQ layout are verified by static inspection and the prerendered HTML only — not by a real browser or PNG screenshots.
- **Candidate/gap facts stay off the pages:** the UN/CTBTO 50–100 kt North Korea figure (candidate) and Fat Man's release time (gap) are not stated.
- **The MHLW hibakusha count updates each July** — recheck July 2027 (registry note).
- **The four-kill slug `/blog/four-kill-mechanisms` is unchanged**, pending the owner's decision on a rename (the one-line change the chat will send if approved).
