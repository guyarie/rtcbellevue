# Notes: clinicians batch 2 (jessica-l, lilach, limor, maki)

Files: src/content/clinicians/{jessica-l,lilach,limor,maki}.md. `astro sync` passes.

## General decisions (all four)
- Profile pages contain a stray empty link `[\n](mailto:linak@mindfulcarewa.com)` inside "Schedule Hours" (copy-paste leftover from another clinician's page). Dropped.
- The profile "Accepting new clients:" label is followed by nothing on Jessica, Lilach and Limor's profiles (status text empty); used the home card's "Accepting new clients" (no real conflict).
- Squarespace column layout put some section headings after the text in the scrape ("## About Lilach", "## About Maki" at the very end of section 4; Jessica's "### Approach to Therapy..." after its paragraphs). Moved each heading to the top of its section.
- Room photos inside body sections removed from body (they are `room_photo`). Decorative tea/cherry-blossom image in the fees section dropped.
- Trailing contact lines in body ("Feel free to reach me at...", "If you are interested ... email/call: ...") dropped as they only repeat email/phone.
- `role` stored in sentence case (Squarespace showed it in caps via styling). Note: other agents' files are inconsistent (claire.md has ALL CAPS role) — normalise one way.
- Profile photos with empty alt (Lilach, Limor headshots) given alt = clinician name. Jessica room photo (room-5.png) had empty alt; used "Therapy office at Relational Therapy Collective".

## Jessica Lazaro (jessica-l)
- No summary card with a role line exists. `summary` taken from the therapists-by-age-group accordion blurb; no `role`.
- Credentials: heading "PsyD"; intro says she is a Licensed Mental Health Counselor (LH.60889640) — no LMHC in credentials anywhere. License kept as displayed "LH.60889640" (with dot).
- Home card areas have a nested list "Neurodiversity" > Executive Functioning Challenges / ADHD / Autism / OCD; flattened to "Neurodiversity (Executive Functioning Challenges, ADHD, Autism, OCD)".
- Card areas differ by page: home/intro-1/meet-the-team = nested version; focus pages (adhd, depression, trauma, individual-therapy, collaborative-care, …) = "Neurodiversity (executive functioning, challenges, ADHD, Autism, OCD)" (stray comma); old filter pages (anxiety-specialists, trauma-specialists, depression-providers, neurodivergent-providers, family-consultant…) = older list without Neurodiversity and "Women’s Issues" without parenthetical.
- Profile areas differ from card: profile adds Child and Family Therapy, Play Therapy, Expressive Arts; lacks Neurodiversity/ADHD/Autism/OCD.
- Clients line on most non-home pages is missing "(": "for clients teens, adults, parents)". Home version used.
- family-consultant-parent-supportcoaches card says "Accepting new clients-Parent Support".
- Profile intro says she sees "individuals of all ages including teenagers, and adults", while body says she works "with adult individuals"; meta description mentions couples/family therapy but tags have neither.
- Body keeps "_I am accepting new clients at the moment._" (owner text; will go stale if status changes).
- To Schedule mailto had an empty `&body=%0A`; dropped.
- Prose typos kept: "approaches therapy in a humanistic and client-centered, who enjoys…"; "Bachelor of Art’s"/"Master of Art’s"; fees last sentence missing final period.

## Lilach Geppert-Shapira (lilach)
- No summary card found anywhere (no role/summary set).
- Profile "Areas of Focus" is 4 groups with sub-lists; schema `areas` is flat strings. Set `areas` = the 4 group titles and reproduced the full grouped list at the top of the body ("## Areas of Focus" + `###` groups). Renderer may show group titles twice — decide later.
- "Therapy Approach for Children and Parent Coaching" promoted from `###` to `##` so the accordion items (CBT / ACT / EFT, converted to `###`) nest under it.
- Conflict within profile: intro "for the past 15 years" vs body "over 20 years of experience".
- Card photo: home/intro-1/meet-the-team/old filter pages use Lilach+3.jpg (used); focus pages use Lilach+headshot.jpg (same as profile).
- family-consultant-parent-supportcoaches and group-providers cards say "Accepting new clients-Parent Coaching".
- Fixed: zero-width char, doubled spaces ("relational and  holistic", "Coaching and  guidance"), paragraph split mid-sentence ("or include" / "children and teens").
- Prose oddities kept: "kids, teens and adult"; repeated "My approach is relational and holistic."; "There is no "one fit all" solution"; last sentence fragment "Rather than offering one-size-fits-all solutions."; "trained in the following:" followed by a sentence fragment; email typed capitalised "Lilach.geppert@gmail.com" (kept).
- Fees: no superbill; "will provide an invoice".

## Limor Raviv (limor)
- role/summary from family-therapists summary card ("INDIVIDUAL, CHILD AND FAMILY THERAPIST" + blurb).
- But tags (clinician-tags.json) don't include `family-therapy`, although she appears on old family-therapists page and that role says "family therapist". Tags copied as-is.
- Phone displayed on profile "(425) 448 0880" (missing hyphen); same digits everywhere.
- Email displayed "Limor2002@gmail.com", mailto lowercase; used lowercase.
- Languages sentence: home card "Limor also offers her services in Hebrew."; family-therapists & therapists-by-age-group say "Limor offers therapy in both English and Hebrew." Used standard (no languages_text).
- Card photo: home = Limor+3.jpg (used); focus pages = Limor+headshot.jpg; family-therapists = Limor.png.
- family-consultant/group-providers cards: "Accepting new clients-Parent Support/Coaching".
- Profile areas vs card: profile splits "Group therapy", "Mindfulness based groups for teens with anxiety", "Social skills and emotional regulation groups"; card has "Mindfulness based and social skills groups".
- Section 3 paragraph is duplicated verbatim in "About Limor" (kept both). Zero-width char removed.

## Maki Park (maki)
- Credentials: profile heading & home card "LMHC" (used, with license LH70154606). "LMHCA" on intro-1, meet-the-team, meet-the-team-2, anxiety-specialists, anxiety-stress, depression-providers-1, trauma-specialists, family-consultant…, psychodynamic-therapy, therapists-by-age-group.
- role/summary from psychodynamic-therapy card ("INDIVIDUAL THERAPIST"). The summary text says "Licensed Mental Health Counselor Associate" — kept verbatim but contradicts LMHC; owners should update. Also awkward wording "psychotherapy with clients struggling with, but not limited to teens and adults who are…".
- Accepting: "no" everywhere (profile + all cards). family-consultant card says "Not accepting new clients at this time-Parent Support".
- Profile areas list "Life Transitions" twice — deduplicated. Profile has "Self Esteem", which card lacks.
- Schedule hours: "Telehealth:" is empty on the profile; dropped that line, only In-person: Mondays, Thursdays kept. Cards still say "In-person & Telehealth services".
- Insurance: Premera + LifeWise logos/text → [lifewise, premera]. Text spells "Life Wise".
- To Schedule button links off-site to https://www.makipark.com/contact.
