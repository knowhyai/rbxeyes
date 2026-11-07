import type { APIRoute } from 'astro';
import { ads } from '../lib/ads';
import { SITE_URL } from '../consts';

/**
 * ads.txt is generated at build time so it always matches what the build
 * actually emits:
 *
 *  - No (or an invalid) publisher configured  -> comment-only file: this
 *    build serves no ads and authorises no sellers.
 *  - Valid PUBLIC_ADSENSE_CLIENT configured   -> the standard Google AdSense
 *    line is generated from that real publisher id only. Nothing is ever
 *    written here that did not come from configuration.
 *
 * The TAG_ID `f08c47fec0942fa0` is the fixed TAG-ID Google documents for
 * AdSense lines in ads.txt — a constant of the spec, not a per-site value.
 */
export const GET: APIRoute = () => {
  const host = (() => {
    try {
      return new URL(SITE_URL).host;
    } catch {
      return SITE_URL;
    }
  })();

  const lines: string[] = [
    `# ads.txt for ${host}`,
    '',
    '# This file is generated at build time from the PUBLIC_ADSENSE_* build',
    '# configuration — see README.md ("Advertising (optional)").',
    '',
  ];

  if (ads.enabled && ads.publisherId) {
    lines.push(`google.com, ${ads.publisherId}, DIRECT, f08c47fec0942fa0`);
  } else {
    lines.push(
      '# No authorised digital sellers: this build has no ad publisher',
      '# configured, so it serves no advertising and authorises none.',
    );
  }

  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
