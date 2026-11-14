#!/usr/bin/env node
/**
 * Migration check: for each scraped old page (scrape/pages/<slug>.md), list
 * sentences that don't appear on the new built page (dist/<slug>.html).
 * Run after `npm run build`. Output: scrape/compare.json + a summary.
 */
import fs from 'node:fs';
import * as cheerio from 'cheerio';

const norm = (s) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/[‘’“”"'`]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

function sentences(md) {
  const body = md.replace(/^---[\s\S]*?---/, '')
    .replace(/<!--[\s\S]*?-->/g, '\n')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '\n')       // images
    .replace(/\[BUTTON: ([^\]]*)\]\([^)]*\)/g, '\n$1\n')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')        // links -> text
    .replace(/[*_#>|]/g, ' ');
  return body.split(/\n+|(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => norm(s).split(' ').length >= 4);
}

const skip = /^(intro-0tOQM|group-events|cart|home|meet-the-team|meet-the-team-2|our-services|ares-of-focus|intro|anxiety-stress|david|blog__(category|tag)__)/;
const out = {};
let total = 0, missing = 0;
for (const f of fs.readdirSync('scrape/pages')) {
  const slug = f.replace(/\.md$/, '');
  if (skip.test(slug)) continue;
  const path = slug === 'index' ? 'dist/index.html' : `dist/${slug.replace(/__/g, '/')}.html`;
  if (!fs.existsSync(path)) { out[slug] = ['(NO PAGE BUILT)']; continue; }
  const $ = cheerio.load(fs.readFileSync(path, 'utf8'));
  $('header, footer, script, style').remove();
  const text = norm($('main').text());
  const miss = [];
  for (const s of sentences(fs.readFileSync(`scrape/pages/${f}`, 'utf8'))) {
    total++;
    if (!text.includes(norm(s))) { missing++; miss.push(s.slice(0, 160)); }
  }
  if (miss.length) out[slug] = miss;
}
fs.writeFileSync('scrape/compare.json', JSON.stringify(out, null, 2));
console.log(`${missing}/${total} sentences not found on new pages`);
for (const [k, v] of Object.entries(out).sort((a, b) => b[1].length - a[1].length)) console.log(String(v.length).padStart(4), k);
