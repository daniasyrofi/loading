import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(projectRoot, "dist");

const files = [
  "_headers",
  "404.html",
  "app.js",
  "catalog.json",
  "index.html",
  "indicator.js",
  "playground.css",
  "playground.js",
  "registry.json",
  "robots.txt",
  "styles.css",
];

const directories = ["assets", "draft", "posters", "r", "specimens"];

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

for (const file of files) {
  await cp(join(projectRoot, file), join(outputDir, file));
}

for (const directory of directories) {
  await cp(join(projectRoot, directory), join(outputDir, directory), { recursive: true });
}

// Development-only fixtures and notes are not part of the public site.
await rm(join(outputDir, "specimens", "tests"), { recursive: true, force: true });
await rm(join(outputDir, "specimens", "README.md"), { force: true });

console.log(`Cloudflare Pages bundle ready: ${outputDir}`);
