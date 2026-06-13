import type { BalbharatiLesson } from "@/lib/curriculum";
import lesson11 from "@/lib/flashcards/lessons/1.1.json";

export interface LessonFlashcardSeed {
  word: string;
  type?: "word" | "phrase" | "pattern" | "structure";
  category?: string;
  image_prompt?: string;
}

export interface LessonPack {
  lessonId: string;
  title?: string;
  cards: LessonFlashcardSeed[];
}

/** Curated lesson packs — add new JSON files here as textbooks are prepared */
export const LESSON_PACKS: Record<string, LessonPack> = {
  "1.1": lesson11 as LessonPack,
};

export function getLessonPack(lessonId: string): LessonPack | undefined {
  return LESSON_PACKS[lessonId];
}

export function listLessonPackIds(): string[] {
  return Object.keys(LESSON_PACKS);
}

export function seedForWord(lessonId: string, word: string): LessonFlashcardSeed | undefined {
  return LESSON_PACKS[lessonId]?.cards.find((c) => c.word.toLowerCase() === word.toLowerCase());
}

export function orderedWordsForLesson(lessonId: string, vocabulary: string[]): string[] {
  const pack = LESSON_PACKS[lessonId];
  if (pack?.cards?.length) {
    return pack.cards.map((c) => c.word.toLowerCase().trim());
  }
  const vocabSet = new Set(vocabulary.map((w) => w.toLowerCase()));
  const words = vocabulary.filter((w, i, arr) => arr.findIndex((x) => x.toLowerCase() === w.toLowerCase()) === i);
  return words.map((w) => w.toLowerCase().trim()).filter((w) => vocabSet.has(w));
}

export function cardTypeForLesson(lesson: BalbharatiLesson): LessonFlashcardSeed["type"] {
  const gradeMatch = lesson.id.match(/(\d+)/);
  const grade = gradeMatch ? parseInt(gradeMatch[1], 10) : 1;
  if (grade <= 2) return "word";
  if (grade === 3) return "word";
  return "word";
}
