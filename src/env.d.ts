/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Canonical site origin; see astro.config.mjs and src/consts.ts. */
  readonly SITE_URL?: string;
  /**
   * Google AdSense publisher id ("pub-…" or "ca-pub-" + 10–20 digits).
   * Unset or invalid -> no ad script, no ad units, comment-only ads.txt.
   * Never set a guessed or placeholder id.
   */
  readonly PUBLIC_ADSENSE_CLIENT?: string;
  /** AdSense slot (ad unit) id for the placement after the active-codes section. */
  readonly PUBLIC_ADSENSE_SLOT_TOP?: string;
  /** AdSense slot (ad unit) id for the placement after the redeem section. */
  readonly PUBLIC_ADSENSE_SLOT_BOTTOM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
