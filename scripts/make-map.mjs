/**
 * Build the static map image of the salon's street (no Google, no cookies).
 *
 *   node scripts/make-map.mjs     → images-src/map.png, then run `npm run images`
 *
 * Map data © OpenStreetMap contributors (ODbL) — the attribution is shown
 * under the map on the site. Downloads ~30 standard tiles once, politely.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'images-src', 'map.png');

const LAT = 48.8514360, LON = 2.3786501;   // 9 rue Trousseau, 75011 Paris
const ZOOM = 17;
const W = 1200, H = 960;                   // shown at ~600×480 → sharp on retina screens
const TILE = 256;

// Web-Mercator: lat/lon → global pixel at this zoom
const n = 2 ** ZOOM;
const px = (LON + 180) / 360 * n * TILE;
const latR = LAT * Math.PI / 180;
const py = (1 - Math.log(Math.tan(latR) + 1 / Math.cos(latR)) / Math.PI) / 2 * n * TILE;

const left = Math.round(px - W / 2), top = Math.round(py - H / 2);
const tx0 = Math.floor(left / TILE), ty0 = Math.floor(top / TILE);
const tx1 = Math.floor((left + W - 1) / TILE), ty1 = Math.floor((top + H - 1) / TILE);

const tiles = [];
for (let ty = ty0; ty <= ty1; ty++) {
  for (let tx = tx0; tx <= tx1; tx++) {
    const url = `https://tile.openstreetmap.org/${ZOOM}/${tx}/${ty}.png`;
    const res = await fetch(url, { headers: { 'User-Agent': 'atelier-site-map-builder/1.0 (one-off static map)' } });
    if (!res.ok) throw new Error(`${url} → ${res.status}`);
    tiles.push({ input: Buffer.from(await res.arrayBuffer()), left: (tx - tx0) * TILE, top: (ty - ty0) * TILE });
    await new Promise(r => setTimeout(r, 150));   // be gentle with the tile server
  }
}
console.log(`downloaded ${tiles.length} tiles`);

const mosaic = await sharp({ create: { width: (tx1 - tx0 + 1) * TILE, height: (ty1 - ty0 + 1) * TILE, channels: 3, background: '#f2eae0' } })
  .composite(tiles).png().toBuffer();

// Crop around the salon, then give it the salon's warm cream/brown tones
const cropped = await sharp(mosaic).extract({ left: left - tx0 * TILE, top: top - ty0 * TILE, width: W, height: H })
  .modulate({ saturation: 0 })           // remove the original colours (keeps RGB, unlike grayscale())
  .linear(0.8, 46)                       // softer contrast, lighter
  .tint({ r: 176, g: 140, b: 112 })      // warm cream/brown tint (the salon's colours)
  .png().toBuffer();

// Brown pin exactly on the salon (pin tip = map centre)
const pin = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><filter id="s" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#2C1810" flood-opacity=".35"/></filter></defs>
  <circle cx="${W / 2}" cy="${H / 2}" r="34" fill="#8B6F5E" fill-opacity=".18"/>
  <g filter="url(#s)" transform="translate(${W / 2} ${H / 2})">
    <path d="M0 0 C-6 -16 -28 -30 -28 -54 a28 28 0 0 1 56 0 C28 -30 6 -16 0 0z" fill="#2C1810"/>
    <circle cx="0" cy="-54" r="11" fill="#FAF7F0"/>
  </g>
</svg>`);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
await sharp(cropped).composite([{ input: pin }]).png({ compressionLevel: 9 }).toFile(OUT);
console.log('wrote', path.relative(ROOT, OUT));
