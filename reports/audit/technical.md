# Technical SEO Audit — Phase 6

_Nuclear Blast Simulator (NBS-002). READ-ONLY audit. Next.js 15.5.14 App Router, 498 crawled URLs, 504 prerendered routes (build.txt:24). Production server probed at http://localhost:4317. Sources: inventory.csv, analysis.json, duplicates.md, build.txt, links.csv, and the cited source files._

---

## 1. robots.txt

**Source:** `src/app/robots.ts` (Next Metadata Route → emits `/robots.txt`).
**Generated output:** `reports/audit/tools/robots.txt` (verbatim below, trimmed).

```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /_next/      ← robots.ts:31
Disallow: /admin/

User-Agent: GPTBot            Allow: /   Disallow: /api/
User-Agent: OAI-SearchBot     Allow: /   Disallow: /api/
User-Agent: ChatGPT-User      Allow: /   Disallow: /api/
User-Agent: PerplexityBot     Allow: /   Disallow: /api/
User-Agent: Perplexity-User   Allow: /   Disallow: /api/
User-Agent: ClaudeBot         Allow: /   Disallow: /api/
User-Agent: Claude-Web        Allow: /   Disallow: /api/
User-Agent: anthropic-ai      Allow: /   Disallow: /api/
User-Agent: CCBot             Allow: /   Disallow: /api/
User-Agent: Google-Extended   Allow: /   Disallow: /api/
User-Agent: Applebot-Extended Allow: /   Disallow: /api/
User-Agent: cohere-ai         Allow: /   Disallow: /api/
User-Agent: Bytespider        Allow: /   Disallow: /api/

Host: https://nukeblastsimulator.com
Sitemap: https://nukeblastsimulator.com/sitemap.xml
```

**check_robots.py output** (`reports/audit/tools/robots.txt`):
```
INFO: retrieval agent 'googlebot': partial disallows ['/_next/', '/admin/', '/api/'] — verify none cover content paths
INFO: retrieval agent 'bingbot': partial disallows ['/_next/', '/admin/', '/api/'] — verify none cover content paths
INFO: retrieval agent 'oai-searchbot': partial disallows ['/api/'] — verify none cover content paths
INFO: retrieval agent 'chatgpt-user': partial disallows ['/api/'] — verify none cover content paths
INFO: retrieval agent 'perplexitybot': partial disallows ['/api/'] — verify none cover content paths
INFO: retrieval agent 'claude-user': partial disallows ['/_next/', '/admin/', '/api/'] — verify none cover content paths
INFO: retrieval agent 'claude-searchbot': partial disallows ['/_next/', '/admin/', '/api/'] — verify none cover content paths
RESULT: OK (0 warnings, 7 info)
```

**CONFIRMED — `Disallow: /_next/` for `User-Agent: *` (`robots.ts:31`).** This is the one material robots defect.
- **SEO impact:** `/_next/static/` serves the JS/CSS Googlebot's Web Rendering Service (WRS) must fetch to render the page. Google's own guidance is explicit: do **not** block `/_next/static/` (or any render-critical CSS/JS) or rendered DOM, layout, and lazy content may be degraded or dropped. This site is especially exposed because the home simulator and every map are client-rendered (`MapWrapper.tsx:8-16`, `ssr:false`) — the interactive LCP region depends on `/_next/` chunks. Content HTML is server-rendered so text is still indexable, but blocking render resources is a self-inflicted rendering risk and a recurring Search Console "Blocked by robots.txt" / "Page indexed without content" trigger.
- **Note — AI bots are exempted.** All 13 AI crawlers (`robots.ts:8-22`) get their own rules that disallow **only** `/api/`, so they are **not** blocked from `/_next/`. Googlebot and Bingbot (which fall under `*`) ARE blocked from `/_next/`. Net effect: the render-resource block hits exactly the two crawlers that render JS, and spares the ones that mostly consume server HTML. `/admin/` does not exist as a route (harmless); `/api/` correctly hidden.
- Secondary: `Host:` directive (`robots.ts:41`) is non-standard/ignored by Google; harmless.

## 2. sitemap.xml

**Source:** `src/app/sitemap.ts`. **Count: 498 URLs** = 16 static (`sitemap.ts:18-34`) + 44 weapons (`:47-54`, `custom` excluded) + 100 cities (`:57-62`) + 250 scenarios (`:65-70`) + 30 compares (`:73-78`) + 50 glossary (`:81-86`) + 8 blog (`:89-94`). Matches the 498-row inventory; every crawled URL is in-sitemap, 0 orphaned-from-sitemap.

- **`lastModified = new Date()` (`sitemap.ts:37`)** — a single build-time timestamp applied to all 490 non-blog URLs. Confirmed in `analysis.json modDates`: **425 pages share `2026-10-15`** (crawl/build day) and 65 report `(none)`; only the **8 blog** URLs carry real dates (`sitemap.ts:91`, `new Date(a.dateModified ?? a.datePublished)`, the `2026-04-29` cohort). Impact: `<lastmod>` is a uniform, meaningless freshness signal that resets on every deploy — Google discounts `<lastmod>` it detects as non-truthful, so crawl-scheduling value is lost. Low severity (it's advisory), but it is noise.
- `changeFrequency`/`priority` are set per template (`:18-94`). Both are effectively ignored by Google today; cosmetic.

## 3. Canonicals, host, redirects, 404, headers

- **Canonicals: 0 mismatches** (`analysis.json canonMismatch: []`). Each template emits a correct self-referential absolute canonical, e.g. live `/weapons/tsar-bomba` → `<link rel="canonical" href="https://nukeblastsimulator.com/weapons/tsar-bomba"/>`. `metadataBase` is set (`layout.tsx:19`), so relative metadata resolves to the apex origin.
- **www-vs-apex:** The app canonicalises everything to the **apex** `https://nukeblastsimulator.com` (canonicals, `metadataBase`, `SITE_URL` in `schemas.ts:5`, sitemap `BASE_URL`). There is **no www→apex redirect in the codebase** — no `redirects()` in `next.config.js`, no `vercel.json`, no `middleware.ts`. Host normalization is therefore delegated entirely to the hosting/DNS layer (unverifiable from this repo). If www resolves and 200s without redirecting, canonicals alone are the only consolidation signal (works, but weaker than a 301).
- **Redirects: NONE in code.** `next.config.js` (full file, 16 lines) has no `redirects`/`rewrites`/`headers`. `inventory.csv redirect_chain` is empty for all 498 rows; `links.csv` = 23,352 internal links **all 200**, 0 redirect hops, 0 internal 3xx/4xx/5xx. Clean.
- **Trailing slash:** Next.js default (`trailingSlash` unset ⇒ `false`): canonical form is no-trailing-slash; `/path/` 308→`/path`. No duplication observed in inventory.
- **Custom 404:** `src/app/not-found.tsx` exists (branded 404 with links to `/`, `/about`, `/weapons`, `/faq`; metadata `title: '404 - Page Not Found'`). Live probe of a bogus path returns **HTTP/1.1 404** with `Cache-Control: private, no-cache, no-store` — correct soft-404-free behavior. Built as `/_not-found` (build.txt:30), 103 kB.
- **Response headers (live):** `X-Powered-By` is **absent** (confirms `poweredByHeader:false`, `next.config.js:13`). `compress:true` (`next.config.js:12`) is configured (gzip from the Node server); the probed dev/standalone response advertised no `Content-Encoding` to curl — compression likely terminated at a proxy in production, so verify `Content-Encoding: gzip/br` is present on the live edge. Static pages return `Cache-Control: s-maxage=31536000`, `x-nextjs-prerender: 1`, `x-nextjs-cache: HIT`, `ETag` — strong caching, fully prerendered.

## 4. Metadata (titles / descriptions / OG / Twitter)

- **Title template** `'%s | NukeBlastSimulator.com'` (`layout.tsx:22`); root default (`layout.tsx:21`) is itself 68 chars.
- **Length (analysis.json titleLen):** **492/498 titles > 60 chars**, and **448/498 > 70 chars.** The brand suffix ` | NukeBlastSimulator.com` is 25 chars — it alone pushes nearly every title past the SERP truncation zone (~60 char / ~580px). Brand-suffix bloat is the dominant title problem: the distinctive head of long scenario/city titles gets clipped in results. Recommend dropping or shortening the suffix on long templates.
- **Descriptions (analysis.json descLen):** **428/498 > 160 chars** (will truncate in SERP); `under70: 0`, `missing: 0` (none too short, none absent).
- **Duplicates: 0 duplicate titles and 0 duplicate descriptions** (`analysis.json dupTitleGroups:0, dupDescGroups:0`). Every page has a unique title and description — a genuine strength given the 498-page programmatic scale.
- **H1:** `missingH1: []`, `multiH1: []` — exactly one H1 per page across all 498.
- **OG / Twitter images:** site-wide default is static `/og-image.png` (1200×630, `layout.tsx:34-41`, `:47`). Four templates override with **dynamic `opengraph-image` routes** rendered per-entity: `weapons/[slug]`, `examples/[slug]`, `scenarios/[scenario]`, `compare/[slug]` (`src/app/.../opengraph-image.tsx`; build.txt:45,53,72,82 list them as dynamic `ƒ`). Live `/weapons/tsar-bomba` → `og:image = .../weapons/tsar-bomba/opengraph-image?<hash>`. Hub/legal/glossary/blog/home fall back to the static PNG.
- `twitter:card = summary_large_image` (`layout.tsx:44`). `keywords` meta present (`layout.tsx:25`) — ignored by Google, harmless.

## 5. Structured data (JSON-LD)

**No parse errors:** `inventory.csv jsonld_types` has **0 `PARSE_ERROR`** rows — all emitted JSON-LD is valid JSON. Per-template graph (`analysis.json schemaByTemplate`):

| template | n | schema types emitted |
|---|---|---|
| home | 1 | FAQPage, Organization, Person, SoftwareApplication, WebSite |
| legal | 9 | AboutPage, Article, BreadcrumbList, ContactPage, FAQPage, HowTo, Organization, Person, SoftwareApplication, WebSite |
| hub | 6 | BreadcrumbList, Dataset, DefinedTermSet, ItemList, Organization, Person, SoftwareApplication, WebSite |
| weapon | 44 | Article, BreadcrumbList, FAQPage, Organization, Person, SoftwareApplication, WebSite |
| city | 100 | Article, BreadcrumbList, FAQPage, Organization, Person, SoftwareApplication, WebSite |
| scenario | 250 | Article, BreadcrumbList, FAQPage, Organization, Person, SoftwareApplication, WebSite |
| compare | 30 | Article, BreadcrumbList, FAQPage, Organization, Person, SoftwareApplication, WebSite |
| glossary | 50 | BreadcrumbList, DefinedTerm, Organization, Person, SoftwareApplication, WebSite |
| blog | 8 | Article, BreadcrumbList, Organization, Person, SoftwareApplication, WebSite |

Site-wide root graph (`layout.tsx:78-81`): Organization + WebSite + SoftwareApplication + editorial Person, `@id`-linked (`schemas.ts:19-132`) — technically well-built, interconnected graph.

- **FAQPage on ~433 content pages is a DEAD rich result.** Emitted on home, legal, weapon, city, scenario, compare (`faqPageSchema`, `schemas.ts:155-168`). Google **deprecated FAQ rich results in 2023** and the carousel is gone; FAQPage no longer produces any SERP enhancement for non-gov/health sites. It is not harmful markup, but it buys nothing. Keep the on-page FAQ **content** (good for users/AI answers); the `FAQPage` JSON-LD can be dropped as inert. (Project note flags deprecation effective May 2026 — either way it is a no-op rich result today.)
- **Editorial Person is a collective persona, not a human** (`schemas.ts:108-132`): `@type Person`, `name "NukeBlastSimulator Editorial"`, `jobTitle "Editorial Team"`, referenced as `author` on every `Article` (`schemas.ts:214`). A `Person` named "…Editorial" with jobTitle "Editorial Team" is an E-E-A-T mismatch — Google expects a real, attributable author for YMCA/sensitive (nuclear) topics. Site owner/author is Marko Visic (not surfaced in schema). This is an authorship/trust signal gap, not a crawl/render defect.
- **Article dates are cosmetic/uniform** (`schemas.ts:211-212`): `datePublished` defaults to the literal `'2025-10-22'` and `dateModified` defaults to `new Date()` (today). Confirmed in `analysis.json`: **425 pages share pubDate `2025-10-22` and modDate `2026-10-15`** (the crawl day). Every programmatic page therefore claims "modified today," which is false freshness that resets each build — a thin/misleading signal, low severity but worth truthing.
- Hub pages carry `Dataset`/`DefinedTermSet`/`ItemList` and glossary carries `DefinedTerm` — appropriate, valid types.

## 6. Internal linking

- **Nav/footer chrome = 16 links, on all 498 pages.** `links.csv` confirms exactly 16 internal targets each receive **498 inlinks** (one per page): `/`, `/how-it-works`, `/weapons`, `/examples`, `/scenarios`, `/compare`, `/blog`, `/glossary`, `/methodology`, `/faq`, `/about`, `/resources`, `/sources`, `/contact`, `/terms`, `/privacy`.
- **0 true orphans — everything is reachable** via chrome. But **15 hub/legal pages have 0 in-content (editorial) inlinks** (`analysis.json orphans`): the 6 hubs (`/weapons /examples /scenarios /compare /glossary /blog`) and 9 legal/info pages (`/about /methodology /how-it-works /faq /privacy /contact /terms /resources /sources`). For each of the 16 chrome targets, content inlinks = total − 498 = **0** — they get link equity only from boilerplate, which Google heavily discounts. These hubs sit above 490 detail pages yet receive no contextual links from body copy, capping their ranking authority.
- **Scale:** 23,352 internal links, **all HTTP 200** (0 broken, 0 redirected). Outlinks/page: min 16 (chrome-only = the orphan hubs/legal, confirming they add no body links), median 32, max 276. Detail pages do cross-link within template: top body targets are `/weapons/castle-bravo` (140 inlinks), `/weapons/little-boy` (139), `/weapons/tsar-bomba` (135), `/weapons/w76` (134) — healthy weapon hub-and-spoke, but the **category hubs themselves are link-starved** in content.
- **External citations: 17**, all to high-authority disarmament/science domains (ICANW ×2, SIPRI, FAS, Bulletin of the Atomic Scientists, Carnegie, UNIDIR, Belfer, ICRC, CTBTO, UN, ICJ, NTI, Mapbox attribution). Good outbound E-E-A-T; status `unverified: box firewall` only because the sandbox blocks egress (not a site defect). Anchors are descriptive org names.

## 7. Performance (from build.txt + live probe)

- **First-load JS** (build.txt:28-86): **shared baseline 103 kB** (two chunks: `4bd1b696` 54.2 kB + `255-…` 46 kB + 2.5 kB). **Home 116 kB** (10.3 kB page-specific — the heaviest route, it hydrates the interactive simulator shell). Content templates **~106 kB** (blog/compare/examples/scenarios/glossary/weapons hubs+detail all ~106 kB; legal/404/about ~103 kB). These are moderate, healthy App-Router numbers — nothing over 120 kB.
- **Map is lazy-loaded, out of first paint:** `MapboxMap` is imported via `next/dynamic` with **`ssr: false`** and a loading placeholder (`MapWrapper.tsx:8-16`). The heavy map/Mapbox bundle is therefore **not** in the 116 kB first-load and not server-rendered — good for initial JS/LCP, but it also means the map LCP region depends on client JS **and on `/_next/` chunks that robots blocks for Googlebot** (ties back to §1).
- **Likely LCP element per template:** home → the map/simulator placeholder then canvas (client, deferred) or the H1 hero; content pages (weapon/city/scenario/compare/glossary/blog) → the server-rendered H1 + first text block (fast, HTML-first). Content LCP is healthy; home LCP is the risk surface.
- **Images:** `next/image` configured for **AVIF + WebP** with tuned `deviceSizes`/`imageSizes` (`next.config.js:7-11`) — modern formats on-demand. But the **static social image `public/og-image.png` is 127 KB** (127,179 bytes, 1200×630) and is **not** served through `next/image` (OG images must be absolute static assets) — it is fine as a share-card but is the largest single static asset; an `og-image.svg` (2.2 KB) also exists unused by metadata. Favicons are SVG (`favicon.svg` 1 KB, `icon.svg` 1.2 KB) — lightweight.
- **Fonts:** **no `next/font`** anywhere (grep: 0 imports). Typography is system/CSS fonts from `globals.css`/theme CSS (`layout.tsx:2-6`). No webfont download, no `next/font` optimization — zero font-blocking and zero CLS-from-fonts, but also no custom brand font. Neutral-to-positive for performance.
- **Caching:** static routes return `s-maxage=31536000` + `x-nextjs-cache: HIT` + `ETag` — excellent. 404 is `no-store`. `compress:true` set; confirm `Content-Encoding` is actually emitted at the production edge (not observed on the local probe).

---

## Priority list

### P0 — fix first
- **robots.ts:31 blocks `/_next/` for `User-Agent: *`** → Googlebot/Bingbot cannot fetch render-critical JS/CSS; the client-rendered home simulator + all maps are the exposed LCP/content. Remove `/_next/` from the `*` disallow (keep `/api/`, drop the non-existent `/admin/`). This is the only crawl/render-breaking defect found.

### P1 — high impact
- **Title brand-suffix bloat:** 492/498 titles >60 chars, 448/498 >70, driven by the 25-char ` | NukeBlastSimulator.com` suffix (`layout.tsx:22`). Shorten/drop the suffix on long templates so distinctive keywords survive SERP truncation.
- **428/498 meta descriptions >160 chars** → SERP truncation. Trim toward ~150–155.
- **15 hubs/legal pages have 0 in-content inlinks** (6 category hubs + 9 legal/info; `analysis.json orphans`). Add contextual body links from detail pages up to their hubs to pass real link equity (chrome-only links are discounted).
- **Author E-E-A-T gap:** site-wide `author` is a collective `Person` "NukeBlastSimulator Editorial"/"Editorial Team" (`schemas.ts:108-132,214`), not a real attributable human — weak for a sensitive/YMYL nuclear topic. Attribute to a named person (owner Marko Visic) with real credentials.

### P2 — cleanup / low severity
- **FAQPage JSON-LD on ~433 pages is an inert/dead rich result** (deprecated; `schemas.ts:155-168`). Keep on-page FAQ content; drop the JSON-LD as no-op clutter.
- **Uniform/false dates:** `sitemap.ts:37` `lastModified=new Date()` on 490 URLs and `schemas.ts:211-212` `datePublished '2025-10-22'`/`dateModified=today` on 425 pages → freshness resets every build. Emit real per-entity dates or omit.
- **No www→apex 301 in code** (`next.config.js`, no `vercel.json`/`middleware`) — consolidation relies on canonicals + host layer. Add a host-level 301 to be safe.
- **`og-image.png` = 127 KB** static (largest asset; unused `og-image.svg` also present). Compress the PNG. Confirm `Content-Encoding` (compress:true) is actually served at the production edge. `Host:` line in robots is non-standard (harmless).
