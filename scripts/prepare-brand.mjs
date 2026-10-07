import fs from "node:fs/promises";
import sharp from "sharp";

const source = "public/brand/mark-generated.png";
await fs.mkdir("public/brand", { recursive: true });
const symbol = await sharp(source)
  .trim()
  .resize(448, 448, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .extend({ top: 32, bottom: 32, left: 32, right: 32, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
await sharp(symbol).webp({ lossless: true }).toFile("public/brand/mark.webp");
for (const [path, size] of [
  ["app/icon.png", 512],
  ["app/apple-icon.png", 180],
  ["public/brand/icon-192.png", 192],
  ["public/brand/icon-512.png", 512],
]) {
  await sharp(symbol).resize(size, size).flatten({ background: "#0d0d0c" }).png().toFile(path);
}

const icon = await sharp(symbol).resize(32, 32).ensureAlpha().png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header[6] = 32;
header[7] = 32;
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(icon.length, 14);
header.writeUInt32LE(22, 18);
await fs.writeFile("app/favicon.ico", Buffer.concat([header, icon]));
console.log("Prepared the redesigned transparent mark and browser icons.");
