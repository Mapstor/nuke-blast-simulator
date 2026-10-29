# NBS-015 READINESS-1 — report

**Task:** Raptive readiness, part 1 — rename the nuclear-explosion article, cite the country intros, three layout fixes, a web manifest, Hiroshima article figures, and a ledger brand-safety clean-up.
**Date:** 2026-10-29 · CC · done (unpushed)

Chat's 2026-10-29 production check confirmed NBS-013/014 are live and clean (all 116 sitemap pages 200, every citation resolves, no raw-field text, no competitor brand name, no "kill" in the nuclear-explosion article's metadata). This wave begins the raptive-ready pass.

---

## 1. Verification (exact commands + results)

| Check | Command | Result |
|---|---|---|
| Production build | `npm run build` | **exit 0** (116 sitemap pages) |
| Tests | `npx vitest run` | **105 passed, 0 skipped** (19 files) incl. the rename redirect test |
| Keyword ledger | `check_ledger.py` | **RESULT OK** |
| Data sources | `check_sources.py` | **RESULT OK** |
| Content dates | `NBS_DATE=2026-10-29 … update-content-dates.mjs` | 116 pages, 0 pruned, datePublished preserved |
| Impeccable hook | PostToolUse on every write | no deterministic issues; **no new ignores** |

### Rename coverage (tests)
- `redirects.test.ts` now imports `blog-redirects.json`, asserts the count (395 total), that `/blog/four-kill-mechanisms → /blog/nuclear-explosion` is a permanent one-hop to a built page, that the old URL is **not** built, and that **no built page links to the old URL**.
- `retarget-2026-10-28.test.ts` reads `blog/nuclear-explosion.html`; the sitemap contains `/blog/nuclear-explosion`; the NBS-013 sitewide tests (every citation resolves, no key=value, brand name) stay green.

### VERIFY prints
`reports/NBS-015/verify-prints.txt` — the nine country intros with their resolved citation numbers, the Iran enrichment sentence after the fix, the Russia and US delivery subtotal labels, and the manifest JSON.

---

## 2. The six items

1. **RENAME `/blog/four-kill-mechanisms` → `/blog/nuclear-explosion`** (owner approved). Changed: the article slug (so the blog index, related, prev/next, search index and menu — all derived from `a.slug` — follow automatically), the PAGE_SEO override + regenerated `pageSeo.ts`, `livePages.ts`, the `ogImage` metric key, `page-map.csv` slug, the ledger `page_slug` (62 rows), the `content-dates` key (migrated, datePublished 2026-04-29 preserved), the three `removed-strings` scoped rows, and `sitemap.md`. Added `data/blog-redirects.json` (one permanent 308, one hop), wired into `next.config.js`. 0 built pages reference the old URL; canonical/og:url/JSON-LD/sitemap all use the new URL.
2. **COUNTRY INTROS cited.** `buildIntro()` now returns `{text, ids}` and the intro renders a trailing `<Cite>`. Totals and world shares cite FAS + SIPRI on every page; China's "expanding faster than any other" cites the SIPRI Yearbook 2026 press release; the US "only country ever to have used a nuclear weapon in war" cites UN ODA; the India/Pakistan test and NPT claims, and North Korea's "only to test this century"/"largest", cite the test-history and treaty rows. **Iran:** "has long enriched uranium under IAEA safeguards" was reworded and cited — "a party to the NPT (NL treaty database) and has enriched uranium under its IAEA safeguards agreement, the stockpiles of which the Agency has measured and reported (IAEA GOV/2026/50)."
3. **LAYOUT.** (a) The `/nuclear-blast-radius` yield chart's axis labels/titles went from 26 → **32** (≈11.6 px at a 326 px phone column) and the illegible ~6 px numbered weapon markers became **colored dots keyed to the HTML legend's matching color swatches** (a readable on-chart number can't fit without Little Boy/Fat Man overlapping). (b) Every delivery **subtotal row is now labeled by what it sums** (ICBMs, SLBMs, Bombers, Strategic total, Nonstrategic, …), from the Nuclear Notebook leg, via `subtotalLabel(field)`.
4. **WEB MANIFEST.** `src/app/manifest.ts` serves `/manifest.webmanifest` (name "Nuke Blast Simulator", short_name "Nuke Blast", theme `#22c55e`, background `#111827`, the existing SVG icons) and Next injects one `<link rel="manifest">`; the existing favicons are untouched.
5. **HIROSHIMA FIGURES.** Two SVGs added to the Hiroshima article from verified rows only: a **hero** comparing each city's end-of-1945 toll and the RERF 2–4-month range (~140,000 ±10,000 / 90,000–166,000; 73,884 / 60,000–80,000), and a **supporting timeline** from the Potsdam Declaration (26 July 1945) to Nagasaki (9 August 1945). No images of people, injuries or destruction — bars and a date timeline only; labels render ≥11 px on a phone.
6. **LEDGER BRAND SAFETY.** The only `examples/*` keyword matching "bomb {place} simulator" / "bombing {place}" was **"bomb iran simulator"** (examples/tehran); it is now `discard` / `offtopic` with no page_slug and the note "targeting framing excluded (PRODUCT.md)". Tehran's secondary was re-picked from its tertiaries ("nuclear bomb tehran"); the title is unchanged. `check_ledger.py` RESULT OK.

---

## 3. Adversarial review (3 lenses, read-only agents)

- **Integrity / rename lens — 0 defects.** All 12 changed pages' citations resolve; no built page references the old URL; the redirect is a one-hop 308; the manifest parses with exactly one `<link rel="manifest">` and the favicons retained; the chart axis fonts are 32 with swatch-keyed dots.
- **Facts lens — 2 findings, both FIXED.** (a) China's "expanding faster than any other" was cited to the SIPRI press release, but that source's registry `supports` summary listed only totals; the `supports` text now documents the growth claim (sentence chat-verified 2026-10-29). (b) Israel's "never confirmed a test / deliberate ambiguity" clause was backed only by the generic FAS/SIPRI ids; the Israel-specific SIPRI opacity source (`sipri-sipri-yearbook-2024-ch-7-sec-ix-israeli-nu`) was added to the intro's citation.
- **Anti-slop / SVG lens — 4 findings, all FIXED.** The timeline caption said "thirteen days" (Potsdam→Nagasaki is 14 days; the SVG itself uses day 0→14) → "**two weeks**". Both new SVGs had labels at 20–24 px (render <11 px at a ~294 px column) → raised to **≥26 px**. The Hiroshima death-toll value labels overflowed the 680-wide viewBox and clipped → redesigned so each value sits in a **left-anchored label above its bar** (nothing runs past the frame). The file header comment's false "24 px floor" claim was corrected.

Re-verified after the fixes: `npm run build` exit 0, **105 tests pass**, both checkers OK, smallest Hiroshima-SVG label font = 26.

---

## 4. §0 — waiting on owner (raptive-ready)

Logged for the owner before the About "How this site is made" paragraph (NBS-016): (1) a human review of the top ~30 pages, logged in the DEVLOG; (2) a phone test of the pages and nav; (3) the `info@nukeblastsimulator.com` mail test; (4) submit the sitemap in GSC + Bing; (5) GA4 view access ready at application time.

## 5. Honest gaps

- **No Chromium in the box:** the chart/SVG label sizes and the delivery/intro layout are verified by static inspection and the prerendered HTML, not a real browser or screenshots. The ≥11 px figures are computed for a ~294–326 px article column on a 390 px phone.
- The four-kill→nuclear-explosion **308 cannot be exercised from the box** (no running prod); the rule, its one-hop target and the absence of the old URL in the build are tested instead.
- The China growth and Israel opacity citations rest on the registry/chat verification of those sources' wording (chat-verified 2026-10-29); the box cannot re-fetch them.
