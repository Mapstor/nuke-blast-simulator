#!/usr/bin/env node
/* NBS-002 audit crawler. Read-only. Crawls the local prod server, unions with
 * sitemap + known route tree, emits inventory.csv, links.csv, pages.json. */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const BASE = 'http://localhost:4317';
const PROD = 'https://nukeblastsimulator.com';
const OUT = path.resolve(__dirname, '..');
const TOOLS = __dirname;

// ---- template classifier -------------------------------------------------
function template(p) {
  if (p === '/') return 'home';
  if (/^\/weapons\/[^/]+$/.test(p)) return 'weapon';
  if (p === '/weapons') return 'hub';
  if (/^\/examples\/[^/]+$/.test(p)) return 'city';
  if (p === '/examples') return 'hub';
  if (/^\/scenarios\/[^/]+$/.test(p)) return 'scenario';
  if (p === '/scenarios') return 'hub';
  if (/^\/compare\/[^/]+$/.test(p)) return 'compare';
  if (p === '/compare') return 'hub';
  if (/^\/blog\/[^/]+$/.test(p)) return 'blog';
  if (p === '/blog') return 'hub';
  if (/^\/glossary\/[^/]+$/.test(p)) return 'glossary';
  if (p === '/glossary') return 'hub';
  if (['/about','/contact','/privacy','/terms','/methodology','/how-it-works','/sources','/resources','/faq'].includes(p)) return 'legal';
  return 'other';
}

// ---- sitemap --------------------------------------------------------------
const sitemapXml = fs.readFileSync(path.join(TOOLS, 'sitemap.xml'), 'utf8');
const sitemapPaths = new Map(); // path -> lastmod
{
  const re = /<url>([\s\S]*?)<\/url>/g; let m;
  while ((m = re.exec(sitemapXml))) {
    const block = m[1];
    const loc = (block.match(/<loc>(.*?)<\/loc>/) || [])[1] || '';
    const lm = (block.match(/<lastmod>(.*?)<\/lastmod>/) || [])[1] || '';
    let p = loc.replace(PROD, '') || '/';
    if (p === '') p = '/';
    sitemapPaths.set(p, lm);
  }
}

// ---- helpers --------------------------------------------------------------
async function fetchRaw(p) {
  // follow redirects manually to capture chain
  const chain = [];
  let url = BASE + p;
  for (let i = 0; i < 5; i++) {
    let res;
    try { res = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'NBS-Audit/1.0' } }); }
    catch (e) { return { status: 0, chain, body: '', ctype: '', err: String(e) }; }
    const status = res.status;
    const ctype = res.headers.get('content-type') || '';
    if (status >= 300 && status < 400) {
      const loc = res.headers.get('location') || '';
      chain.push({ from: url.replace(BASE, ''), status, to: loc });
      url = loc.startsWith('http') ? loc : BASE + loc;
      if (!url.startsWith(BASE)) return { status, chain, body: '', ctype, redirectedOffsite: true };
      continue;
    }
    const body = ctype.includes('text/html') ? await res.text() : '';
    return { status, chain, body, ctype };
  }
  return { status: 999, chain, body: '', ctype: '', err: 'too many redirects' };
}

function textWords(s) { return (s.trim().match(/\S+/g) || []).length; }

function parse(p, html) {
  const $ = cheerio.load(html);
  const title = ($('title').first().text() || '').trim();
  const metaDesc = ($('meta[name="description"]').attr('content') || '').trim();
  const h1s = $('h1').map((i, el) => $(el).text().trim()).get().filter(Boolean);
  const canonical = ($('link[rel="canonical"]').attr('href') || '').trim();
  const robotsMeta = ($('meta[name="robots"]').attr('content') || '').trim();

  // JSON-LD types (incl @graph)
  const types = new Set();
  $('script[type="application/ld+json"]').each((i, el) => {
    try {
      const data = JSON.parse($(el).contents().text());
      const walk = (o) => {
        if (Array.isArray(o)) return o.forEach(walk);
        if (o && typeof o === 'object') {
          if (o['@type']) [].concat(o['@type']).forEach((t) => types.add(t));
          if (o['@graph']) walk(o['@graph']);
        }
      };
      walk(data);
    } catch (e) { types.add('PARSE_ERROR'); }
  });

  // visible word count: strip chrome
  const $v = cheerio.load(html);
  $v('header, nav, footer, script, style, noscript').remove();
  const visWords = textWords($v('body').text());

  // links
  const internal = new Set();
  const external = new Set();
  $('a[href]').each((i, el) => {
    let href = ($(el).attr('href') || '').trim();
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (href.startsWith(PROD)) href = href.replace(PROD, '') || '/';
    if (href.startsWith('http://') || href.startsWith('https://')) { external.add(href); return; }
    if (href.startsWith('/')) { internal.add(href.split('#')[0].split('?')[0]); }
  });

  // content-only internal links (exclude header/nav/footer)
  const $c = cheerio.load(html);
  $c('header, nav, footer').remove();
  const contentInternal = new Set();
  const contentExternal = new Set();
  $c('a[href]').each((i, el) => {
    let href = ($c(el).attr('href') || '').trim();
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (href.startsWith(PROD)) href = href.replace(PROD, '') || '/';
    if (href.startsWith('http://') || href.startsWith('https://')) { contentExternal.add(href); return; }
    if (href.startsWith('/')) contentInternal.add(href.split('#')[0].split('?')[0]);
  });

  // byline / dates from JSON-LD article + visible
  let byline = '', datePub = '', dateMod = '';
  $('script[type="application/ld+json"]').each((i, el) => {
    try {
      const data = JSON.parse($(el).contents().text());
      const arr = [].concat(data['@graph'] || data);
      arr.forEach((o) => {
        if (!o || typeof o !== 'object') return;
        if ((o['@type'] === 'Article' || (Array.isArray(o['@type']) && o['@type'].includes('Article')))) {
          if (o.datePublished) datePub = o.datePublished;
          if (o.dateModified) dateMod = o.dateModified;
          if (o.author && o.author.name) byline = o.author.name;
        }
      });
    } catch (e) {}
  });
  // visible byline fallback
  if (!byline) {
    const bodyText = $v('body').text();
    const bm = bodyText.match(/By\s+([A-Z][A-Za-z.\- ]{2,40})/);
    if (bm) byline = bm[1].trim();
  }
  const timePub = $('time[datetime]').first().attr('datetime') || '';
  if (!datePub && timePub) datePub = timePub;

  return { title, metaDesc, h1s, canonical, robotsMeta, types: [...types], visWords,
    internal: [...internal], external: [...external], contentInternal: [...contentInternal],
    contentExternal: [...contentExternal], byline, datePub, dateMod };
}

// ---- crawl ----------------------------------------------------------------
(async () => {
  const known = new Set([...sitemapPaths.keys()]);
  const routeSet = new Set([...sitemapPaths.keys()]); // sitemap == SSG route set
  const pages = new Map();
  const queue = ['/'];
  const seen = new Set();
  const foundIn = new Map(); // path -> Set
  const addFound = (p, src) => { if (!foundIn.has(p)) foundIn.set(p, new Set()); foundIn.get(p).add(src); };
  for (const p of sitemapPaths.keys()) addFound(p, 'sitemap');
  for (const p of routeSet) addFound(p, 'route');
  for (const p of known) if (!seen.has(p)) queue.push(p);

  const navSet = new Set();
  let navCaptured = false;

  async function visit(p) {
    if (seen.has(p)) return; seen.add(p);
    const r = await fetchRaw(p);
    const rec = { path: p, status: r.status, chain: r.chain, ctype: r.ctype };
    if (r.redirectedOffsite) rec.offsite = true;
    if (r.body) {
      const d = parse(p, r.body);
      Object.assign(rec, d);
      if (!navCaptured) {
        // capture global nav/footer link set from homepage
        const $ = cheerio.load(r.body);
        $('header a[href], nav a[href], footer a[href]').each((i, el) => {
          let href = ($(el).attr('href') || '').trim();
          if (href.startsWith(PROD)) href = href.replace(PROD, '') || '/';
          if (href.startsWith('/')) navSet.add(href.split('#')[0].split('?')[0]);
        });
        navCaptured = true;
      }
      // enqueue newly discovered internal links
      for (const l of d.internal) {
        if (!seen.has(l) && !queue.includes(l)) { queue.push(l); addFound(l, known.has(l) ? (routeSet.has(l) ? 'route' : 'sitemap') : 'crawl'); }
        else addFound(l, foundIn.has(l) ? [...foundIn.get(l)][0] : 'crawl');
        if (!known.has(l)) addFound(l, 'crawl');
      }
    }
    pages.set(p, rec);
  }

  // process queue with limited concurrency
  const CONC = 12;
  while (queue.length) {
    const batch = queue.splice(0, CONC);
    await Promise.all(batch.map(visit));
  }

  // compute inlinks (content-area, excluding global nav)
  const inlinks = new Map();
  for (const rec of pages.values()) {
    const outs = (rec.contentInternal || []).filter((l) => !navSet.has(l));
    rec._contentOut = [...new Set(outs)];
    for (const t of rec._contentOut) inlinks.set(t, (inlinks.get(t) || 0) + 1);
  }

  // ---- write inventory.csv ----
  const esc = (v) => {
    const s = (v === undefined || v === null) ? '' : String(v);
    return '"' + s.replace(/"/g, '""').replace(/[\r\n]+/g, ' ') + '"';
  };
  const cols = ['path','template','found_in','status','title','title_len','meta_description','desc_len','h1','h1_count','canonical','robots_meta','in_sitemap','lastmod','visible_word_count','jsonld_types','internal_inlinks','internal_outlinks','byline','date_published','date_modified','redirect_chain'];
  const rows = [cols.join(',')];
  const allPaths = [...new Set([...sitemapPaths.keys(), ...pages.keys(), ...inlinks.keys()])].sort();
  for (const p of allPaths) {
    const rec = pages.get(p) || { path: p, status: '(not fetched)' };
    const fi = [...(foundIn.get(p) || new Set(['crawl']))].sort().join('|');
    const h1 = (rec.h1s && rec.h1s[0]) || '';
    rows.push([
      esc(p), esc(template(p)), esc(fi), esc(rec.status),
      esc(rec.title), esc((rec.title||'').length),
      esc(rec.metaDesc), esc((rec.metaDesc||'').length),
      esc(h1), esc(rec.h1s ? rec.h1s.length : 0),
      esc(rec.canonical), esc(rec.robotsMeta),
      esc(sitemapPaths.has(p) ? 'yes' : 'no'), esc(sitemapPaths.get(p) || ''),
      esc(rec.visWords), esc((rec.types||[]).join('|')),
      esc(inlinks.get(p) || 0), esc(rec._contentOut ? rec._contentOut.length : 0),
      esc(rec.byline), esc(rec.datePub), esc(rec.dateMod),
      esc((rec.chain||[]).map((c) => `${c.from}->${c.status}->${c.to}`).join(' ')),
    ].join(','));
  }
  fs.writeFileSync(path.join(OUT, 'inventory.csv'), rows.join('\n') + '\n');

  // ---- write links.csv ----
  const lcols = ['source_path','link_type','target','status','note'];
  const lrows = [lcols.join(',')];
  // internal link targets with status
  const statusOf = (t) => { const r = pages.get(t); return r ? r.status : '(not crawled)'; };
  const chainOf = (t) => { const r = pages.get(t); return r && r.chain && r.chain.length ? r.chain.map((c)=>`${c.status}->${c.to}`).join(' ') : ''; };
  const extSeen = new Set();
  for (const rec of pages.values()) {
    const outs = new Set([...(rec.internal||[])]);
    for (const t of outs) {
      lrows.push([esc(rec.path), esc('internal'), esc(t), esc(statusOf(t)), esc(chainOf(t))].join(','));
    }
    for (const e of (rec.external||[])) {
      const key = rec.path + ' ' + e;
      if (extSeen.has(key)) continue; extSeen.add(key);
      lrows.push([esc(rec.path), esc('external'), esc(e), esc('unverified: box firewall'), esc('')].join(','));
    }
  }
  fs.writeFileSync(path.join(OUT, 'links.csv'), lrows.join('\n') + '\n');

  // ---- write pages.json (corpus for downstream scripts) ----
  const corpus = {};
  for (const [p, rec] of pages) {
    corpus[p] = {
      template: template(p), status: rec.status, title: rec.title, metaDesc: rec.metaDesc,
      h1s: rec.h1s, canonical: rec.canonical, robotsMeta: rec.robotsMeta, types: rec.types,
      visWords: rec.visWords, inlinks: inlinks.get(p) || 0, outlinks: rec._contentOut ? rec._contentOut.length : 0,
      byline: rec.byline, datePub: rec.datePub, dateMod: rec.dateMod,
      navExcludedOut: rec._contentOut || [],
    };
  }
  fs.writeFileSync(path.join(TOOLS, 'pages.json'), JSON.stringify(corpus, null, 0));

  // navset for reference
  fs.writeFileSync(path.join(TOOLS, 'navset.json'), JSON.stringify([...navSet].sort(), null, 2));

  // summary to stdout
  const byTpl = {};
  for (const p of allPaths) { const t = template(p); byTpl[t] = (byTpl[t]||0)+1; }
  console.log('CRAWL DONE');
  console.log('total unique paths:', allPaths.length);
  console.log('fetched:', pages.size);
  console.log('sitemap paths:', sitemapPaths.size);
  console.log('by template:', JSON.stringify(byTpl));
  const codes = {}; for (const r of pages.values()) codes[r.status] = (codes[r.status]||0)+1;
  console.log('status codes:', JSON.stringify(codes));
  console.log('navset size:', navSet.size);
})();
