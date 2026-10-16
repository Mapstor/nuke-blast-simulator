# DEVLOG — nukeblastsimulator.com
> Handoff file. Read §0–§5 and the last 10 entries of §6 before any work. Rules: devlog skill (.claude/skills/devlog/SKILL.md). NOTE: the skills live at /workspace/.claude/skills (OUTSIDE this repo).

## §0 Resume here
_last update: 2026-10-16 · NBS-004_
- Phase: **Fixing — waves 1–2 done, unpushed.** Audit (NBS-002) + integrity (NBS-003) + consolidation (NBS-004) committed, not pushed.
- Last confirmed: NBS-004 CONSOLIDATE — 250 /scenarios pages folded into city pages via 251 permanent 308s; real content-date manifest (data/content-dates.json) with drift test; headshot via next/image — done (commit: see §6; build exit 0, 15 tests pass).
- In flight (handed, NOT confirmed): none. (NBS-001 RAPTIVEPREP never run; superseded by NBS-002.)
- Next action: **NBS-005 FACTS** — chat verifies every figure in `reports/audit/facts.csv` (306 uncited) against primary sources; correct or remove; only then re-enable casualties/fallout with a verified model. Also chat: KWP keyword universe from Discover exports into research/.
- Waiting on owner: (1) push NBS-002…NBS-004 and confirm the deployed Vercel commit = this one; (2) preview-branch phone test of NBS-003 (consent banner, /about, a weapon page); (3) confirm `info@nukeblastsimulator.com` receives mail; (4) grant Raptive view-only GA4 access when applying; (5) replace the interim consent banner with a CMP on ad-network acceptance.
- Open questions: Vercel production branch name; Bing Webmaster set up? nuke-blast-simulator-backup/ — safe to delete?

## §1 Site card
- Domain · status · Raptive: nukeblastsimulator.com · live · NOT on Raptive yet (goal: apply after remediation)
- Owner (pushes, runs account steps) · machine: Marko Visic · owner's Mac (?)
- Author (byline · credentials · sameAs): **Marko Visic** · BSc Physics (schema `hasCredential`), MPharm shown on /about prose only — never "registered/licensed" · sameAs https://www.linkedin.com/in/marko-visic/ · headshot /images/marko-visic.jpeg. Set sitewide by NBS-003 (Person schema in layout + visible bylines). Publisher Organization = Moving Data Systems d.o.o., Smolnik 62, 2342 Ruše, Slovenia.
- Repo origin · branch: https://github.com/Mapstor/nuke-blast-simulator.git · master (default branch is master, not main)
- Project folder · box project · preview port: /workspace/nuke-blast-simulator · (box) · .devcontainer/port = 3019 (verify servers run on 4317+)
- Stack · Node in box: Next.js 15.5.14 (App Router) · React 18.3.1 · TypeScript 5.3.3 · Tailwind 3.4 · zustand · framer-motion · Leaflet + react-leaflet AND Mapbox-gl + react-map-gl (both present) · next-seo · vitest (tests) · Node v20.20.2
- Commands (dev / build / test / lint): `npm run dev` / `npm run build` / `npm test` (vitest; tests/effects.test.ts + tests/content-dates.test.ts) / `npm run lint`. Dates: after a content change run `node scripts/update-content-dates.mjs` to refresh data/content-dates.json (the drift test fails until you do).
- Deploy (host, project, trigger; owner pushes): Vercel · project "nukeblastsimulator" (prj_eqDUXhm4bA1x8GWHm8Ld3swOrzAt, org team_B6kyDt6yzHNCsWX1yIciKcY6) · trigger: owner pushes to GitHub; deployed commit NOT verifiable from box (owner check)
- Analytics / Search Console / Bing: GA4 G-XDZQYKGTE2 (single gtag.js, NEXT_PUBLIC_GA_ID override; no GTM) · **Consent Mode v2 interim** (analytics_storage denied by default for EEA/UK/CH via Europe/* timezone heuristic; banner + footer "Cookie settings"; src/components/consent/ConsentManager.tsx — replace with CMP on ad acceptance) · GSC verified (public/google12f8c2f9c03913a3.html + NEXT_PUBLIC_GSC_VERIFICATION) · Bing: ?
- Data sources (or registry path): src/lib/data/*.ts (bombs, cities, comparisons, scenarios, glossary, constants) · src/lib/calculations/* (effects engine) · population grids in src/lib/data/*.json. No data-sourcing registry yet; most figures uncited (see reports/audit/facts.csv).
- Key paths: routes src/app/** · tool+map src/components/simulator/** (MapWrapper = next/dynamic ssr:false) · engine src/lib/calculations/{effects,config}.ts (blast/thermal/fallout/casualties are shims/off) · SEO src/lib/seo/{schemas.ts,og.tsx,contentDates.ts} · dates data/content-dates.json + scripts/{update-content-dates,content-hash}.mjs · redirects data/scenario-redirects.json (next.config.js) + scripts/generate-scenario-redirects.mjs · blog src/lib/blog/articles.ts · nav src/lib/menu/main-menu.ts
- Skills in repo: none inside the repo. Portfolio skills are at /workspace/.claude/skills (anti-slop-prose, content-page, data-sourcing, devlog, google-ai-content-policy, impeccable, kw-research, raptive-ready, seo-visibility, site-audit, site-launch). The repo's own .claude/ holds only settings.local.json.
- Design system (DESIGN.md / PRODUCT.md): none. Impeccable not initialized for this project (/workspace/.impeccable holds only hook consent).
- Other plans / ledgers: /workspace/claude-instruction-nukeblast.txt (original build brief). Keyword research files to live in research/ (keyword-ledger.csv, page-map.csv) — dir not created yet.
- Prompt code: NBS

## §2 Decisions in force
- D-01 · 2026-10-15 · Audit before fixing — NBS-002 AUDIT supersedes NBS-001 RAPTIVEPREP (handed 2026-10-14, never run). Why: fixing blind to the inventory wastes the pass (site-audit rule).
- D-02 · 2026-10-15 · Owner is committed to fully improving the site: Google SEO + AI-assistant visibility + a Raptive application. Why: defines the goal set for all upcoming waves.
- D-03 · 2026-10-14 · Effects benchmarks fixed: Glasstone & Dolan 1977 §2.127 (fireball) + Wikipedia "Effects of nuclear explosions" scaling table (blast, thermal). Chat-verified the live radii run ~1.6–2.4× high and fireball ~2.4× high. Why: need an authoritative yardstick before correcting the formulas.
- D-04 · 2026-10-15 · Keyword-research outputs live in research/ (keyword-ledger.csv, page-map.csv). Why: kw-research convention.
- D-05 · 2026-10-15 · Casualty, fallout, radiation, crater, surface-burst and conventional-weapon effects are WITHDRAWN until verified in chat (owner: "off until verified"). Toggled by EFFECTS_FLAGS in src/lib/calculations/config.ts (all false). Why: the old casualty model double-counted and the fireball/blast radii were unverified; show only what's benchmarked.
- D-06 · 2026-10-15 · Effects engine = one module (src/lib/calculations/effects.ts): fireball 0.061·W^0.4 (G&D §2.127 max air-burst), blast/thermal by log-log interpolation of the Wikipedia scaling table, air burst at optimum height only. Why: single source of truth; no hard-coded radii elsewhere.
- D-07 · 2026-10-15 · Author = Marko Visic (BSc Physics) sitewide; publisher = Moving Data Systems d.o.o. Why: replace the fabricated "Editorial" persona (Raptive decline trigger).
- D-08 · 2026-10-15 · /about uses neutral education framing; TPNW endorsement removed (Peace Resources page kept). Why: brand-safety / avoid uncredentialed advocacy.
- D-09 · 2026-10-15 · /scenarios weapon×city matrix (250 pages) → 308 into the city pages. Executed in NBS-004 (251 rules in data/scenario-redirects.json via next.config.js).
- D-10 · 2026-10-15 · Page dates come from a committed content-hash manifest (data/content-dates.json), never from build time; dateModified moves only when a page's content hash changes. Why: stop cosmetic/uniform freshness (seo-visibility rule 8); a test blocks drift.
- D-11 · 2026-10-16 · The sitewide `border-l-4` "side-tab" callout style is handled in the DESIGN wave (impeccable flags it as an AI-UI tell); the two NBS-003 file-scoped impeccable ignores (weapons/[slug], compare/[slug]) are REMOVED in that wave. Why: don't normalize the tell permanently; fix it properly sitewide.

## §3 Rejected — don't re-propose
- 2026-10-15 · Removing the tehran, tel-aviv, kyiv, moscow and pyongyang city pages — owner keeps them (was an audit proposal; decided against).

## §4 Gotchas & hard rules
- /workspace is NOT a git repo; the repo root is /workspace/nuke-blast-simulator (origin Mapstor/nuke-blast-simulator, branch master). Skills at /workspace/.claude/skills are OUTSIDE the repo and cannot be committed to it.
- Deployed commit cannot be checked from the box — owner must confirm Vercel production = origin/master before trusting any audit of "live" behaviour.
- Effect radii live ONLY in `src/lib/calculations/effects.ts`; never hard-code a radius elsewhere. Everything assumes an air burst at optimum height. Surface/fallout/radiation/crater/casualty/conventional outputs are flag-gated OFF (config.ts) — do not render them or re-enable a flag without a verified model + a DEVLOG decision.
- Casualty model (casualties.ts) double-counts overlapping rings; it is retained but disabled and not imported by any rendered path. Do not resurrect it; a verified gridded-population model is the prerequisite (NBS-004+).
- Dates are manifest-driven (data/content-dates.json), NOT build time. After ANY content change, run `node scripts/update-content-dates.mjs` and commit the manifest, or tests/content-dates.test.ts fails. Never reintroduce `new Date()` for a page date. The content hash strips chrome/scripts/styles/`<time>`, so a date value never changes a hash.
- /scenarios is retired: next.config.js serves 251 permanent 308s from data/scenario-redirects.json. Still no middleware; any new redirect goes in next.config (regenerate scenario rules with scripts/generate-scenario-redirects.mjs if the featured set changes). src/lib/data/scenarios.ts is kept only for that generator.
- The box mounts the parent folder; the repo is /workspace/nuke-blast-simulator (branch master); nuke-blast-simulator-backup/ is a stale pre-April copy (missing blog/compare/examples/glossary) — never edit or audit it.

## §5 Backlog (priority order)
- [P0→NBS-005 FACTS] Chat verifies every figure in `reports/audit/facts.csv` (306 uncited) against primary sources; correct or remove. Then re-enable casualties/fallout only with a verified gridded-population + fallout model.
- [P1] Near-duplicate city pages (61/100 have a ≥0.8 twin) + 50 very thin glossary pages: consolidate/upgrade (reports/audit/duplicates.md).
- [P1] Titles: 492/498 >60 chars (brand-suffix bloat); descriptions 428/498 >160. 15 hub/legal pages have 0 in-content inlinks.
- [P2 DESIGN wave] impeccable pass: replace the sitewide `border-l-4` callout tell (then remove the two NBS-003 ignores, D-11); duplicate viewport meta; MapWrapper catches all errors; home CTA href="#"; sr-only H1; web manifest; custom-404 nav; og-image.png 127 KB. (reports/audit/impeccable.md)
- [P2] Bing Webmaster set up + sitemap submit.
- Everything ranked in `reports/audit/SUMMARY.md` feeds the remaining waves.

## §6 Log (append-only, newest at bottom)
### 2026-10-15 · NBS-002 AUDIT · CC · done
- What: Full read-only audit of nukeblastsimulator.com (site-audit Phases 0–2) + bootstrapped this DEVLOG.md and the CLAUDE.md DEVLOG block. No source/content/config/dependency files changed.
- Files (writes only): DEVLOG.md, CLAUDE.md, reports/audit/** (inventory.csv, links.csv, weapons.csv, cities.csv, analysis.json, build.txt, engine.md, js-off.md, technical.md, trust.md, duplicates.md, facts.csv, prose.md, impeccable.md, SUMMARY.md, tools/*.js + tools/.gitignore).
- Verified: production build `npm run build` exit 0 (504 static pages); prod server `next start -p 4317` served HTTP 200; crawl = 498 URLs = sitemap (all HTTP 200, 0 internal 404s); inventory data rows = 498; `ls reports/audit` shows all 15 report files; `git status --short` showed only DEVLOG.md, CLAUDE.md, reports/, .claude/.
- Commit: d5659870 (reports+bootstrap); DEVLOG hash-record follow-up after. (pushed: no)
- Notes: Key P0/P1 signals — effect radii ~1.6–2.4× over benchmark + overlapping-zone casualty double-count (engine.md); fabricated "Editorial" Person persona on all 498 pages + no real author (trust.md); uniform cosmetic dates; robots /_next/ block; near-duplicate city pages (61/100 have a ≥0.8 twin) and 250 thin templated scenario pages; 50 very thin glossary pages; AdSense pub-id in ads.txt with no AdSense running. See reports/audit/SUMMARY.md for the ranked list and evidence files.

### 2026-10-15 · NBS-003 INTEGRITY · CC · done
- What: Fix wave 1 (code-side P0s). New single effects engine (effects.ts): fireball 0.061·W^0.4, blast/thermal by log-log interpolation of the Wikipedia scaling table, air burst at optimum height. Withdrawal flags (config.ts, all false) hide casualties/fallout/radiation/crater/surface/conventional effects across the 4 templates + tool + FAQ/meta/JSON-LD/OG. 15 conventional weapons removed from the picker (specs kept). /methodology + /faq rewritten to the real formulas; HowTo schema removed; fictional "population grid" claim deleted. Fabricated "Editorial" persona → Marko Visic (Person schema + bylines + rel=me + headshot); publisher Moving Data Systems d.o.o.; /about neutral framing (TPNW endorsement removed) + how-made; /contact + /privacy rewritten (GA4/Mapbox/Vercel named; Consent Mode v2 interim banner); robots /_next/ unblocked; ads.txt (pub-3093026304369835) removed → /ads.txt 404.
- Files: new effects.ts, config.ts, Byline.tsx, consent/ConsentManager.tsx, tests/effects.test.ts; deleted public/ads.txt, api/ads.txt.js, src/app/ads.txt/route.ts; modified the 4 effect templates + hubs, home, about, contact, privacy, terms, methodology, how-it-works, faq, blog (index+article), layout, robots, Analytics, HomeClient, BombSelector, ResultsPanel, ShareButton, Footer, blog/articles.ts, schemas.ts, blast/thermal/fallout/casualties.ts, package.json (+vitest). Full report: reports/NBS-003-report.md.
- Verified: `npm run build` exit 0 (503 routes); `npm test` (vitest) 11 passed, 0 skipped; built HTML 0 "Editorial", 499/499 pages "Marko Visic", 0 withdrawn casualty/fallout strings; /weapons/little-boy shows 0.54/1.54/4.26 km + 0.18 fireball; /weapons/tsar-bomba shows 8.64/23.1/64.1 km + 4.62 fireball; robots.txt no /_next/ (check_robots.py OK); /ads.txt → 404. UI behaviour (consent banner interaction, mobile) UNVERIFIED (no browser).
- Commit: 58459c24 (pushed: no)
- Notes: Tsar 1 psi displays 64.1 km (brief listed 64.2 — same value, different rounding; not a formula error). Dates still cosmetic (NBS-004). .DS_Store untracked (was tracked but gitignored).

### 2026-10-16 · NBS-004 CONSOLIDATE · CC · done
- What: Folded the 250 /scenarios pages into the city pages. Deleted src/app/scenarios/** (route + index + OG); added 251 permanent 308s (data/scenario-redirects.json via next.config.js redirects()): every /scenarios/{bomb}-on-{city} → /examples/{city}, /scenarios → /examples. Removed all internal /scenarios links (sitemap, home section, weapons/examples/compare hubs, footer, search index, mega-menu panel, SearchPalette, FAQ wording). Real content dates: data/content-dates.json (per-URL date-independent content hash + datePublished seeded from git/article + dateModified), scripts/update-content-dates.mjs (+ content-hash.mjs), read by sitemap/articleSchema/blog via src/lib/seo/contentDates.ts; tests/content-dates.test.ts blocks drift. Headshot → next/image, all refs .jpeg.
- Files: deleted src/app/scenarios/** ; new data/{scenario-redirects,content-dates}.json, scripts/{generate-scenario-redirects,update-content-dates,content-hash}.mjs, src/lib/seo/contentDates.ts, tests/content-dates.test.ts; modified next.config.js, sitemap.ts, schemas.ts, page.tsx (home), weapons/examples/compare hubs, blog/[slug], about, faq, Footer, search/index.ts, main-menu.ts, SearchPalette.tsx, scenarios.ts (comment). Report: reports/NBS-004-report.md.
- Verified: `npm run build` exit 0 (252 static routes, was 503); `npm test` 15 passed, 0 skipped (11 effects + 4 content-dates). Local server: /scenarios/tsar-bomba-on-new-york, /b83-on-moscow, /little-boy-on-tokyo, /scenarios → 308 to /examples/new-york, /moscow, /tokyo, /examples, each one hop → 200. Redirect rules = 251. 0 /scenarios in built HTML and sitemap. Sitemap 498 → 247. Manifest: 247 pages, earliest datePublished 2025-10-30, all dateModified 2026-10-15. Headshot file exists, referenced via next/image. UI behaviour (nav, redirects in a real browser) UNVERIFIED (no browser).
- Commit: 0aa7a035 (pushed: no)
- Notes: dateModified seeded uniformly 2026-10-15 (NBS-003 honest date); 4 hub/home pages also changed today (2026-10-16) → 1-day conservative, acceptable. scenarios.ts kept only for the redirect generator.

## §7 History & archive
- 2025-10 · Initial commit: Nuclear Blast Simulator (tool + 12 pages).
- 2026-03 · Added ads.txt (Google AdSense pub-3093026304369835) and route handler; TS fixes.
- 2026-04 · Extended GA4 implementation work; "Complete SEO + AI visibility overhaul" expanding from 12 to ~400 indexable pages.
- 2026-05 · Global navigation / mega menu wired to all pages, +48 cities, Person schema, OG redesign (HEAD eaf0b664, 2026-05-05).
