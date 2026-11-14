# Notes: clinicians batch 1 (claire, lina, galit, jeff)

Files: src/content/clinicians/{claire,lina,galit,jeff}.md. `npx astro sync` OK.

## Conflicts between pages

### Claire (claire)
- Accepting: profile says "Not accepting new clients at this time"; home/index card says "Accepting new clients"; intro-1/meet-the-team/anxiety-specialists/trauma-specialists say "Not accepting new clients at this time"; service/focus pages (individual-therapy, collaborative-care, parenting, trauma, …) "Not accepting clients at this time"; family-consultant + group-providers "Accepting new clients-Parent Support"; selective-mutism-1 + sm-providers "Accepting new clients-PCIT_SM Provider". Used profile: `no` / "Not accepting new clients at this time".
- Clients line: home says "children 3+"; every other card says "children 4+". Used home (3+). Profile intro also says "starting age 3".
- Card areas: home/intro-1/filter pages list 6 areas (School difficulties, Attachment…, Oppression…); service/focus pages + sm pages list a shorter 5-item version (incl. "Cultural & immigration issues", "Parent Support"). Profile areas are a third, different list. Used home for card_areas, profile for areas.
- Card photo: home uses Claire 3.jpg; service pages + sm pages use a different Claire 2.jpg upload (43472b1b…, not in asset map); brave-voice-group and selective-mutism use Claire.png (claire.png). Used claire-3.jpg (card), claire-2.jpg (profile).
- role/summary taken from brave-voice-group summary card ("CHILD AND TEEN THERAPIST, PARENT COACHING", kept in caps verbatim). Its "Claire offers services in English and Tagalog." sentence not stored (languages: [Tagalog]).

### Elina Kogan (lina)
- Credentials: profile heading "LICSW, MFT, MSW"; all cards "LICSW". Used profile.
- Card areas: home/intro-1/filter pages = same 9 as profile. Service/focus pages show older 6-item list (Anxiety, Depression, Marital issues, Parenting, Relationship Issues, Trauma); depression-providers adds "Sensorimotor Psychotherapy". Used home.
- Languages: home/profile = Russian, Hebrew, Ukrainian; service/focus pages say "Russian, Hebrew, Hungarian". Used home.
- Clients: service/focus pages omit "families". Home includes families.
- Card email displayed as "Linak@mindfulcarewa.co" + stray "m" (split link); href linak@mindfulcarewa.com. Used linak@mindfulcarewa.com.
- Card photo: home uses Lina 2.jpg; most other pages use a Lina 3.jpg upload (2daa9a20…, not in asset map). Profile uses lina-3.jpg (7acffe61).
- family-consultant page heading "Elina Kogan, LICSW-Parent Support/Coaching".
- No summary card found → no role/summary.

### Galit (galit)
- Accepting: profile "Not accepting new clients at this time"; home and all cards "Not accepting clients at this time except for IFS intensives" (family-consultant/group-providers add "-Parent Support/Coaching"). Per rule used profile: `no` / "Not accepting new clients at this time" — owners may prefer the IFS-intensives wording (`limited`).
- Phone: displayed (425) 442-5727 everywhere, but the profile link dials sms:5094432281. Used 4254425727.
- Email: profile + home "Galit@compassionateways.com"; most other cards display and link "Galit@compassionatewways.com" (typo, double w). Used compassionateways.com (case kept as displayed).
- Areas: profile "Internal Family systems" vs cards "Internal Family Systems". Service/focus pages omit "Couples".
- Card photo: home galit-3.jpg; service pages use a Galit 2.jpg upload (f8adfbdf…, not in asset map). Profile galit-2.jpg (130392ea).
- No summary card → no role/summary.

### Jeffrey Gillman (jeff)
- Accepting: profile "Accepting New Clients"; home and all cards "Not accepting new clients at this time" (family-consultant adds "-Parent Support"). Used profile: `yes` / "Accepting New Clients".
- Name: profile heading "Jeffrey B. Gillman, PhD"; cards + tags "Jeffrey Gillman". Used "Jeffrey Gillman".
- Card areas: service/focus pages show a shortened 7-item list; home = profile list. card_areas omitted (defaults to areas, identical to home).
- Profile photo (9bba8850 Jeff.png) and card photo (da551930 Jeff.png) both map to the same local jeff.png → profile_photo omitted. Check whether they were different crops.
- Profile phone link split into "(" tel: + "425) 591-8889" sms: — same number, merged.
- No summary card → no role/summary.

## Mechanical fixes / dropped content
- Clients lines for lina and jeff were missing the opening "(" ("…clients teens 15+, …)"); added it.
- Removed empty links in hours lines (several pointed to mailto:linak@… on Galit's and Jeff's pages — copy-paste leftovers), stray zero-width chars, sms: links.
- Claire: dropped the "Learn more about payment options" button in the fees section (empty URL; probably meant /payment-options-explained — schema has no fees button). "cat parent_**_._**" → "cat parent._".
- Claire: subheads in "Types of Services" (Child Therapy and Parent Support, etc.) were unmarked text in the scrape; rendered as `###`.
- "## About <name>" headings appeared at the very end of each scrape (section-4 heading over a background image); placed at the start of that section.
- Lina: "Languages: English, Russian, Hebrew, Ukrainian" was nested inside the last agency list item; moved to its own paragraph after the list.
- Jeff: merged paragraph split after "Virginia Commonwealth"; "# About Dr. Gillman" demoted to `##`. Kept the closing Email/Phone lines since the preceding sentence ends "…reach me\\Dr. Gillman at" (literal "\\" on the live page — likely an error, kept).
- Galit: dropped the closing contact block ("If you are interested in working with Galit, feel free to email or call:" + email + phone) — only repeats contact info.
- Fees: "  " hard line breaks in fee paragraphs became normal line breaks/paragraphs. Logo images not stored in fees (they are the `insurance` list); tea-cup decorative image dropped.
- room_photo_alt for Claire/Lina: original image had no alt; used "Therapy room".

## Possible real typos (kept as-is)
- Claire: "trauma-informed lense", "with learned from experience", "complex trauma ,", "Specialist, Asian Pacific Islander population, As a clinical…", "She received…" (switches to 3rd person), "Seattle..", "include::", "Wednesdays::"; summary "who providers attachment…".
- Galit intro: "She trained" (capital S mid-sentence); body "more unnoticeable then others", "how thing got", "i have since", "turned up to be".
- Jeff: intro ends "deployment.."; areas "(i.e,: …".
- Lina fees: missing final period.
