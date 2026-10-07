import fs from "node:fs/promises";
import sharp from "sharp";

const source = "render/Per pagina studio tecnico/";
await fs.mkdir("artifacts", { recursive: true });
await fs.mkdir("public/images", { recursive: true });
const files = (await fs.readdir(source)).filter((f) => /\.(png|jpg)$/i.test(f));
const tiles = await Promise.all(
  files.map(async (f, i) => ({
    input: await sharp(source + f)
      .resize(300, 190, { fit: "contain", background: "#181818" })
      .extend({ bottom: 30, background: "#181818" })
      .composite([
        {
          input: Buffer.from(
            `<svg width="300" height="30"><text x="8" y="20" fill="white" font-size="12">${f}</text></svg>`,
          ),
          top: 190,
          left: 0,
        },
      ])
      .png()
      .toBuffer(),
    left: (i % 5) * 300,
    top: Math.floor(i / 5) * 220,
  })),
);
await sharp({
  create: {
    width: 1500,
    height: Math.ceil(files.length / 5) * 220,
    channels: 3,
    background: "#181818",
  },
})
  .composite(tiles)
  .jpeg()
  .toFile("artifacts/contact-sheet.jpg");
const selected = {
  living: "Soggiorno v2 arredato.png",
  "living-alt": "Soggiorno v1 arredato.png",
  kitchen: "Cucina arredata v1.png",
  bedroom: "Matrimoniale v1.png",
  bathroom: "Bagno v2 arredato.png",
  exterior: "Vista 1 riv. effettivo arredato.png",
  section: "Spaccato Sannicandro.jpg",
  facade: "Sannicandro prospetto contesto.png",
  "bedroom-single": "Singola V2.jpg",
  "living-day": "Soggiorno 2.png",
  residential: "Vista 4.png",
  "kitchen-detail": "Cucina v.1 tip.7.png",
};
const additionalProjects = JSON.parse(await fs.readFile('lib/additional-projects.json', 'utf8'));
const cristianProjects = JSON.parse(await fs.readFile('lib/cristian-projects.json', 'utf8'));
const cristianSource = "render/Cristian 2/";
const cristianFiles = (await fs.readdir(cristianSource)).filter(f => /\.(png|jpg)$/i.test(f));
const originalImages = { ...selected, ...Object.fromEntries(additionalProjects.map(p => [p.image, p.source])) };
const allImages = {
  ...Object.fromEntries(Object.entries(originalImages).map(([name, file]) => [name, source + file])),
  ...Object.fromEntries(cristianProjects.map(p => [p.image, cristianSource + p.source])),
};
const missing = [...files.map(file => source + file), ...cristianFiles.map(file => cristianSource + file)]
  .filter(file => !Object.values(allImages).includes(file));
if (missing.length) throw new Error(`Images missing from gallery: ${missing.join(', ')}`);
for (const [name, file] of Object.entries(allImages)) {
  await sharp(file)
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 84 })
    .toFile(`public/images/${name}.webp`);
}
await sharp(source + selected.living)
  .resize(1200, 630, { fit: "cover" })
  .jpeg({ quality: 85 })
  .toFile("public/images/og.jpg");
console.log(
  `Prepared ${Object.keys(allImages).length} images and contact sheet. All ${files.length + cristianFiles.length} supplied photos are covered.`,
);

await import('./prepare-brand.mjs');
