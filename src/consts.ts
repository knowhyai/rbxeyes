/**
 * Site-wide constants.
 *
 * SITE_URL must stay in sync with astro.config.mjs (which reads the same
 * env var for `site`, sitemap generation, etc.). Both default to
 * https://rbxeyes.com so the canonical URLs, Open Graph URLs, sitemap
 * and robots.txt all use one domain.
 *
 * The value is read from import.meta.env (covers .env files and the
 * PUBLIC_-style loading) with a process.env fallback so a plain
 * `SITE_URL=… pnpm build` from the shell also works.
 */
function readSiteUrl(): string {
  const fromMeta = import.meta.env.SITE_URL;
  if (typeof fromMeta === 'string' && fromMeta.trim() !== '') return fromMeta.trim();
  const fromProcess = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.SITE_URL;
  if (typeof fromProcess === 'string' && fromProcess.trim() !== '') return fromProcess.trim();
  return 'https://rbxeyes.com';
}

const rawSiteUrl = readSiteUrl();

export const SITE_URL = rawSiteUrl.replace(/\/+$/, '');
export const SITE_NAME = 'rbxeyes';
export const SITE_TAGLINE = 'Honest Roblox code tracker';
export const SITE_LANG = 'en';
