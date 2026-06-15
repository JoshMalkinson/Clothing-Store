// @ts-check
import { defineConfig } from 'astro/config';

// SCSS works out of the box once `sass` is installed (see package.json).
// When you deploy, set `site` to your production URL for correct SEO/sitemaps.
export default defineConfig({
  // GitHub Pages project site -> https://joshmalkinson.github.io/Clothing-Store/
  site: 'https://joshmalkinson.github.io',
  base: '/Clothing-Store',
});
