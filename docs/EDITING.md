# Editing the RTC website

Written for the site owners' coding agent. Every change is a **pull request**; the build
validates content, so a PR with a typo in a field name, a bad tag or a missing image
**fails the check** instead of breaking the live site. Merging to `main` deploys automatically.

All text lives in `src/content/`. You should almost never need to edit `.astro` files.

## Where things are

| What | File(s) |
|---|---|
| A clinician (card + profile page) | `src/content/clinicians/<slug>.md` — URL is `/<slug>` |
| Any other page (services, areas of focus, groups, home, contact…) | `src/content/pages/<slug>.md` — URL is `/<slug>`; home is `index.md` |
| Blog posts | `src/content/posts/<slug>.md` — URL is `/blog/<slug>` |
| Insurance companies (name + logo) | `src/content/insurers/<id>.md` |
| Phone, email, address, header menu | `src/content/site/settings.md` |
| Contact form fields + where it sends | `src/content/site/contact.md` |
| Small UI text (button labels, "Email:", footer text) | `src/content/site/labels.md` |
| Images | `src/assets/images/` (referenced with a relative path, e.g. `../../assets/images/claire-3.jpg`) |

The full list of fields is in `src/content.config.ts` (with comments).

## Clinicians

One file per person is the **single source of truth**: the home page team grid, the
"Meet the Team" page and menu, and every "providers" grid on service / area-of-focus
pages are generated from it. Never copy a clinician's details into a page.

**Mark someone as (not) accepting clients** — in their file:
```yaml
accepting: no            # yes | no | limited
accepting_text: Not accepting new clients at this time
```

**Which grids someone appears in** is controlled by tags:
```yaml
services: [individual-therapy, couples-therapy]   # Our Services pages
focus: [anxiety, trauma]                          # Areas of Focus pages
```
Allowed values are listed at the top of `src/content.config.ts` (`SERVICES`, `FOCUS`).

**Add a clinician**: copy an existing file to `src/content/clinicians/<first-name>.md`, add
their photos to `src/assets/images/`, fill in every field, set `order` (team position).
The menu, team page and grids update automatically.

**Remove a clinician**: set `hidden: true` (keeps their content) or delete the file.
If the profile URL was public, also add a redirect in `deploy/nginx-redirects.conf`.

**Card vs profile**: `card_areas` is the short list on cards (falls back to `areas`);
`areas`, `intro`, `buttons`, `hours`, `fees`, `insurance` and the Markdown body below the
`---` are the profile page. `phone` is 10 digits, no punctuation.
`buttons` show under the profile photo; `fees_buttons` (same format) show in the Fees and
insurance section, e.g. a link to the clinician's own pricing page.

## Pages

A page is a list of `sections`, rendered top to bottom. Each section can have:
`theme` (white | light | bright | dark), `layout` (stack | image-left | image-right | background | hero),
`heading`, `image` + `image_alt`, `body` (Markdown), `highlights` (short facts shown as chips),
`accordion`, `cards`, `buttons`, `providers`, `gallery`, `video`, `embed`, `form`.
`layout: hero` is the full-width photo banner at the top of the home page — use a wide, calm photo.
It is never cropped; the text sits over its left side, so keep the main subjects on the right.
`cards` images are 4:3 and cropped to fill by default; add `card_images: wide` to the section to show
wide pictures (about 2:1, e.g. 440×229) whole, or `card_images: portrait` to show headshots whole,
uncropped (facilitator cards). Use the same shape for every card in a section.
A section with exactly two cards centres them side by side on desktop.
On phones, cards scroll sideways; add `cards_stack: true` to stack them instead (contact page).
A card takes one `button`, or a `buttons` list when it needs more than one.
`gallery` items are `image`, `alt` (for screen readers) and an optional `caption` shown under the photo.
`providers` grids take `card: full` (default), `summary` (role + blurb) or `compact` (photo + name + status).
Example:
```yaml
sections:
  - theme: light
    heading: ADHD
    image: ../../assets/images/unsplash-image-tvc5imo5pxk.jpg
    image_alt: Children playing in a forest
    body: |
      ADHD, or Attention-Deficit/Hyperactivity Disorder, is …
    buttons:
      - { label: Contact Us, url: /contact-us }
  - theme: bright
    heading: ADHD Providers
    providers: { focus: adhd }
```
**New page**: create `src/content/pages/<slug>.md` with `title`, `description` and `sections`.
Add it to the menu in `site/settings.md` if it should be there.

## FAQ (home page)
In `src/content/pages/index.md`, the section with `accordion:` — each item is `title` + `body`.

## Blog post
Create `src/content/posts/<slug>.md`:
```yaml
---
title: …
description: …          # one or two sentences, used in listings and search results
date: 2026-12-01
author: miri            # a clinician file name
image: ../../assets/images/…
image_alt: …
tags: [anxiety]
---
Article text in Markdown…
```
Set `draft: true` to keep it off the site.

## Rules
- Contact form: contact info only. This is a therapy practice — never add fields asking about
  symptoms, diagnoses or other clinical details.
- Don't put colours or text in `.astro` files.
- Check locally if you can: `npm install && npm run build`.
