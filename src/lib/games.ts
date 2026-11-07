/**
 * Game registry: typed JSON data (src/data/*.json) merged with per-page
 * editorial content (intros, redemption steps, FAQs, SEO metadata).
 *
 * Adding a code = edit the JSON only. Changing steps/FAQ/intro = edit here.
 * scripts/validate-data.mjs guards the JSON; the asserts below guard this
 * registry (they run at build time and fail the build if violated).
 */
import type { Callout, CodeStatus, FaqItem, GameCode, GameData, SourceRef } from './types';
import animeEyesData from '../data/anime-eyes.json';
import aotrData from '../data/aotr.json';
import stealABalutData from '../data/steal-a-balut.json';

/** Editorial content that never belongs in the data JSON. */
export interface GameEditorial {
  /** Route path with trailing slash; '' (empty string) means home '/'. */
  slug: string;
  /** Full canonical path, e.g. '/', '/codes-for-aotr/'. */
  path: string;
  /** Short label for the site nav. */
  navLabel: string;
  /** Small caps line above the H1. */
  eyebrow: string;
  /** H1 text before the data-derived month; defaults to `${title} Codes`. */
  heroTitle?: string;
  /** Hero intro paragraph (plain text). */
  intro: string;
  seoTitle: string;
  seoDescription: string;
  /** How-to-redeem steps (plain text, numbered when rendered). */
  redeemSteps: string[];
  /** Requirement/prerequisite callout shown next to the steps, if any. */
  redeemNote?: Callout;
  /** Intro line above the worth-trying section. */
  worthTryingIntro: string;
  faqs: FaqItem[];
  /** Ids of the two related games shown at the bottom of the page. */
  relatedIds: string[];
  /** Extra honesty note about the sources, shown under the source list. */
  sourceNote?: string;
}

export interface GameRecord extends GameData, GameEditorial {}

const animeEyes: GameRecord = {
  ...(animeEyesData as unknown as GameData),
  slug: '',
  path: '/',
  navLabel: '+1 Anime Eyes',
  eyebrow: 'Roblox code tracker',
  heroTitle: '+1 Anime Eyes Roblox Codes',
  intro:
    'We read three independent code guides for +1 Anime Eyes and list every code they agree is still redeemable — kyubi coins, eggs and boosts, with one-tap copy buttons and the exact reward wording each source printed. “Reported active” means exactly that: the sources listed it as working when we read them on 6 November 2026. We have never tested these codes in-game.',
  seoTitle: '+1 Anime Eyes Codes (November 2026) — Anime Eyes Roblox Codes',
  seoDescription:
    'Every +1 Anime Eyes Roblox code reported for November 2026 — kyubi coins, eggs and boosts, with copy buttons, source links and redemption steps. Reported by sources, never tested in-game.',
  redeemSteps: [
    'Open Roblox and launch +1 Anime Eyes (use the game link below and check the title matches before redeeming).',
    'Once in-game, click the blue Codes button in the top-right corner of the screen.',
    'Paste a code exactly as shown in the table above into the “Enter code” field.',
    'Click Redeem. If the code is still live and your account is eligible, the reward is granted immediately.',
  ],
  redeemNote: {
    title: 'Conflicting requirement: first Rebirth',
    body:
      'Pro Game Guides says you must reach your first Rebirth before codes can be redeemed in +1 Anime Eyes; MobileMatters does not mention any requirement. The sources disagree, so we report both claims without picking a side — if the Codes button or a redemption fails on a fresh account, reach your first Rebirth and try again.',
    tone: 'amber',
  },
  worthTryingIntro:
    'Codes that at least one source lists but we cannot call active in good faith — a spelling disagreement, a single source, or an expiry that lands right on our read date. Read each note before trying.',
  faqs: [
    {
      q: 'Are these +1 Anime Eyes codes tested in-game?',
      a: 'No. Every code on this page is compiled from independent code guides — we report what they list and note where they disagree. “Reported active” means the cited sources listed the code as working on 6 November 2026, not that we redeemed it ourselves.',
    },
    {
      q: 'Do +1 Anime Eyes codes need exact capitalization?',
      a: 'Our sources print these codes in capitals and we show them exactly as printed. We cannot verify whether redemption is case-sensitive, so paste each code exactly as it appears in the table — including digits like the “2” in UPDATE2.',
    },
    {
      q: 'Why does a code say “Invalid” or “Already redeemed”?',
      a: '“Already redeemed” usually means your account has used that code — most codes are one per account. “Invalid” or “Expired” typically means the code ended after our sources were last updated. Also check the spelling: one source’s intro mentions “KURAMA”, but its own table and the two other sources all print “KURUMA” — the table spelling is what we list.',
    },
    {
      q: 'Why can’t I see the Codes button, or why does redemption fail?',
      a: 'Pro Game Guides says a first Rebirth is required before codes can be redeemed; MobileMatters doesn’t mention that requirement. If redemption fails early on, reach your first Rebirth and try again — we report both claims rather than assert either as certain.',
    },
    {
      q: 'What do UPDATE1 and NEWWORLDS actually give?',
      a: 'The table shows Pro Game Guides’ wording: UPDATE1 is a 2x Chakra boost (10 minutes) and NEWWORLDS is a 2x Trophy boost (10 minutes). MobileMatters — updated later, on 5 November 2026 — lists both rewards only as “rewards”, with no specifics. We use Pro Game Guides’ wording because it is the only source that names the reward at all; both sources and both dates stay on each code so you can judge either way.',
    },
    {
      q: 'When were these codes last checked?',
      a: 'We last read all three sources on 6 November 2026. The sources themselves were updated 30 October 2026 (GameRant), 2 November 2026 (Pro Game Guides) and 5 November 2026 (MobileMatters). The month in the headline comes from our own read date — never from a build-time clock.',
    },
  ],
  relatedIds: ['aotr', 'steal-a-balut'],
  sourceNote:
    'Note: Pro Game Guides’ article body oddly references a future date (“November 21”). We treat that as an editorial slip on their side and do not use it as evidence for anything — including future checks. Their intro also mentions a “KURAMA” code, but their own table and both other sources print “KURUMA”, so only KURUMA is seeded.',
};

const aotr: GameRecord = {
  ...(aotrData as unknown as GameData),
  slug: 'codes-for-aotr',
  path: '/codes-for-aotr/',
  navLabel: 'AOTR Codes',
  eyebrow: 'Roblox code tracker',
  intro:
    'Attack on Titan Revolution (AOTR) codes drop Spins, Potions, Emperor Keys, Memory Scrolls and Gems. Two independent guides agree on the list below — we read both on 6 November 2026 and show their reward wording verbatim, including the expiry dates they report. “Reported active” means exactly that: listed as working by both sources, never tested in-game by us.',
  seoTitle: 'AOTR Codes (November 2026) — Attack on Titan Revolution Codes',
  seoDescription:
    'All Attack on Titan Revolution (AOTR) codes reported for November 2026 — Spins, Potions, Emperor Keys and Gems, with copy buttons, source links and redemption steps. Reported by sources, never tested in-game.',
  redeemSteps: [
    'Open Roblox and launch Attack on Titan Revolution (use the game link below and check the title and creator match before redeeming).',
    'Select your save slot.',
    'From the main menu — before starting a run — open the Codes entry in the bottom-right corner.',
    'Paste a code exactly as printed above and confirm with Redeem. The reward is added to that save slot.',
  ],
  redeemNote: {
    title: 'Some codes have requirements',
    body:
      'GamesRadar reports that UPDATE5 requires Prestige 1, and that WZINS and TERRA70K require level 25. If one of those codes rejects you, the requirement is the first thing to check.',
    tone: 'mint',
  },
  worthTryingIntro:
    'Codes we cannot honestly call active: FREECODE11 expires on our read date itself, and the two sources print the Halloween code with different spellings. Each entry explains exactly what is uncertain.',
  faqs: [
    {
      q: 'Are these Attack on Titan Revolution codes tested in-game?',
      a: 'No. We compile what GamesRadar and Destructoid report and note where they disagree. “Reported active” means both sources listed the code as working on 6 November 2026 — we have not redeemed them ourselves and never claim to.',
    },
    {
      q: 'Are AOTR codes case-sensitive?',
      a: 'The sources disagree: GamesRadar says AOTR codes are not case-sensitive, while Destructoid says capitalization matters. We can’t settle that, so paste each code in the exact case shown in the tables — that works under either claim.',
    },
    {
      q: 'Why is FREECODE11 in “worth trying” instead of the active table?',
      a: 'Both sources list it as active, but GamesRadar reports it expires on 6 November 2026 — the same day we read the sources — and neither gives a cutoff time. It might die mid-day, so we mark it needs-check rather than active. Try it first; it may still work.',
    },
    {
      q: 'Which Halloween spelling is right — HALLOWEEN2026 or HALLOWEN2026?',
      a: 'We don’t know, and we won’t pretend to. GamesRadar prints HALLOWEEN2026 (“4,000x Pumpkins”) while Destructoid prints HALLOWEN2026 (“4k Pumpkins”) — one is likely a typo, but each spelling comes from a reliable source. Try both, exactly as printed, before the expiry GamesRadar reports (around 10 November 2026).',
    },
    {
      q: 'Why does a code fail even though it’s listed as active?',
      a: 'Most AOTR codes have expiry dates (see each code’s note — most here end 10 or 15 November 2026). Others have requirements: UPDATE5 needs Prestige 1, and WZINS and TERRA70K need level 25, per GamesRadar. Beyond that, “already redeemed” means the account used it — codes are generally one per account.',
    },
    {
      q: 'When were these codes last checked?',
      a: 'We last read both sources on 6 November 2026; both were updated that same day. The month in the headline comes from our read date, not a build-time clock.',
    },
  ],
  relatedIds: ['anime-eyes', 'steal-a-balut'],
  sourceNote:
    'Game link: we opened the Roblox page at roblox.com/games/13379208636 on 7 November 2026 and its title read “Attack on Titan Revolution”, creator “AoTR [PI]” (also confirmed via Rolimons’ mirror of the same place ID). That is the extent of the verification — the title and creator match, nothing more.',
};

const stealABalut: GameRecord = {
  ...(stealABalutData as unknown as GameData),
  slug: 'steal-a-balut-codes',
  path: '/steal-a-balut-codes/',
  navLabel: 'Steal a Balut',
  eyebrow: 'Roblox code tracker',
  intro:
    'Steal a Balut codes hand out free Speed and Cash. Both guides we track agree on all three codes below — we read them on 6 November 2026 and keep the reward wording verbatim. “Reported active” means exactly that: listed as working by both sources, never tested in-game by us.',
  seoTitle: 'Steal a Balut Codes (November 2026) — Roblox Speed & Cash Codes',
  seoDescription:
    'Steal a Balut Roblox codes for November 2026 — free Speed and Cash rewards with copy buttons, exact source links and redemption steps. Reported by sources, never tested in-game.',
  redeemSteps: [
    'Open Roblox and launch Steal a Balut (use the game link below and check the title matches before redeeming).',
    'Tap the Shop button on the left side of the screen.',
    'Scroll to the bottom of the Shop to find the Codes section.',
    'Enter a code in exact capitals and press Redeem.',
  ],
  redeemNote: {
    title: 'No prerequisites reported',
    body:
      'Dexerto lists no group joins, likes or level requirements for Steal a Balut codes. If a code still fails, it most likely expired after 4 November 2026, when both sources were last updated.',
    tone: 'mint',
  },
  worthTryingIntro:
    'Codes we cannot call active in good faith — single-source listings, spelling conflicts or expiry dates landing on our read date.',
  faqs: [
    {
      q: 'Are these Steal a Balut codes tested in-game?',
      a: 'No. We compile what GGRecon and Dexerto report and note any wording differences. “Reported active” means both sources listed the code as working when we read them on 6 November 2026 — we have not redeemed them ourselves.',
    },
    {
      q: 'Do Steal a Balut codes need exact capitals?',
      a: 'Both sources say to enter the codes in exact capitals, so paste them exactly as printed in the table — OG, BALUT and RELEASED are all shown in capitals for a reason.',
    },
    {
      q: 'Why did my code fail?',
      a: 'If it says “already redeemed”, your account used it — codes are generally one per account. If it says invalid or expired, the code most likely ended after the sources were last updated on 4 November 2026. Dexerto lists no other prerequisites for this game.',
    },
    {
      q: 'When were these codes last checked?',
      a: 'We last read both sources on 6 November 2026. GGRecon’s page was updated 4 November 2026 and Dexerto’s was published 4 November 2026. The month in the headline comes from our read date, not a build-time clock.',
    },
  ],
  relatedIds: ['anime-eyes', 'aotr'],
  sourceNote:
    'Game link: we opened the Roblox page at roblox.com/games/90773083590844 on 7 November 2026 and its title read “Steal A Balut”, created by a Roblox group of the same name, and its description matches the codes we track (OG, BALUT, RELEASED). Verified to that extent only.',
};

export const GAMES: GameRecord[] = [animeEyes, aotr, stealABalut];

/* ------------------------------------------------------------------ */
/* Registry integrity — runs at build; a violation fails the build.   */
/* ------------------------------------------------------------------ */
{
  const ids = new Set<string>();
  const paths = new Set<string>();
  for (const game of GAMES) {
    if (ids.has(game.id)) throw new Error(`Duplicate game id: ${game.id}`);
    if (paths.has(game.path)) throw new Error(`Duplicate game path: ${game.path}`);
    ids.add(game.id);
    paths.add(game.path);
    if (game.codes.length === 0) throw new Error(`Game ${game.id} has no codes`);
    for (const relatedId of game.relatedIds) {
      if (!ids.has(relatedId) && !GAMES.some((g) => g.id === relatedId)) {
        throw new Error(`Game ${game.id} references unknown related game ${relatedId}`);
      }
    }
  }
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

export function getGame(id: string): GameRecord {
  const game = GAMES.find((g) => g.id === id);
  if (!game) throw new Error(`Unknown game: ${id}`);
  return game;
}

export function getRelatedGames(game: GameRecord): GameRecord[] {
  return game.relatedIds
    .map((id) => GAMES.find((g) => g.id === id))
    .filter((g): g is GameRecord => Boolean(g));
}

export function codesByStatus(game: GameRecord, status: CodeStatus): GameCode[] {
  return game.codes.filter((c) => c.status === status);
}

/** Resolve a code's source URLs to their full source records. */
export function sourceRefsFor(game: GameData, code: GameCode): SourceRef[] {
  return code.sources
    .map((url) => game.sources.find((s) => s.url === url))
    .filter((s): s is SourceRef => Boolean(s));
}

/** Short source label for compact table cells. */
export function sourceShortName(source: SourceRef): string {
  return source.short ?? source.name;
}

/** The newest date we read any game's sources — used for the footer stamp. */
export const SITE_LAST_READ: string = GAMES.reduce(
  (newest, game) => (game.lastChecked > newest ? game.lastChecked : newest),
  '0000-00-01',
);

export function countActive(game: GameRecord): number {
  return codesByStatus(game, 'active').length;
}
export function countNeedsCheck(game: GameRecord): number {
  return codesByStatus(game, 'needs-check').length;
}
export function countExpired(game: GameRecord): number {
  return codesByStatus(game, 'expired').length;
}
