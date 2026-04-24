/**
 * Seed: Activity pool — Balbharati Grade 1 English
 *
 * Run:  npx tsx server/seeds/activities.ts
 *
 * Requires env vars:
 *   SUPABASE_URL=https://<project>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
 */

import { createClient } from '@supabase/supabase-js';
import type { Activity } from '../../src/types';

// ── Activity data ──────────────────────────────────────────────────────────

export const ACTIVITIES: Activity[] = [

  // ── Lesson 1 — Greetings ─────────────────────────────────────────────────

  {
    id: 'act-01-song',
    title: { en: 'Hello Song with Actions', mr: '', hi: '', ur: '' },
    type: 'song',
    practiceMode: 'guided',
    applicableLessons: ['bb-g1-en-01'],
    minClassSize: 10,
    maxClassSize: 80,
    requiredResources: [],
    durationMinutes: 10,
    instructions: {
      en: "Teach the chant 'Good morning, good morning, how do you do? Good morning, good morning, I am fine, thank you!' to a 4-beat clap, with children waving on 'good morning' and bowing on 'thank you'. After two whole-class rounds, children sing it face-to-face in pairs using each other's names.",
      mr: '',
      hi: '',
      ur: '',
    },
    classroomManagementTips: [
      'Tap the rhythm on a desk first before adding words so children internalize the beat.',
      "Slow the tempo right down on 'thank you' so the bow gesture is clear.",
    ],
  },

  {
    id: 'act-01-game',
    title: { en: 'Greeting Ball Pass', mr: '', hi: '', ur: '' },
    type: 'game',
    practiceMode: 'group',
    applicableLessons: ['bb-g1-en-01'],
    minClassSize: 10,
    maxClassSize: 50,
    requiredResources: ['soft ball or crumpled paper ball'],
    durationMinutes: 15,
    instructions: {
      en: "Children sit in a circle; the teacher greets the child to their left — 'Good morning, ___!' — rolls the ball to them, and the child replies then passes it on. Alternate the greeting phrase each round between 'Good morning', 'Good afternoon', and 'Goodbye'.",
      mr: '',
      hi: '',
      ur: '',
    },
    classroomManagementTips: [
      'Use a sponge ball so no one gets hurt if a throw goes wide.',
      'Allow a 5-second pause before requiring a response so shy children are not rushed.',
    ],
  },

  {
    id: 'act-01-craft',
    title: { en: 'Greetings Flip Book', mr: '', hi: '', ur: '' },
    type: 'craft',
    practiceMode: 'individual',
    applicableLessons: ['bb-g1-en-01'],
    minClassSize: 10,
    maxClassSize: 60,
    requiredResources: ['A4 paper (one per child)', 'crayons'],
    durationMinutes: 20,
    instructions: {
      en: "Children fold an A4 sheet into thirds to make a 3-page flip book, then draw one time of day on each page and write the matching greeting — 'Good morning!', 'Good afternoon!', 'Goodbye!' — copied from the board. In pairs, they flip through each other's books and read the greetings aloud.",
      mr: '',
      hi: '',
      ur: '',
    },
    classroomManagementTips: [
      'Pre-fold one book as a model and leave it on display while children work.',
      'Write the three phrases on the board with a small sun / cloud / moon drawing so children know which page is which.',
    ],
  },

  // ── Lesson 2 — My School ─────────────────────────────────────────────────

  {
    id: 'act-02-song',
    title: { en: 'My School Song', mr: '', hi: '', ur: '' },
    type: 'song',
    practiceMode: 'guided',
    applicableLessons: ['bb-g1-en-02'],
    minClassSize: 10,
    maxClassSize: 80,
    requiredResources: [],
    durationMinutes: 10,
    instructions: {
      en: "Teach this chant to the tune of 'Mary Had a Little Lamb': 'This is my school, my school, my school — this is my school, I love it so', swapping 'school' one word at a time — 'my bag', 'my book', 'my teacher' — while pointing to each real object. After two whole-class rounds, individual children stand, point, and lead one verse each.",
      mr: '',
      hi: '',
      ur: '',
    },
    classroomManagementTips: [
      'Point to the real object every time it is named so gesture and word are always linked.',
      'Keep the pace slow — vocabulary retention matters more than singing speed.',
    ],
  },

  {
    id: 'act-02-game',
    title: { en: 'Touch and Name', mr: '', hi: '', ur: '' },
    type: 'game',
    practiceMode: 'guided',
    applicableLessons: ['bb-g1-en-02'],
    minClassSize: 10,
    maxClassSize: 60,
    requiredResources: ['real classroom objects: book, bag, chalk, ruler, pencil'],
    durationMinutes: 15,
    instructions: {
      en: "Place five or six school objects on the front desk; call one child at a time, say the Marathi name, and the child must touch the correct object and say 'This is a ___' in English. After the individual round, play in teams — each team has 30 seconds to touch and name as many objects as possible.",
      mr: '',
      hi: '',
      ur: '',
    },
    classroomManagementTips: [
      'Keep objects on a raised surface so all children can see from their seats.',
      'Have a helper student manage the waiting queue so you can focus on the active child.',
    ],
  },

  {
    id: 'act-02-craft',
    title: { en: 'My School Bag Drawing', mr: '', hi: '', ur: '' },
    type: 'craft',
    practiceMode: 'individual',
    applicableLessons: ['bb-g1-en-02'],
    minClassSize: 10,
    maxClassSize: 60,
    requiredResources: ['A4 paper (one per child)', 'crayons or colour pencils'],
    durationMinutes: 20,
    instructions: {
      en: "Each child draws their school bag and at least three items inside it — a book, a pencil, and one item of their choice — then writes the English name below each object copied from the board. When finished, each child holds up their drawing and names one object aloud; display the finished work on the classroom wall.",
      mr: '',
      hi: '',
      ur: '',
    },
    classroomManagementTips: [
      'Give a 2-minute warning before the sharing round so children can finish colouring.',
      'Seat children apart — this is personal work, not a copying exercise.',
    ],
  },

  // ── Lesson 6 — My Family ─────────────────────────────────────────────────

  {
    id: 'act-06-song',
    title: { en: 'This Is My Mother Action Song', mr: '', hi: '', ur: '' },
    type: 'song',
    practiceMode: 'guided',
    applicableLessons: ['bb-g1-en-06'],
    minClassSize: 10,
    maxClassSize: 80,
    requiredResources: [],
    durationMinutes: 10,
    instructions: {
      en: "Teach the chant 'This is my mother, this is my father, this is my sister, this is my brother — I love my family!' with a different hand gesture for each member: wave for mother, thumbs-up for father, pinky for sister, fist for brother. After two class rounds, call out a family member and children hold up the matching hand signal without singing.",
      mr: '',
      hi: '',
      ur: '',
    },
    classroomManagementTips: [
      'Introduce one gesture at a time before combining them with the chant.',
      'The silent signal round at the end doubles as a quick comprehension check.',
    ],
  },

  {
    id: 'act-06-game',
    title: { en: 'Family Flashcard Guess', mr: '', hi: '', ur: '' },
    type: 'game',
    practiceMode: 'group',
    applicableLessons: ['bb-g1-en-06'],
    minClassSize: 10,
    maxClassSize: 60,
    requiredResources: [
      'one set of family flashcards per pair: mother, father, sister, brother, grandmother, grandfather',
    ],
    durationMinutes: 15,
    instructions: {
      en: "In pairs, Partner A holds a flashcard face-out so Partner B cannot see it; Partner B asks up to three yes/no questions in English — 'Is it a woman?', 'Is it old?' — then guesses 'This is your ___!' Partner A confirms with 'Yes, this is my ___!' and the pair swap roles after each card.",
      mr: '',
      hi: '',
      ur: '',
    },
    classroomManagementTips: [
      'Model one full question-and-guess exchange at the front before pairs start.',
      'Write the three allowed question stems on the board so children can reference them.',
    ],
  },

  {
    id: 'act-06-craft',
    title: { en: 'My Family Portrait', mr: '', hi: '', ur: '' },
    type: 'craft',
    practiceMode: 'individual',
    applicableLessons: ['bb-g1-en-06'],
    minClassSize: 10,
    maxClassSize: 60,
    requiredResources: ['A4 paper (one per child)', 'crayons', 'family word bank on the board'],
    durationMinutes: 20,
    instructions: {
      en: "Each child draws at least four family members and writes the correct English label beneath each figure, copying from the word bank on the board. After drawing, children do a gallery walk — visiting three classmates' pictures and saying 'This is his/her ___' for one person in each picture.",
      mr: '',
      hi: '',
      ur: '',
    },
    classroomManagementTips: [
      'Reassure children that stick figures are perfectly fine — this is a language activity, not an art lesson.',
      'Include small illustrations next to each word on the board so pre-readers can match by picture.',
    ],
  },

];

// ── Seed runner ────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (require.main === module) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // Map TypeScript camelCase shape → DB snake_case columns
  const rows = ACTIVITIES.map((a) => ({
    id: a.id,
    title_en: a.title.en,
    title_mr: a.title.mr,
    title_hi: a.title.hi,
    title_ur: a.title.ur,
    type: a.type,
    practice_mode: a.practiceMode,
    applicable_lessons: a.applicableLessons,
    min_class_size: a.minClassSize,
    max_class_size: a.maxClassSize,
    required_resources: a.requiredResources,
    duration_minutes: a.durationMinutes,
    instructions_en: a.instructions.en,
    instructions_mr: a.instructions.mr,
    instructions_hi: a.instructions.hi,
    instructions_ur: a.instructions.ur,
    classroom_management_tips: a.classroomManagementTips,
  }));

  (async () => {
    console.log(`Seeding ${rows.length} activities into ${SUPABASE_URL} …\n`);

    const { data, error } = await supabase
      .from('activities')
      .upsert(rows, { onConflict: 'id' })
      .select('id, title_en');

    if (error) {
      console.error('Seed failed:', error.message);
      process.exit(1);
    }

    data?.forEach((r) => console.log(`  ✓  ${r.id}  —  ${r.title_en}`));
    console.log(`\nDone — ${data?.length ?? 0} rows upserted.`);
  })();
}
