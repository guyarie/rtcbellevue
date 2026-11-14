#!/usr/bin/env node
/**
 * Shrinks source images in src/assets/images so the repo and dist/ stay small
 * (Astro ships the original of every content image next to the resized ones).
 *
 *   node scripts/optimize-images.mjs          # dry run: show what would change
 *   node scripts/optimize-images.mjs --write  # do it
 *
 * - Fixes extensions that lie about the format (Squarespace's CDN served WebP as .png).
 * - Downscales anything larger than MAX px on its long edge.
 * - Converts opaque PNG photos to JPEG.
 * - Rewrites references in src/ when a file is renamed.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DIR = 'src/assets/images';
const MAX = 2000;
const WRITE = process.argv.includes('--write');
const EXT = { jpeg: '.jpg', png: '.png', webp: '.webp', gif: '.gif' };

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(md|mdx|astro|ts|mjs|yml|yaml)$/.test(e.name)) out.push(p);
  }
  return out;
}

const renames = {};
let before = 0;
let after = 0;
for (const name of (await fs.readdir(DIR)).sort()) {
  const file = path.join(DIR, name);
  const buf = await fs.readFile(file);
  before += buf.length;
  const img = sharp(buf);
  const meta = await img.metadata();
  const big = Math.max(meta.width ?? 0, meta.height ?? 0) > MAX;
  const photoPng = meta.format === 'png' && !meta.hasAlpha && buf.length > 300_000;
  let format = photoPng ? 'jpeg' : meta.format;
  const ext = EXT[format] ?? path.extname(name);
  const newName = path.basename(name, path.extname(name)) + ext;
  const needsWork = big || photoPng || buf.length > 600_000;

  let outBuf = buf;
  if (needsWork) {
    let p = sharp(buf).rotate();
    if (big) p = p.resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true });
    if (format === 'jpeg') p = p.jpeg({ quality: 82, mozjpeg: true });
    else if (format === 'webp') p = p.webp({ quality: 82 });
    else if (format === 'png') p = p.png({ compressionLevel: 9, palette: true });
    outBuf = await p.toBuffer();
    if (outBuf.length >= buf.length && !photoPng && !big) outBuf = buf; // no gain
  }
  after += outBuf.length;
  if (newName !== name) renames[name] = newName;
  if (needsWork || newName !== name)
    console.log(`${name}${newName !== name ? ` -> ${newName}` : ''}: ${(buf.length / 1e3).toFixed(0)}KB -> ${(outBuf.length / 1e3).toFixed(0)}KB`);
  if (WRITE) {
    if (newName !== name) await fs.unlink(file);
    await fs.writeFile(path.join(DIR, newName), outBuf);
  }
}

if (WRITE && Object.keys(renames).length) {
  for (const f of await walk('src')) {
    let s = await fs.readFile(f, 'utf8');
    let changed = false;
    for (const [from, to] of Object.entries(renames)) {
      const re = new RegExp(`(assets/images/)${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w.-])`, 'g');
      if (re.test(s)) { s = s.replace(re, `$1${to}`); changed = true; }
    }
    if (changed) { await fs.writeFile(f, s); console.log('updated refs in', f); }
  }
}
console.log(`\n${(before / 1e6).toFixed(1)}MB -> ${(after / 1e6).toFixed(1)}MB, ${Object.keys(renames).length} renamed${WRITE ? '' : ' (dry run)'}`);
