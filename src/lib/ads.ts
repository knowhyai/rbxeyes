/**
 * AdSense build-time configuration.
 *
 * All values come from PUBLIC_ env vars read at build time. This is a fully
 * static site: there is no ad decisioning of ours at runtime — when the vars
 * are unset or invalid, nothing ad-related is emitted at all (no Google
 * script tag, no placeholder units, and ads.txt stays comment-only).
 *
 * We never invent IDs: a var that does not match the real AdSense formats
 * below is treated as absent (with a build-time warning naming the var), not
 * faked with a placeholder.
 */

/**
 * Read a PUBLIC_ var from either Vite's import.meta.env or the plain process
 * environment. The first is populated from .env files, the second from the
 * shell running the build — covering both `pnpm build` styles.
 */
function envVar(name: string): string | undefined {
  const fromMeta = (import.meta.env as Record<string, unknown>)[name];
  if (typeof fromMeta === 'string' && fromMeta.trim() !== '') return fromMeta.trim();
  const fromProcess = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.[name];
  if (typeof fromProcess === 'string' && fromProcess.trim() !== '') return fromProcess.trim();
  return undefined;
}

/** AdSense publisher IDs are "pub-" or "ca-pub-" followed by 10–20 digits. */
const CLIENT_RE = /^(ca-)?(pub-\d{10,20})$/;

/** AdSense slot (ad unit) IDs are plain numeric strings of 8–20 digits. */
const SLOT_RE = /^\d{8,20}$/;

export interface AdUnitConfig {
  /** The slot id exactly as configured, validated. */
  slotId: string;
}

export interface AdsConfig {
  /** True only when a valid publisher client is configured. */
  enabled: boolean;
  /** Full client string for the Google script and ins tags ("ca-pub-…"). */
  client: string | null;
  /** Bare publisher id for ads.txt ("pub-…"). */
  publisherId: string | null;
  /** Ad units; null when PUBLIC_ADSENSE_SLOT_TOP/BOTTOM is unset or invalid. */
  top: AdUnitConfig | null;
  bottom: AdUnitConfig | null;
}

function parseClient(raw: string | undefined, name: string): { client: string | null; publisherId: string | null } {
  if (raw === undefined) return { client: null, publisherId: null };
  const match = CLIENT_RE.exec(raw);
  if (!match) {
    console.warn(
      `[ads] ${name}="${raw}" is not a valid AdSense publisher id (expected "pub-…" or "ca-pub-…" followed by 10–20 digits). Ignoring it — no ads will be emitted. Never set a guessed placeholder.`,
    );
    return { client: null, publisherId: null };
  }
  return { client: `ca-${match[2]}`, publisherId: match[2] };
}

function parseSlot(raw: string | undefined, name: string): AdUnitConfig | null {
  if (raw === undefined) return null;
  if (!SLOT_RE.exec(raw)) {
    console.warn(
      `[ads] ${name}="${raw}" is not a valid AdSense slot id (expected 8–20 digits). Ignoring it — that unit will not be emitted.`,
    );
    return null;
  }
  return { slotId: raw };
}

const { client, publisherId } = parseClient(envVar('PUBLIC_ADSENSE_CLIENT'), 'PUBLIC_ADSENSE_CLIENT');

export const ads: AdsConfig = {
  enabled: client !== null,
  client,
  publisherId,
  top: parseSlot(envVar('PUBLIC_ADSENSE_SLOT_TOP'), 'PUBLIC_ADSENSE_SLOT_TOP'),
  bottom: parseSlot(envVar('PUBLIC_ADSENSE_SLOT_BOTTOM'), 'PUBLIC_ADSENSE_SLOT_BOTTOM'),
};
