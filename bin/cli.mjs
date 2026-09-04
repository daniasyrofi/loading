#!/usr/bin/env node

/**
 * Interactive Terminal CLI for @dani/loading
 * Allows developers to list, inspect, and extract loading specimens directly from terminal.
 * Usage: npx @dani/loading [add <specimen-name> | list | info <specimen-name>]
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const registryPath = resolve(__dirname, "../registry.json");

const args = process.argv.slice(2);
const command = args[0] || "list";
const targetSpecimen = args[1];

const registry = JSON.parse(await readFile(registryPath, "utf8"));

console.log(`\n✨ @dani/loading — Curated Loading State Component Registry`);
console.log(`   Explore live at: https://loading.daniasyrofi.com\n`);

if (command === "list") {
  console.log(`Available Specimens (${registry.items.length} total):\n`);
  registry.items.forEach((item, idx) => {
    const num = String(idx + 1).padStart(2, "0");
    console.log(`  ${num}. \x1b[36m${item.name.padEnd(20)}\x1b[0m — ${item.description}`);
  });
  console.log(`\nTo inspect a specimen:   npx @dani/loading info <specimen-name>`);
  console.log(`To install via shadcn:   pnpm dlx shadcn@latest add https://loading.daniasyrofi.com/registry.json/<specimen-name>\n`);
} else if (command === "info") {
  if (!targetSpecimen) {
    console.error("❌ Please specify a specimen name: npx @dani/loading info <name>");
    process.exit(1);
  }
  const item = registry.items.find((i) => i.name === targetSpecimen);
  if (!item) {
    console.error(`❌ Specimen "${targetSpecimen}" not found in registry.`);
    process.exit(1);
  }
  console.log(`📦 Specimen: \x1b[36m${item.title}\x1b[0m (${item.name})`);
  console.log(`   Description: ${item.description}`);
  console.log(`   Files: ${item.files.map((f) => f.target).join(", ")}`);
  console.log(`\n   Live Playground: https://loading.daniasyrofi.com/?specimen=${item.name}\n`);
} else {
  console.log(`Unknown command: "${command}". Available commands: list, info <specimen-name>`);
}
