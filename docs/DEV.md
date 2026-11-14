# Developer reference

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run preview
```

## Structure
- `src/content.config.ts` — Zod schemas for all collections (`pages`, `clinicians`, `insurers`, `posts`, `site`).
- `src/pages/[...slug].astro` — renders every `pages` entry; `index.md` → `/`.
- `src/pages/[clinician].astro` — clinician profiles at `/<slug>` (old Squarespace URLs kept).
- `src/pages/blog/` — blog list + posts.
- `src/components/Section.astro` — renders one page section; `ProviderCard.astro` — clinician card;
  `Carousel.astro` — scroll-snap slider; `ContactForm.astro` — contact form, emailed via FormSubmit (formsubmit.co) to `form_email` in `site/contact.md`.
- `src/lib/site.ts` — content helpers (`getClinicians(filter)`, `getLabels()`, `md()`).
- Images live in `src/assets/images/` and go through `astro:assets` (resized/WebP at build).
- `astro.config.mjs`: `build.format: 'file'` + `trailingSlash: 'never'` so `/claire` is `claire.html`,
  matching the old URLs. Nginx serves it with `try_files $uri $uri.html`.

## Migration scripts (not part of the build)
- `npm run scrape` — re-scrapes the old Squarespace site into `scrape/` (`scrape/pages/*.md` is committed as reference; raw HTML and image originals are gitignored).
- `node scripts/import-images.mjs` — copies scraped images into `src/assets/images/`.
- `node scripts/compare-content.mjs` (after a build) — lists sentences from the old pages that are missing on the new ones → `scrape/compare.json`.
- `scrape/notes/` — conflicts found between pages during migration (owner questions).

## Conventions
- Zero hardcoded copy in `.astro` files: UI strings come from `src/content/site/labels.md` via `getLabels()` (missing key = build error).
- No hardcoded colours: use the CSS variables in `src/styles/global.css` (palette from the old Squarespace theme).
