# NBS-002 Prose Audit — anti-slop-prose REVIEW (findings only, no edits)

Scope: 7 URLs. Method: anti-slop-prose SKILL.md REVIEW mode. Each hit is `pattern# · "quote" · fix`. Grouped per URL, with tells-per-1,000-words of **body prose** (target ≤ 2). Exempt per skill: FAQ *questions*, stat-callout boxes, headings, data tables, weapon/city dropdowns and link grids, legal pages, number ranges/units, the single intro promise line. FAQ *answers*, intros, direct-answer blocks and tool-result explanations are in scope. Methodology prose is in scope; its formula lines and mortality table are exempt (data-table cells + quotations from sources).

Body-prose word counts below exclude the exempt chrome (dropdown option lists, link grids, result tables, stat callouts, FAQ question text).

---

## 1. `/` (home)

Body prose ≈ 760 words (excludes weapon dropdown x2, weapon/city/comparison/blog link grids, glossary term boxes, FAQ question headings).

- **11** · "The tool is built as an educational resource to support nuclear-disarmament awareness." / "we aim to **foster** informed discussions" (echoed on /about) · "foster" is AI-vocabulary filler → "to promote" or just "to support."
- **1** · "Nuclear Blast Simulator is a free, interactive online tool that lets you visualize the effects…" — fine; but the recurring **not-just framing** does not appear here. No hit.
- **7** · Three consecutive "Understanding Nuclear Blast Effects" sub-blurbs plus three FAQ answers all open with the subject noun ("A shock wave radiates…", "Intense light…", "Surface bursts produce…") — borderline; the descriptions are short stat-style blurbs, not running prose. Note only, not counted.
- **2** · "Scroll back to the top — pick a weapon, click a city, see the impact." · dramatic one-line closer / fragment triad used as a CTA. Counts as 1 (closer). The em dash + comma-spliced triad also trips **6/8** but the CTA is microcopy — count once under pattern 2.
- **8** · "destroyed Hiroshima to the 50-megaton Tsar Bomba, the largest nuclear weapon ever tested." and "windows shatter out to many kilometers. These radii scale with the cube root of yield." — body prose runs ~760 words with **4 em dashes** (intro: "Little Boy that destroyed Hiroshima to the 50-megaton Tsar Bomba — the largest…"; "declassified U.S. Department of Defense reference"; "Air bursts produce minimal local fallout — which is why…"; "roughly 40-50% smaller blast radius"). Budget is 1 per ~300 words ≈ 2–3 allowed; **4 present → ~1–2 over budget.** Count 1.
- **14** · "free, requires no signup, and never transmits your simulations to a server" repeated three times (intro, mission line, FAQ) — not sales language per se, but the triple repetition of the "free / no signup / never transmits" sales triad is promotional padding (**pattern 6 forced triad + 14**). Count 1.

Clean notes: numbers, units, named sources (Glasstone & Dolan 1977) are specific and correct-to-registry — good real-writer signals. The "Below:"-style promise is absent; intro states the point directly.

**Tells ≈ 4 in ~760 words → 5.3 per 1,000.** Over target. Worst types: 8 (em-dash over-budget), 2 (closer), 11/14 (filler + repeated sales triad).

---

## 2. `/about`

Body prose ≈ 420 words (excludes the editorial-persona stat line, data-source bullet list, Einstein quotation, disclaimer bullets — quotation and legal-style disclaimer are exempt).

- **11** · "we aim to **foster** informed discussions about nuclear policy" · "foster" → "encourage" / "support."
- **17** · "Our nuclear blast simulator **serves as** an educational tool to promote understanding…" · "serves as" → "is." (pattern 17, avoiding *is/are/has*.)
- **11** · "demonstrating the exponential increase in destructive capability" — shallow **-ing rider** (**13**) tacked on a sentence about the weapon list; also "demonstrating" borders inflation. Rewrite as a real clause or cut. Count under 13.
- **13** · "Knowledge of nuclear weapons effects should inspire action toward a nuclear-weapon-free world." / "By visualizing the devastating consequences … we aim to foster…" — the mission paragraphs are abstract declaratives with no number (**pattern 16**, vague declaratives). "the urgent need for a nuclear-weapon-free world" is advocacy boilerplate. Count 1 under 16.
- **19/D** · "Education • Awareness • Action • Peace" · decorative bullet-separated slogan line · cut or make a sentence (pattern 19, no decorative symbols in body text).
- **24** · "The simulator accurately models the critical differences between detonation types:" then immediately lists air/surface burst — "accurately" is an unearned self-claim (adjacent to **14** sales language "accurately models … critical"). Count 1.

Note: the collective "NukeBlastSimulator Editorial" persona line is factual chrome, not prose — out of scope here (flagged by the E-E-A-T agent, not prose). Einstein quote is exempt (quotation).

**Tells ≈ 5 in ~420 words → 11.9 per 1,000.** Well over target — /about is the slop-densest page. Worst types: 11 (foster), 17 (serves as), 16 (vague mission declaratives), 19 (decorative slogan).

---

## 3. `/methodology`

Body prose ≈ 150 words (formula lines, the mortality-rate table, data-source list and disclaimer bullet list are EXEMPT — data-table cells, citations, and the actual numbers trace to the registry; per skill, data integrity never touched).

- **11/15** · "The simulator uses **scientifically validated** scaling-law formulas derived from nuclear weapons testing data and the **seminal work** *The Effects of Nuclear Weapons*…" · "scientifically validated" is borrowed-authority padding (**15**) and "seminal" is AI-inflation (**11/12**) → "scaling-law formulas from *The Effects of Nuclear Weapons* (Glasstone & Dolan, 1977)." Count 1.
- **13** · "Casualties are calculated by combining each zone's area, the local population density … and an empirically-derived mortality rate per zone:" — acceptable methodology passive (pattern 10 exempts actor-less method steps); "empirically-derived" is mild inflation but tolerable. No count.

The rest of the page is formulas + table + bullet caveats = exempt. Prose surface here is tiny, so a single inflation cluster in the one running sentence is the whole finding.

**Tells ≈ 1 in ~150 words → 6.7 per 1,000.** Over target only because the prose base is so small; one fix clears it. Worst type: 15/11 ("scientifically validated", "seminal work"). NOTE: the formula `0.28 × Yield^0.33` shown for the fireball is a data/engine issue owned by the effects-engine fix, not a prose tell — not counted here.

---

## 4. `/weapons/tsar-bomba`

Body prose ≈ 230 words (effect-zone table and FAQ *questions* exempt; FAQ *answers*, overview, table caption in scope).

- **12** · "the Tsar Bomba is 3,333× more powerful than the Hiroshima bomb" · this is a fact-with-number — GOOD, keep. (Listed to show it is correctly *not* a tell.)
- **17** · "As a thermonuclear (hydrogen bomb) weapon, it **derives its energy from** a fission primary that ignites a much larger fusion secondary stage." — "derives its energy from" is fine (not a *serves as* substitute). No count.
- **8** · Overview + caption run ~120 words with 1 em dash ("most residential buildings would collapse. The 1 PSI light-damage radius…" uses none; the em dashes are in the FAQ answers: "a 5 PSI moderate-blast zone of about 36.60 km — the area in which…" and "the largest weapon ever tested —"). ~2 em dashes across ~230 words = at budget, not over. No count.
- **—** · No A-section staging, no closers, no AI-vocab in body. The page is unusually clean: it states the fact plus the number (good per Keep list).

**Tells ≈ 0 in ~230 words → 0.0 per 1,000.** At/under target — the cleanest of the seven. (The radii themselves are engine-inflated per CONFIRMED FACTS, but that is a data finding, not a prose tell.)

---

## 5. `/examples/houston`

Body prose ≈ 400 words (the four effect-zone tables, the 95-city link grid, and FAQ *questions* are EXEMPT; "About Houston" lead, the "Below are four scenario…" promise, Limitations lead, and FAQ *answers* in scope).

- **1/8** · "The largest city in Texas and home to the United States' largest medical center and a major energy industry hub." · fragment (no verb) opener — tolerable as a dek, but note the stacked "largest … largest … major" (**pattern 6** forced triad of superlatives). Count 1 under 6.
- **promise line (EXEMPT)** · "Below are four scenario calculations using historical and modern nuclear weapons." — this is the single intro promise line; skill exempts it. No count.
- **16** · "The purpose of these visualizations is to convey the humanitarian scale of nuclear weapons — not to make any operational claim." (FAQ answer) — contains a **not-X framing (pattern 1)** "— not to make any operational claim" and an em dash in an FAQ answer (**pattern 8**: *no em dashes in FAQ answers*). Count 1 (the em-dash-in-FAQ-answer is the firm rule).
- **5** · "Is Houston a likely nuclear target? This is an educational simulator and does not assess threat probability." — arguing-with-no-one setup, but it answers a real searcher question (FAQ question is exempt and the misconception is genuine) → keep. No count.
- **8** · Several FAQ answers carry em dashes against the "none in FAQ answers" rule: "A Hiroshima-yield warhead (15 kt Little Boy)…" (none), but "the largest weapon ever tested — would put roughly 51,085,374 people…" (one) and "humanitarian scale … — not to make…" (one). **2 em dashes inside FAQ answers → violates the hard no-em-dash-in-FAQ rule.** Count 1 (distinct from the Houston-dek em dashes).

Clean notes: casualty prose cites specific numbers and the right caveats ("depend strongly on time of day, sheltering, weather"). Good. (The casualty numbers themselves double-count overlapping zones per CONFIRMED FACTS — data finding, not prose.)

**Tells ≈ 3 in ~400 words → 7.5 per 1,000.** Over target. Worst types: 8 (em dashes inside FAQ answers — a hard rule, twice), 6 (superlative triad in dek), 1 (not-X in FAQ answer).

---

## 6. `/compare/little-boy-vs-fat-man`

Body prose ≈ 118 words (the comparison table, stat-callout fatality numbers, related-comparison grid and FAQ *questions* are EXEMPT; "Verdict" paragraph, casualty-estimate lead sentence, caveat, and "Hiroshima reference" prose in scope).

- **24** · "The Fat Man is 1.4× more powerful than the Little Boy by yield. Both weapons are described in detail below, with side-by-side blast and thermal radii, casualty estimates at a reference urban density, and historical context." · second sentence is **writing about the page** ("are described in detail below, with …") — pattern 23/24, cut it; the table already is the detail. Count 1.
- **6** · "…side-by-side blast and thermal radii, casualty estimates at a reference urban density, and historical context" · forced triad listing what's below. Folds into the cut above; count once.
- **—** · "The Hiroshima bomb (Little Boy) had a yield of approximately 15 kilotons. The Little Boy is 1× more powerful than the Hiroshima bomb. The Fat Man is 1× more powerful." — reads awkwardly ("1× more powerful" = a data/template bug, Little Boy *is* the Hiroshima bomb so "1× more powerful" is nonsense), but this is a **data/template defect**, not a prose-style tell — reported by the data-integrity agent, not here. No prose count.
- **8** · Body prose is ~118 words with 0 em dashes in the running prose. Under budget. No count.

**Tells ≈ 1 in ~118 words → 8.5 per 1,000.** Over target (tiny prose base; one "described below" fix clears it). Worst type: 23/24 (writing about the page) + 6 (triad). The "1× more powerful" nonsense is the page's worst problem overall but is a template/data bug, out of prose scope.

---

## 7. `/blog/modern-nuclear-arsenals-2026`

Body prose ≈ 721 words (entire article is running prose; only the two trailing nav sentences excluded). This is the largest genuine-prose surface of the seven.

- **11** · "North Korea … has now demonstrated thermonuclear capability (claimed in 2017) and intercontinental delivery…" — clean. No AI-vocab hits in the body; the article avoids delve/tapestry/leverage etc. Good.
- **8** · ~721 words of body prose contain **em dashes in roughly these spots**: "down from a Cold War peak of around 70,000 in 1986, but climbing again…" (comma, OK); "plus reserves and retired-but-intact)"; "a posture often described as 'full-spectrum deterrence.'"; "the Hwasong-14 was the first nuclear-capable ICBM credibly tested by the country; the simulator includes it…" (semicolon). Actual em dashes: "a policy known as 'amimut.'" region and "(Hwasong-15 and Hwasong-17 ICBMs, tested in 2017 and 2022 respectively)". **Count of true em dashes ≈ 2 across 721 words → within the 1-per-300 budget (≈2–3 allowed).** At budget, no count.
- **3** · "The big two: the United States and Russia" is a heading (exempt). No throat-clearing run-ups in the body. Good.
- **13** · "The expansion appears motivated by perceived US missile-defense capabilities and improvements in conventional precision strike that, in Beijing's view, made China's previous minimum deterrent insufficient." — "appears motivated by" is a legitimate sourced hedge (pattern 9 allows one qualifier where uncertainty is real). No count.
- **20** · "Total inventory and trends" closes: "…the era of US-Russia bilateral arms control is effectively over." — this is a genuine last-fact ending, not an "In conclusion/Overall" recap. GOOD (pattern 20 satisfied).
- **17** · "Both arsenals follow the classical 'triad' structure" — "follow" is a plain verb, fine. No *serves as/boasts*. Good.

The article reads like a knowledgeable human: exact warhead counts, named delivery systems (Minuteman III, Yars, Sarmat, JL-3, Jericho), dated events (silo fields 2021, New START expiry Feb 2026), sourced to SIPRI/FAS/Bulletin. Strong real-writer signals throughout.

**Tells ≈ 0–1 in ~721 words → ≈ 1.4 per 1,000 (effectively at/under target).** The single soft hit, if any, is a borderline em-dash count; the body is clean. Best-written page of the seven. (All the 2026 figures are arsenal-data claims owned by the data-freshness/citations agents, not prose.)

---

## Summary table

| URL | Body-prose words | Total tells | Tells / 1k | Worst pattern types |
|---|---|---|---|---|
| `/` | ~760 | 4 | 5.3 | 8 (em-dash over budget), 2 (dramatic closer), 11/14 (foster + repeated "free/no-signup" sales triad) |
| `/about` | ~420 | 5 | 11.9 | 11 (foster), 17 (serves as→is), 16 (vague mission declaratives), 19 (decorative "Education•Awareness•Action•Peace" slogan) |
| `/methodology` | ~150 | 1 | 6.7 | 15/11 ("scientifically validated", "seminal work") |
| `/weapons/tsar-bomba` | ~230 | 0 | 0.0 | — (cleanest; states fact + number) |
| `/examples/houston` | ~400 | 3 | 7.5 | 8 (em dashes inside FAQ answers — hard rule, ×2), 6 (superlative triad dek), 1 (not-X in FAQ answer) |
| `/compare/little-boy-vs-fat-man` | ~118 | 1 | 8.5 | 23/24 (writing about the page "described in detail below") + 6 (triad) |
| `/blog/modern-nuclear-arsenals-2026` | ~721 | 0–1 | ~1.4 | — (best-written; borderline em-dash count only) |

**Target is ≤ 2 tells / 1,000 words of body prose. Only 2 of 7 pages meet it: `/weapons/tsar-bomba` (0.0) and `/blog/modern-nuclear-arsenals-2026` (~1.4).** The five short template/landing pages fail, driven by small prose bases and recurring filler — `foster`, `serves as`, "scientifically validated/seminal", the repeated "free / no signup / never transmits" sales triad, decorative slogan lines, and em dashes used where the skill forbids them (FAQ answers).

**Worst offender overall: `/about` at 11.9 tells/1k** — highest density, with `foster`, `serves as` (pattern 17), abstract numberless mission declaratives (pattern 16), and the decorative `Education • Awareness • Action • Peace` slogan line (pattern 19) clustered in ~420 words.

Notes on scope boundaries honored: engine-inflated radii and double-counted casualties (CONFIRMED FACTS), the "1× more powerful" template bug on the compare page, and the editorial-persona / 2026 arsenal figures are **data / E-E-A-T / freshness findings, not prose-style tells**, and are excluded from the counts above per the skill's precedence rule (data integrity is never this pass's job).
