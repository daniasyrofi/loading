/**
 * Specimen & Registry Validation Harness
 * Validates registry.json and specimen contracts
 */

import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const registryPath = resolve(__dirname, "../registry.json");

console.log("\n🔍 Validating loading/registry.json and specimen distribution registry...\n");

const content = await readFile(registryPath, "utf8");
const registry = JSON.parse(content);

let errors = 0;
let warnings = 0;

if (!registry.items || !Array.isArray(registry.items)) {
  console.error("❌ Invalid registry.json: missing items array");
  process.exit(1);
}

console.log(`Checking ${registry.items.length} registered components in registry.json:`);

const seen = new Set();
for (const item of registry.items) {
  if (!item.name || seen.has(item.name)) {
    console.error(`❌ Duplicate or invalid item name: ${item.name}`);
    errors++;
  }
  seen.add(item.name);

  if (!item.title || !item.description) {
    console.error(`❌ [${item.name}] Missing title or description`);
    errors++;
  }

  if (!item.files || item.files.length === 0) {
    console.error(`❌ [${item.name}] Missing files mapping for distribution`);
    errors++;
  } else {
    for (const f of item.files) {
      if (!f.path || !f.target) {
        console.error(`❌ [${item.name}] Invalid file mapping (missing path or target)`);
        errors++;
      }
    }
  }

  console.log(`  ✓ ${item.name.padEnd(22)} → ${item.title}`);
}

console.log(`\n📋 Registry Summary:`);
console.log(`- Registered Components: ${registry.items.length}`);
console.log(`- Errors: ${errors}`);
console.log(`- Warnings: ${warnings}`);

if (errors > 0) {
  console.error(`\n❌ Registry validation failed with ${errors} error(s).\n`);
  process.exit(1);
} else {
  console.log(`\n✅ All ${registry.items.length} items in registry.json passed validation successfully!\n`);
}
