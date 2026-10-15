# Phase 9 — Trust Frame & Author Identity Audit

**Audit:** NBS-002 (read-only) · **Date:** 2026-10-15
**Standard:** `/workspace/.claude/skills/raptive-ready/SKILL.md` §"Trust and author-identity standard"
**Site owner/author of record (DEVLOG §1):** Marko Visic

---

## 1. Organisation-as-author / "Editorial" / team strings

There is **NO real named human author with credentials anywhere on the site.** Every byline, author field, and Person schema resolves to a collective persona ("NukeBlastSimulator Editorial" / "Editorial Team"). The real owner **Marko Visic is never named** — zero occurrences of "Marko" or "Visic" in `src/` or in any rendered HTML. This is a direct violation of the standard's byline + credentials + Person-schema-from-§1 requirements.

### Inventory of the collective-persona strings

**A. Person schema (the core E-E-A-T entity) — `src/lib/seo/schemas.ts`**
- L11: `EDITORIAL_PERSON_ID = ${SITE_URL}/about#editorial`
- L104–107: comment admitting it is a "collective Person entity for E-E-A-T signal", to be named "once the team is named publicly" (i.e. it isn't)
- L108: `editorialPersonSchema` → `@type: 'Person'`
- L112: `name: 'NukeBlastSimulator Editorial'`
- L113: `alternateName: 'NBS Editorial'`
- L115: `jobTitle: 'Editorial Team'`
- L116–117: description "The editorial team behind Nuclear Blast Simulator…"
- **L214:** `articleSchema.author = { '@id': EDITORIAL_PERSON_ID }` — every Article on the site attributes authorship to this non-human Person.
- Emitted site-wide via `layout.tsx` L15, L80 (injected into the root JSON-LD graph on every page).

**B. Site-level author metadata — `src/app/layout.tsx`**
- L26: `authors: [{ name: 'NukeBlastSimulator.com' }]` — author is the **domain name**, not a person.

**C. Visible "Editorial Team" block — `src/app/about/page.tsx`**
- L27: `<section id="editorial">` (anchor target of the Person `@id`)
- L28: `<h2>Editorial Team</h2>`
- L35: visible name "NukeBlastSimulator Editorial"
- L36: "Editorial team · Last reviewed {new Date()…}" (auto-generated review date — see §6)
- L41: body "written and reviewed by the NukeBlastSimulator Editorial team"
- No person, no credentials, no alumniOf, no hasCredential, no sameAs, no rel="me".

**D. Visible blog bylines — `src/app/blog/[slug]/page.tsx`**
- L56: OG `authors: [article.author]`
- L90: `articleSchema(... authorName: article.author)`
- L118: rendered byline `By <span>{article.author}</span>`
- Source of `article.author`: **`src/lib/blog/articles.ts`** — all 8 articles hardcode `author: 'NukeBlastSimulator Editorial'` (L16, 80, 141, 205, 268, 332, 399, 460). Every blog post is "By NukeBlastSimulator Editorial".
- `src/lib/blog/types.ts` L18: `author: string` (field def).

**E. Blog index — `src/app/blog/page.tsx`**
- L27 "Editorial Articles", L46 "Long-form, sourced editorial…".

**Count:** collective-persona / org-as-author strings appear across **7 source files** (schemas.ts, layout.tsx, about, blog/[slug], blog/page, blog/articles.ts, blog/types.ts). Named-human-author count: **0.** rel="me" / sameAs / LinkedIn / hasCredential / alumniOf: **0 occurrences in all of src/** (grep clean).

---

## 2. Author / Person / Organization schema — asserted identity vs reality

| Schema (@type) | Where | Asserts | Reality |
|---|---|---|---|
| `Person` (editorialPersonSchema) | schemas.ts L108; layout L80 (all pages) | A "Person" named *NukeBlastSimulator Editorial*, jobTitle *Editorial Team*, `knowsAbout` 10 nuclear topics, `worksFor`/`affiliation` the Org | **Not a person.** A brand label dressed as `@type:Person`. No name, no credential, no sameAs. Misrepresentation risk under Raptive's "invented personas" red flag. |
| `Article.author` | schemas.ts L214 (every article + methodology) | authored by the Person `@id` above | Authored by nobody identifiable; owner Marko Visic absent. |
| `Organization` | schemas.ts L19–43; layout L80 | name `NukeBlastSimulator.com`, email `info@nukeblastsimulator.com`, logo `/icon.svg`, `knowsAbout` list | Org is internally consistent, but has **no `founder`/`sameAs`/real human** to anchor it. |
| `AboutPage` / `ContactPage` | about L17 / contact L17 | `mainEntity`/`about` → the Org | Point at the Org, never at a person. |
| metadata `authors` | layout L26 | author = "NukeBlastSimulator.com" | Author is a domain string. |

Net: the schema graph is technically well-formed and cross-linked by `@id`, but it **manufactures an author entity rather than naming the real one.** Against the raptive-ready standard ("Person schema from §1: name, alumniOf, hasCredential, knowsAbout, sameAs … plus a visible rel=me link") it fails on every field except `knowsAbout`.

---

## 3. About / Contact / Privacy / Terms content vs the real stack

**Privacy (`src/app/privacy/page.tsx`) — FAILS "policy matches the stack".**
- GA4 **is running** site-wide: `src/components/Analytics.tsx` loads `googletagmanager.com/gtag/js?id=G-XDZQYKGTE2` (L7, L38) and is mounted in `layout.tsx` L84. Confirmed in live HTML (`/privacy` serves a `googletagmanager` script).
- Yet the Privacy page **never names Google Analytics or GA4.** Live-rendered body text check: `GA4`=absent, `Google Analytics`=absent. It only lists **Mapbox** (L86–96) and generic "web hosting" (L99–109) as third parties.
- It affirmatively claims the opposite of reality: L120 "**No tracking cookies or advertising cookies**", L124 "All data is cleared when you close the browser", L159 "**No opt-out required since there's no tracking**", L187 "GDPR compliant". GA4 sets `_ga`/`_gid` persistent cookies and is analytics tracking — these statements are false as written. No consent/CMP banner exists.
- **AdSense:** no AdSense/`adsbygoogle` script loads anywhere (grep clean; live `/about` clean). But `public/ads.txt` publishes `google.com, pub-3093026304369835, DIRECT, f08c47fec0942fa0` — an authorized-seller declaration for an ad network **that is not installed.** This is the exact "policy pages that don't match the stack" red flag (cf. calculatemybmi's phantom AdSense). No policy page *mentions* ads/AdSense; the mismatch is ads.txt-vs-reality rather than copy-vs-reality, but it still trips the domain "advertising infringements" check.

**Contact (`src/app/contact/page.tsx`) — on-domain address present but likely non-functional.**
- Single contact channel: `info@nukeblastsimulator.com` (L43, L221; mailto at about L57). It **is** on-domain (good). No contact form. Stated SLAs ("Security Issues: Within 24 hours", "URGENT SECURITY REPORT", L107/L135) and a "Professional Network" / "Mission Statement" of partnerships (L200–215) are unverifiable claims for a one-person site — presentation of an institution that isn't evidenced. Deliverability of the mailbox not verifiable in this audit; flag for owner to confirm it receives mail.

**About (`src/app/about/page.tsx`) — TPNW sentence flagged by chat, reported verbatim (NOT edited):**

> "We support international efforts for nuclear disarmament, including the Treaty on the Prohibition of Nuclear Weapons, and organizations working toward nuclear abolition." *(about/page.tsx L171–174)*

This is an **advocacy/political-position statement** made in the voice of the (fictitious) editorial team. It takes a side on a contested arms-control treaty rather than describing it neutrally — a brand-safety/voice concern for review, and it rests on a persona with no real author behind it. (The Resources page L37–55 separately describes TPNW factually.)

**Terms (`src/app/terms/page.tsx`)** — standard educational-use boilerplate; L119–123 again asserts "No data … shared with third parties" / local-only processing, contradicting the live GA4 beacon. Age gate (L104, 16+) present.

---

## 4. Footer, header, favicon, manifest, 404

**Footer link set (`src/components/layout/Footer.tsx` L5–42)** — four groups:
- **Tools:** Simulator (/), Weapons Database (/weapons), City Scenarios (/examples), Bomb-on-City Scenarios (/scenarios), Weapon Comparisons (/compare)
- **Learn:** Blog (/blog), Glossary (/glossary), How It Works (/how-it-works), Methodology (/methodology), FAQ (/faq)
- **About:** About (/about), Peace Resources (/resources), Data Sources (/sources), Contact (/contact)
- **Legal:** Terms of Service (/terms), Privacy Policy (/privacy)
- Disclaimer + `© {year} NukeBlastSimulator.com · 400+ pages`. All trust pages are linked site-wide (meets the "footer linking all of them" bar). No author link.

**Header (`MilitaryHeader.tsx`)** — full desktop mega-menu + mobile accordion drawer (L262–332) with body-scroll-lock; mobile nav present (passes red-flag #7). No author/by-line surface.

**Favicon — PARTIAL.** `layout.tsx` L74 `<link rel="icon" href="/favicon.svg">`, L75 a second inline `data:` SVG ⚛️ emoji icon, L76 `apple-touch-icon`→favicon.svg. `public/favicon.svg` and `public/icon.svg` exist. **No web manifest:** no `site.webmanifest`/`manifest.json` in `public/`, and **no `rel="manifest"`** in layout. The standard's readiness pass item 7 asks for "favicon **and manifest**" → manifest MISSING.

**Custom 404 (`src/app/not-found.tsx`)** — exists, branded, with a primary CTA (Return to Simulator) + 3 helpful links (About, Weapons, FAQ) L32–40. **However it does NOT render the site header/footer nav** (it's a bare centered card, not wrapped by the global chrome) — minor: helpful links yes, full nav no. Passes the "custom 404" bar at a basic level.

**Other public/ notes:** `google12f8c2f9c03913a3.html` (GSC verification), `llms.txt` (present; repeats the wrong formulas — fireball 0.28·W^0.33 etc., consistent with the methodology page's incorrect numbers, not the real engine's 0.145·W^0.4), `og-image.png`/`.svg`.

---

## 5. How date fields are set — fails "dates mark real events"

- `articleSchema` (`schemas.ts` L211–212): `datePublished ?? '2025-10-22'` and `dateModified ?? new Date().toISOString().slice(0,10)` → **every Article/methodology with no explicit date claims it was *modified today*, every day.** Pure cosmetic freshness.
- Blog posts pass real-looking dates, but **all 8 articles hardcode the identical `datePublished: '2026-04-29'`** (`articles.ts` L15,79,140,204,267,331,398,459) with no `dateModified` — an implausible "all published the same day" signal.
- About page L36 and Privacy/Terms L209/L173 render **`new Date()`** as a "Last reviewed"/"Last updated" date — it changes to today on every build/render, so it marks **no real event.** The About page literally prints a "Last reviewed {month year}" that no human ever reviewed.

Per the standard: *"Dates mark real events only. 'Reviewed' only when a review happened and is logged in DEVLOG. Never auto-refresh dates."* → three separate auto-refresh/placeholder-date mechanisms, all failing.

---

## P0 / P1 / P2 fix list

**P0 — blocks a Raptive application**
1. **Name the real human author (Marko Visic) with topic-fit credentials** on the About page, and replace `editorialPersonSchema` with a real `Person` (name, alumniOf, hasCredential, knowsAbout, sameAs + a visible `rel="me"` link). Repoint `articleSchema.author`, blog `article.author`, and `layout.authors` to that person. Remove the fictitious "NukeBlastSimulator Editorial" persona (invented-persona red flag).
2. **Privacy policy must name the real stack:** disclose GA4 (G-XDZQYKGTE2) and its cookies; delete the false "no tracking / no cookies / no opt-out needed" claims (and the matching lines in Terms). Add a consent mechanism or state the legal basis.
3. **Resolve the ads.txt mismatch:** either remove `public/ads.txt` (pub-3093026304369835) since no ad script runs, or align it with the actual (future Raptive) setup. A live ads.txt for an uninstalled network is a domain/advertising red flag.

**P1 — would likely draw a reviewer flag**
4. **Kill all auto-refreshing dates:** stop `datePublished ?? '2025-10-22'` and `dateModified = new Date()`; give each article a true publish date; replace About "Last reviewed {new Date()}" and Privacy/Terms "Last updated {new Date()}" with static dates logged in DEVLOG.
5. **Diversify blog dates** away from the single 2026-04-29 stamp; add honest `dateModified` only where content changed.
6. **Confirm `info@nukeblastsimulator.com` actually receives mail;** soften the unverifiable "Professional Network"/partnership and 24-hour-SLA claims to what the one-person operation can honour.
7. **Add a web app manifest** (`site.webmanifest` + `rel="manifest"`) to satisfy the favicon-and-manifest trust item.

**P2 — polish**
8. Re-voice the About TPNW sentence (L171–174) to neutral description, or clearly label it as the site's stated mission, so it doesn't read as uncredentialed political advocacy.
9. Wrap `not-found.tsx` in the global header/footer so the 404 carries full site nav.
10. Add an "How this site is made" AI-disclosure paragraph (About/methodology) per the standard's default.

---

## Verdict

**NO-GO on trust.** The site presents a polished trust frame (footer, favicon, 404, full policy set) but it is built on a **fabricated collective-author persona with zero named human or credentials**, a **Privacy policy that contradicts the live GA4 stack**, a **live ads.txt for an uninstalled ad network**, and **auto-refreshing placeholder dates** — four of Raptive's own documented decline triggers. It fails the raptive-ready author-identity bar outright and must not be submitted until P0 items are remediated.
