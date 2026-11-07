/**
 * Shared types for the rbxeyes data layer.
 *
 * The JSON files under src/data are validated against these shapes by
 * scripts/validate-data.mjs before every build (see the "build" script
 * in package.json). Dates are plain ISO calendar dates (YYYY-MM-DD).
 */

/** Status of a code as *reported by our sources* — never an in-game claim. */
export type CodeStatus = 'active' | 'needs-check' | 'expired';

/** A source page we manually read to compile codes. */
export interface SourceRef {
  /** Human-readable publication name, e.g. "Pro Game Guides". */
  name: string;
  /** Short name for compact table cells, e.g. "PGG". Falls back to name. */
  short?: string;
  /** Full URL of the page we read. Must be https. */
  url: string;
  /** The source's own published/updated date (ISO calendar date). */
  updated: string;
  /** Whether `updated` is a "published" or "updated" date, for honest wording. */
  dateKind?: 'updated' | 'published';
}

/** A single redeem code record. */
export interface GameCode {
  /** Exact code string as printed by the source — never altered. */
  code: string;
  /** Reward text, verbatim from our most recent source. Never invented or merged. */
  reward: string;
  /** active | needs-check | expired — reported status, not an in-game claim. */
  status: CodeStatus;
  /** Discrepancies, expiry dates and requirements, stated openly. May be empty. */
  note: string;
  /** URLs of the sources (from the game's `sources` list) that list this code. */
  sources: string[];
  /** The date we actually read the sources (ISO calendar date). */
  lastChecked: string;
  /** The updated/published dates of the referenced sources at read time. */
  sourceUpdated: string[];
}

/** Everything a game's JSON file contains. */
export interface GameData {
  /** Stable id, e.g. "anime-eyes". */
  id: string;
  /** Display title, e.g. "+1 Anime Eyes". */
  title: string;
  /** The date we last read this game's sources (ISO calendar date). */
  lastChecked: string;
  /** Official Roblox game URL — only present when a source verified it. */
  gameUrl?: string;
  /** Who shared the game link, phrased honestly. */
  gameUrlCredit?: string;
  /** Source pages we read for this game. */
  sources: SourceRef[];
  /** All codes for this game, any status. */
  codes: GameCode[];
}

/** A question/answer pair used on pages and in FAQ JSON-LD. */
export interface FaqItem {
  q: string;
  a: string;
}

/** Tone for callout boxes. */
export type CalloutTone = 'mint' | 'amber' | 'rose';

export interface Callout {
  title: string;
  body: string;
  tone: CalloutTone;
}
