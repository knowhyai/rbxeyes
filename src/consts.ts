/**
 * Site-wide constants.
 *
 * SITE_URL must stay in sync with astro.config.mjs (which reads the same
 * env var for `site`, sitemap generation, etc.). Both default to
 * https://rbxeyes.com so the canonical URLs, Open Graph URLs, sitemap
 * and robots.txt all use one domain.
 */
const rawSiteUrl = import.meta.env.SITE_URL ?? 'https://rbxeyes.com';

export const SITE_URL = rawSiteUrl.replace(/\/+$/, '');
export const SITE_NAME = 'rbxeyes';
export const SITE_TAGLINE = 'Honest Roblox code tracker';
export const SITE_LANG = 'en';
