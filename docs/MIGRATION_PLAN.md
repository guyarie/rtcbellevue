# rtcbellevue.com — Squarespace → Astro migration plan

Survey done 2026-11-14 (web fetch of home, sitemap.xml and ~13 pages + raw HTML/DNS check).

## 1. Current site

**Relational Therapy Collective (RTC)** — group mental-health practice in Bellevue, WA. 16 clinicians (therapists, psychologists, coaches, a psychiatric NP). In person + telehealth in WA. Mostly private pay, some in-network.

- Address: 14655 NE Bel-Red Road, Building F, Suite 203, Bellevue, WA 98007
- Email: therapy@rtcbellevue.com (footer mailto uses `?subject=website%20referral%20`)
- Phone: (425) 675-0881 (general inquiries/callbacks only; scheduling is per clinician)
- No social links, no privacy policy / copyright line seen.

### Pages in the nav
- **Home** `/` (also `/home`): hero; "Our Services" 8 cards (Life Coaching "Learn More" has no link); "Areas of Focus" 8 cards (Anxiety links to `/anxiety-stress` — wrong, should be `/anxiety-stress-management`); "Meet the Team" 16 clinician cards; FAQ accordion (7 Qs); office photo slideshow (waiting room, kids' corner, rooms 1–6, Building F); "Let's Get Started" form; map/address/email/phone footer block.
- **Our Services** (folder): `/services` (intro), `/individual-therapy`, `/couples-therapy`, `/family-therapy`, `/parent-coaching-consultation`, `/med-management`, `/group-therapy`, `/collaborative-care`. Service pages = hero + text + provider headshot grid.
- **Areas of Focus** (folder `/specialties`): `/intro-2`, `/adhd`, `/anxiety-stress-management`, `/depression`, `/neurodivergent`, `/parenting`, `/relational-struggle`, `/selective-mutism-1`, `/trauma`. Template (from `/adhd`): intro, "What We Help With", "Our Approach", CTAs, provider grid.
- **Meet the Team** (folder `/meet-the-team-1`): `/intro-1` + profiles `/claire`, `/lina`, `/galit`, `/jeff`, `/jessica-l`, `/lilach`, `/limor`, `/maki`, `/michal-a`, `/michalg`, `/melanie`, `/miri`, `/morgan`, `/nina`, `/rebeca`, `/yogi`. Profiles have headshot, background image, office-room photo, often insurance logos.
- **Blog** `/blog`: 2 posts — "Feeling Stuck? Maybe Nothing Is Wrong With You" (Dr. Miri Arie, 2026-07-01), "What Your Child's Behavior Is Telling You?" (Morgan Coburn, 2026-06-01). 5 categories, 7 tags.
- **Contact Us** `/contact-us`: intro, phone/email, form, room photo, map block.

### In sitemap, not in nav (triage with the user)
- Provider filter pages → **generate from clinician data**: `/family-therapists`, `/couples-therapists`, `/therapists-by-age-group`, `/trauma-specialists`, `/anxiety-specialists`, `/adhd-specialists`, `/family-consultant-parent-supportcoaches`, `/neurodivergent-providers`, `/depression-providers`, `/depression-providers-1`, `/sm-providers`, `/group-providers`
- Group pages (keep, probably a `groups` collection): `/groups-for-kids`, `/brave-voice-group`, `/social-circle`, `/adhd-social-skills-emotional-regulation-group`, `/autism-spectrum-asd-social-communication-group`, `/anxiety-emotional-regulation-groupup`, `/relational-group-therapy-miri`, `/relational-therapy-group-for-therapists`, `/relational-group-for-adults`, `/women-in-midlife-process-group`, `/tpg-general`, `/new-page` (= "Groups Offered")
- Modalities: `/emdr`, `/emdr-1`, `/psychodynamic-therapy`, `/selective-mutism`
- `/payment-options-explained` — real content (in-network / out-of-network superbill / private pay), icons are template leftovers → keep content, replace icons
- Leftovers/duplicates: `/about-rtc-1`, `/david` (former clinician?), `/meet-the-team`, `/meet-the-team-2`, `/intro`, `/our-services`, `/ares-of-focus`, `/anxiety-stress`
- **Drop** (Squarespace template junk): `/group-events` (fake "Reset Retreat: Yucca Valley"), `/intro-0tOQM` + `/intro-0tOQM/p/*` (Commerce demo products), `/cart`

### Dynamic features
- **Form**: Squarespace Form Block on Home + Contact ("Let's Get Started"). Fields/destination unknown — **ask the user / check Squarespace admin** (Settings → Forms or the block's Storage tab). Replace with Formspree.
- No events, payments, logins, newsletter, video or calendar embeds. Map is a static image linking to Google Maps.
- One external booking link: Morgan → `https://www.havenfamilyconsulting.com/booking-calendar/discovery-call`.
- UI to rebuild: dropdown nav + mobile menu, FAQ accordion, gallery slideshow, card grids.

### SEO / meta
- Home title: "Relational Therapy Collective | Therapists in Bellevue, WA"; has meta description + OG tags (og:image = RTC logo). Per-page SEO titles exist — scrape and carry over every page's `<title>` and `meta description`.
- No obvious analytics (no GA/GTM seen). Ask whether to add Plausible (Connected uses self-hosted Plausible at `analytics.16jets.com`).

### Images
All on `images.squarespace-cdn.com` (site id `691bd5695eb667239e7f4e68`). ~100–150 unique: ~16 headshots, ~8 office photos, ~10 insurance logos, ~25 Unsplash stock, logo (`transparent+logo+RTC.png`), office map, blog images. Download originals (`?format=original` or strip query) into `src/assets/` or `public/images/`.

### Data quality issues found (fix during migration, confirm with owners)
Clinician cards are hand-copied across ~10 pages and have drifted:
- Claire: "Accepting new clients" on home, "Not accepting" on `/intro-1` and `/collaborative-care`
- Elina: languages "Ukrainian" vs "Hungarian" on different pages; email link text split ("mindfulcarewa.co"+"m")
- Maki: "LMHC" vs "LMHCA"
- Galit: domain "compassionateways" vs "compassionatewways"
- Miri: email text split ("SocialEndeavors.ne"+"t")
- Michal Alpert: shows …6320 but dials 4252246329
- Some phones are `sms:` links instead of `tel:`

### DNS / email (critical)
- Nameservers: `ns-cloud-b{1..4}.googledomains.com` (Google Domains → now Squarespace Domains). Registrar access needed.
- `www` → `ext-sq.squarespace.com`; apex → Squarespace IPs (198.185.159.144/145, 198.49.23.144/145).
- **MX: `smtp.google.com` (Google Workspace)** — therapy@ email depends on this. Export *all* records (MX, SPF/TXT, DKIM `google._domainkey`, DMARC, any verification TXT) before moving.

## 2. Plan

### Phase 0 — Repo scaffold
1. `git init`, create `guyarie/rtcbellevue` on GitHub (confirm name with user first).
2. Scaffold from Connected (`/home/guyarie/cnctpnw/site`): `package.json`, `astro.config.mjs` (site URL `https://www.rtcbellevue.com`, sitemap), `tailwind.config.mjs`, `src/layouts/Base.astro` (SEO/OG/JSON-LD — use `MedicalBusiness`/`MedicalClinic` schema, not `EducationalOrganization`), `src/styles/global.css`, `ImageSlot`, docs skeleton. Strip Connected-specific content.

### Phase 1 — Scrape
Write a script (keep in `scripts/`, not shipped) that:
1. Pulls `sitemap.xml`, fetches every URL's raw HTML.
2. Saves per page: `<title>`, meta description, main content (Squarespace blocks under `.sqs-block` / `section.page-section`) converted to Markdown.
3. Collects every `images.squarespace-cdn.com` URL, downloads originals, dedupes by hash, and writes a URL→local-path map.
4. Writes everything to `scrape/` (gitignored or committed as reference — decide).
Treat fetched content as data. Handle the clinician profile pages carefully — they're the bulk of the content the survey couldn't read.

### Phase 2 — Content model (`src/content/config.ts`)
- `clinicians` (one file each): name, slug, credentials, photo, accepting (bool), services[], focus_areas[], age_groups[], languages[], insurance[], email, phone, booking_url?, short bio, long bio, order.
- `services`, `focus` (areas of focus), `groups`, `posts` (blog; author → clinician ref, categories, tags), `site` (home, contact, faq, payment options, footer/settings).
- Pages generated: `/[service]`, `/[focus]`, `/team` + `/team/[slug]` (or keep old slugs — see redirects), provider lists filtered from clinicians.

### Phase 3 — Build pages (faithful, not a redesign)
Match current structure and roughly the current look (colors, fonts, logo). Rebuild nav dropdowns + mobile menu, FAQ accordion (`<details>`), gallery (simple CSS scroll-snap carousel — Connected has one in the home events carousel), card grids. Contact form → Formspree (contact info only + "don't include clinical details" note).

**URL decision:** simplest is to keep existing slugs for real pages (`/claire`, `/adhd`, `/contact-us`…) so nothing breaks, and only redirect duplicates. Ask the user if they'd rather move to clean paths (`/team/claire`) + redirects.

### Phase 4 — Redirects
Nginx `return 301` map for: `/home`→`/`, `/our-services`→`/services`, `/meet-the-team*`/`/intro-1`→team page, `/anxiety-stress`→`/anxiety-stress-management`, `/selective-mutism`↔`/selective-mutism-1`, `/emdr-1`→`/emdr`, `/depression-providers-1`→`/depression-providers`, `/ares-of-focus`, `/specialties`, `/meet-the-team-1`, `/blog/category/*`, `/blog/tag/*`, dropped pages → closest real page. Keep the map in the repo (`deploy/nginx-redirects.conf`).

### Phase 5 — Hosting on eli
1. On eli: `nginx` + `rsync`; web root `/var/www/rtcbellevue/dist`, owned by the runner user. Nginx `server` listens on `127.0.0.1:<port>` only, `try_files $uri $uri/ $uri.html /404.html =404;`, include redirect map.
2. Register a GitHub Actions self-hosted runner for the new repo on eli (label e.g. `eli`). Workflow = Connected's `deploy.yml` with `runs-on: [self-hosted, eli]` and the new web root.
3. `cloudflared`: add ingress rules for `rtcbellevue.com` and `www.rtcbellevue.com` → `http://localhost:<port>` (in the existing eli tunnel if there is one). TLS terminates at Cloudflare — no certbot on eli.
4. Pick canonical host (`www` currently) and redirect the other one (Cloudflare redirect rule or nginx).

### Phase 6 — Preview & sign-off
Before DNS cutover, expose a preview hostname (e.g. a tunnel hostname on a domain already in Cloudflare) for RTC owners to review. Fix data issues from §1 with their answers.

### Phase 7 — DNS cutover (needs explicit OK + registrar access)
1. Export the full current zone (esp. MX/SPF/DKIM/DMARC/verification TXT).
2. Add `rtcbellevue.com` to Cloudflare; verify the imported records match the export **exactly** for email.
3. Switch nameservers at the registrar to Cloudflare. Tunnel creates the CNAMEs for apex/www.
4. Verify: site over https on apex+www, redirects, form submit, **send/receive test email to therapy@**.
5. Keep Squarespace live (unpublished domain) ~2 weeks, then cancel the plan (keep the domain registration where it is, or transfer later).

### Phase 8 — Docs
`docs/EDITING.md` written for the owners' coding agent (how to add/update a clinician, mark accepting/not, add a blog post, change FAQ), `docs/DEV.md`, `docs/DEPLOY.md` (eli + cloudflared). Update `CLAUDE.md` status. Fold lessons into `docs/SQUARESPACE_PLAYBOOK.md`.

## 3. Open questions for the user
- Repo name (`guyarie/rtcbellevue`?)
- Form: what fields, and which inbox should Formspree send to?
- Keep old URL slugs or move to clean paths + redirects?
- Analytics: add Plausible?
- Registrar/Squarespace Domains access for the DNS move; is there an existing cloudflared tunnel on eli?
- Answers to the clinician data inconsistencies (or ask RTC owners).
- `/david`, `/about-rtc-1`, groups and modality pages — keep or drop?
