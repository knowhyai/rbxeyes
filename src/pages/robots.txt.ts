import type { APIRoute } from 'astro';
import { SITE_URL } from '../consts';

/**
 * robots.txt is generated (not a static file) so it always references the
 * same SITE_URL that drives the canonical tags and the sitemap.
 */
export const GET: APIRoute = () =>
  new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap-index.xml\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
