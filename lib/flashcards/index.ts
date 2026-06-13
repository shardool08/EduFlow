import type { BalbharatiLesson } from "@/lib/curriculum";
import { getEmoji } from "@/lib/emoji-map";
import type { Language } from "@/lib/translations";
import { getWordMeaning } from "@/lib/flashcards/word-meanings";
import {
  cardTypeForLesson,
  getLessonPack,
  listLessonPackIds,
  orderedWordsForLesson,
  seedForWord,
  type LessonFlashcardSeed,
} from "@/lib/flashcards/lessons/index";
import {
  getImageManifest,
  listLessonsWithLocalImages,
  listLocalImagesForLesson,
  localFlashcardImageUrl,
  resolveLocalFlashcardImage,
} from "@/lib/flashcards/local-images";

export type { LessonFlashcardSeed, LessonPack } from "@/lib/flashcards/lessons/index";
export {
  getImageManifest,
  listLessonsWithLocalImages,
  listLocalImagesForLesson,
  localFlashcardImageUrl,
  resolveLocalFlashcardImage,
};

export interface LessonFlashcard {
  word: string;
  emoji: string;
  meaning: string;
  imageUrl?: string;
  type: "word" | "phrase" | "pattern" | "structure";
  category?: string;
}

/** Build the full flashcard set for a lesson — curriculum + local images + emoji fallback */
export function getLessonFlashcards(
  lesson: BalbharatiLesson,
  lang: Language = "mr"
): LessonFlashcard[] {
  const words = orderedWordsForLesson(lesson.id, lesson.vocabulary || []);
  const defaultType = cardTypeForLesson(lesson) || "word";
  const pack = getLessonPack(lesson.id);

  return words.map((word) => {
    const key = word.toLowerCase().trim();
    const seed = seedForWord(lesson.id, key);
    return {
      word: key,
      emoji: getEmoji(key),
      meaning: getWordMeaning(key, lang),
      imageUrl: resolveLocalFlashcardImage(lesson.id, key),
      type: seed?.type || defaultType,
      category: seed?.category || pack?.cards.find((c) => c.word === key)?.category,
    };
  });
}

export function getLessonFlashcardsFromVocabulary(
  lessonId: string,
  vocabulary: string[],
  lang: Language = "mr"
): LessonFlashcard[] {
  return getLessonFlashcards({ id: lessonId, vocabulary } as BalbharatiLesson, lang);
}

/** Image generation prompts for offline scripts (curated packs only) */
export function getLessonImagePrompts(lessonId: string): { word: string; prompt: string }[] {
  const pack = getLessonPack(lessonId);
  if (!pack) return [];
  return pack.cards
    .filter((c) => c.image_prompt)
    .map((c) => ({ word: c.word.toLowerCase().trim(), prompt: c.image_prompt! }));
}

export function listLessonsWithImagePrompts(): string[] {
  return listLessonPackIds();
}

/** @deprecated use localFlashcardImageUrl */
export function flashcardImagePath(lessonId: string, word: string): string {
  return localFlashcardImageUrl(lessonId, word);
}
