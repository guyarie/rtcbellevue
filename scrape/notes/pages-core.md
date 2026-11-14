# Notes: core pages + blog (pages-core agent)

Files written: `src/content/pages/{index,services,individual-therapy,couples-therapy,family-therapy,parent-coaching-consultation,med-management,group-therapy,collaborative-care,intro-1,contact-us,payment-options-explained,blog}.md`, `src/content/posts/{feeling-stuck-maybe-nothing-is-wrong-with-you,what-your-childs-behavior-is-telling-you}.md`. `npx astro sync` passes.

## Added from raw HTML (missing from the scrape Markdown)
- **List-section buttons.** Squarespace card grids have their own section button, and the scrape didn't capture it. I added it as `buttons`:
  - "Let's get started" → /contact-us on the home and /services "Our Services" grid and on the home "Areas Of Focus" grid.
  - "Contact us" → /contact-us on every clinician grid (home, intro-1, all service pages, group-therapy).
  - The schema renders `buttons` **before** `providers`. On the old site the button sat **below** the grid. That's a renderer-order issue to check.
- **Home office slideshow (gallery).** The slideshow's own files (`PXL_20260219_*`, `PXL_20260316_*`, `room+2.jpg`, `Room%2B3.jpg`, `Room+4.jpg`, `Room+5.png`, `Room+6.jpeg`, `Building+F.jpeg`) are **not in asset-map.json**.
  - I used the locally available same-named photos instead: room-1…room-6.png and building-f.jpg. They came from clinician and about pages, so they may be different crops or versions.
  - The two waiting-room slides ("Waiting room", "Waiting Room - Kids Section") are missing completely.
  - Fix: download the originals and swap them in.

## Schema couldn't express / approximations
- Within a section, render order is fixed (heading, image, body, accordion, buttons). Some content therefore moves:
  - individual-therapy: buttons were above the accordion; now they're below it.
  - family-therapy and parent-coaching: the body text after the buttons now renders above them.
  - Home hero: the italic quote was above the "Welcome…" heading; it's now the first paragraph of the body.
  - Home and contact: the image was above the heading; now it's below it.
- intro-1 section 1 was theme `bright-inverse` with a **background image** (unsplash-image-wirawxahtg.jpg). I mapped it to `theme: dark` + a normal `image`, because the schema has no background images.
- Home hero is a side-by-side, so it has `layout: image-right`. Every other page's hero is stacked: the image is centred above the text in the fluid grid.
- Blog posts: the "feeling stuck" post's `<title>` and og:title are a long sentence: "If you feel stuck and keep asking yourself… — Relational Therapy Collective". The posts schema has no separate SEO title, so `title` uses the H1, "Feeling Stuck? Maybe Nothing Is Wrong With You".
- Blog post images: the only images are the blog-list thumbnails and og:image (`picture+for+Miri+blog(1).png`, `picture+for+morgan+blog.png`). Neither is in asset-map.json, so `image` is omitted on both posts. Fix: download them.
- The "what your child's behavior" post ends with a button [Morgan Coburn](/morgan). It's now a plain Markdown link.
- The "feeling stuck" post has no categories or tags on the old site, so both are empty.
- Home `<title>` has no " — Relational Therapy Collective" suffix ("Relational Therapy Collective | Therapists in Bellevue, WA"). If the layout always appends the suffix, the home title will repeat the name, so the home page may need a no-suffix exception.

## Dropped
- All clinician card content in the team grids → replaced by `providers`. Differences vs. the old grids:
  - The old **parent-coaching** grid had 13 people, led by Morgan, Lilach and Limor. The new one depends on the `parent-coaching` tags and `order`.
  - **David** has a clinician file, but he wasn't on the old home or team grids. If he isn't `hidden`, `providers: {all: true}` will show him.
- payment-options-explained: dropped the Icon-01/03/04 template icons, as instructed. Also dropped the eyebrow label "EXPERTISE" above the heading, which looks like a template leftover. Restore it if the owners want it.
- Post bodies: dropped the author bio block and the trailing auto-generated author/category link line.
- Contact page footer (map, address, email, phone) is left to the layout.

## Links
- Fixed: home "Anxiety and Stress" /anxiety-stress → /anxiety-stress-management.
- Fixed (broken on old site): parent-coaching "Find Your Therapist" went to `/family-consultant-and-parent-support/coaches`, which doesn't exist. Changed it to `/family-consultant-parent-supportcoaches` (page title "Family Consultant & Parent Support/Coaches").
- Omitted: the "Life Coaching" card's "Learn More" (empty link) on home and /services.
- Kept as-is but worth confirming:
  - group-therapy "Find Groups Offered" → `/new-page`. That's the real URL of the "Groups Offered" page, but it's an ugly slug.
  - med-management "Contact Us" → external https://www.seattlepsychiatricclinic.com/contact.
  - med-management body cites https://pacificmindhealth.com and clevelandclinic.org.

## Data conflicts
- Maki: "LMHC" on home and service grids, but "LMHCA" on intro-1 (Meet the Team).
- Contact phone/email wording differs: home says "Phone: (425)675-0881 is for general inquiries…"; contact page says "Clinical information is best communicated via phone…". Both kept verbatim.

## Typos / oddities to ask the owners about (kept verbatim)
- "Collaborative Care for **Familes** with Complex Needs" (home and /services card title).
- "understand ing" (Family Therapy card), "wel-being" (Medication Management card), "connect with other" (Group card).
- individual-therapy "Age Groups": the first bullet is a broken duplicate of the second ("**For Younger Children**For younger children, …"). It's probably an edit leftover, so it should likely be deleted.
- family-therapy: "where one issue affects every and change…" (a word is missing).
- parent-coaching: "help them with strategies to between the child and parent/s"; "how they impact each others".
- payment: "after and copay or deductible"; "This option give you".
- med-management providers heading had a double space ("Medication  Management Providers"). I normalized it.
