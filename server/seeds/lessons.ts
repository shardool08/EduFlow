/**
 * Seed: Balbharati Grade 1 English — selected lessons
 *
 * Run:  npx tsx server/seeds/lessons.ts
 *
 * Requires env vars (copy from your Supabase project settings → API):
 *   SUPABASE_URL=https://<project>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=<service-role-key>   ← bypasses RLS
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// ── Rows match public.lessons column names exactly ─────────────────────────
// learning_objectives is JSONB: [{en, mr}]
// vocabulary / target_structures / page_numbers are Postgres arrays (TEXT[]/INT[])

const LESSONS = [
  // ── JUNE ──────────────────────────────────────────────────────────────────

  {
    id: 'bb-g1-en-01',
    lesson_number: 1,
    title_en: 'Greetings',
    title_mr: 'अभिवादन',
    title_hi: 'अभिवादन',
    title_ur: 'سلام',
    vocabulary: [
      'hello', 'good morning', 'good afternoon', 'good evening',
      'goodbye', 'thank you', 'please', 'sorry',
    ],
    target_structures: [
      'Good ___, ___!',
      'Hello, I am ___.',
      'Thank you!',
      'Sorry!',
    ],
    learning_objectives: [
      {
        en: 'Children can greet in English at different times of day',
        mr: 'मुलं दिवसाच्या वेगवेगळ्या वेळी English मध्ये अभिवादन करू शकतात',
      },
      {
        en: "Children can introduce themselves: 'I am ___'",
        mr: "मुलं स्वतःची ओळख सांगू शकतात: 'I am ___'",
      },
      {
        en: 'Children use polite words: please, thank you, sorry',
        mr: 'मुलं please, thank you, sorry हे शिष्टाचाराचे शब्द वापरू शकतात',
      },
    ],
    page_numbers: [1, 2, 3, 4],
    thematic_group: 'Social Skills',
    suggested_month: 6,
  },

  // ── JULY ──────────────────────────────────────────────────────────────────

  {
    id: 'bb-g1-en-06',
    lesson_number: 6,
    title_en: 'My Family',
    title_mr: 'माझे कुटुंब',
    title_hi: 'मेरा परिवार',
    title_ur: 'میرا خاندان',
    vocabulary: [
      'mother', 'father', 'sister', 'brother',
      'grandmother', 'grandfather', 'family', 'baby',
    ],
    target_structures: [
      'This is my ___.',
      'Who is this?',
      'She is my ___.',
      'He is my ___.',
    ],
    learning_objectives: [
      {
        en: 'Children can name at least 6 family members in English',
        mr: 'मुलं किमान 6 कुटुंबातील सदस्यांची नावे English मध्ये सांगू शकतात',
      },
      {
        en: "Children introduce family members using 'This is my ___'",
        mr: "मुलं 'This is my ___' वापरून कुटुंबातील सदस्यांची ओळख करून देऊ शकतात",
      },
      {
        en: "Children correctly use 'She is my ___' and 'He is my ___'",
        mr: "मुलं 'She is my ___' आणि 'He is my ___' योग्यरित्या वापरू शकतात",
      },
    ],
    page_numbers: [21, 22, 23, 24],
    thematic_group: 'Self and Family',
    suggested_month: 7,
  },
];

// ── Run ────────────────────────────────────────────────────────────────────

async function seed() {
  console.log(`Seeding ${LESSONS.length} lessons into ${SUPABASE_URL} …\n`);

  const { data, error } = await supabase
    .from('lessons')
    .upsert(LESSONS, { onConflict: 'id' })
    .select('id, lesson_number, title_en');

  if (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }

  data?.forEach((row) =>
    console.log(`  ✓ ${row.lesson_number.toString().padStart(2, ' ')}  ${row.id}  ${row.title_en}`)
  );

  console.log(`\nDone — ${data?.length ?? 0} rows upserted.`);
}

seed();
