/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Canonical site origin; see astro.config.mjs and src/consts.ts. */
  readonly SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
