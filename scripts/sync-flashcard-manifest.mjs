// Scan public/flashcards/ and update lib/flashcards/manifest.json
//
// Usage: node scripts/sync-flashcard-manifest.mjs
//
// Folder naming: public/flashcards/1-1/head.webp → lesson "1.1", word "head"

import fs from "fs";
import path from "path";
import { loadEnv } from "./load-env.mjs";

loadEnv();

const PUBLIC_DIR = path.join("public", "flashcards");
const MANIFEST_PATH = path.join("lib", "flashcards", "manifest.json");

function folderToLessonId(folder) {
  return folder.replace(/-/g, ".");
}

function scanLocalImages() {
  const manifest = {};

  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    return manifest;
  }

  for (const folder of fs.readdirSync(PUBLIC_DIR)) {
    const dir = path.join(PUBLIC_DIR, folder);
    if (!fs.statSync(dir).isDirectory()) continue;

    const lessonId = folderToLessonId(folder);
    const words = [];

    for (const file of fs.readdirSync(dir)) {
      if (!/\.(webp|png|jpg|jpeg)$/i.test(file)) continue;
      const word = file.replace(/\.(webp|png|jpg|jpeg)$/i, "").replace(/-/g, " ");
      words.push(word.toLowerCase().trim());
    }

    if (words.length) {
      words.sort();
      manifest[lessonId] = words;
    }
  }

  return manifest;
}

function main() {
  const manifest = scanLocalImages();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");

  const lessonCount = Object.keys(manifest).length;
  const imageCount = Object.values(manifest).reduce((n, arr) => n + arr.length, 0);

  console.log("========================================");
  console.log("Local flashcard manifest synced");
  console.log(`Lessons with images: ${lessonCount}`);
  console.log(`Total images: ${imageCount}`);
  console.log(`Manifest: ${MANIFEST_PATH}`);
  console.log(`Files: ${PUBLIC_DIR}/`);
  console.log("========================================");

  if (imageCount === 0) {
    console.log("\nNo images yet. Add .webp files under public/flashcards/{lesson-folder}/");
    console.log("Example: public/flashcards/1-1/head.webp");
    console.log("Then run: npm run flashcards:sync");
  }
}

main();
