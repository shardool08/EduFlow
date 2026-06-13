/**
 * Seed Firestore catalog + upload images to Firebase Storage.
 *
 * Prerequisites:
 *   1. Firebase project with Firestore + Storage enabled
 *   2. Service account JSON: set GOOGLE_APPLICATION_CREDENTIALS or place serviceAccount.json in project root
 *   3. npm install firebase-admin (devDependency)
 *
 * Usage:
 *   FIREBASE_PROJECT_ID=your-project node scripts/seed-firebase-catalog.mjs
 *   node scripts/seed-firebase-catalog.mjs --dry-run
 *   node scripts/seed-firebase-catalog.mjs --flashcards-only
 *   node scripts/seed-firebase-catalog.mjs --tlm-only
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const tlmOnly = args.has("--tlm-only");
const flashcardsOnly = args.has("--flashcards-only");
const doTlm = !flashcardsOnly;
const doFlashcards = !tlmOnly;

const projectId =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  process.env.GCLOUD_PROJECT;

if (!projectId) {
  console.error("Set FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  process.exit(1);
}

const storageBucket =
  process.env.FIREBASE_STORAGE_BUCKET ||
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
  `${projectId}.appspot.com`;

function loadJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(root, relPath), "utf8"));
}

function safeLessonDocId(lessonId) {
  return lessonId.replace(/\./g, "_");
}

function safeFileName(word) {
  return word
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "card";
}

function initAdmin() {
  if (getApps().length) return;
  const credPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.join(root, "serviceAccount.json");
  if (!fs.existsSync(credPath)) {
    console.error(
      "Missing service account. Set GOOGLE_APPLICATION_CREDENTIALS or add serviceAccount.json",
    );
    process.exit(1);
  }
  initializeApp({
    credential: cert(JSON.parse(fs.readFileSync(credPath, "utf8"))),
    projectId,
    storageBucket,
  });
}

async function uploadFile(localPath, storagePath, contentType) {
  if (!fs.existsSync(localPath)) return null;
  if (dryRun) {
    console.log(`[dry-run] upload ${localPath} -> ${storagePath}`);
    return `https://storage.googleapis.com/${storageBucket}/${storagePath}`;
  }
  const bucket = getStorage().bucket();
  const [file] = await bucket.upload(localPath, {
    destination: storagePath,
    metadata: { cacheControl: "public,max-age=31536000", contentType },
  });
  await file.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
}

async function seedTlm(db) {
  const tlm = loadJson("android/app/src/main/assets/tlm-catalog.json");
  const publicTlmDir = path.join(root, "public", "catalog", "tlm");
  const resources = [];

  for (const item of tlm) {
    let imageUrl = item.imageUrl || "";
    const candidates = [
      path.join(publicTlmDir, `${item.id}.webp`),
      path.join(publicTlmDir, `${item.id}.png`),
      path.join(root, "public", "tlm", `${item.id}.webp`),
    ];
    for (const local of candidates) {
      if (fs.existsSync(local)) {
        const ext = path.extname(local).slice(1) || "webp";
        const uploaded = await uploadFile(
          local,
          `catalog/tlm/${item.id}.${ext}`,
          ext === "png" ? "image/png" : "image/webp",
        );
        if (uploaded) imageUrl = uploaded;
        break;
      }
    }
    resources.push({
      id: item.id,
      label: item.label,
      emoji: item.emoji || "📦",
      imageUrl,
    });
  }

  if (dryRun) {
    console.log(`[dry-run] catalog/tlmResources (${resources.length} items)`);
    return;
  }

  await db.collection("catalog").doc("tlmResources").set(
    {
      resources,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
  console.log(`Seeded TLM catalog (${resources.length} resources)`);
}

async function seedFlashcards(db) {
  const flashcards = loadJson("android/app/src/main/assets/flashcards.json");
  const publicFlashDir = path.join(root, "public", "flashcards");
  let batch = db.batch();
  let batchOps = 0;
  let lessonCount = 0;
  let imageCount = 0;

  async function commitBatchIfNeeded(force = false) {
    if (dryRun || batchOps === 0) return;
    if (!force && batchOps < 400) return;
    await batch.commit();
    batch = db.batch();
    batchOps = 0;
  }

  if (!dryRun) {
    await db.collection("catalog").doc("flashcards").set(
      {
        version: 1,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  }

  for (const [lessonId, lesson] of Object.entries(flashcards)) {
    const cards = [];
    for (const card of lesson.cards || []) {
      let imageUrl = card.imageUrl || "";
      const wordFile = safeFileName(card.word);
      const localCandidates = [
        path.join(publicFlashDir, lessonId, `${wordFile}.webp`),
        path.join(publicFlashDir, lessonId, `${card.word}.webp`),
        path.join(publicFlashDir, safeLessonDocId(lessonId), `${wordFile}.webp`),
      ];
      for (const local of localCandidates) {
        if (fs.existsSync(local)) {
          const uploaded = await uploadFile(
            local,
            `catalog/flashcards/${safeLessonDocId(lessonId)}/${path.basename(local)}`,
            "image/webp",
          );
          if (uploaded) {
            imageUrl = uploaded;
            imageCount++;
          }
          break;
        }
      }
      cards.push({
        word: card.word,
        emoji: card.emoji || "📚",
        meaningMr: card.meaningMr || card.word,
        meaningHi: card.meaningHi || card.word,
        meaningUr: card.meaningUr || card.word,
        type: card.type || "word",
        imageUrl,
      });
    }

    const docRef = db
      .collection("catalog")
      .doc("flashcards")
      .collection("lessons")
      .doc(safeLessonDocId(lessonId));

    if (dryRun) {
      console.log(`[dry-run] flashcards lesson ${lessonId} (${cards.length} cards)`);
    } else {
      batch.set(
        docRef,
        {
          lessonId,
          title: lesson.title || lessonId,
          cards,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
      batchOps++;
      await commitBatchIfNeeded();
    }
    lessonCount++;
  }

  if (!dryRun) {
    await commitBatchIfNeeded(true);
  }
  console.log(
    `Seeded flashcard catalog (${lessonCount} lessons, ${imageCount} images uploaded)`,
  );
}

async function main() {
  initAdmin();
  const db = getFirestore();
  console.log(`Project: ${projectId}`);
  console.log(`Bucket: ${storageBucket}`);
  if (dryRun) console.log("DRY RUN — no writes");

  if (doTlm) await seedTlm(db);
  if (doFlashcards) await seedFlashcards(db);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
