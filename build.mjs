import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

const output = new URL("./dist/", import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const entry of ["index.html", "src", "public", "privacy", "thanks", "spasibo"]) {
  await cp(new URL(`./${entry}`, import.meta.url), new URL(`./dist/${entry}`, import.meta.url), { recursive: true });
}

for (const asset of ["152.png", "IMAGE 2026-07-24 18:06:49.jpg", "alexandra-hero-cutout.png"]) {
  await cp(new URL(`./public/${asset}`, import.meta.url), new URL(`./dist/${asset}`, import.meta.url));
}
await cp(new URL("./public/vendor", import.meta.url), new URL("./dist/vendor", import.meta.url), { recursive: true });

const sourceHtml = await readFile(new URL("./index.html", import.meta.url), "utf8");
const reviewsHtml = await readFile(new URL("./src/com-reviews.html", import.meta.url), "utf8");
const emptyReviewsPattern = /<section class="chapter chapter--paper reviews">[\s\S]*?<\/section>/;

if (!emptyReviewsPattern.test(sourceHtml)) {
  throw new Error("Could not find the reviews placeholder in index.html");
}

const commercialHtml = sourceHtml
  .replace("/public/alexandra-hero-cutout.png", "/public/153.png")
  .replace(emptyReviewsPattern, reviewsHtml.trim());

await mkdir(new URL("./dist/com-version/", import.meta.url), { recursive: true });
await writeFile(new URL("./dist/com-version/index.html", import.meta.url), commercialHtml);

console.log("Static site built in dist/");
