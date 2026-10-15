#!/usr/bin/env node
/* Dump chrome-stripped visible text per page to corpus/<safe>.txt for
 * duplicate-similarity and prose phases. Also writes corpus-index.json. */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const BASE = 'http://localhost:4317';
const pages = JSON.parse(fs.readFileSync(path.join(__dirname, 'pages.json'), 'utf8'));
const dir = path.join(__dirname, 'corpus');
fs.mkdirSync(dir, { recursive: true });
const safe = (p) => (p === '/' ? 'home' : p.replace(/^\//, '').replace(/\//g, '__'));

(async () => {
  const idx = {};
  const paths = Object.keys(pages);
  const CONC = 12;
  for (let i = 0; i < paths.length; i += CONC) {
    const batch = paths.slice(i, i + CONC);
    await Promise.all(batch.map(async (p) => {
      try {
        const res = await fetch(BASE + p, { headers: { 'User-Agent': 'NBS-Audit/1.0' } });
        const html = await res.text();
        const $ = cheerio.load(html);
        $('header, nav, footer, script, style, noscript').remove();
        const text = $('body').text().replace(/\s+/g, ' ').trim();
        const file = safe(p) + '.txt';
        fs.writeFileSync(path.join(dir, file), text);
        idx[p] = { file, template: pages[p].template, words: (text.match(/\S+/g) || []).length };
      } catch (e) { idx[p] = { error: String(e) }; }
    }));
  }
  fs.writeFileSync(path.join(__dirname, 'corpus-index.json'), JSON.stringify(idx, null, 0));
  console.log('corpus written:', Object.keys(idx).length, 'pages ->', dir);
})();
