import { NextRequest, NextResponse } from "next/server";
import { allLessonsServer as balbharatiLessons } from "@/lib/curriculum";
import { anthropicMessages, parseLessonGrade } from "@/lib/api-utils";
import {
  buildWorksheetPrompt,
  getDayContext,
  getDayVocabulary,
  parseJsonArray,
  validateWorksheetItems,
} from "@/lib/materials";
import { getLessonFlashcardsFromVocabulary } from "@/lib/flashcards";

function langCode(code?: string): "mr" | "hi" | "ur" | "en" {
  if (code === "hi") return "hi";
  if (code === "ur") return "ur";
  if (code === "en") return "en";
  return "mr";
}

function langName(code?: string): string {
  if (code === "hi") return "Hindi";
  if (code === "ur") return "Urdu";
  if (code === "en") return "English";
  return "Marathi";
}

async function generateWorksheetItems(
  lesson: (typeof balbharatiLessons)[0],
  grade: number,
  day: number,
  teacherProfile: Record<string, string | undefined>,
  vocabularyFocus?: string[]
) {
  const ctx = getDayContext(lesson, day);
  const lang = langName(teacherProfile?.language);
  const vocabulary = getDayVocabulary(lesson, day, vocabularyFocus || []);

  const prompt = buildWorksheetPrompt(
    lesson,
    grade,
    day,
    lang,
    vocabulary,
    ctx.focus,
    ctx.level
  );

  const result = await anthropicMessages({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3072,
    messages: [{ role: "user", content: prompt }],
  });

  if (!result.ok) return { error: true as const, items: [] as ReturnType<typeof validateWorksheetItems> };

  try {
    const raw = parseJsonArray(result.data.content?.[0]?.text || "[]");
    let items = validateWorksheetItems(raw, vocabulary);

    if (items.length < 3) {
      const retry = await anthropicMessages({
        model: "claude-sonnet-4-20250514",
        max_tokens: 3072,
        messages: [
          { role: "user", content: prompt },
          { role: "assistant", content: JSON.stringify(raw) },
          {
            role: "user",
            content: `Fix the worksheet. Previous output had invalid or off-vocabulary words. Return exactly 5 valid items using ONLY: ${vocabulary.join(", ")}. Return ONLY the JSON array.`,
          },
        ],
      });
      if (retry.ok) {
        try {
          const retryRaw = parseJsonArray(retry.data.content?.[0]?.text || "[]");
          items = validateWorksheetItems(retryRaw, vocabulary);
        } catch {
          /* keep first pass */
        }
      }
    }

    return { error: false as const, items };
  } catch {
    return { error: true as const, items: [] as ReturnType<typeof validateWorksheetItems> };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lessonId, day, teacherProfile, tlmMode, vocabularyFocus } = body;

    if (!lessonId) {
      return NextResponse.json({ error: "Missing lessonId" }, { status: 400 });
    }

    const lesson = balbharatiLessons.find((l) => l.id === lessonId);
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const dayNum = day || 1;
    const grade = parseLessonGrade(lesson.id);
    const focusWords = Array.isArray(vocabularyFocus) ? vocabularyFocus : undefined;

    if (tlmMode) {
      const lang = langCode(teacherProfile?.language);
      const flashcards = getLessonFlashcardsFromVocabulary(
        lesson.id,
        lesson.vocabulary || [],
        lang
      );
      return NextResponse.json({
        tlmType: "flashcards",
        items: flashcards,
        lesson: { id: lesson.id, en: lesson.en },
        source: "lesson",
      });
    }

    const { error, items } = await generateWorksheetItems(
      lesson,
      grade,
      dayNum,
      teacherProfile || {},
      focusWords
    );

    if (error || items.length === 0) {
      return NextResponse.json({ error: "Could not generate worksheet" }, { status: 500 });
    }

    return NextResponse.json({
      items,
      lesson: { id: lesson.id, en: lesson.en, local: lesson[teacherProfile?.language || "mr"] },
    });
  } catch (error) {
    console.error("WORKSHEET ERROR:", error);
    return NextResponse.json({ error: "Could not generate worksheet" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const lessonId = req.nextUrl.searchParams.get("lessonId");
  const lang = langCode(req.nextUrl.searchParams.get("lang") || undefined);

  if (!lessonId) {
    return NextResponse.json({ error: "Missing lessonId" }, { status: 400 });
  }

  const lesson = balbharatiLessons.find((l) => l.id === lessonId);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const items = getLessonFlashcardsFromVocabulary(lesson.id, lesson.vocabulary || [], lang);
  return NextResponse.json({
    tlmType: "flashcards",
    items,
    lesson: { id: lesson.id, en: lesson.en },
    source: "lesson",
  });
}
