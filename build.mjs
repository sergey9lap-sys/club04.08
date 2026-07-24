import { cp, mkdir, rm } from "node:fs/promises";

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

console.log("Static site built in dist/");
