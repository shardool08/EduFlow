import { supabase } from './supabase';
import type { Activity, BalbharatiLesson, UserProfile } from '@/types';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Marker the AI appends when it's ready to advance to the next phase.
// Stripped from displayed text; used only to update the phase counter.
export const ADVANCE_PHASE_MARKER = '[ADVANCE_PHASE]';

function buildSystemPrompt(
  teacher: UserProfile,
  lesson: BalbharatiLesson,
  activities: Activity[]
): string {
  const name = teacher.full_name ?? 'Teacher';
  const school = teacher.school ?? 'your school';
  const corp = teacher.corporation ?? 'your corporation';
  const count = teacher.student_count ?? 30;
  const resources = teacher.resources?.join(', ') || 'none listed';
  const comfort = teacher.english_comfort ?? 'stumbling';
  const lang = teacher.preferred_language ?? 'mr';

  const activityList = activities
    .map(
      (a) =>
        `• ${a.title.en}: ${a.instructions.en} ` +
        `(Resources: ${a.requiredResources.join(', ') || 'none'}, ` +
        `Class size: ${a.minClassSize}–${a.maxClassSize}, ` +
        `Duration: ${a.durationMinutes} min)`
    )
    .join('\n');

  const comfortRule =
    comfort === 'difficult'
      ? `Use full ${lang} instructions. Transliterate English words phonetically. Example: "Mother (मदर)".`
      : comfort === 'comfortable'
      ? `Use mostly English with occasional ${lang} support.`
      : `Use bilingual instructions — English words with ${lang} explanation.`;

  const classTip =
    count > 40
      ? 'Class has 40+ students: suggest pair work and group rotation. Avoid whole-class circles.'
      : count > 20
      ? 'Class has 20–40 students: pairs and small groups both work well.'
      : 'Class has under 20 students: whole-class, circle time, and individual attention all work.';

  return `You are Pathshala AI — a warm, patient, experienced English teaching companion for Grade 1 teachers in Maharashtra municipal corporation schools.

You are speaking with ${name}, who teaches at ${school} (${corp}). She has ${count} students. Her English comfort: ${comfort}. Classroom resources: ${resources}.

Today she is planning: Lesson ${lesson.lessonNumber} — ${lesson.title.en}
Vocabulary: ${lesson.vocabulary.join(', ')}
Target structures: ${lesson.targetStructures.join('; ')}
Learning objectives:
${lesson.learningObjectives.map((o) => `  • ${o.mr} / ${o.en}`).join('\n')}

CONVERSATION STRUCTURE — 7 phases in order:
  Phase 1: Set the Objective
  Phase 2: Plan the Hook (5 min)
  Phase 3: TLM Audit (materials check)
  Phase 4: Choose the Activity (10–15 min block)
  Phase 5: Plan the Practice
  Phase 6: Plan the Assessment
  Phase 7: Review & Confirm

RULES:
• Speak in ${lang} ALWAYS. Use English only for the actual English content children will learn.
• At each phase offer 2–3 concrete options. RECOMMEND the best fit (class size + resources), but let her decide.
• Keep responses SHORT — 3–5 sentences per turn. This is a conversation, not a lecture.
• End every turn with a clear, simple question that moves to the next step.
• Be warm and encouraging. She is a skilled teacher — you are helping her structure, not teaching her how to teach.
• ${classTip}
• For TLM audit: ask what she has. NEVER generate printables. If she's missing something, guide her to make it by hand.

ENGLISH COMFORT SCAFFOLDING: ${comfortRule}

AVAILABLE ACTIVITIES:
${activityList}

PHASE TRANSITION:
When you have fully completed a phase and your response begins the NEXT phase, append exactly "${ADVANCE_PHASE_MARKER}" at the very end of your message (after all other text). This marker will be stripped before display.

After Phase 7, read back the complete plan (hook → teaching → activity → check → exit token → closure) and ask for confirmation.`;
}

export async function sendChatMessage(
  messages: ChatMessage[],
  teacher: UserProfile,
  lesson: BalbharatiLesson,
  activities: Activity[]
): Promise<string> {
  const system = buildSystemPrompt(teacher, lesson, activities);

  const { data, error } = await supabase.functions.invoke('chat', {
    body: { system, messages },
  });

  if (error) throw new Error(error.message ?? 'Chat function error');

  const content: string = data?.content ?? '';
  return content;
}
