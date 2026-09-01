/**
 * Ultra-fast Zero-Dependency Local Dev Server for loading.daniasyrofi.com
 */

import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname);
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".ts": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon"
};

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);
    if (pathname === "/") pathname = "/index.html";

    const relativePath = pathname.replace(/^\/+/, "");
    const filePath = resolve(rootDir, relativePath);

    try {
      const stats = await stat(filePath);
      let targetFile = filePath;
      if (stats.isDirectory()) {
        targetFile = join(filePath, "index.html");
      }

      const ext = extname(targetFile).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      const content = await readFile(targetFile);

      res.writeHead(200, {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache"
      });
      res.end(content);
    } catch (e) {
      if (e.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end("<h1>404 Not Found</h1>");
      } else {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(`500 Error: ${e.message}`);
      }
    }
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(`500 Internal Server Error: ${err.message}`);
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`\n✨ Loading Showcase Local Server is live!`);
  console.log(`   ➜ Local:   http://localhost:${PORT}`);
  console.log(`   ➜ Network: http://127.0.0.1:${PORT}`);
  console.log(`   ➜ Press Ctrl+C to stop.\n`);
});
