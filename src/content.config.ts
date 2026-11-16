import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Tags that connect clinicians to pages. A page section with
 * `providers: { service: couples-therapy }` lists every clinician whose
 * `services` includes `couples-therapy` — so a clinician's tags are the only
 * place that decides which "Meet the team" grids they appear in.
 * Adding a new tag here is a code change (and should come with a page).
 */
export const SERVICES = [
  'individual-therapy',
  'couples-therapy',
  'family-therapy',
  'parent-coaching',
  'group-therapy',
  'med-management',
  'collaborative-care',
] as const;

export const FOCUS = [
  'adhd',
  'anxiety',
  'depression',
  'neurodivergent',
  'parenting',
  'relational',
  'selective-mutism',
  'trauma',
] as const;

// Background colour of a page section — mirrors the Squarespace section themes.
// `dark` = dark-brown band with light text (was a photo-background section).
const theme = z.enum(['white', 'light', 'bright', 'dark']).default('white');

const button = z.object({
  label: z.string(),
  url: z.string(),
  style: z.enum(['primary', 'secondary']).default('primary'),
});

// Sections are the building blocks of every generic page (services, areas of
// focus, groups, home, contact…). Every field is optional; a section renders
// whatever it has, in this order: heading, image, body, accordion,
// cards, providers, buttons, gallery, video, embed, form.
const section = (image: any) =>
  z.object({
    id: z.string().optional(), // anchor (#id)
    theme,
    // `background` = the image fills the section behind the text (light text on a dark tint).
    // `hero` = full-width photo banner; text sits on the left over a soft fade (home page top).
    layout: z.enum(['stack', 'image-left', 'image-right', 'background', 'hero']).default('stack'),
    heading: z.string().optional(),
    image: image.optional(),
    image_alt: z.string().optional(),
    body: z.string().optional(), // Markdown
    highlights: z.array(z.string()).optional(), // short facts shown as a row of chips
    accordion: z.array(z.object({ title: z.string(), body: z.string() })).optional(),
    cards: z
      .array(
        z.object({
          title: z.string(),
          image: image.optional(),
          image_alt: z.string().optional(),
          body: z.string().optional(), // Markdown
          button: button.optional(),
          buttons: z.array(button).optional(), // when a card needs more than one
        }),
      )
      .optional(),
    // Card image shape: `photo` = 4:3, cropped to fill; `wide` = about 2:1, shows
    // wide pictures (440×229) whole. All cards in a section share the shape.
    card_images: z.enum(['photo', 'wide', 'portrait']).default('photo'),
    // On phones cards scroll sideways; `cards_stack: true` stacks them instead
    // (use when every card matters, e.g. the contact options).
    cards_stack: z.boolean().default(false),
    buttons: z.array(button).optional(),
    // A grid of clinicians, chosen by tag (or everyone with `all: true`).
    providers: z
      .object({
        service: z.enum(SERVICES).optional(),
        focus: z.enum(FOCUS).optional(),
        all: z.boolean().optional(),
        // `full` = focus-area list card (team page); `summary` = role + blurb;
        // `compact` = photo, name and status only (home page).
        card: z.enum(['full', 'summary', 'compact']).default('full'),
      })
      .optional(),
    gallery: z.array(z.object({ image, alt: z.string(), caption: z.string().optional() })).optional(), // caption shown under the photo
    video: z.string().url().optional(), // YouTube embed URL
    form: z.boolean().optional(), // the contact form (settings in site/contact.md)
    embed: z.string().url().optional(), // iframe src
  });

const pages = defineCollection({
  // One file per URL: src/content/pages/adhd.md -> /adhd
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(), // <title> / SEO title
      description: z.string().optional(), // meta description
      sections: z.array(section(image())).default([]),
    }),
});

const clinicians = defineCollection({
  // One file per clinician: src/content/clinicians/claire.md -> /claire
  // The Markdown body is the long-form part of the profile page.
  loader: glob({ pattern: '*.md', base: './src/content/clinicians' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(), // "Claire de Leon"
      credentials: z.string(), // "LMHC"
      order: z.number(), // position in team grids (lower first)
      hidden: z.boolean().default(false), // keep the file but hide from site
      role: z.string().optional(), // short title, e.g. "Individual therapist, EMDR specialist"
      license: z.string().optional(), // "LH60618686"

      photo: image(), // card headshot
      photo_alt: z.string(),
      profile_photo: image().optional(), // headshot on the profile page (defaults to photo)
      profile_photo_alt: z.string().optional(),
      room_photo: image().optional(), // office photo on the profile page
      room_photo_alt: z.string().optional(),

      accepting: z.enum(['yes', 'no', 'limited']),
      accepting_text: z.string(), // shown verbatim, e.g. "Accepting new clients"
      clients: z.string(), // "In-person & Telehealth services for clients (teens, adults, parents)"
      languages: z.array(z.string()).default([]), // languages other than English
      languages_text: z.string().optional(), // override the card's languages sentence

      email: z.string().email().optional(),
      phone: z.string().regex(/^\d{10}$/, '10 digits, no punctuation').optional(),

      services: z.array(z.enum(SERVICES)).min(1),
      focus: z.array(z.enum(FOCUS)).default([]),

      summary: z.string().optional(), // one-paragraph blurb (summary cards)
      card_areas: z.array(z.string()).optional(), // areas on team cards (defaults to `areas`)
      areas: z.array(z.string()), // "Areas of focus" on the profile page
      intro: z.string(), // first paragraph of the profile (Markdown)

      buttons: z.array(button).default([]), // e.g. To Schedule, Group Offerings
      new_clients: z.string().optional(), // how to get started (Markdown)
      hours: z.string().optional(), // schedule hours (Markdown)

      fees_buttons: z.array(button).default([]),
      fees: z.string().optional(), // Fees & insurance text (Markdown)
      insurance: z.array(reference('insurers')).default([]),
    }),
});

const insurers = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/insurers' }),
  schema: ({ image }) => z.object({ name: z.string(), logo: image() }),
});

const posts = defineCollection({
  // src/content/posts/<slug>.md -> /blog/<slug>
  loader: glob({ pattern: '*.md', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      author: reference('clinicians'),
      image: image().optional(),
      image_alt: z.string().optional(),
      categories: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

// Site-wide settings and copy (nav, footer, contact details, form labels…).
const site = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/site' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // settings.md
      name: z.string().optional(),
      logo: image().optional(),
      logo_alt: z.string().optional(),
      address: z.array(z.string()).optional(),
      map_url: z.string().url().optional(),
      map_image: image().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      nav: z
        .array(
          z.object({
            label: z.string(),
            url: z.string(),
            children: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
            // Append one link per (visible) clinician to this dropdown.
            children_from: z.enum(['clinicians']).optional(),
          }),
        )
        .optional(),
      cta: button.optional(), // header button
      chat_url: z.string().url().optional(), // floating chat bubble (iframe src)
      footer_note: z.string().optional(),
      // contact.md (form) — submissions are emailed to form_email via FormSubmit
      form_email: z.string().email().optional(),
      form_subject: z.string().optional(),
      form_fields: z
        .array(
          z.object({
            name: z.string(),
            label: z.string(),
            type: z.enum(['text', 'email', 'tel', 'textarea', 'select']),
            required: z.boolean().default(false),
            options: z.array(z.string()).optional(),
          }),
        )
        .optional(),
      form_note: z.string().optional(),
      form_submit: z.string().optional(),
      form_success: z.string().optional(),
      // labels.md — small UI strings used by components
      labels: z.record(z.string()).optional(),
    }),
});

export const collections = { pages, clinicians, insurers, posts, site };
