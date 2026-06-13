import type { BalbharatiLesson } from "@/lib/curriculum";

export interface FlashcardItem {
  word: string;
  meaning?: string;
  emoji?: string;
  imageUrl?: string;
}

export interface WorksheetItem {
  type: string;
  instruction_local: string;
  instruction_en: string;
  content: Record<string, unknown>;
}

const WORKSHEET_TYPES = new Set([
  "trace", "circle", "match", "fill_blank", "label", "draw", "categorize",
]);

export function getDayContext(lesson: BalbharatiLesson, day: number) {
  const dayInfo = lesson.bloomsProgression.find((b) => b.day === day);
  return {
    day,
    level: dayInfo?.level || "Remember",
    focus: dayInfo?.focus || "",
    totalDays: lesson.days,
  };
}

/** Words prioritized for this day — plan focus words first, then lesson vocabulary */
export function getDayVocabulary(
  lesson: BalbharatiLesson,
  day: number,
  extraWords: string[] = []
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const add = (w: string) => {
    const clean = w?.toLowerCase?.().trim();
    if (clean && clean.length > 1 && !seen.has(clean)) {
      seen.add(clean);
      out.push(clean);
    }
  };
  extraWords.forEach(add);
  lesson.vocabulary.forEach(add);
  return out.slice(0, 12);
}

export function buildFlashcardPrompt(
  lesson: BalbharatiLesson,
  grade: number,
  day: number,
  langName: string,
  vocabulary: string[],
  dayFocus: string
): string {
  return `You are creating classroom flashcards for Grade ${grade} English (Balbharati Maharashtra).

LESSON: ${lesson.id} — ${lesson.en}
DAY ${day} of ${lesson.days}
TODAY'S FOCUS: ${dayFocus || "Lesson vocabulary"}
ALLOWED WORDS ONLY (pick 8-10 from this list): ${vocabulary.join(", ")}

Rules:
- Choose words most important for TODAY's focus, not random words from the list
- Prefer concrete nouns and action verbs teachers can show in class
- Skip grammar terms (noun, verb, tense, vowel, etc.)
- Each card needs a simple child-friendly meaning in ${langName}

Return ONLY a JSON array:
[
  {
    "word": "head",
    "meaning": "short meaning in ${langName} for a child",
    "image_search": "simple search term for a clear photo (e.g. human head, child pointing to head)"
  }
]`;
}

export function buildWorksheetPrompt(
  lesson: BalbharatiLesson,
  grade: number,
  day: number,
  langName: string,
  vocabulary: string[],
  dayFocus: string,
  bloomsLevel: string
): string {
  const allowed = vocabulary.join(", ");
  const typeGuide =
    bloomsLevel.includes("Apply")
      ? 'Use types: "fill_blank", "label", "match", "draw"'
      : bloomsLevel.includes("Understand")
        ? 'Use types: "match", "categorize", "fill_blank", "circle"'
        : 'Use types: "trace", "circle", "match", "fill_blank"';

  return `You are an expert Grade ${grade} English worksheet designer for Balbharati (Maharashtra municipal schools).

LESSON: ${lesson.id} — ${lesson.en} (${lesson.type})
DAY ${day} of ${lesson.days} | Bloom's: ${bloomsLevel}
TODAY'S FOCUS: ${dayFocus}
STRUCTURES: ${lesson.structures.join(" | ") || "none"}

ALLOWED VOCABULARY ONLY: ${allowed}

Create exactly 5 worksheet items aligned to TODAY's focus and Bloom's level.
${typeGuide}

Return ONLY a JSON array. Each item MUST match one of these schemas:

trace: { "type":"trace", "instruction_local":"...", "instruction_en":"...", "content": { "words": ["cat","bat"] } }
circle: { "type":"circle", "instruction_local":"...", "instruction_en":"...", "content": { "questions": [{ "image_desc":"picture of a cat", "options": ["cat","dog","pen"], "answer": "cat" }] } }
match: { "type":"match", "instruction_local":"...", "instruction_en":"...", "content": { "pairs": [{ "word":"cat", "image_desc":"picture of a cat" }] } }
fill_blank: { "type":"fill_blank", "instruction_local":"...", "instruction_en":"...", "content": { "sentences": ["The ___ is big."], "word_bank": ["cat","dog"] } }
label: { "type":"label", "instruction_local":"...", "instruction_en":"...", "content": { "items": [{ "image_desc":"picture of sun", "answer": "sun" }] } }
draw: { "type":"draw", "instruction_local":"...", "instruction_en":"...", "content": { "prompt": "Draw a cat and write the word" } }
categorize: { "type":"categorize", "instruction_local":"...", "instruction_en":"...", "content": { "categories": ["Animals","Things"], "words": ["cat","pen"] } }

CRITICAL:
- instruction_local MUST be in ${langName}
- instruction_en in simple English
- Every word in content MUST be from ALLOWED VOCABULARY
- image_desc = plain English description of what to draw/show (for teacher to sketch or use flashcard)
- For Grade 1-2: keep sentences very short (3-5 words)
- Do NOT invent words outside the allowed list`;
}

function wordInAllowed(word: string, allowed: Set<string>): boolean {
  const w = word.toLowerCase().trim();
  if (allowed.has(w)) return true;
  return [...allowed].some((a) => w.includes(a) || a.includes(w));
}

export function validateWorksheetItems(
  items: unknown[],
  allowedWords: string[]
): WorksheetItem[] {
  if (!Array.isArray(items)) return [];
  const allowed = new Set(allowedWords.map((w) => w.toLowerCase()));

  const valid: WorksheetItem[] = [];
  for (const raw of items) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as WorksheetItem;
    if (!WORKSHEET_TYPES.has(item.type)) continue;
    if (!item.instruction_local || !item.instruction_en || !item.content) continue;

    const content = item.content as Record<string, unknown>;
    let ok = true;

    if (item.type === "trace" && Array.isArray(content.words)) {
      ok = (content.words as string[]).every((w) => wordInAllowed(String(w), allowed));
    } else if (item.type === "match" && Array.isArray(content.pairs)) {
      ok = (content.pairs as { word?: string }[]).every((p) => p.word && wordInAllowed(p.word, allowed));
    } else if (item.type === "fill_blank" && Array.isArray(content.sentences)) {
      ok = true;
    } else if (item.type === "circle" && Array.isArray(content.questions)) {
      ok = (content.questions as { options?: string[] }[]).every((q) =>
        (q.options || []).some((o) => wordInAllowed(String(o), allowed))
      );
    }

    if (ok) valid.push(item);
  }
  return valid.slice(0, 5);
}

export function parseJsonArray(text: string): unknown[] {
  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);
  return Array.isArray(parsed) ? parsed : [];
}
