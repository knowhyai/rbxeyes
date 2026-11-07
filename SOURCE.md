# SOURCE.md — research log

Every URL below was **read on 2026-11-06** (fetched live, by hand — nothing automated).
Publication/update dates are the calendar dates each page reported for itself at read time.
This file is the provenance record for the seed data in `src/data/*.json`.

## Code sources (seeded the JSON)

| # | Source | URL | Published/updated | Used for |
|---|--------|-----|-------------------|----------|
| 1 | MobileMatters | https://mobilematters.gg/guides/redeem-codes/1-anime-eyes | updated 2026-11-05 | Newest wording for all 7 +1 Anime Eyes rewards (verbatim, minus a “(new!)” suffix on newly added rows) |
| 2 | Pro Game Guides | https://progameguides.com/roblox/1-anime-eyes-codes/ | updated 2026-11-02 | +1 Anime Eyes active list agreement; fuller reward wording (noted per code) |
| 3 | GameRant | https://gamerant.com/roblox-codes-plus-one-anime-eyes-discord-server-links/ | updated 2026-10-30 | +1 Anime Eyes agreement; Roblox game link |
| 4 | GamesRadar | https://www.gamesradar.com/games/action-rpg/aotr-codes/ | updated 2026-11-06 | AOTR verbatim rewards, expiry dates (Nov 6/10/15), Prestige 1 + level 25 requirements, “not case sensitive” claim, HALLOWEEN2026 spelling |
| 5 | Destructoid | https://www.destructoid.com/attack-on-titan-revolution-codes/ | updated 2026-11-06 | AOTR active list agreement, “case matters” claim, HALLOWEN2026 spelling |
| 6 | Dexerto | https://www.dexerto.com/roblox/steal-a-balut-codes-3424664/ | published 2026-11-04 | Steal a Balut active list agreement, “no prerequisites”, reward wording variants |
| 7 | GGRecon | https://www.ggrecon.com/guides/all-steal-a-balut-codes-to-redeem-free-cash-speed/ | updated 2026-11-04 | Steal a Balut verbatim reward wording (OG, RELEASED) |

## Research & inspiration (not code sources)

These informed the site's approach and toolchain. **No codes were taken from them.**

| Source | URL | Date | Why it's here |
|--------|-----|------|---------------|
| Codes.gg | https://codesgg.com/ | read 2026-11-06 | Label what is actually known and never pretend codes were checked in-game |
| FreshCodes wiki | https://freshcodes.wiki/ | read 2026-11-06 | The two-source agreement model for "active" listings |
| dev.to essay | https://dev.to/akbargul/i-built-a-static-site-that-re-checks-2600-roblox-code-lists-every-day-15l9 | published 2026-11-03, read 2026-11-06 | Static site + JSON architecture reference. We deliberately do **not** auto-re-check anything — rbxeyes is manual only |
| knowhy-news `astro.config.mjs` | https://github.com/knowhyai/knowhy-news/blob/main/astro.config.mjs | read 2026-11-06 | Reference for Astro + `@astrojs/sitemap` + static output config (read via `gh`; not forked, nothing copied) |
| knowhy-news `package.json` | https://github.com/knowhyai/knowhy-news/blob/main/package.json | read 2026-11-06 | pnpm/Astro toolchain reference (read via `gh`; not forked, nothing copied) |

## Seeded data summary

- **+1 Anime Eyes** (`src/data/anime-eyes.json`) — 7 active (all three sources agree on all 7): UPDATE2, KURUMA, 1MILLIONVISITS, AWAKEN, SHARINGAN, UPDATE1, NEWWORLDS. None expired.
- **Attack on Titan Revolution** (`src/data/aotr.json`) — 7 active, 3 needs-check (FREECODE11, HALLOWEEN2026, HALLOWEN2026), 4 expired (FREECODE10, FREECODE9, FREECODE8, GROUP10M). Both sources agree on the 8 active-exact strings; FREECODE11 is seeded needs-check because it expires on the read date.
- **Steal a Balut** (`src/data/steal-a-balut.json`) — 3 active (OG, BALUT, RELEASED), both sources agree; none expired.

## Known discrepancies (all of them)

### +1 Anime Eyes

- **Reward wording differs by source** (MobileMatters is newest and shown verbatim; PGG's fuller wording noted per code):
  - UPDATE2 & KURUMA — PGG: “15 Kurama Coins, 2x Chakra boost (5 minutes)”; MobileMatters: “15 kyubi coins”.
  - AWAKEN — PGG: “3 Shinobi Eggs and 2x Chakra boost (30 minutes)”.
  - SHARINGAN — PGG: “Akatsuki Egg and 2x Trophy boost (30 minutes)”; GameRant additionally includes 250 Wins.
  - UPDATE1 — PGG: “2x Chakra boost (10 minutes)”; MobileMatters lists only “rewards”.
  - NEWWORLDS — PGG: “2x Trophy boost (10 minutes)”; MobileMatters lists only “rewards”.
- **1MILLIONVISITS** — GameRant says “Internal Aegis Egg”; both newer sources say “infernal aegis egg”. Newer wording displayed, older noted.
- **KURAMA vs KURUMA** — PGG's intro mentions “KURAMA”, but PGG's own table and both other sources print “KURUMA”. Only KURUMA is seeded.
- **PGG future-date anomaly** — PGG's body weirdly references a Nov 21 date (in the future relative to its 2026-11-02 update). Treated as an editorial slip; used as evidence for nothing, including future checks.
- **First Rebirth requirement** — PGG says a first Rebirth is required before codes can be redeemed; MobileMatters doesn't mention it. Reported as a conflict, not asserted either way.
- **Game link** — https://www.roblox.com/games/97617452700163/1-Anime-Eyes confirmed via GameRant; labeled as their link, not claimed as verified-official by us.

### Attack on Titan Revolution

- **Case sensitivity** — GamesRadar says AOTR codes are not case-sensitive; Destructoid says case matters. FAQ reports the disagreement and advises pasting exact case.
- **HALLOWEEN2026 vs HALLOWEN2026** — GamesRadar prints HALLOWEEN2026 (“4,000x Pumpkins”, expiry ~Nov 10); Destructoid prints HALLOWEN2026 (“4k Pumpkins”). Both exact strings seeded as needs-check; neither claimed active.
- **FREECODE11 expiry** — expires 2026-11-06, the read date itself; cutoff time unknown, so needs-check rather than active.
- **TERRA70K reward casing** — GamesRadar prints “50x spins” (lowercase); kept verbatim with a note.
- **Official Roblox game link** — none verified; omitted rather than guessed.
- **Expired seed** — only 4 shared expired strings seeded (FREECODE10, FREECODE9, FREECODE8, GROUP10M), not the full historical list.

### Steal a Balut

- **OG wording** — GGRecon: “1,000 Speed and $100,000 Cash”; Dexerto lists the same contents without the “and”. GGRecon wording displayed.
- **RELEASED wording** — GGRecon: “$25,000 Cash”; Dexerto: “$25,000”. GGRecon wording displayed.
- **Prerequisites** — Dexerto lists none; noted, not asserted as a guarantee.
- **Official Roblox game link** — none verified; omitted rather than guessed.

## Read-date policy

All seed rows use `lastChecked: 2026-11-06` and each source's own date in `sourceUpdated`.
Nothing on the site re-checks codes automatically, and no data field is ever updated by the
build — updates happen only when a person re-reads sources and edits the JSON.
