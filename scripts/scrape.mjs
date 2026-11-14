#!/usr/bin/env node
/**
 * One-off scraper for the old Squarespace site (reference material for the
 * migration — not part of the build).
 *
 *   npm run scrape            # fetch everything (uses cached HTML in scrape/raw/)
 *   npm run scrape -- --fresh # re-download HTML
 *
 * Output:
 *   scrape/raw/<slug>.html     raw page HTML (gitignored)
 *   scrape/images/<hash>.<ext> downloaded originals, deduped by content (gitignored)
 *   scrape/pages/<slug>.md     title/meta + section-by-section Markdown
 *   scrape/pages.json          per-page metadata (title, description, og image, block types)
 *   scrape/images.json         CDN URL → local file map (+ which pages use each image)
 *
 * Fetched content is treated as data only.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

const ORIGIN = 'https://www.rtcbellevue.com';
const OUT = path.resolve('scrape');
const FRESH = process.argv.includes('--fresh');
const CDN = /^https?:\/\/(images\.squarespace-cdn\.com|static1\.squarespace\.com)\//;

const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-' });
td.remove(['script', 'style', 'noscript']);

const imageUses = new Map(); // normalized CDN url -> Set(slug)

function slugFor(url) {
  const p = new URL(url).pathname.replace(/^\/|\/$/g, '');
  return p ? p.replace(/\//g, '__') : 'index';
}

/** Strip query (?format=…) to get the original upload. */
function normImg(u) {
  if (!u) return null;
  if (u.startsWith('//')) u = 'https:' + u;
  if (!CDN.test(u)) return null;
  return u.split('?')[0];
}

function noteImage(u, slug) {
  const n = normImg(u);
  if (!n) return null;
  if (!imageUses.has(n)) imageUses.set(n, new Set());
  imageUses.get(n).add(slug);
  return n;
}

async function fetchText(url, file) {
  if (!FRESH) {
    try { return await fs.readFile(file, 'utf8'); } catch {}
  }
  const res = await fetch(url, { headers: { 'user-agent': 'rtcbellevue-migration-scraper' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const text = await res.text();
  await fs.writeFile(file, text);
  return text;
}

function blockType($b) {
  const cls = ($b.attr('class') || '').split(/\s+/);
  const t = cls.find((c) => c.startsWith('sqs-block-') && c !== 'sqs-block-website-component');
  return t ? t.replace('sqs-block-', '') : 'unknown';
}

function blockToMd($, el, slug) {
  const $b = $(el);
  const type = blockType($b);
  const imgsIn = () =>
    $b.find('img').map((_, i) => {
      const $i = $(i);
      const src = noteImage($i.attr('data-src') || $i.attr('data-image') || $i.attr('src'), slug);
      return src ? `![${($i.attr('alt') || '').trim()}](${src})` : null;
    }).get().filter(Boolean);

  switch (type) {
    case 'html':
    case 'markdown':
      return td.turndown($b.find('.sqs-html-content').html() || $b.html() || '').trim();
    case 'image': {
      const imgs = imgsIn();
      const link = $b.find('a').attr('href');
      const caption = $b.find('figcaption').text().replace(/\s+/g, ' ').trim();
      let md = imgs.join('\n');
      if (link) md = `[${md}](${link})`;
      if (caption) md += `\n_${caption}_`;
      return md;
    }
    case 'button': {
      const $a = $b.find('a').first();
      return `[BUTTON: ${$a.text().replace(/\s+/g, ' ').trim()}](${$a.attr('href') || ''})`;
    }
    case 'accordion': {
      const items = $b.find('.accordion-item').map((_, it) => {
        const q = $(it).find('.accordion-item__title').text().replace(/\s+/g, ' ').trim();
        const a = td.turndown($(it).find('.accordion-item__description').html() || '').trim();
        return `**Q: ${q}**\n\n${a}`;
      }).get();
      return `<!-- accordion -->\n${items.join('\n\n')}`;
    }
    case 'gallery':
    case 'gallery-block':
      return `<!-- gallery -->\n${imgsIn().join('\n')}`;
    case 'form': {
      const fields = $b.find('[data-form-field], .field, label').map((_, f) => $(f).text().replace(/\s+/g, ' ').trim()).get();
      const ctx = $b.find('[data-block-json]').attr('data-block-json');
      return `<!-- form block (JS-rendered; fields below may be incomplete) -->\n${fields.join('\n')}${ctx ? `\n<!-- block json: ${ctx.slice(0, 2000)} -->` : ''}`;
    }
    case 'map':
      return `<!-- map block: ${$b.find('[data-block-json]').attr('data-block-json') || ''} -->`;
    case 'video':
    case 'embed': {
      const urls = [
        ...$b.find('iframe[src]').map((_, f) => $(f).attr('src')).get(),
        ...$b.find('[data-html]').map((_, d) => (/src="([^"]+)"/.exec($(d).attr('data-html')) || [])[1]).get(),
      ].filter(Boolean);
      return `<!-- ${type} block: ${urls.join(' ') || '(no url found)'} -->`;
    }
    case 'spacer':
    case 'horizontalrule':
      return '';
    case 'summary-v2':
    case 'summary':
      return `<!-- summary block -->\n` + $b.find('a').map((_, a) => `- [${$(a).text().replace(/\s+/g, ' ').trim()}](${$(a).attr('href')})`).get().filter((l) => !l.startsWith('- []')).join('\n');
    default: {
      const text = td.turndown($b.html() || '').trim();
      const imgs = imgsIn();
      return `<!-- ${type} block -->\n${text}${imgs.length ? '\n' + imgs.join('\n') : ''}`;
    }
  }
}

function pageToMd($, slug) {
  const parts = [];
  const blockTypes = new Set();
  const $main = $('#page article, main').first();

  // Blog post bodies don't use page-sections.
  const $sections = $main.find('section.page-section');
  const groups = $sections.length ? $sections.toArray() : [$main.get(0)];

  groups.forEach((sec, i) => {
    const $s = $(sec);
    const bg = $s.find('.section-background img').first();
    const bgSrc = noteImage(bg.attr('data-src') || bg.attr('src'), slug);
    const theme = $s.attr('data-section-theme');
    parts.push(`\n<!-- ===== section ${i + 1}${theme ? ` | theme: ${theme}` : ''}${bgSrc ? ` | background: ${bgSrc}` : ''} ===== -->\n`);
    // Gallery sections (slideshow/grid) — also not .sqs-block based.
    const $gal = $s.find('.gallery-slideshow-item-img, .gallery-grid-item img, .gallery-strips-item img, .gallery-masonry-item img');
    if ($gal.length) {
      blockTypes.add('gallery-section');
      const seen = new Set();
      parts.push('<!-- gallery -->\n' + $gal.map((_, im) => {
        const src = noteImage($(im).attr('data-src') || $(im).attr('src'), slug);
        if (!src || seen.has(src)) return null;
        seen.add(src);
        return `![${($(im).attr('alt') || '').trim()}](${src})`;
      }).get().filter(Boolean).join('\n'));
    }
    // "List sections" (cards / people grids) — not .sqs-block based.
    if ($s.find('.user-items-list').length) {
      blockTypes.add('list-section');
      const heading = $s.find('.list-section-title').text().replace(/\s+/g, ' ').trim();
      if (heading) parts.push(`## ${heading}`);
      parts.push('<!-- list section -->');
      $s.find('li.list-item').each((_, li) => {
        const $li = $(li);
        const $img = $li.find('img').first();
        const img = noteImage($img.attr('data-src') || $img.attr('src'), slug);
        const title = $li.find('.list-item-content__title').text().replace(/\s+/g, ' ').trim();
        const desc = td.turndown($li.find('.list-item-content__description').html() || '').trim();
        const $btn = $li.find('.list-item-content__button');
        const out = [`### ${title}`];
        if (img) out.push(`![${($img.attr('alt') || '').trim()}](${img})`);
        if (desc) out.push(desc);
        if ($btn.length) out.push(`[BUTTON: ${$btn.text().replace(/\s+/g, ' ').trim()}](${$btn.attr('href') || ''})`);
        parts.push(out.join('\n\n'));
      });
    }
    $s.find('.sqs-block').each((_, b) => {
      blockTypes.add(blockType($(b)));
      const md = blockToMd($, b, slug);
      if (md) parts.push(md);
    });
  });

  // Blog item extras
  const $post = $('article.blog-item, .blog-item-wrapper').first();
  if ($post.length) {
    const author = $('.blog-author, .blog-item-author-profile-wrapper, [rel=author]').first().text().replace(/\s+/g, ' ').trim();
    const date = $('time').first().attr('datetime') || $('time').first().text().trim();
    parts.unshift(`<!-- blog post | author: ${author} | date: ${date} -->`);
  }
  // Blog list
  $('.blog-item, article.entry, .blog-basic-grid--container article').each((_, a) => {
    const $a = $(a);
    const href = $a.find('a').attr('href');
    const t = $a.find('h1,h2,h3').first().text().trim();
    if (t) parts.push(`- [${t}](${href})`);
  });

  return { md: parts.join('\n\n').replace(/\n{3,}/g, '\n\n').trim() + '\n', blockTypes: [...blockTypes] };
}

async function downloadImages() {
  await fs.mkdir(path.join(OUT, 'images'), { recursive: true });
  const map = {};
  const byHash = {};
  const urls = [...imageUses.keys()];
  let i = 0;
  const worker = async () => {
    while (i < urls.length) {
      const u = urls[i++];
      try {
        const res = await fetch(u);
        if (!res.ok) throw new Error(String(res.status));
        const buf = Buffer.from(await res.arrayBuffer());
        const hash = crypto.createHash('sha1').update(buf).digest('hex').slice(0, 12);
        const ext = (path.extname(decodeURIComponent(new URL(u).pathname)) || '.' + (res.headers.get('content-type') || '/bin').split('/')[1]).toLowerCase();
        const file = `images/${hash}${ext}`;
        if (!byHash[hash]) {
          await fs.writeFile(path.join(OUT, file), buf);
          byHash[hash] = file;
        }
        map[u] = { file: byHash[hash], name: decodeURIComponent(path.basename(new URL(u).pathname)), bytes: buf.length, pages: [...imageUses.get(u)] };
      } catch (e) {
        map[u] = { error: String(e.message), pages: [...imageUses.get(u)] };
      }
    }
  };
  await Promise.all(Array.from({ length: 8 }, worker));
  return map;
}

async function main() {
  await fs.mkdir(path.join(OUT, 'raw'), { recursive: true });
  await fs.mkdir(path.join(OUT, 'pages'), { recursive: true });

  const sitemap = await fetchText(`${ORIGIN}/sitemap.xml`, path.join(OUT, 'raw', 'sitemap.xml'));
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  // Pages only (sitemap also lists image:loc entries inside <image:image>)
  const pageUrls = [...new Set(urls.filter((u) => u.startsWith(ORIGIN)))];
  if (!pageUrls.includes(`${ORIGIN}/`)) pageUrls.unshift(`${ORIGIN}/`);
  // Blog posts may not all be in the sitemap — discover from /blog later too.

  const meta = {};
  const queue = [...pageUrls];
  const seen = new Set();
  while (queue.length) {
    const url = queue.shift();
    if (seen.has(url)) continue;
    seen.add(url);
    const slug = slugFor(url);
    let html;
    try {
      html = await fetchText(url, path.join(OUT, 'raw', `${slug}.html`));
    } catch (e) {
      meta[slug] = { url, error: e.message };
      console.error('FAIL', url, e.message);
      continue;
    }
    const $ = cheerio.load(html);
    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content') || '';
    const ogImage = $('meta[property="og:image"]').attr('content') || '';
    noteImage(ogImage, slug);
    const { md, blockTypes } = pageToMd($, slug);
    const links = [...new Set($('#page a[href]').map((_, a) => $(a).attr('href')).get())];

    // Follow blog post links found on /blog
    if (slug === 'blog') {
      for (const l of links) if (/^\/blog\/[^/]+$/.test(l) && !/\/(category|tag)\//.test(l)) queue.push(ORIGIN + l);
    }

    meta[slug] = { url, title, description, ogImage: normImg(ogImage), blockTypes, links };
    const header = `---\nurl: ${url}\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\n---\n\n`;
    await fs.writeFile(path.join(OUT, 'pages', `${slug}.md`), header + md);
    console.log('ok', slug, blockTypes.join(','));
  }

  await fs.writeFile(path.join(OUT, 'pages.json'), JSON.stringify(meta, null, 2));
  const imgs = await downloadImages();
  await fs.writeFile(path.join(OUT, 'images.json'), JSON.stringify(imgs, null, 2));
  const errs = Object.values(imgs).filter((v) => v.error).length;
  console.log(`\n${Object.keys(meta).length} pages, ${Object.keys(imgs).length} image URLs (${new Set(Object.values(imgs).map((v) => v.file).filter(Boolean)).size} unique files, ${errs} errors)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
