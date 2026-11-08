// Converts the raw brand photography + videos into web-ready assets.
//   Images  -> public/img/<name>-{1000,2000}.webp
//   Videos  -> public/frames/<flavor>/0001.webp … (frame sequences for scroll scrubbing)
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const IMG_IN = join(root, "Images");
const VID_IN = join(root, "Videos");
const IMG_OUT = join(root, "public/img");
const FRAMES_OUT = join(root, "public/frames");

const imageMap = {
  "Blueberries_and_gelato_arranged": "blueberry-flatlay",
  "Blueberries_growing_on_misty_hills": "blueberry-farm",
  "Gelato_cup_with_blueberry_scoop": "blueberry-cup",
  "Gelato_cup_with_mango_scoops": "mango-cup",
  "Gelato_cup_with_strawberry": "strawberry-cup",
  "Gelato_cups_in_a_row": "cups-row",
  "Gelato_shop_front_on_street": "shop",
  "Mango_arrangement_on_orange": "mango-flatlay",
  "Mangoes_hanging_on_orchard_branch": "mango-farm",
  "Pistachio_branch_on_volcanic_soil": "pistachio-farm",
  "Pistachio_gelato_paper_cup": "pistachio-cup",
  "Pistachio_ingredients_arranged": "pistachio-flatlay",
  "Ripe_strawberries_in_field": "strawberry-farm",
  "Strawberries_arranged_on_pink": "strawberry-flatlay",
  "Strawberry_gelato_churning": "churn",
  "Strawberry_gelato_on_ledge": "strawberry-ledge",
};

const videoMap = {
  Blueberries: "blueberry",
  Mango: "mango",
  Pistachio: "pistachio",
  Strawberry: "strawberry",
};

mkdirSync(IMG_OUT, { recursive: true });
for (const file of readdirSync(IMG_IN)) {
  const key = Object.keys(imageMap).find((k) => file.startsWith(k));
  if (!key) continue;
  const name = imageMap[key];
  for (const w of [1000, 2000]) {
    await sharp(join(IMG_IN, file))
      .resize({ width: w })
      .webp({ quality: w > 1000 ? 74 : 72, effort: 5 })
      .toFile(join(IMG_OUT, `${name}-${w}.webp`));
  }
  console.log("img", name);
}

for (const file of readdirSync(VID_IN)) {
  const key = Object.keys(videoMap).find((k) => file.includes(`_${k}`));
  if (!key) continue;
  const flavor = videoMap[key];
  const tmp = join(tmpdir(), `brio-frames-${flavor}`);
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  execFileSync("ffmpeg", [
    "-loglevel", "error", "-y", "-i", join(VID_IN, file),
    "-vf", "scale=1280:-2", "-q:v", "2", join(tmp, "%04d.jpg"),
  ]);
  const out = join(FRAMES_OUT, flavor);
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  const frames = readdirSync(tmp).filter((f) => f.endsWith(".jpg")).sort();
  await Promise.all(
    frames.map((f) =>
      sharp(join(tmp, f))
        .webp({ quality: 62, effort: 4 })
        .toFile(join(out, f.replace(".jpg", ".webp"))),
    ),
  );
  rmSync(tmp, { recursive: true, force: true });
  console.log("frames", flavor, frames.length);
}

if (!existsSync(IMG_OUT)) process.exit(1);

// Hero: split the 4-cup row into individual columns (pistachio, strawberry, mango, blueberry)
const row = readdirSync(IMG_IN).find((f) => f.startsWith("Gelato_cups_in_a_row"));
if (row) {
  const meta = await sharp(join(IMG_IN, row)).metadata();
  const colW = Math.floor(meta.width / 4);
  const names = ["pistachio", "strawberry", "mango", "blueberry"];
  for (let i = 0; i < 4; i++) {
    await sharp(join(IMG_IN, row))
      .extract({ left: i * colW + 6, top: 0, width: colW - 12, height: meta.height })
      .webp({ quality: 78, effort: 5 })
      .toFile(join(IMG_OUT, `hero-${names[i]}.webp`));
  }
  console.log("hero columns", colW);
}
