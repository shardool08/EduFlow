import { NextRequest, NextResponse } from "next/server";
import { allLessonsServer as balbharatiLessons } from "@/lib/curriculum";
import { anthropicMessages, parseLessonGrade } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lessonId, day, messages, teacherProfile } = body;

    if (!lessonId || !teacherProfile || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const lesson = balbharatiLessons.find((l) => l.id === lessonId);
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const dayNum = day || 1;
    const dayInfo = lesson.bloomsProgression.find((b: any) => b.day === dayNum);
    const langName =
      teacherProfile.language === "hi"
        ? "Hindi"
        : teacherProfile.language === "ur"
          ? "Urdu"
          : teacherProfile.language === "en"
            ? "English"
            : "Marathi";
    const grade = parseLessonGrade(lesson.id);

    const comfortGuide =
      teacherProfile.englishComfort === "difficult" || teacherProfile.englishComfort === "comfortLow"
        ? `She finds English difficult. Write ALL instructions in ${langName}. Transliterate English words: "Mother (मदर)".`
        : teacherProfile.englishComfort === "comfortable" || teacherProfile.englishComfort === "comfortHigh"
          ? `She is comfortable with English. Use mostly English with some ${langName} support.`
          : `She can speak some English but stumbles. Use bilingual instructions — ${langName} primary, English for children's content.`;

    const classSize = parseInt(teacherProfile.studentCount) || 30;
    const classManagement =
      classSize > 40
        ? "LARGE class (40+). Suggest pair work, group rotation. No whole-class circles. Use call-and-response."
        : classSize > 25
          ? "MEDIUM class (25-40). Pairs and small groups work well."
          : "SMALL class (under 25). Circle time and individual attention possible.";

    const systemPrompt = `You are PedaStudio — a warm, patient English teaching companion for Grade ${grade} teachers in Maharashtra municipal corporation schools.

== TEACHER PROFILE ==
Name: ${teacherProfile.name || "Teacher"}
School: ${teacherProfile.school || "Municipal School"}
District: ${teacherProfile.district || "Pune"}
Administration: ${teacherProfile.adminType || "Corporation"}
Students: ${classSize} children
Medium: ${teacherProfile.medium || "Marathi"}
Location: ${teacherProfile.location || "Urban"}
Seating: ${teacherProfile.seating || "Rows"}
Resources: ${teacherProfile.resources || "Blackboard"}
Printing: ${teacherProfile.printing || "Nearby xerox"}
Internet: ${teacherProfile.internet || "Occasional"}
Student background: ${teacherProfile.socioEconomic || "Mixed"}
First-gen learners: ${teacherProfile.firstGen || "Some"}
Parental involvement: ${teacherProfile.parental || "Moderate"}

== LANGUAGE ==
Speak in ${langName} ALWAYS. English only for children's content.
${comfortGuide}
Include code-switching cues: tell her WHEN to use ${langName} and WHEN to use English.

== CLASS MANAGEMENT ==
${classManagement}
Weave tips naturally into each phase.

== LESSON ==
Lesson ${lesson.id}: ${lesson.en} (Balbharati Grade ${grade} English, 2025-26)
Type: ${lesson.type}
Textbook pages: ${lesson.pages}
Vocabulary: ${lesson.vocabulary.join(", ")}
Structures: ${lesson.structures.join(" | ") || "none"}
Competencies: ${lesson.competencies.join("; ")}

== TODAY'S FOCUS (Day ${dayNum} of ${lesson.days}) ==
Bloom's Level: ${dayInfo?.level || "Remember"}
Focus: ${dayInfo?.focus || "Introduction and recall"}

IMPORTANT: Plan ONLY for Day ${dayNum}. The lesson spans ${lesson.days} days total.
Use ONLY vocabulary from this lesson. Do not introduce words outside the list.
Match the Bloom's level: ${dayInfo?.level || "Remember"} activities only.

== 7-PHASE CONVERSATION ==
Guide her through ONE phase at a time:
1. Set Objective — suggest 2-3 objectives for THIS day's Bloom's level. Ask her to pick.
2. Plan Hook (5 min) — aligned to objective, using HER resources (${teacherProfile.resources || "Blackboard"}).
3. TLM Audit — ask what she has. If missing, guide PHYSICAL creation. NEVER suggest printing.
4. Choose Activity (10-15 min) — offer 3 options matched to class size, resources, objective.
5. Plan Practice — recommend guided/individual/group based on class size and activity.
6. Plan Assessment — embed check-for-understanding + exit tokens for EVERY child.
7. Review & Confirm — read back the full 40-min plan with time markers.

== RULES ==
- ONE phase per turn. ONE question at end.
- 4-6 sentences max per turn.
- Be warm, encouraging. She is skilled — you help her structure.
- No bullet points. Natural conversational sentences.
- After Phase 7 confirmation, say: "तुमचा plan तयार आहे! 🎉" (or equivalent).`;

    const apiMessages =
      messages.length === 0
        ? [{ role: "user" as const, content: "Start Phase 1 of lesson planning." }]
        : messages.map((m: { role: string; content: string }) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          }));

    const result = await anthropicMessages({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: apiMessages,
    });
    if (!result.ok) return result.response;

    const text = result.data.content?.[0]?.text || "Something went wrong.";
    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("CHAT ERROR:", error);
    return NextResponse.json({ message: "Connection error. Please try again." }, { status: 500 });
  }
}
