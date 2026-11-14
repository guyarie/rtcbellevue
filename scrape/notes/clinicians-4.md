# Notes — clinicians batch 4 (morgan, nina, rebeca, yogi, david)

Files: `src/content/clinicians/{morgan,nina,rebeca,yogi,david}.md`. `npx astro sync` passed (only warnings: no files yet in `pages`/`posts`).

## Conflicts between pages

### Morgan Coburn
- **Schedule link:** the profile's "To Schedule" button goes to `https://www.havenfamilyconsulting.com/book-online`. Every card (index, intro-1, home, individual-therapy, etc.) links "Click here to schedule." to `.../booking-calendar/discovery-call`. Because the profile is canonical for buttons, I used `book-online`. **Please check this:** the task brief said the button goes to discovery-call. If that link is wanted, change one URL.
- **Email:** the profile says `info@havenfamilyconsulting.com`. All cards say `Morgan@havenfamilyconsulting.com`. I used the profile's address.
- **Clients line:** the home page, intro-1 and meet-the-team say "(children, parents and families)". The service and focus pages say "(child and families, parents)". I used the home page version.
- **Card photo:** the home page and the filter pages use `morgan-2.jpg`. The service and focus pages use `morgan-1.png`. I used the home page's `morgan-2.jpg`.
- **Card areas:** the home page has short labels, which went into `card_areas`. The filter pages (adhd-specialists, anxiety-specialists, neurodivergent-providers) show the long profile wording with a typo, "behavio". The service pages say "Early childhood program & educators seeking consultations".
- **Accepting text:** family-consultant-parent-supportcoaches and group-providers say "Accepting new clients-Family Consultant & Parent Coaching".
- **No license:** she describes her work as non-clinical consultation that is not billable to insurance, so `insurance: []`. She is still tagged `individual-therapy`/`collaborative-care` per clinician-tags.json — the owners may want to review that.

### Nina Helms
- **Credentials:** the profile heading says "LMHC, NCC". All cards say "LMHC". I used "LMHC, NCC".
- **Email:** the profile says `nina@sisucg.org` (as does the emdr card). The home page and most cards say `sisucounseling@icloud.com`. I used the profile's address.
- **Insurance:** the text lists Premera, Aetna, First Choice and Kaiser PPO. The logos also include **Regence**, which the text doesn't mention. I included `regence` because it is based on the logos. The First Choice logo appears twice on the page; I listed it once.
- **Card photo:** the home page uses `nina-2.jpg`. Service pages use `nina-headshot.jpg`, the same image as the profile photo. emdr and emdr-1 use `nina.png`.
- **Role and summary:** taken from the emdr-1/family-therapists summary card ("INDIVIDUAL THERAPIST, EMDR SPECIALIST", converted to sentence case). The emdr card has an italic variant that says "diagnosed with" instead of "struggling with" and has no "(accepting new clients)".
- **Accepting text:** family-consultant-parent-supportcoaches says "Accepting new clients-Parent Support".

### Rebeca Marín Cordero
- **Accepting status (conflict):** the profile says "Accepting new couple clients". Every card (home, intro-1, service, focus and filter pages) says "Not accepting new clients at this time". I followed the profile: `accepting: limited`, `accepting_text: Accepting new couple clients`.
- **Name:** the profile uses "Marín" with an accent. Cards and clinician-tags.json use "Marin". I used "Marín Cordero".
- **License format:** "PY.60608622" in the intro and "PY. 60608622" in the bio. I used `PY.60608622`.
- **Profile vs card photo:** different CDN URLs, but asset-map.json maps both to `rebeca.png`, so both fields point to the same file. The same happens for Yogi (`yogi.png`), David (`david.png`) and the room photo `room-4.png` (Nina and David have different URLs). Check whether the second image was lost when files were deduplicated.
- **Hours:** the profile says in-person "Not at this time", which matches the card's "Telehealth services".

### Yogi Patel
- **Accepting text:** the profile says "Accepting new clients virtually". The card says "Accepting new patients". Both mean yes; the card text is used.
- **In-person:** the profile lists in-person hours on Fridays. Every card says "Telehealth services". I kept both as they are.
- **Insurance:** the text and a combined logo image list Aetna, Regence, Premera and **Cigna**. There is no `cigna` insurer entry, so `insurance` only has aetna, regence and premera. Cigna appears only in the fees text. The combined image `insurance-logoes.png` was not used.
- **Fees order:** I moved the sentence "Dr. Yogi accepts …" ahead of "Aside from insurances above…". On the old page it came after, which made "above" read wrong.

### David Neal (hidden)
- He is not on the home page, the team page or any nav page. He appears only on the /david profile and on old pages: depression-providers (full card), family-therapists (summary card) and **psychodynamic-therapy** (summary card, not mentioned in the task). He is probably a former clinician, so the file has `hidden: true` and `order: 99`.
- **Tags** are not in clinician-tags.json; I inferred them. `services: [individual-therapy, family-therapy]`, `focus: [depression]`. The psychodynamic-therapy page doesn't match any tag.
- **Role:** "TEEN, ADULT, COUPLES, AND FAMILY THERAPIST" from family-therapists. psychodynamic-therapy says "TEEN, ADULT, AND GROUP THERAPIST" and has a typo, "Porivdes".
- **Card fields** (photo, accepting, clients, card_areas) come from the depression-providers card. Its clients line is missing an opening parenthesis: "clients teens 13+, adults, couples, families)". Kept verbatim.
- **Insurance:** the PacificSource logo is shown, but the text says "David accepts Medicare insurance". I used `insurance: [pacificsource]` and kept the Medicare sentence in `fees`.
- **License:** WA PY61429548 (used) and MA PSY11698 (kept only in the intro).
- The bio says the fellowship's "anticipated graduation, 2024" — this is out of date.

## Fixes and drops
- **Dropped closing contact blocks** that only repeat email and phone: Nina, Rebeca, Yogi and David ("If you are interested in working with … email or call").
- **Dropped images:** the background tea/cherry-blossom image in the fees section (all five), insurer logos (now `insurance` refs), and Yogi's combined insurance-logo image.
- **"## About X" placement:** for Morgan, Rebeca and Yogi the scrape put this heading at the very end of the page. I moved it to the top of the bio section, matching Nina's page. David's "### About David" was already in place.
- **Morgan buttons:** "Pricing" was in the fees section; it is now in `buttons`, after "My Website" and "To Schedule".
- **Morgan areas:** the profile bolds the lead phrase. I dropped the bold because `areas` are plain strings.
- **Morgan hours:** the original reads "In-person:" then a line break (empty link) then "Video Sessions". This is ambiguous — it may mean "In-person & Video Sessions". I kept it as two lines.
- **David areas:** removed the trailing comma in "Depression,".
- **David approach paragraph:** fixed broken italics ("A_s a clinical…").
- **Other mechanical fixes:** removed zero-width characters, stray empty links and `?` with nothing after it in `mailto:` links, collapsed double spaces, and stripped the trailing ":" from the "Accepting new clients:" lines used as `new_clients`.
- **Photo alt text:** Morgan's and Nina's profile photos had no alt text, so I wrote "Headshot of <name>".

## Typos kept (possibly real errors)
- **Morgan:**
  - "emotional regulations"
  - "She specializes in behind helping parents"
  - "evidence-infromed"
  - "work hard on on the flowers"
- **Nina:**
  - "She a certified trauma professional"
  - "clinets" on the card
- **Rebeca:** "s well as obesity"
- **Yogi:**
  - "who has has obtained"
  - "Yogi see individuals"
  - "interest in psychiatry peaked" (should be "piqued")
  - the approach paragraph has no final period
- **David:** the intro contains a sentence fragment: "Having worked in private practice, … settings."
