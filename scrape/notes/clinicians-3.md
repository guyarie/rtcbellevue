# Notes — clinicians batch 3 (michal-a, michalg, melanie, miri)

Files: src/content/clinicians/{michal-a,michalg,melanie,miri}.md. `npx astro sync` passes.

## Conflicts between pages
- **Miri — accepting status**: profile says "Accepting adult clients at this time"; home/intro-1/meet-the-team cards say "Accepting new clients"; sm-providers & selective-mutism-1 say "Accepting new clients-SPACE Provider"; group-providers & family-consultant-parent-supportcoaches say "Accepting new clients-Parent Support/Coaching"; family-therapists / therapists-by-age-group say "(accepting new clients)". Used profile → `accepting: limited`, text "Accepting adult clients at this time". Note the home card still advertises "children-0+" in `clients` and "Working with children under age 5" in areas, which sits awkwardly with "adult clients" — owner should confirm.
- **Miri — credentials**: profile "PhD, CGP"; every card "PhD". Used "PhD, CGP".
- **Miri — languages**: home card says only "Miri also offers her services in Hebrew" (so no `languages_text`, `languages: [Hebrew]`). The Russian/Hungarian caveat ("Dr. Arie is fluent in English and Hebrew. She can also support families who prefer to speak Russian or Hungarian but are proficient enough to understand responses in English.") appears only on family-therapists and therapists-by-age-group summary cards. Not used, since the home card is canonical — set `languages_text` to that sentence if the owners want it on all cards.
- **Miri — card areas**: profile's last area "Children and Teens: with specialized training for working with children under age 5" vs cards "Working with children under age 5" (kept each in its own field).
- **Michal Alpert — phone**: displays (425) 224-6320 everywhere; card `tel:` links dial 4252246**329** (home, intro-1, psychodynamic-therapy, therapists-by-age-group, etc.); profile's link uses …6320. Kept displayed 4252246320 — owner should confirm which is right.
- **Michal Alpert — card photo** varies by page (home: Michal+A+3.jpg; most focus pages: Michal+A.png; collaborative-care/individual-therapy: Michal+A+2.jpg variants). Used home's.
- **Michal Goldring Keidar — card areas**: home/intro-1/meet-the-team/focus-"specialists" pages use the new 8-item list; many other pages (adhd, collaborative-care, couples-therapy, individual-therapy, family-therapy, parenting, trauma, etc.) still show an old 7-item list ("Trauma and recovery", "Relational issues including couples counseling", "Life transitions (parenthood, ‘empty nesting,’ aging)", …) and old photo Michal+4.jpg. Used home's.
- **Michal Goldring Keidar — home card glitch**: the home card's area list ends with "Therapy Approach for Teens and Adults" (a profile heading pasted in as an area). Dropped from `card_areas`.
- **Michal Goldring Keidar — in-person**: profile hours say "In-person: Not at this time"; psychodynamic-therapy and therapists-by-age-group say "telehealth video service only"; but home card `clients` says "In-person & Telehealth services…". Kept the home card text; owner should confirm.
- **Michal Goldring Keidar — summary**: psychodynamic-therapy card (role "TEEN, ADULT, AND PARENT COACHING") has an older blurb with typos ("parentdhoo", "empty nesing") and its About button links to `/`. Took the role from there but the summary from therapists-by-age-group (current text, matches profile intro). One therapists-by-age-group About link points to porpoise-falcon-5sy8.squarespace.com/michalg (old staging domain).
- **Melanie — card photo** home uses Melanie+2.jpg; many focus pages use Melanie.jpg; emdr-1 uses Melanie.png. Used home's.
- **Melanie — areas**: profile list includes "Individual Therapy (16yo and over)" and lacks "Communication skills"; cards add "Communication skills" and drop the individual-therapy item.
- Role lines: source is ALL CAPS on the site; converted to sentence case to match the schema example (another batch kept caps for one clinician — pick one convention site-wide).

## Mechanical fixes / reorderings
- Removed zero-width spaces, empty `mailto:linak@mindfulcarewa.com` links inside "Schedule Hours", `sms:`/`tel:` phone links, trailing `?` on mailto URLs, mid-sentence hard line breaks in Michal Alpert's "Approach" paragraph.
- Body headings that the scrape placed at the END of their section ("### About Michal(Michelle)", "## About Michal", Melanie's "### _My Therapy Approach_" after its paragraph) were moved to the top of their section — DOM order from Squarespace's fluid layout; visual order uncertain.
- Michal Alpert's trailing email link: moved the trailing "." outside the link text.

## Dropped
- Miri: trailing "If you are interested in working with Miri, feel free to email or contact: email / 585-857-9394" (pure contact repeat, per task).
- Kept the trailing contact repeats for Michal G and Melanie, and Michal A's "I am accepting new clients… reach me at…" (not instructed to drop).
- Fees-section decorative tea/cherry-blossom image and section-4 background image (no schema field).
- Website https://www.socialendeavors.net/ (Miri, summary cards only) — no schema field.
- `insurance: []` for all four (all out-of-network, no insurer logos).

## Typos left as-is (owner may want to fix)
- Michal Alpert summary: "Cultural iIsues".
- Michal Alpert body: "join CRAFT as a provider" (old practice name?), "assist individuals understand"; heading "About Michal(Michelle)" (missing space).
- Melanie intro: "She also have certificates".
- Miri summary: "licensed clinical psychologist specializes in"; fees: "She will be happy" (capital S).
- Michal G body: "narrative therapy-when" (hyphen for dash), last italic paragraph missing final period; "interested to connect".

## Invented text (alt text only)
- `profile_photo_alt` for all four and `room_photo_alt` for Michal G and Melanie were empty on the source; wrote neutral alts ("Headshot of …", "…'s therapy office").
