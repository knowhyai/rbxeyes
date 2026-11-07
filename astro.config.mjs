// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * SITE_URL is the single source of truth for this site's origin.
 * It feeds the <link rel="canonical"> URLs, Open Graph URLs, the
 * @astrojs/sitemap output and the generated robots.txt — they all
 * use the same domain by construction.
 *
 * Override it at build time when previewing on another origin, e.g.:
 *   SITE_URL=https://preview.example.org pnpm build
 */
const SITE_URL = (process.env.SITE_URL ?? 'https://rbxeyes.com').replace(/\/+$/, '');

export default defineConfig({
  site: SITE_URL,
  // Fully static output in ./dist, ready for any static host (Cloudflare Pages).
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
