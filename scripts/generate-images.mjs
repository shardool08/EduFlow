// Generate flashcard images using DALL-E or Flux
//
// Usage:
//   node scripts/generate-images.mjs --lesson=1.1
//   node scripts/generate-images.mjs --all          (uses lib/flashcards/image-prompts.json)
//   node scripts/generate-images.mjs --lesson=1.1 --flux
//
// Output: public/flashcards/[lesson-id]/[word].webp
//         lib/flashcards/manifest.json

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { loadEnv } from "./load-env.mjs";

loadEnv();

const USE_FLUX = process.argv.includes("--flux");
const lessonArg = process.argv.find((a) => a.startsWith("--lesson="));
const lessonFilter = lessonArg ? lessonArg.split("=")[1] : null;
const runAll = process.argv.includes("--all");

const API_KEY = USE_FLUX ? process.env.REPLICATE_API_TOKEN : process.env.OPENAI_API_KEY;

if (!API_KEY) {
  console.error(`ERROR: Set ${USE_FLUX ? "REPLICATE_API_TOKEN" : "OPENAI_API_KEY"} in .env`);
  process.exit(1);
}

const STYLE_SUFFIX =
  ", simple flat illustration style, bold outlines, vibrant colors, child-friendly, educational flashcard, white background, no text, no letters, no words";

function lessonDir(lessonId) {
  return lessonId.replace(/\./g, "-");
}

function loadLessonPack(lessonId) {
  const file = path.join("lib", "flashcards", "lessons", `${lessonId}.json`);
  if (!fs.existsSync(file)) {
    console.error(`No lesson pack at ${file}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function buildPromptList() {
  if (lessonFilter) {
    const pack = loadLessonPack(lessonFilter);
    return pack.cards.map((c) => ({
      lesson: pack.lessonId,
      word: c.word.toLowerCase().trim(),
      prompt: c.image_prompt,
    }));
  }

  if (runAll) {
    const file = "lib/flashcards/image-prompts.json";
    if (!fs.existsSync(file)) {
      console.error("ERROR: Run generate-flashcards.mjs first, or use --lesson=1.1");
      process.exit(1);
    }
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    return raw.map((p) => ({
      lesson: p.lesson,
      word: (p.text || p.word || "").toLowerCase().trim(),
      prompt: p.prompt,
      legacyId: p.id,
    }));
  }

  // Default: all curated lesson JSON files in lib/flashcards/lessons/
  const dir = path.join("lib", "flashcards", "lessons");
  const out = [];
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const pack = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    for (const c of pack.cards || []) {
      if (c.image_prompt) {
        out.push({ lesson: pack.lessonId, word: c.word.toLowerCase().trim(), prompt: c.image_prompt });
      }
    }
  }
  return out;
}

async function generateWithDALLE(prompt) {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: prompt + STYLE_SUFFIX,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "b64_json",
    }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return Buffer.from(data.data[0].b64_json, "base64");
}

async function generateWithFlux(prompt) {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${API_KEY}`,
    },
    body: JSON.stringify({
      version: "black-forest-labs/flux-schnell",
      input: {
        prompt: prompt + STYLE_SUFFIX,
        num_outputs: 1,
        aspect_ratio: "1:1",
        output_format: "webp",
      },
    }),
  });
  const prediction = await response.json();
  let result = prediction;
  while (result.status !== "succeeded" && result.status !== "failed") {
    await new Promise((r) => setTimeout(r, 1000));
    const poll = await fetch(result.urls.get, {
      headers: { Authorization: `Token ${API_KEY}` },
    });
    result = await poll.json();
  }
  if (result.status === "failed") throw new Error("Flux generation failed");
  const imgResponse = await fetch(result.output[0]);
  return Buffer.from(await imgResponse.arrayBuffer());
}

function updateManifest(entries) {
  const manifestPath = path.join("lib", "flashcards", "manifest.json");
  let manifest = {};
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    } catch {
      manifest = {};
    }
  }
  for (const { lesson, word } of entries) {
    if (!manifest[lesson]) manifest[lesson] = [];
    if (!manifest[lesson].includes(word)) manifest[lesson].push(word);
  }
  for (const lesson of Object.keys(manifest)) {
    manifest[lesson].sort();
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

async function main() {
  const prompts = buildPromptList();
  console.log(`Generating ${prompts.length} flashcard image(s)...`);

  let success = 0;
  let failed = 0;
  const failedPrompts = [];
  const succeeded = [];

  for (let i = 0; i < prompts.length; i++) {
    const p = prompts[i];
    const dir = path.join("public", "flashcards", lessonDir(p.lesson));
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filename = `${p.word}.webp`;
    const filepath = path.join(dir, filename);

    if (fs.existsSync(filepath)) {
      console.log(`[${i + 1}/${prompts.length}] SKIP (exists): ${p.lesson}/${filename}`);
      success++;
      succeeded.push({ lesson: p.lesson, word: p.word });
      continue;
    }

    console.log(`[${i + 1}/${prompts.length}] ${p.lesson} — "${p.word}"`);

    try {
      const imageBuffer = USE_FLUX ? await generateWithFlux(p.prompt) : await generateWithDALLE(p.prompt);
      fs.writeFileSync(filepath, imageBuffer);
      console.log(`  ✓ Saved: flashcards/${lessonDir(p.lesson)}/${filename} (${(imageBuffer.length / 1024).toFixed(0)}KB)`);
      success++;
      succeeded.push({ lesson: p.lesson, word: p.word });
    } catch (e) {
      console.error(`  ✗ Failed: ${e.message}`);
      failed++;
      failedPrompts.push(p);
    }

    await new Promise((r) => setTimeout(r, USE_FLUX ? 500 : 1200));
  }

  if (succeeded.length) {
    try {
      execSync("node scripts/sync-flashcard-manifest.mjs", { stdio: "inherit" });
    } catch {
      updateManifest(succeeded);
    }
  }

  if (failedPrompts.length) {
    fs.writeFileSync(
      path.join("lib", "flashcards", "failed-prompts.json"),
      JSON.stringify(failedPrompts, null, 2)
    );
  }

  console.log("\n========================================");
  console.log(`Success: ${success}/${prompts.length}`);
  console.log(`Failed: ${failed}`);
  console.log(`Images: public/flashcards/`);
  if (failed > 0) console.log(`Retry: lib/flashcards/failed-prompts.json`);
  console.log("========================================");
}

main().catch(console.error);
