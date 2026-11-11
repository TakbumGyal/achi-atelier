/**
 * Make web-optimized copies of the photos.
 *
 *   npm run images
 *
 * Reads the full-size originals in images-src/ and writes, into assets/img/,
 * a WebP (small, used by all modern browsers) and a JPEG/PNG fallback,
 * resized to the largest size the site displays them at (sharp on phones
 * and retina screens).
 *
 * To change a photo: replace the file in images-src/ (same name), run
 * `npm run images`, then check with `npm run preview`.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'images-src');
const OUT = path.join(ROOT, 'assets', 'img');

/* source file → output name + max width (px). */
const IMAGES = [
  { src: 'logo.png', out: 'logo-nav', width: 280, keepPng: true },    // navbar logo (shown ≤ 140px tall)
  { src: 'logo.png', out: 'logo', width: 600, keepPng: true, noWebp: true }, // social-sharing image
  { src: 'hero.jpg', out: 'hero', width: 840 },                       // shown 420px wide (desktop only)
  { src: 'about/about-1.jpg', out: 'about/about-1', width: 700 },
  { src: 'about/about-2.jpg', out: 'about/about-2', width: 700 },
  { src: 'about/about-3.jpg', out: 'about/about-3', width: 1100 },
  { src: 'gallery/gallery-1.png', out: 'gallery/gallery-1', width: 900 },
  { src: 'gallery/gallery-2.jpg', out: 'gallery/gallery-2', width: 900 },
  { src: 'gallery/gallery-3.jpg', out: 'gallery/gallery-3', width: 900 },
  { src: 'gallery/gallery-4.jpg', out: 'gallery/gallery-4', width: 900 },
  { src: 'gallery/gallery-5.jpg', out: 'gallery/gallery-5', width: 900 },
];

const kb = bytes => `${Math.round(bytes / 1024)} KB`;
let before = 0, after = 0;

for (const img of IMAGES) {
  const input = path.join(SRC, img.src);
  const base = path.join(OUT, img.out);
  fs.mkdirSync(path.dirname(base), { recursive: true });
  const pipeline = () => sharp(input).rotate().resize({ width: img.width, withoutEnlargement: true });

  const outputs = [];
  if (!img.noWebp) {
    await pipeline().webp({ quality: 78, effort: 6 }).toFile(base + '.webp');
    outputs.push(base + '.webp');
  }
  if (img.keepPng) {
    await pipeline().png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(base + '.png');
    outputs.push(base + '.png');
  } else {
    await pipeline().jpeg({ quality: 78, mozjpeg: true }).toFile(base + '.jpg');
    outputs.push(base + '.jpg');
  }

  const srcSize = fs.statSync(input).size;
  const sizes = outputs.map(f => `${path.extname(f).slice(1)} ${kb(fs.statSync(f).size)}`).join(', ');
  before += srcSize;
  after += fs.statSync(outputs[0]).size;
  console.log(`${img.out.padEnd(20)} ${kb(srcSize).padStart(8)} → ${sizes}`);
}
console.log(`\nWhat a modern browser downloads: ${kb(before)} → ${kb(after)}`);
