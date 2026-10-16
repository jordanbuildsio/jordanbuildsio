// Generates assets/tags/<slug>.svg, the tag bubbles under each product in
// the profile README.
//
//   node scripts/tags.mjs
//
// They mirror the portfolio's .glass-tag chips (custom-styles.css): a pill
// with a faint fill and hairline rim, 12px text, 12px side padding. GitHub
// strips CSS from READMEs, so each bubble is its own image, and they sit
// inline so they wrap with the card. The theme switch lives inside the SVG
// (prefers-color-scheme), so one file serves both themes. Text uses system
// fonts: an SVG shown through <img> cannot load web fonts, so widths come
// from Helvetica's advance widths, padded for wider faces like SF and Inter.
import { mkdirSync, writeFileSync } from "node:fs";

// Same as `tags` in the portfolio's src/data/info.json (English).
const tags = {
  tokiyo: ["Figure drawing", "Gesture practice", "Timed poses", "Curated pose sets"],
  runblade: ["Noir", "Sci-fi", "Interrogation", "Deduction", "Pixel art"],
};

const out = new URL("../assets/tags", import.meta.url).pathname;
mkdirSync(out, { recursive: true });

// Helvetica advance widths per 1000 units of font size.
const advance = {
  " ": 278, "-": 333,
  a: 556, b: 556, c: 500, d: 556, e: 556, f: 278, g: 556, h: 556, i: 222, j: 222,
  k: 500, l: 222, m: 833, n: 556, o: 556, p: 556, q: 556, r: 333, s: 500, t: 278,
  u: 556, v: 500, w: 722, x: 500, y: 500, z: 500,
  A: 667, B: 667, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278, J: 500,
  K: 667, L: 556, M: 833, N: 722, O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611,
  U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611,
};
const size = 12;
const textWidth = (s) => ([...s].reduce((w, c) => w + (advance[c] ?? 556), 0) * size * 1.08) / 1000;

const font = `Inter, 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;
const pillH = 24;
const gapX = 4; // inline whitespace adds ~4px more between bubbles
const gapY = 3;

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

for (const [project, list] of Object.entries(tags)) {
  mkdirSync(`${out}/${project}`, { recursive: true });
  for (const tag of list) {
    const pillW = Math.ceil(textWidth(tag) + 24);
    const w = pillW + gapX;
    const h = pillH + gapY * 2;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escape(tag)}">
  <style>
    rect { fill: rgba(0, 0, 0, 0.04); stroke: rgba(0, 0, 0, 0.1); }
    text { fill: #333336; font: 400 ${size}px ${font}; }
    @media (prefers-color-scheme: dark) {
      rect { fill: rgba(255, 255, 255, 0.06); stroke: rgba(255, 255, 255, 0.12); }
      text { fill: #a1a1a6; }
    }
  </style>
  <rect x="0.5" y="${gapY + 0.5}" width="${pillW - 1}" height="${pillH - 1}" rx="${(pillH - 1) / 2}"/>
  <text x="${pillW / 2}" y="${gapY + pillH / 2}" text-anchor="middle" dominant-baseline="central">${escape(tag)}</text>
</svg>
`;
    writeFileSync(`${out}/${project}/${slug(tag)}.svg`, svg);
  }
}
