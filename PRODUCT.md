# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: curious adults and students who arrive from Google and Bing searches, English-speaking with the United States first, about 45% on phones. Their job is a fast, trustworthy answer to one question — "how big is the blast, and what would it reach in my city." Secondary: teachers and journalists who reach for the site when nuclear news breaks and need correct, citable numbers quickly.

## Product Purpose

An educational map of nuclear-weapon effects. A reader picks a weapon or a custom yield, clicks a place, and sees the fireball, blast overpressure (20 / 5 / 1 psi) and thermal-burn rings for an air burst at optimum height, computed from Glasstone & Dolan scaling laws. Around that tool sit a weapons database, 100 city pages, weapon comparisons, articles, and a glossary.

Success means three things together: readers get correct, cited numbers fast; the site earns organic rankings on Google (and Bing); and it passes Raptive's editorial review for quality and trust.

## Positioning

Two commitments a neighboring "nuke map" cannot truthfully copy:
- **Every number on the site carries a citation to a verified source.** Sources live in a verified registry (`research/sources.csv`) and surface on a generated `/sources` page; weapon and city figures link to the exact source they come from.
- **A named physicist writes it:** Marko Visic, BSc Physics, with a real byline, credentials, and headshot — not an anonymous or invented editorial voice.

## Operating Context

- Readers land from a search result on a specific surface — the interactive map (home), a weapon page, a city page, a comparison, an article, or a glossary term — rather than browsing from a front door.
- The interactive map is a tool used in place; every text/content surface stands on its own and is read without interacting with the map.
- The site is evaluated two ways beyond readers: search engines crawl it for ranking, and Raptive reviewers assess it by hand for original, trustworthy, brand-safe content.
- Published by Moving Data Systems d.o.o. (Ruše, Slovenia); contact `info@nukeblastsimulator.com`.

## Capabilities and Constraints

Capabilities:
- Interactive effects map: choose a catalogued weapon or a custom yield, click any location, and read the fireball, 20/5/1 psi blast, and thermal-burn rings for an air burst at optimum height.
- Weapons database: 29 nuclear weapons and tests plus 14 conventional bombs for comparison, and a custom-yield option.
- 100 city pages, weapon-vs-weapon comparisons, long-form articles, and a glossary.
- Terminology the product uses precisely: *yield* (kilotons / megatons), *air burst at optimum height*, *overpressure* (20 / 5 / 1 psi), *fireball*, *thermal burns* (1st / 2nd / 3rd degree).

Hard constraints (must be preserved by all future work):
- **Withheld outputs — never shown until a verified model exists:** casualty and fatality counts, fallout, radiation dose, craters, and surface-burst effects. Only air-burst effect radii the sources support are displayed.
- Every text/content page must read fully **without JavaScript**; the interactive map loads only when someone uses it (progressive enhancement, never a prerequisite for the content).
- Show nothing the available, cited sources cannot support.
- Display advertising (Raptive) is a future addition; **do not design around ad slots** now.

## Brand Commitments

- **Name:** Nuke Blast Simulator (nukeblastsimulator.com); the simulator tool is also referred to as the Nuclear Blast Simulator.
- **Author / byline:** Marko Visic, BSc Physics — a named, credentialed human, with headshot `public/images/marko-visic.jpeg`. Content reads as written and reviewed by a physicist.
- **Voice & tone:** sober and scientific, like a museum exhibit or a textbook — not a game and not a military display. The answer is stated plainly and the framing stays calm and neutral about real places.
- **Prohibited:** gore, glorification of weapons, targeting or attack language, and military emblems used as decoration.

## Evidence on Hand

Real, verified material (chat-verified against primary sources; paths are repo-relative):
- `research/facts-verified.csv` — 424 audited factual claims with verdicts, corrected text, and source ids.
- `research/sources.csv` — 240 verified sources (publisher, title, deep URL, attribution); `research/data-sources.csv` — the data-domain registry (engine, weapons, arsenals, cities, etc.).
- `research/cities-verified.csv` — 100 cities with verified population, area, density, coordinates, and source ids.
- The generated `/sources` page and the author headshot at `public/images/marko-visic.jpeg`.

**No testimonials, press mentions, user counts, awards, or partnership claims exist.** Future work must never invent them.

## Product Principles

1. **Every number traces to a cited source** — if it can't be cited, it isn't shown.
2. **The answer comes first** — the radius before the story.
3. **Calm, neutral framing about real places** — inform, never dramatize or glorify.
4. **Fast on phones** — mobile-first; content before interactivity.
5. **Show nothing the model can't support** — withheld effects stay withheld until verified.

## Accessibility & Inclusion

- Target WCAG AA contrast across the site.
- Mobile-first: roughly 45% of visitors are on phones.
- All content is readable without JavaScript; the interactive map is an enhancement on top of text that already stands alone.
