# Relational Therapy Collective (rtcbellevue.com) — Claude Code Project Guide

## Status: MIGRATION IN PROGRESS
This folder is the new home of **www.rtcbellevue.com**, currently a Squarespace site.
Goal #1 is to **get off Squarespace** with a faithful rebuild. A redesign comes later — don't spend effort on it now.

**Start here:** `docs/MIGRATION_PLAN.md` — the full survey of the current site and the step-by-step plan.
`docs/SQUARESPACE_PLAYBOOK.md` is the generic, reusable version of this process (we'll repeat it for other sites) — update it with anything learned along the way.

## Progress (2026-11-14)
- Phase 0 (scaffold) + Phase 1 (scrape) done; Phase 2 (content model) and Phase 3 (pages) built — see `docs/DEV.md`.
- Repo: `guyarie/rtcbellevue` (public, made so 2026-11-14 so `main` can be protected on the free plan). Owners' agent pushes as `ariemiri-pnw` (write access); `main` needs a PR + 1 approval, same as Connected. The deploy workflow only triggers on push to `main` — keep it that way (self-hosted runner on eli; never add `pull_request` triggers). Plausible: `data-domain="rtcbellevue.com"` on analytics.16jets.com.
- Contact form emails therapy@ via FormSubmit — needs the one-time activation click in that inbox after the first live submission.
- DNS is on Cloudflare (RTC's account, records unchanged — site still served by Squarespace). eli is set up (nginx, runner, tunnel); preview at https://preview.rtcbellevue.com. Details + go-live steps: `docs/DEPLOY.md`.
- Owner Q&A doc ("RTC Website — Questions for the Owners", Google Drive) answered and applied 2026-11-14; dropped pages are redirected in `deploy/nginx-redirects.conf`. Still open: Galit/Jeffrey accepting status and Brave Voice fees/dates (left blank by owners).
- Not done yet: owner sign-off, go-live switch in Cloudflare (needs explicit OK).

## Where things are
- Content: `src/content/` — `clinicians/` (one file per person, single source of truth), `pages/` (generic section-based pages, filename = old URL slug), `posts/`, `insurers/`, `site/` (settings, contact form, UI labels). Schemas + allowed tags: `src/content.config.ts`.
- Editing guide for the owners' agents: `docs/EDITING.md`. Dev: `docs/DEV.md`. Hosting: `docs/DEPLOY.md`. Redirects: `deploy/nginx-redirects.conf`.
- Scrape of the old site (reference only): `scrape/pages/*.md`; owner questions/conflicts: `scrape/notes/`.
- **Old URLs are kept** (`/claire`, `/adhd`, `/intro-1`…) — don't rename content files without adding a redirect.

## Reference implementation
The sibling project **Connected PNW** (`/home/guyarie/cnctpnw/site`, repo `guyarie/connectedpnw`) is the template for stack, content structure, docs and deploy workflow. Copy its patterns; read its `CLAUDE.md` and `docs/` first.

## Target stack (same as Connected, except hosting)
- **Framework**: Astro 5, static output (`npm run build` → `dist/`)
- **Styling**: Tailwind + CSS variables in `src/styles/global.css` (light/dark tokens, no hardcoded colors in `.astro`)
- **Content**: Astro Content Collections; all user-facing copy in Markdown/data files, **zero hardcoded text in `.astro` files**
- **Clinicians**: one content-collection entry per clinician (single source of truth) — every team grid and "providers for X" page is generated from it
- **Forms**: FormSubmit (formsubmit.co) — form posts straight to therapy@rtcbellevue.com, no account/backend (`src/content/site/contact.md`)
- **Hosting**: **eli** (home server), Nginx serves `dist/` on localhost; public traffic arrives via a **Cloudflare Tunnel (`cloudflared`) into eli** — no open ports, no origin TLS certs needed
- **Deploy**: GitHub Actions **self-hosted runner on eli**; on push to `main` it builds and `rsync -a --delete`s to the local web root
- **Repo**: new GitHub repo under `guyarie` (e.g. `guyarie/rtcbellevue`)

## Who edits
Site owners edit via **their own coding agent, submitting PRs**. So: keep the content structure obvious and documented (`docs/EDITING.md`), keep the clinician schema strict (Zod) so bad PRs fail the build, and keep this CLAUDE.md accurate — it's what their agent reads.

## Key constraints
- Do not touch DNS / the live Squarespace site without explicit OK from the user — **email (Google Workspace MX) must survive the DNS move**.
- Don't publish anything confidential; contact form collects contact info only (therapy practice — no clinical details).
