import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { marked } from 'marked';

export type Clinician = CollectionEntry<'clinicians'>;

/** Site settings (src/content/site/settings.md). */
export async function getSettings() {
  const entry = await getEntry('site', 'settings');
  if (!entry) throw new Error('src/content/site/settings.md is missing');
  return entry.data;
}

/** Contact-form settings (src/content/site/contact.md). */
export async function getFormSettings() {
  const entry = await getEntry('site', 'contact');
  if (!entry) throw new Error('src/content/site/contact.md is missing');
  return entry.data;
}

/**
 * Returns a lookup for UI strings from src/content/site/labels.md.
 * `t('blog_by', { author: 'Miri' })` fills `{author}` placeholders.
 * A missing key fails the build so typos can't ship.
 */
export async function getLabels() {
  const entry = await getEntry('site', 'labels');
  const labels = entry?.data.labels ?? {};
  return (key: string, vars: Record<string, string | number> = {}) => {
    const s = labels[key];
    if (s === undefined) throw new Error(`Missing label "${key}" in src/content/site/labels.md`);
    return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
  };
}

/** Visible clinicians in team order. */
export async function getClinicians(filter?: {
  service?: string;
  focus?: string;
  all?: boolean;
}): Promise<Clinician[]> {
  const all = (await getCollection('clinicians', (c) => !c.data.hidden)).sort(
    (a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name),
  );
  if (!filter || filter.all) return all;
  return all.filter(
    (c) =>
      (!filter.service || (c.data.services as string[]).includes(filter.service)) &&
      (!filter.focus || (c.data.focus as string[]).includes(filter.focus)),
  );
}

/** "Claire de Leon, LMHC" */
export const displayName = (c: Clinician) => `${c.data.name}, ${c.data.credentials}`;

/** "4256750881" -> "(425) 675-0881" */
export function formatPhone(digits: string) {
  const d = digits.replace(/\D/g, '');
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : digits;
}

/** Render a Markdown string from frontmatter to HTML. */
export function md(s?: string) {
  return s ? (marked.parse(s, { async: false }) as string) : '';
}

/** Inline Markdown (no wrapping <p>). */
export function mdInline(s?: string) {
  return s ? (marked.parseInline(s, { async: false }) as string) : '';
}
