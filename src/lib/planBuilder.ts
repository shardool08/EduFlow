import type { BalbharatiLesson, PlanningDecisions, SupportedLanguage, UserProfile } from '@/types';
import type {
  GeneratedLessonPlan,
  GeneratedWorksheet,
  LessonPlanSection,
  PdfBundle,
  WorksheetItem,
} from '@/types/pdf';

function formatDate(): string {
  return new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function buildSections(
  lesson: BalbharatiLesson,
  decisions: PlanningDecisions
): LessonPlanSection[] {
  const { hookDescription, selectedActivity, practiceMode, assessmentMethod } = decisions;
  const vocabStr = lesson.vocabulary.slice(0, 6).join(', ');

  const practiceInstructions = (() => {
    const activityNote = selectedActivity?.instructions.mr ?? '';
    if (practiceMode === 'group') return `Group practice: ${activityNote}`;
    if (practiceMode === 'individual') return `Individual practice: ${activityNote}`;
    return `Guided practice: Demonstrate 2–3 examples first, then have students practice in pairs. ${activityNote}`;
  })();

  return [
    {
      icon: '🎯',
      title: 'Hook',
      timeRange: '0–5 min',
      instructions:
        hookDescription ??
        `Show a picture or object related to "${lesson.title.en}". Say: "Today we will learn about ${lesson.title.en}."`,
      tip: 'Stand near the board. Make eye contact with quiet students first.',
    },
    {
      icon: '📋',
      title: 'Prior Knowledge',
      timeRange: '5–8 min',
      instructions: `Ask: "What do you know about ${lesson.title.en}?" Listen in Marathi/Hindi. Bridge their answers to English: ${vocabStr}.`,
      tip: 'Accept all answers warmly. This is connecting, not testing.',
    },
    {
      icon: '📖',
      title: 'Core Teaching',
      timeRange: '8–16 min',
      instructions: selectedActivity
        ? `Introduce vocabulary: ${vocabStr}.\n${selectedActivity.instructions.mr}`
        : `Introduce vocabulary one by one: ${vocabStr}. Say each word clearly, have students repeat.`,
      tip: 'Show → Say → Repeat. Keep each word introduction under 1 minute.',
    },
    {
      icon: '🎮',
      title: `Practice: ${selectedActivity?.title.en ?? 'Activity'}`,
      timeRange: '16–28 min',
      instructions: practiceInstructions,
      tip:
        selectedActivity?.classroomManagementTips[0] ??
        'Move around the class. Give quiet encouragement.',
    },
    {
      icon: '✅',
      title: 'Check for Understanding',
      timeRange: '28–33 min',
      instructions:
        assessmentMethod ??
        `Ask 5 random students one question each about today's vocabulary. Look for: hesitation, wrong answers, confusion.`,
      tip: "Note who struggled — adjust tomorrow's plan.",
    },
    {
      icon: '🚪',
      title: 'Exit Token',
      timeRange: '33–36 min',
      instructions: `Each student says one ${lesson.title.en.toLowerCase()} vocabulary word in English before lining up / leaving the group.`,
      tip: 'Keep it fast — 5–8 seconds per student. No corrections at this stage.',
    },
    {
      icon: '🔚',
      title: 'Closure',
      timeRange: '36–40 min',
      instructions: `Recap: "Today we learned about ${lesson.title.en}." Preview next class. Ask: "Can you teach someone at home today?"`,
    },
  ];
}

function buildWorksheetItems(lesson: BalbharatiLesson): WorksheetItem[] {
  const vocab = lesson.vocabulary.slice(0, 6);
  const items: WorksheetItem[] = [];

  if (vocab.length >= 1) {
    items.push({
      type: 'tracing',
      instruction: 'Trace the words.',
      words: vocab.slice(0, 3),
    });
  }

  if (vocab.length >= 2) {
    items.push({
      type: 'matching',
      instruction: 'Match the words. Draw a line.',
      words: vocab.slice(0, 4),
    });
  }

  if (lesson.targetStructures.length > 0) {
    const structure = lesson.targetStructures[0].replace('___', '______');
    items.push({
      type: 'labeling',
      instruction: `Complete the sentence: "${structure}"`,
      words: vocab.slice(0, 3),
    });
  }

  items.push({
    type: 'drawing',
    instruction: `Draw a picture about "${lesson.title.en}" and write the English word.`,
    words: [],
  });

  return items;
}

function teacherInstructionText(lang: SupportedLanguage): string {
  switch (lang) {
    case 'hi': return 'बच्चों को कहें: English में लिखें।';
    case 'en': return 'Tell students: Write the English word.';
    default:   return 'मुलांना सांगा: English मध्ये लिहा.';
  }
}

export function buildLessonPlan(
  lesson: BalbharatiLesson,
  decisions: PlanningDecisions,
  profile: UserProfile
): GeneratedLessonPlan {
  return {
    teacherName: profile.full_name,
    school: profile.school ?? '',
    corporation: profile.corporation ?? '',
    date: formatDate(),
    lessonNumber: lesson.lessonNumber,
    lessonTitle: lesson.title.en,
    lessonTitleMr: lesson.title.mr,
    objective: decisions.objective ?? lesson.learningObjectives[0]?.en ?? '',
    sections: buildSections(lesson, decisions),
    includeWorksheet: decisions.includeWorksheet,
    includeAssessment: decisions.includeAssessment,
  };
}

export function buildWorksheet(
  lesson: BalbharatiLesson,
  lang: SupportedLanguage
): GeneratedWorksheet {
  return {
    lessonNumber: lesson.lessonNumber,
    lessonTitle: lesson.title.en,
    teacherInstruction: teacherInstructionText(lang),
    items: buildWorksheetItems(lesson),
  };
}

export function buildBundle(
  lesson: BalbharatiLesson,
  decisions: PlanningDecisions,
  profile: UserProfile
): PdfBundle {
  const lang = profile.preferred_language ?? 'mr';
  return {
    lessonPlan: buildLessonPlan(lesson, decisions, profile),
    worksheet: buildWorksheet(lesson, lang),
    assessment: decisions.includeAssessment ? buildWorksheet(lesson, lang) : undefined,
  };
}
