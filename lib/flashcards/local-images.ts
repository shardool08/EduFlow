import manifest from "@/lib/flashcards/manifest.json";

/** Maps lessonId → list of words that have approved images in public/flashcards/ */
export type FlashcardImageManifest = Record<string, string[]>;

const imageManifest = manifest as FlashcardImageManifest;

/** Lesson 1.1 → folder 1-1 under public/flashcards/ */
export function lessonFolderId(lessonId: string): string {
  return lessonId.replace(/\./g, "-");
}

export function lessonIdFromFolder(folder: string): string {
  return folder.replace(/-/g, ".");
}

/** Public URL for a locally stored flashcard image */
export function localFlashcardImageUrl(lessonId: string, word: string): string {
  const folder = lessonFolderId(lessonId);
  const safeWord = word.toLowerCase().trim().replace(/\s+/g, "-");
  return `/flashcards/${folder}/${safeWord}.webp`;
}

/** True when manifest lists this word (file should exist in public/flashcards/) */
export function hasLocalFlashcardImage(lessonId: string, word: string): boolean {
  const key = word.toLowerCase().trim();
  const list = imageManifest[lessonId];
  return list?.some((w) => w.toLowerCase().trim() === key) ?? false;
}

/** Resolved image URL for UI, or undefined → emoji fallback */
export function resolveLocalFlashcardImage(lessonId: string, word: string): string | undefined {
  if (!hasLocalFlashcardImage(lessonId, word)) return undefined;
  return localFlashcardImageUrl(lessonId, word);
}

export function listLessonsWithLocalImages(): string[] {
  return Object.keys(imageManifest).filter((id) => imageManifest[id]?.length > 0);
}

export function listLocalImagesForLesson(lessonId: string): string[] {
  return imageManifest[lessonId] ?? [];
}

export function getImageManifest(): FlashcardImageManifest {
  return imageManifest;
}
