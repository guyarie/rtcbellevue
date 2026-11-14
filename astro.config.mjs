import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.rtcbellevue.com',
  integrations: [tailwind(), sitemap()],
  output: 'static',
  // Old Squarespace URLs have no trailing slash (/claire, /adhd) — keep them that way.
  trailingSlash: 'never',
  build: { format: 'file' },
});
