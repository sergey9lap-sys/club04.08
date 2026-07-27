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
const mainWidget = '<script id="9a2fe2c17b5ddf2676e1a2dc52657252d39571ea" src="https://agkedu.getcourse.ru/pl/lite/widget/script?id=1635593"></script>';
const commercialWidget = '<script id="2c719ff488264ed214ed447da91dfd550af62651" src="https://agkedu.getcourse.ru/pl/lite/widget/script?id=1635595"></script>';
const mainAnalytics = '<script>window.siteAnalytics={yandexId:110484880,metaPixelId:null};</script>';
const commercialAnalytics = '<script>window.siteAnalytics={yandexId:110484887,metaPixelId:"1923709794923109"};</script>';

if (!emptyReviewsPattern.test(sourceHtml)) {
  throw new Error("Could not find the reviews placeholder in index.html");
}
if (!sourceHtml.includes(mainWidget)) {
  throw new Error("Could not find the main GetCourse widget in index.html");
}
if (!sourceHtml.includes(mainAnalytics)) {
  throw new Error("Could not find the main analytics configuration in index.html");
}

const commercialHtml = sourceHtml
  .replace("<body>", '<body class="is-commercial">')
  .replace("/public/alexandra-hero-cutout.png", "/public/153.png")
  .replace(emptyReviewsPattern, reviewsHtml.trim())
  .replace(mainWidget, commercialWidget)
  .replace(mainAnalytics, commercialAnalytics);

await mkdir(new URL("./dist/com-version/", import.meta.url), { recursive: true });
await writeFile(new URL("./dist/com-version/index.html", import.meta.url), commercialHtml);
await writeFile(new URL("./dist/index.html", import.meta.url), commercialHtml);

console.log("Static site built in dist/");
