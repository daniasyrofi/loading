import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);
const readProjectFile = (path) => readFile(new URL(path, projectRoot), "utf8");

test("collection previews share one cacheable iframe document URL", async () => {
  const [gallerySource, specimenHtml, specimenBootstrap, specimenSource] = await Promise.all([
    readProjectFile("app.js"),
    readProjectFile("specimens/index.html"),
    readProjectFile("specimens/bootstrap.js"),
    readProjectFile("specimens/app.js"),
  ]);

  assert.match(gallerySource, /previewUrl\.hash = previewParams\.toString\(\)/);
  assert.match(gallerySource, /previewParams\.set\("collection-preview", "true"\)/);
  assert.match(specimenHtml, /src="\.\/bootstrap\.js"/);
  assert.match(specimenBootstrap, /window\.location\.hash\.slice\(1\)/);
  assert.match(specimenSource, /window\.location\.hash\.slice\(1\)/);
});

test("public live previews prioritize every visible card and recycle offscreen work", async () => {
  const [galleryHtml, gallerySource] = await Promise.all([
    readProjectFile("index.html"),
    readProjectFile("app.js"),
  ]);

  assert.match(galleryHtml, /class="specimen-poster"/);
  assert.match(galleryHtml, /app\.js\?v=viewport-live-1/);
  assert.doesNotMatch(galleryHtml, /<script type="module" src="\.\/playground\.js"><\/script>/);
  assert.doesNotMatch(galleryHtml, /href="\.\/playground\.css"/);
  assert.match(gallerySource, /poster\.dataset\.src = `\.\/posters\/specimen-\$\{id\}\.webp`/);
  assert.match(gallerySource, /posterObserver\.observe\(poster\)/);
  assert.match(gallerySource, /supportsIntentPreview && !reducedMotion/);
  assert.match(gallerySource, /const autoPreview = isDraftCollection \|\| !reducedMotion/);
  assert.match(gallerySource, /maxConcurrentFrameLoads = supportsIntentPreview \? 3 : 2/);
  assert.match(gallerySource, /framePrefetchMargin = supportsIntentPreview \? "160px 0px" : "120px 0px"/);
  assert.match(gallerySource, /const visibleFrameObserver = new IntersectionObserver/);
  assert.match(gallerySource, /queueFrame\(frame, true\)/);
  assert.match(gallerySource, /frame\.dataset\.ready === "true"\) \{\n          releaseLiveFrame\(frame\)/);
  assert.doesNotMatch(gallerySource, /maxLivePreviews/);
  assert.match(gallerySource, /import\("\.\/playground\.js"\)/);
  assert.match(gallerySource, /stylesheet\.href = "\.\/playground\.css"/);
  assert.match(gallerySource, /data-auto-preview="true"/);
});

test("embedded thumbnails never bypass the cache or fetch the catalog", async () => {
  const specimenSource = await readProjectFile("specimens/app.js");

  assert.doesNotMatch(specimenSource, /cache\s*:\s*["']no-store["']/);
  assert.match(specimenSource, /const catalog = isCollectionPreview \? null : await fetch/);
  assert.match(specimenSource, /collectionPreviewIds\.has\(requestedSpecimen\)/);
  assert.equal(
    specimenSource.match(/new URLSearchParams\(window\.location\.search\)/g)?.length,
    1,
    "all runtime consumers should reuse the merged query + fragment parameters",
  );
});

test("Netlify sends browser-cache headers for the shared preview graph", async () => {
  const config = await readProjectFile("netlify.toml");
  const cachedPaths = [
    "/specimens/*",
    "/catalog.json",
    "/assets/fonts/*.woff2",
    "/posters/*",
    "/*.js",
    "/*.css",
    "/*",
  ];

  for (const path of cachedPaths) {
    assert.ok(config.includes(`for = "${path}"`), `missing cache rule for ${path}`);
  }

  const rules = config.split("[[headers]]").slice(1).map((rule) => rule.split("[[redirects]]")[0]);
  assert.equal(rules.at(-1)?.match(/for = "\/\*"/)?.length, 1, "catch-all header rule must be last");
  for (const rule of rules) {
    assert.match(rule, /Cache-Control = /, "every first-match header rule needs a cache policy");
    assert.match(rule, /Content-Security-Policy = /, "every first-match header rule needs the CSP");
  }
});

test("Netlify applies a strict script policy and per-client abuse limit", async () => {
  const config = await readProjectFile("netlify.toml");

  assert.match(config, /Content-Security-Policy = "[^"]*script-src 'self'/);
  assert.match(config, /Content-Security-Policy = "[^"]*object-src 'none'/);
  assert.match(config, /Permissions-Policy = /);
  assert.match(config, /\[redirects\.rate_limit\]/);
  assert.match(config, /window_limit = 240/);
  assert.match(config, /aggregate_by = \["ip", "domain"\]/);
});

test("Cloudflare Pages build is explicit, cache-aware, and safe to index", async () => {
  const [wrangler, headers, buildScript] = await Promise.all([
    readProjectFile("wrangler.jsonc"),
    readProjectFile("_headers"),
    readProjectFile("scripts/build-site.mjs"),
  ]);

  assert.match(wrangler, /"pages_build_output_dir": "\.\/dist"/);
  assert.match(wrangler, /"name": "loading-daniasyrofi"/);
  assert.match(headers, /Content-Security-Policy: [^\n]*script-src 'self'/);
  assert.match(headers, /\/specimens\/\*\n  Cache-Control: public, max-age=86400/);
  assert.match(headers, /\/assets\/fonts\/\*\.woff2\n  Cache-Control: public, max-age=31536000, immutable/);
  assert.match(headers, /https:\/\/:version\.loading-daniasyrofi\.pages\.dev\/\*/);
  assert.match(buildScript, /const files = \[/);
  assert.match(buildScript, /join\(outputDir, "specimens", "tests"\)/);
  assert.doesNotMatch(buildScript, /cp\(projectRoot, outputDir/);
});

test("robots policy keeps public search available and rejects common AI crawlers", async () => {
  const robots = await readProjectFile("robots.txt");

  assert.match(robots, /User-agent: GPTBot\nDisallow: \//);
  assert.match(robots, /User-agent: ClaudeBot\nDisallow: \//);
  assert.match(robots, /User-agent: \*\nAllow: \/\nDisallow: \/draft\//);
});

test("local development server stays loopback-only and rejects path traversal", async () => {
  const server = await readProjectFile("dev-server.mjs");

  assert.match(server, /const HOST = "127\.0\.0\.1"/);
  assert.match(server, /resolvedRelativePath\.startsWith\("\.\."\)/);
  assert.match(server, /server\.listen\(PORT, HOST/);
});
