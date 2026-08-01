import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

const output = new URL("./dist/", import.meta.url);
const isCommercialBuild = process.env.SITE_VARIANT === "com";
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
const mainAnalytics = 'window.siteAnalytics={yandexId:110484880,metaPixelId:null};';
const commercialAnalytics = 'window.siteAnalytics={yandexId:110484887,metaPixelId:"1923709794923109"};';
const commercialMetrikaOnly = 'window.siteAnalytics={yandexId:110484887,metaPixelId:null};';
const metaPixelHead = `<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1923709794923109');
fbq('track', 'PageView');
</script>`;
const metaPixelNoScript = `<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1923709794923109&ev=PageView&noscript=1"
alt=""></noscript>`;
const injectMetaPixel = (html) => html
  .replace("</head>", `${metaPixelHead}\n</head>`)
  .replace(/<body([^>]*)>/, `<body$1>\n${metaPixelNoScript}`);

if (!emptyReviewsPattern.test(sourceHtml)) {
  throw new Error("Could not find the reviews placeholder in index.html");
}
if (!sourceHtml.includes(mainWidget)) {
  throw new Error("Could not find the main GetCourse widget in index.html");
}
if (!sourceHtml.includes(mainAnalytics)) {
  throw new Error("Could not find the main analytics configuration in index.html");
}

const mainHtml = sourceHtml.replace(emptyReviewsPattern, reviewsHtml.trim());
await writeFile(new URL("./dist/index.html", import.meta.url), mainHtml);

const commercialHtml = injectMetaPixel(mainHtml
  .replace("<body>", '<body class="is-commercial">')
  .replace("/public/alexandra-hero-cutout.png", "/public/153.png")
  .replace(mainWidget, commercialWidget)
  .replace(mainAnalytics, commercialAnalytics));

await mkdir(new URL("./dist/com-version/", import.meta.url), { recursive: true });
await writeFile(new URL("./dist/com-version/index.html", import.meta.url), commercialHtml);

if (isCommercialBuild) {
  await writeFile(new URL("./dist/index.html", import.meta.url), commercialHtml);
  for (const route of ["thanks", "spasibo"]) {
    const routeHtml = await readFile(new URL(`./${route}/index.html`, import.meta.url), "utf8");
    if (!routeHtml.includes(mainAnalytics)) {
      throw new Error(`Could not find the main analytics configuration in ${route}/index.html`);
    }
    const analyticsConfig = route === "thanks" ? commercialAnalytics : commercialMetrikaOnly;
    const builtRouteHtml = routeHtml.replace(mainAnalytics, analyticsConfig);
    await writeFile(
      new URL(`./dist/${route}/index.html`, import.meta.url),
      route === "thanks" ? injectMetaPixel(builtRouteHtml) : builtRouteHtml
    );
  }
}

console.log(`${isCommercialBuild ? "COM" : "MAIN"} site built in dist/`);
