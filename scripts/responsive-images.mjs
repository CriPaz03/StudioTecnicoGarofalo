import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
const widths = [96, 192, 256, 384, 640, 960, 1280, 1600, 1920];
await mkdir('public/responsive', { recursive: true });
for (const file of await readdir('public/images')) {
  if (!file.endsWith('.webp')) continue;
  for (const width of widths) {
    await sharp(`public/images/${file}`).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`public/responsive/${file.slice(0, -5)}-${width}.webp`);
  }
}
console.log('Responsive images generated.');
