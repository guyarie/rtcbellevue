# Squarespace → Astro migration playbook (reusable)

Generic process for moving a Squarespace site to our standard stack. First run: rtcbellevue.com (see `MIGRATION_PLAN.md`). **Update this file with lessons from each migration** — once it's stable, extract it (and the scrape script) into a shared template repo.

## Standard target stack
Astro 5 static + Tailwind + Content Collections (no copy in `.astro`), FormSubmit (formsubmit.co, no account — posts straight to an email address) for simple contact forms, hosted on **eli**: Nginx on localhost, **cloudflared tunnel** for public traffic, GitHub Actions **self-hosted runner on eli** builds and `rsync --delete`s on push to `main`. Owners edit via their coding agent → PR. Reference implementation: Connected PNW (`/home/guyarie/cnctpnw/site`).

## Steps
1. **Survey**: sitemap.xml, nav, every page; list forms, commerce, blogs, events, embeds, scripts; raw `<head>` for titles/meta/analytics; `dig` NS/MX/A/CNAME. Flag Squarespace template leftovers (demo images from other site IDs on `images.squarespace-cdn.com`, fake retreats/products, `/cart`).
2. **Scaffold** repo from the reference implementation; strip its content. Set up the repo for owner PRs — see *Repo access for owners* below.
3. **Scrape** with a script: all sitemap URLs → title/meta/content Markdown; download all CDN images (originals), dedupe, URL→path map.
4. **Model content**: find anything repeated by hand across pages (team cards, service cards) and make it one collection; generate the repeats.
5. **Rebuild** faithfully (redesign later). Keep existing slugs where possible.
6. **Redirects** for duplicates, renamed slugs, blog category/tag archives, dropped pages.
7. **Host on eli**: web root, nginx localhost server block, runner, tunnel ingress.
8. **Preview + owner sign-off** on a preview hostname.
9. **DNS cutover**: export full zone first; move to Cloudflare; **verify email records (MX/SPF/DKIM/DMARC) exactly**; test email after.
10. **Docs**: EDITING (for owners' agents), DEV, DEPLOY, CLAUDE.md.
11. Keep Squarespace a couple of weeks, then cancel.

## Repo access for owners
Owners' agents push as their own GitHub user (for RTC and Connected: `ariemiri-pnw`) and every change goes through a PR that we approve.
- **Repo must be public.** Branch protection on a private repo needs GitHub Pro, and personal-account repos can't give collaborators read-only access. Before flipping, scan the full git history for secrets (`git log --all -p | grep -iE 'token|secret|password|api.?key|PRIVATE KEY'`) and check notes/docs for anything the owners wouldn't want public. Keep credentials in an untracked file.
- **Collaborator:** `gh api -X PUT repos/<owner>/<repo>/collaborators/<user> -f permission=push` (sends an invite they must accept).
- **Protect `main`:** PR required, 1 approval, no force-push, no deletion, `enforce_admins: false` (so we can still push directly — GitHub prints "Bypassed rule violations"). No required status checks — we're the only approvers.
  ```
  gh api -X PUT repos/<owner>/<repo>/branches/main/protection --input - <<'EOF'
  {"required_status_checks":null,"enforce_admins":false,"required_pull_request_reviews":{"required_approving_review_count":1},"restrictions":null,"allow_force_pushes":false,"allow_deletions":false}
  EOF
  ```
- **Two workflows:** `deploy.yml` on the self-hosted eli runner, triggered **only** by `push` to `main`; `check.yml` runs `npm ci && npm run build` on `pull_request` on **`ubuntu-latest`** (GitHub-hosted, `permissions: contents: read`) so bad content shows a red ✗ before merge. Never give a `pull_request` trigger to the eli runner — on a public repo anyone can open a PR from a fork.
- Known gap: a write collaborator could push a branch adding a workflow that targets the eli runner. Accepted, since the collaborator is the owners' own agent.

## Gotchas
- Squarespace forms are JS-rendered — fields/destination aren't in the HTML markdown; check the admin.
- Fetch tools that convert to markdown drop `<head>` and sometimes truncate long pages — use raw `curl` for meta and scraping.
- Google Domains sites now live at Squarespace Domains (nameservers still `*.googledomains.com`).

## Lessons learned
### rtcbellevue.com (2026-11)
- `scripts/scrape.mjs` (cheerio + turndown) is reusable: handles `section.page-section` + `.sqs-block` (html/image/button/accordion/gallery/form/video/embed) **and list sections** (`.user-items-list` / `li.list-item`) — people grids and card sliders are list sections, not blocks, and come back empty otherwise. Records each section's `data-section-theme`.
- The site footer (map/address) is `footer#footer-sections`, outside `article` — scrape it separately; same for the header logo (`img[elementtiming=nbf-header-logo-desktop]`).
- Theme: palette is in `site.css` as `--{white,black,accent,lightAccent,darkAccent}-hsl`; section themes map to them via `[data-section-theme="bright|light"]` rules. Fonts: `--heading-font-font-family` / `--body-font-font-family`.
- Form fields: in the page HTML as `formFields` JSON (HTML-entity encoded) — no admin needed for the field list (destination still is).
- Look for embeds pointing at the client's own subdomains (here `phone.rtcbellevue.com` → a chat widget on another box) — those DNS records must survive the cutover.
- The CDN sometimes serves WebP/JPEG under a `.png` URL; Astro/sharp handle it by content, but extensions may lie.
- Hand-copied team cards drift a lot (status, credentials, emails, phones, photos differ per page). Model one clinician entry and generate every grid by tag; extract with "profile page is canonical for profile fields, home card for card fields", and write all conflicts to a notes file for the owners.
- Parallel subagents per batch of clinicians/pages worked well with a shared brief file (`scrape/AGENT_BRIEF.md`) + schema-validated output (`astro sync`).
