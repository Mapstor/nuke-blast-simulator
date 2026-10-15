# DEVLOG — nukeblastsimulator.com
> Handoff file. Read §0–§5 and the last 10 entries of §6 before any work. Rules: devlog skill (.claude/skills/devlog/SKILL.md). NOTE: the skills live at /workspace/.claude/skills (OUTSIDE this repo).

## §0 Resume here
_last update: 2026-10-15 · NBS-002_
- Phase: **Audit complete, fixing not started.** Full read-only audit (NBS-002) done; findings in `reports/audit/`.
- Last confirmed: NBS-002 AUDIT — full read-only site audit (Phases 0–2) + DEVLOG bootstrap — done (commit: see §6)
- In flight (handed, NOT confirmed): none. (NBS-001 RAPTIVEPREP was handed 2026-10-14 but never run; superseded by NBS-002.)
- Next action: chat writes fix waves from `reports/audit/SUMMARY.md` in site-audit Phase-3 order (P0 integrity → consolidation+redirects → trust frame → technical SEO → mobile → prose). First CC prompt will be NBS-003.
- Waiting on owner: (1) confirm the deployed Vercel commit = origin/master (can't be checked from the box); (2) grant Raptive view-only GA4 access when applying; (3) phone test on the top templates; (4) confirm author identity — real name (Marko Visic), credentials and sameAs to replace the "Editorial" persona; (5) decide AdSense pub-id vs Raptive on ads.txt.
- Open questions: Vercel production branch name; Bing Webmaster set up? author credentials + sameAs URL; keep or remove the 5 sensitive city pages (see §5); nuke-blast-simulator-backup/ — safe to delete?

## §1 Site card
- Domain · status · Raptive: nukeblastsimulator.com · live · NOT on Raptive yet (goal: apply after remediation)
- Owner (pushes, runs account steps) · machine: Marko Visic · owner's Mac (?)
- Author (byline · credentials · sameAs): Marko Visic — **but the live site currently bylines a collective "NukeBlastSimulator Editorial" Person persona, not Marko; no credentials or sameAs anywhere** (fix in trust-frame wave). Credentials/sameAs: ?
- Repo origin · branch: https://github.com/Mapstor/nuke-blast-simulator.git · master (HEAD eaf0b664, 2026-05-05; in sync with origin/master; default branch is master, not main)
- Project folder · box project · preview port: /workspace/nuke-blast-simulator · (box) · .devcontainer/port = 3019 (audit server was run on 4317)
- Stack · Node in box: Next.js 15.5.14 (App Router) · React 18.3.1 · TypeScript 5.3.3 · Tailwind 3.4 · zustand · framer-motion · Leaflet + react-leaflet AND Mapbox-gl + react-map-gl (both present) · next-seo · Node v20.20.2
- Commands (dev / build / test / lint): `npm run dev` / `npm run build` / (no tests) / `npm run lint`
- Deploy (host, project, trigger; owner pushes): Vercel · project "nukeblastsimulator" (prj_eqDUXhm4bA1x8GWHm8Ld3swOrzAt, org team_B6kyDt6yzHNCsWX1yIciKcY6) · trigger: owner pushes to GitHub; deployed commit NOT verifiable from box (owner check)
- Analytics / Search Console / Bing: GA4 G-XDZQYKGTE2 (single gtag.js install, NEXT_PUBLIC_GA_ID override; no GTM) · GSC verified (public/google12f8c2f9c03913a3.html + NEXT_PUBLIC_GSC_VERIFICATION) · Bing: ?
- Data sources (or registry path): src/lib/data/*.ts (bombs, cities, comparisons, scenarios, glossary, constants) · src/lib/calculations/* (effects engine) · population grids in src/lib/data/*.json. No data-sourcing registry yet; most figures uncited (see reports/audit/facts.csv).
- Key paths: routes src/app/** · tool+map src/components/simulator/** (MapWrapper = next/dynamic ssr:false) · engine src/lib/calculations/{blast,casualties,fallout,thermal}.ts · SEO src/lib/seo/{schemas.ts,og.tsx} · blog src/lib/blog/articles.ts · nav src/lib/menu/main-menu.ts
- Skills in repo: none inside the repo. Portfolio skills are at /workspace/.claude/skills (anti-slop-prose, content-page, data-sourcing, devlog, google-ai-content-policy, impeccable, kw-research, raptive-ready, seo-visibility, site-audit, site-launch). The repo's own .claude/ holds only settings.local.json.
- Design system (DESIGN.md / PRODUCT.md): none. Impeccable not initialized for this project (/workspace/.impeccable holds only hook consent).
- Other plans / ledgers: /workspace/claude-instruction-nukeblast.txt (original build brief). Keyword research files to live in research/ (keyword-ledger.csv, page-map.csv) — dir not created yet.
- Prompt code: NBS

## §2 Decisions in force
- D-01 · 2026-10-15 · Audit before fixing — NBS-002 AUDIT supersedes NBS-001 RAPTIVEPREP (handed 2026-10-14, never run). Why: fixing blind to the inventory wastes the pass (site-audit rule).
- D-02 · 2026-10-15 · Owner is committed to fully improving the site: Google SEO + AI-assistant visibility + a Raptive application. Why: defines the goal set for all upcoming waves.
- D-03 · 2026-10-14 · Effects benchmarks fixed: Glasstone & Dolan 1977 §2.127 (fireball) + Wikipedia "Effects of nuclear explosions" scaling table (blast, thermal). Chat-verified the live radii run ~1.6–2.4× high and fireball ~2.4× high. Why: need an authoritative yardstick before correcting the formulas.
- D-04 · 2026-10-15 · Keyword-research outputs live in research/ (keyword-ledger.csv, page-map.csv). Why: kw-research convention.

## §3 Rejected — don't re-propose
- (none yet)

## §4 Gotchas & hard rules
- /workspace is NOT a git repo; the repo root is /workspace/nuke-blast-simulator (origin Mapstor/nuke-blast-simulator, branch master). Skills at /workspace/.claude/skills are OUTSIDE the repo and cannot be committed to it.
- Deployed commit cannot be checked from the box — owner must confirm Vercel production = origin/master before trusting any audit of "live" behaviour.
- Casualty zones are overlapping concentric rings each computed and summed independently → systematic double/triple counting (src/lib/calculations/casualties.ts).
- Freshness is cosmetic: sitemap `lastModified = new Date()` (src/app/sitemap.ts:37) and articleSchema `dateModified = new Date()` (src/lib/seo/schemas.ts) both = build date; datePublished is hardcoded '2025-10-22' for all 425 content pages. Never present these as real dates.
- robots.ts:31 disallows /_next/ for userAgent '*' → can block Googlebot's render resources (AI bots are exempted).
- No vercel.json rules, no middleware, no redirects in next.config.js — all redirect/canonical logic must be added deliberately.
- Backup tree nuke-blast-simulator-backup/ is a stale pre-April copy (missing blog/compare/examples/scenarios/glossary) — do not edit or audit it.

## §5 Backlog (priority order)
Proposed in chat, **owner OK pending** (not yet decided/rejected):
- [P1] Hold casualties/fallout OUTPUT off the pages until a gridded population source is verified (current model uses a flat city density; double-counts).
- [P1] Consolidate the /scenarios matrix (250 pages) → 308-redirect into the city pages.
- [P1] Remove the 5 geopolitically sensitive city pages: tehran, tel-aviv, kyiv, moscow, pyongyang (all present in src/lib/data/cities.ts).
- [P1] About-page sentence about the TPNW treaty — keep or neutralize (decision pending; see reports/audit/trust.md).
- [P1+] Everything ranked in reports/audit/SUMMARY.md (P0/P1/P2) feeds the fix waves.

## §6 Log (append-only, newest at bottom)
### 2026-10-15 · NBS-002 AUDIT · CC · done
- What: Full read-only audit of nukeblastsimulator.com (site-audit Phases 0–2) + bootstrapped this DEVLOG.md and the CLAUDE.md DEVLOG block. No source/content/config/dependency files changed.
- Files (writes only): DEVLOG.md, CLAUDE.md, reports/audit/** (inventory.csv, links.csv, weapons.csv, cities.csv, analysis.json, build.txt, engine.md, js-off.md, technical.md, trust.md, duplicates.md, facts.csv, prose.md, impeccable.md, SUMMARY.md, tools/*.js + tools/.gitignore).
- Verified: production build `npm run build` exit 0 (504 static pages); prod server `next start -p 4317` served 200; crawl = 498 URLs = sitemap (all HTTP 200, 0 internal 404s); inventory rows = 498; all report files present. (commit hash: SEE git log below — finalized at commit time.)
- Commit: <pending> (pushed: no)
- Notes: Key P0/P1 signals — effect radii ~1.6–2.4× over benchmark + overlapping-zone casualty double-count (engine.md); fabricated "Editorial" Person persona on all 498 pages + no real author (trust.md); uniform cosmetic dates; robots /_next/ block; near-duplicate city pages (61/100 have a ≥0.8 twin) and 250 thin templated scenario pages; 50 very thin glossary pages; AdSense pub-id in ads.txt with no AdSense running. See reports/audit/SUMMARY.md for the ranked list and evidence files.

## §7 History & archive
- 2025-10 · Initial commit: Nuclear Blast Simulator (tool + 12 pages).
- 2026-03 · Added ads.txt (Google AdSense pub-3093026304369835) and route handler; TS fixes.
- 2026-04 · Extended GA4 implementation work; "Complete SEO + AI visibility overhaul" expanding from 12 to ~400 indexable pages.
- 2026-05 · Global navigation / mega menu wired to all pages, +48 cities, Person schema, OG redesign (HEAD eaf0b664, 2026-05-05).
