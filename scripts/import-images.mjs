#!/usr/bin/env node
/**
 * Copies scraped images (scrape/images, from `npm run scrape`) into
 * src/assets/images/ with readable names, skipping images only used by
 * dropped template-junk pages. Writes scrape/asset-map.json:
 *   CDN url -> "src/assets/images/<name>"
 * Safe to re-run; existing files are left alone.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const JUNK = [/^intro-0tOQM/, /^group-events$/, /^cart$/];
const DEST = 'src/assets/images';

const images = JSON.parse(await fs.readFile('scrape/images.json', 'utf8'));
await fs.mkdir(DEST, { recursive: true });

const slugify = (s) =>
  s.toLowerCase().replace(/\.[a-z0-9]+$/, '').replace(/[+_\s]+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'image';

const byFile = new Map(); // scraped file -> dest path (dedupe identical content)
const used = new Set();
const map = {};
for (const [url, v] of Object.entries(images)) {
  if (v.error) continue;
  if (v.pages.every((p) => JUNK.some((re) => re.test(p)))) continue;
  if (!byFile.has(v.file)) {
    const ext = path.extname(v.file);
    let base = slugify(v.name);
    let name = base + ext;
    for (let i = 2; used.has(name); i++) name = `${base}-${i}${ext}`;
    used.add(name);
    const dest = path.join(DEST, name);
    try { await fs.access(dest); } catch { await fs.copyFile(path.join('scrape', v.file), dest); }
    byFile.set(v.file, dest);
  }
  map[url] = byFile.get(v.file);
}
await fs.writeFile('scrape/asset-map.json', JSON.stringify(map, null, 2));
console.log(`${Object.keys(map).length} urls -> ${byFile.size} files in ${DEST}`);
