// Generates public/og.png — the 1200×630 Open Graph / Twitter share card.
//
// Pure Node (zlib + a minimal PNG encoder): no dependencies, no network,
// deterministic output. Re-run after changing the design:
//   node scripts/generate-og.mjs
//
// The artwork is original: the rbxeyes eye mark (vesica outline, iris rings,
// pupil, highlight) drawn large over the dark brand background, next to the
// wordmark rendered in a tiny hand-drawn 5×8 pixel font.
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const W = 1200;
const H = 630;

// Brand palette (matches src/styles/global.css tokens).
const BG = [11, 15, 14];        // #0b0f0e
const INK = [236, 233, 225];    // #ece9e1
const MINT = [127, 231, 182];   // #7fe7b6
const MINT_SOFT = [185, 244, 217]; // #b9f4d9

const px = new Uint8Array(W * H * 3);

function blend(x, y, [r, g, b], a = 1) {
  if (x < 0 || y < 0 || x >= W || y >= H || a <= 0) return;
  const i = (y * W + x) * 3;
  px[i] = Math.round(r * a + px[i] * (1 - a));
  px[i + 1] = Math.round(g * a + px[i + 1] * (1 - a));
  px[i + 2] = Math.round(b * a + px[i + 2] * (1 - a));
}

function fill([r, g, b]) {
  for (let i = 0; i < px.length; i += 3) {
    px[i] = r; px[i + 1] = g; px[i + 2] = b;
  }
}

function rectOutline(x0, y0, x1, y1, color, a) {
  for (let x = x0; x <= x1; x++) { blend(x, y0, color, a); blend(x, y1, color, a); }
  for (let y = y0; y <= y1; y++) { blend(x0, y, color, a); blend(x1, y, color, a); }
}

/** Filled circle. */
function disc(cx, cy, r, color, a = 1) {
  for (let y = Math.floor(cy - r) - 1; y <= Math.ceil(cy + r) + 1; y++) {
    for (let x = Math.floor(cx - r) - 1; x <= Math.ceil(cx + r) + 1; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d <= r - 0.5) blend(x, y, color, a);
      else if (d <= r + 0.5) blend(x, y, color, a * (r + 0.5 - d));
    }
  }
}

/** Circular ring stroke (approximate even thickness). */
function ring(cx, cy, r, thickness, color, a = 1) {
  const outer = r + thickness / 2;
  const inner = r - thickness / 2;
  for (let y = Math.floor(cy - outer); y <= Math.ceil(cy + outer); y++) {
    for (let x = Math.floor(cx - outer); x <= Math.ceil(cx + outer); x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d >= inner && d <= outer) blend(x, y, color, a);
    }
  }
}

/** Dotted circular ring (fixed angular step -> even dot spacing). */
function dottedRing(cx, cy, r, color, a = 1) {
  const steps = Math.ceil(2 * Math.PI * r / 9); // ~9px arc per dot cycle
  for (let i = 0; i < steps; i += 2) { // every other segment -> dashes
    const t = (i / steps) * 2 * Math.PI;
    const x = cx + Math.cos(t) * r;
    const y = cy + Math.sin(t) * r;
    disc(x, y, 1.6, color, a);
  }
}

/** Eye (vesica) outline: boundary of the intersection of two equal circles. */
function vesicaOutline(cx, cy, R, off, thickness, color, a = 1) {
  const outer = thickness / 2;
  for (let y = Math.floor(cy - (R - off)) - 2; y <= Math.ceil(cy + (R - off)) + 2; y++) {
    for (let x = Math.floor(cx - Math.sqrt(R * R - off * off)) - 2; x <= Math.ceil(cx + Math.sqrt(R * R - off * off)) + 2; x++) {
      const dTop = Math.hypot(x - cx, y - (cy - off));
      const dBot = Math.hypot(x - cx, y - (cy + off));
      const edge = Math.max(dTop, dBot); // inside both circles <=> edge <= R
      if (edge >= R - outer && edge <= R + outer) blend(x, y, color, a);
    }
  }
}

function line(x0, y0, x1, y1, color, a = 1) {
  const len = Math.hypot(x1 - x0, y1 - y0);
  const n = Math.max(1, Math.ceil(len));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    blend(Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t), color, a);
  }
}

/* ---------- 5×8 pixel font (hand-drawn, lowercase set used by the art) ---------- */
const GLYPHS = {
  a: ['00000', '00000', '01100', '10010', '11110', '10010', '10010', '00000'],
  b: ['10000', '10000', '11100', '10010', '10010', '10010', '11100', '00000'],
  c: ['00000', '00000', '01110', '10000', '10000', '10000', '01110', '00000'],
  d: ['00010', '00010', '01110', '10010', '10010', '10010', '01110', '00000'],
  e: ['00000', '00000', '01110', '10000', '11110', '10000', '01110', '00000'],
  h: ['10000', '10000', '11100', '10010', '10010', '10010', '10010', '00000'],
  k: ['10000', '10000', '10010', '10100', '11000', '10100', '10010', '00000'],
  l: ['10000', '10000', '10000', '10000', '10000', '10000', '11000', '00000'],
  n: ['00000', '00000', '11100', '10010', '10010', '10010', '10010', '00000'],
  o: ['00000', '00000', '01100', '10010', '10010', '10010', '01100', '00000'],
  r: ['00000', '00000', '10110', '11000', '10000', '10000', '10000', '00000'],
  s: ['00000', '00000', '01110', '10000', '01100', '00010', '11100', '00000'],
  t: ['00100', '00100', '00100', '11100', '00100', '00100', '01100', '00000'],
  u: ['00000', '00000', '10010', '10010', '10010', '10010', '01110', '00000'],
  x: ['00000', '00000', '10010', '10100', '01000', '10100', '10010', '00000'],
  y: ['00000', '00000', '10010', '10010', '10010', '01110', '00010', '01100'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000', '00000'],
};

/** Measure width in pixels: cells of 5*scale + letter-spacing of scale. */
function textWidth(str, scale) {
  return str.length * 5 * scale + (str.length - 1) * scale;
}

function drawText(str, x0, y0, scale, color, a = 1) {
  let x = x0;
  for (const ch of str) {
    const glyph = GLYPHS[ch];
    if (!glyph) throw new Error(`No glyph for "${ch}"`);
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 5; col++) {
        if (glyph[row][col] === '1') {
          const gx = x + col * scale;
          const gy = y0 + row * scale;
          for (let dy = 0; dy < scale; dy++) {
            for (let dx = 0; dx < scale; dx++) blend(gx + dx, gy + dy, color, a);
          }
        }
      }
    }
    x += 6 * scale;
  }
}

/* ---------- compose the card ---------- */
fill(BG);

// Mint glow behind the eye (two soft radial passes, right side).
{
  const cx = 905, cy = 300;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const d = Math.hypot((x - cx) / 420, (y - cy) / 330);
      const a = Math.max(0, 0.16 * (1 - d));
      if (a > 0) blend(x, y, MINT, a);
    }
  }
}

// Sparse sparkle dots, fixed positions.
const SPARKS = [[172, 520], [640, 96], [1130, 545], [70, 92], [540, 566], [1168, 128]];
for (const [sx, sy] of SPARKS) {
  disc(sx, sy, 2.4, MINT, 0.4);
  disc(sx, sy, 1.1, MINT_SOFT, 0.55);
}

// Inner hairline frame.
rectOutline(26, 26, W - 27, H - 27, MINT, 0.14);

// The eye mark, centered right.
const EX = 915, EY = 315;
dottedRing(EX, EY, 252, MINT, 0.16);
dottedRing(EX, EY, 228, MINT, 0.10);
vesicaOutline(EX, EY, 212, 96, 7, MINT, 0.55);
// Lash rays above the eye.
line(EX - 132, EY - 108, EX - 158, EY - 146, MINT, 0.4);
line(EX - 34, EY - 152, EX - 42, EY - 196, MINT, 0.4);
line(EX + 74, EY - 138, EX + 102, EY - 172, MINT, 0.4);
line(EX + 150, EY - 66, EX + 188, EY - 88, MINT, 0.4);
// Iris rings + pupil + highlight.
ring(EX, EY, 112, 9, MINT, 0.5);
dottedRing(EX, EY, 88, MINT, 0.22);
ring(EX, EY, 62, 6, MINT, 0.34);
disc(EX, EY, 30, MINT, 0.5);
disc(EX - 32, EY - 30, 10, MINT_SOFT, 0.9);
disc(EX + 52, EY + 44, 4.5, MINT_SOFT, 0.5);

// Wordmark + tagline, left.
const brand = 'rbxeyes';
const brandScale = 13;
const brandX = 96;
const brandY = 196;
drawText(brand, brandX, brandY, brandScale, INK, 1);
// Mint underline echoing the eyebrow rule on the site.
for (let x = brandX; x < brandX + textWidth(brand, brandScale); x += 10) {
  line(x, brandY + 8 * brandScale + 22, Math.min(x + 6, brandX + textWidth(brand, brandScale)), brandY + 8 * brandScale + 22, MINT, 0.75);
}
const tagline = 'honest roblox code tracker';
drawText(tagline, brandX, brandY + 8 * brandScale + 58, 4, MINT, 0.92);

/* ---------- minimal PNG encoder (color type 2, RGB8) ---------- */
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;  // bit depth
ihdr[9] = 2;  // color type: truecolor RGB
// Scanlines with filter byte 0.
const raw = Buffer.alloc((W * 3 + 1) * H);
for (let y = 0; y < H; y++) {
  raw[y * (W * 3 + 1)] = 0;
  Buffer.from(px.buffer, y * W * 3, W * 3).copy(raw, y * (W * 3 + 1) + 1);
}

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'og.png');
writeFileSync(out, png);
console.log(`og.png written: ${out} (${png.length.toLocaleString('en-US')} bytes, ${W}x${H})`);
