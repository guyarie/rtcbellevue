# Notes: areas of focus, provider-filter, group and modality pages

38 files written to `src/content/pages/`. `npx astro sync` passes.

## Structure decisions
- **Focus pages (adhd, anxiety-stress-management, depression, neurodivergent, parenting, relational-struggle, selective-mutism-1, trauma).** The old "What We Help With / Our Approach" section is now **two** section items with the same theme (`bright`):
  - "What We Help With": `layout: image-left`, the shared image, and the condition list.
  - "Our Approach": the modality list.
  The schema allows only one heading per section, and the scrape had both headings first, followed by every list in the wrong order. I used the desktop grid positions in `raw/*.html` to put them back. Each page has 2–4 list blocks (help col1, help col2, approach col1, approach col2), and the scrape had them in the order help1, approach1, help2, approach2. adhd is the worst case: the scrape put "Our Approach" directly above the condition list.
- **Focus-page hero buttons** are in visual order: Find Your Therapist, Want to learn more, Contact. The scrape order differed on anxiety-stress-management and parenting.
- **parenting hero.** The scrape put the body paragraphs above the heading and image. I restored the visual order: heading, image, body.
- **Provider-filter pages** are now one section each with `providers: … card: summary`. Their old theme is kept (couples-therapists = bright, the rest = light).
- **therapists-by-age-group.** Kept as an accordion, but with one item per age group (Child, Teen, Adult), each holding a linked name list. The old page had three headings, each with an accordion of full bios (with emails and phones). I dropped those bios because they live on the profile pages now.
  - Miri has no "About Me" link in Child/Teen on the old page. I linked her to /miri anyway because her profile exists.
  - Michal GK's Teen link pointed to `porpoise-falcon-5sy8.squarespace.com/michalg`. Fixed to /michalg.
  - Nina's absolute rtcbellevue.com link is now /nina.
- **Hand-picked clinician lists with no matching tag** are now plain linked-name lists, not copied cards:
  - emdr: Nina
  - emdr-1: Nina, Melanie
  - psychodynamic-therapy: David, Maki, Michal A, Michal GK. Michal GK's old card button was "Click Here" → `/`.
  - brave-voice-group facilitator: Claire
  
  If you want these generated, they would need `emdr` / `psychodynamic` tags, which is a schema change.
- **selective-mutism specialists.** Section 2 was two photos and prose bios (Claire, Miri). It now uses `providers: { focus: selective-mutism }`, which gives the same two people. Dropped Claire's contact details from it: malaya@counselingmind.co and counselingmind.co.
- **"About the facilitator(s)" sections** in tpg-general, relational-therapy-group-for-therapists and relational-group-therapy-miri are kept as prose. On the first two they are `cards` (Dafna Chen, Miri Arie). Dafna has no clinician entry. Miri's bio here is a different, group-specific text that links to craftpnw.com, not /miri.
- **relational-group-therapy-miri section 3** had two YouTube videos plus buttons. It is now two section items because `video` holds only one URL.
- **emdr-1 section 1** is now two section items ("…Reprocessing" with intro + "Book A Free consultation", then "How EMDR Works" + "Learn more"). Otherwise the renderer would move the first button below the second text.
- **about-rtc-1** was one section with three headings and two images. It is now three section items. Matching the images to the headings (room photo with "Why…", building photo with "When…") is my guess from the grid columns.

## Mechanical fixes
- Removed zero-width characters and doubled spaces. The double space was in the tpg-general `<title>` and in "Our approach is relational,  The group…".
- Joined sentences broken across paragraphs (from pasted docs) on adhd-social-skills…, social-circle and the social-circle FAQ.
- `sms:5858579394` "CALL" buttons are now `tel:5858579394`, so the button still works.
- Dafna's "•" / "••" lines are now a Markdown list.
- about-rtc-1: "…life transitions / Want deeper connection…" were run into one bullet. Split them into two bullets.
- social-circle: the three group buttons had **empty URLs**. I pointed them at the three group pages. Please confirm this is what the owners meant.
- psychodynamic-therapy: the "Intro Video by Dr. Phil Sarpong" button was a huge google.com search URL. It now links to the YouTube video id inside it: `https://www.youtube.com/watch?v=_4_hdctx3-Q`. Please verify this is the right video.
- intro-2: `/anxiety-stress` → `/anxiety-stress-management`, per the brief.

## Duplicates / overlapping pages
- **depression-providers vs depression-providers-1.** Same title and heading, different hand-picked people. Only `-1` is linked (from /depression). Both files now render the identical `focus: depression` grid, so `depression-providers` is a redirect candidate.
- **emdr vs emdr-1.** Not identical: they overlap on "How EMDR Works".
  - emdr has the 8 phases and side effects, plus an odd line pointing readers to the EMDRIA Therapist Finder.
  - emdr-1 has a practice intro and lists Nina and Melanie (emdr lists Nina only).
  - Neither page is linked from anywhere on the site.
  - emdr-1's `<title>`/description is identical to **/trauma**'s ("EMDR Therapy in Bellevue, WA | Trauma Treatment | RTC"), so the trauma page has EMDR SEO metadata. Copied verbatim, but worth fixing.
- **selective-mutism vs selective-mutism-1.** These are different pages.
  - `-1` is the focus page: it is in the nav and has hero, help/approach and providers.
  - selective-mutism is a modality/explainer (characteristics, treatment, resources) linked only from Claire's profile.
- **tpg-general vs relational-therapy-group-for-therapists.** Near-identical process-group pages. tpg-general says "Co-facilitated by Dafna Chen and Miri Arie"; the other says "with Dafna Chen". The other also has the CALL button.
  - tpg-general is linked from new-page and group-therapy.
  - relational-therapy-group-for-therapists is linked only from relational-group-therapy-miri.
- **groups-for-kids section 1 = social-circle section 1** (same text).
- **social-circle sections 4 and 5 are the same FAQ twice**: once as an accordion, once as plain text. Both are visible on the live page. I kept both; it is a removal candidate.

## Provider membership differences (old hand-picked grid → new tag-driven grid)
Focus pages and trauma-, anxiety-, neurodivergent-, sm-providers, depression-providers-1 and family-consultant-parent-supportcoaches: **no difference**.
- family-therapists (service family-therapy): **+** Elina Kogan, Galit Arad-Trutner, Michal Goldring Keidar. **−** Limor Raviv, David Neal (hidden).
- couples-therapists: **+** Michal Goldring Keidar.
- adhd-specialists: **+** Jessica Lazaro. The /adhd page already listed her.
- depression-providers (no -1): **+** Galit, Maki Park, Michal Goldring Keidar. **−** David Neal (hidden).
- group-providers (service group-therapy): **−** Morgan Coburn.
- parenting page: the old heading was "Family Consultant & Parent Support/Coaches" with Morgan, Lilach and Limor first. `focus: parenting` has the same 13 people in default order.

## Broken / questionable links
- **David Neal** (`david.md`, `hidden: true`) appears on therapists-by-age-group (Teen, Adult) and psychodynamic-therapy. I kept his name **unlinked**, assuming /david won't render. If he has left, remove these lines.
- No links to /group-events, /intro-0tOQM or /cart on these pages.
- relational-struggle "Find Your Therapist" → /meet-the-team; parenting "Want to learn more" → /parent-coaching-consultation; others → /services, /contact-us. Copied verbatim; these depend on other agents' pages existing.
- Pages linked from **nowhere** on the old site (orphans): social-circle, women-in-midlife-process-group, emdr, emdr-1, psychodynamic-therapy, about-rtc-1, depression-providers.

## Data conflicts
- Credentials:
  - Elina Kogan is "MSW" on therapists-by-age-group but LICSW everywhere else.
  - Maki Park is "LMHCA" on the filter pages and age-group page but "LMHC" on the focus pages.
  - Kept verbatim in the age-group list.
- Elina's languages: the focus-page cards say Russian, Hebrew, Hungarian; therapists-by-age-group says English, Russian, Hebrew, Ukrainian. I dropped these from the page, but the clinician file should settle it.
- Michal GK: the age-group page says "telehealth video service only", while the focus-page cards say "In-person & Telehealth".
- Michal Alpert's phone: (425) 224-6320 displayed vs tel:4252246329. Dropped from my pages; the clinician file should check it.
- selective-mutism-1 description names only Claire, but the page lists Claire and Miri.

## Typos left as-is (owners' wording)
- adhd: "how they impact each others"
- parenting: a stray closing `"` at the end of paragraph 2
- selective-mutism-1: "Our therapists are RTC are passionate", "they may be avoiding" (lowercase after a full stop)
- **selective-mutism-1 "What We Help With" is a copy of the neurodivergent list** (executive functioning, masking fatigue…). Also, its approach items say "symptoms of trauma". Both look like a copy-paste error by the owners.
- neurodivergent and trauma approach lists reuse the "anxiety/trauma" wording.
- intro-2: "relationship-because", "where you are. and"
- brave-voice-group: "supports children are able to speak"
- anxiety group: "Building safety confidence" (missing comma); the `<title>` says "Groupup", matching the slug
- adhd group heading: "ADHD Social Skills Camp; Emotional Regulation Group"
- therapists groups: "Wednesday 11:15-:12-45 PT"
- emdr-1: "(AIP)model"
- selective-mutism: "**Context**: Dependent:" (should be "Context-Dependent")
- psychodynamic: "parentdhoo", "empty nesing" (only in the dropped Michal card)
- about-rtc-1: "partners and famil", "our expertise complement"
- relational-group-for-adults: "Are the relationships … not feel satisfying"
- relational-group-therapy-miri meta description: "services in Miri" (treats the name as a place)

## Current or stale? (one line each)
- **intro-2:** current. It is the nav "Areas of Focus" page. Its `<title>` is just "Intro".
- **new-page (Groups Offered):** current. Linked from group-therapy.
- **groups-for-kids:** current.
- **brave-voice-group:** looks current. Fees, a monthly Wednesday schedule and a Room 3 address are specific; check with Claire.
- **social-circle:** probably a superseded draft of groups-for-kids. It is an orphan with empty buttons and a duplicated FAQ, but its intake/FAQ text appears nowhere else.
- **adhd-social-skills-emotional-regulation-group / autism-spectrum… / anxiety-emotional-regulation-groupup:** current. All three use the same Google Form for scheduling.
- **relational-group-therapy-miri:** current but Miri-specific. Linked from Miri's profile; links to craftpnw.com.
- **relational-therapy-group-for-therapists:** likely stale duplicate of tpg-general.
- **relational-group-for-adults:** current. Thursday group, $75.
- **women-in-midlife-process-group:** stale or unlisted. It is an orphan, run by Dafna (not an RTC clinician), says "not therapy groups", and books via an external theranest link.
- **tpg-general:** current. It is the canonical therapist process group page.
- **emdr:** stale or unlisted. Orphan; generic explainer.
- **emdr-1:** stale or unlisted. Orphan; its SEO was copied onto /trauma.
- **psychodynamic-therapy:** stale. Orphan, Google-search video link, broken "Click Here" → `/`, and it lists hidden David Neal.
- **selective-mutism:** current-ish explainer. Linked only from Claire's profile.
- **about-rtc-1:** probably current copy but an orphan. It may be what the About page is meant to be; check against the other agents' about/home pages.
