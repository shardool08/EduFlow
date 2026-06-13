import { getAllLessons, getLessons } from "@/lib/curriculum";
import type { BalbharatiLesson } from "@/lib/curriculum";

export function findLessonById(lessonId: string): BalbharatiLesson | null {
  return getAllLessons().find((l) => l.id === lessonId) ?? null;
}

export function findLesson(lessonId: string, grade?: number, subject?: string): BalbharatiLesson | null {
  if (grade !== undefined && subject) {
    const scoped = getLessons(grade, subject).find((l) => l.id === lessonId);
    if (scoped) return scoped;
  }
  return findLessonById(lessonId);
}
