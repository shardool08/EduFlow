/**
 * Seed: Balbharati Grade 1 English — first 10 lessons
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
        en: "Children use polite words: please, thank you, sorry",
        mr: 'मुलं please, thank you, sorry हे शिष्टाचाराचे शब्द वापरू शकतात',
      },
    ],
    page_numbers: [1, 2, 3, 4],
    thematic_group: 'Social Skills',
    suggested_month: 6,
  },

  {
    id: 'bb-g1-en-02',
    lesson_number: 2,
    title_en: 'My School',
    title_mr: 'माझी शाळा',
    title_hi: 'मेरी स्कूल',
    title_ur: 'میری اسکول',
    vocabulary: [
      'school', 'classroom', 'teacher', 'student',
      'blackboard', 'book', 'bag', 'chalk', 'pencil', 'ruler',
    ],
    target_structures: [
      'This is my ___.',
      'I see a ___.',
      'This is a ___.',
    ],
    learning_objectives: [
      {
        en: 'Children can name at least 8 school objects in English',
        mr: 'मुलं किमान 8 शाळेच्या वस्तूंची नावे English मध्ये सांगू शकतात',
      },
      {
        en: "Children can use 'This is my/a ___' and 'I see a ___'",
        mr: "मुलं 'This is my/a ___' आणि 'I see a ___' हे वाक्य बोलू शकतात",
      },
    ],
    page_numbers: [5, 6, 7, 8],
    thematic_group: 'School',
    suggested_month: 6,
  },

  {
    id: 'bb-g1-en-03',
    lesson_number: 3,
    title_en: 'Numbers 1–5',
    title_mr: 'संख्या १–५',
    title_hi: 'संख्या 1–5',
    title_ur: 'نمبر 1–5',
    vocabulary: ['one', 'two', 'three', 'four', 'five', 'count', 'number'],
    target_structures: [
      'Count: one, two, three, four, five.',
      'I have ___ ___s.',
      'How many ___s?',
    ],
    learning_objectives: [
      {
        en: 'Children can count 1–5 in English',
        mr: 'मुलं English मध्ये 1 ते 5 पर्यंत मोजू शकतात',
      },
      {
        en: "Children can say 'I have ___ ___s' with numbers 1–5",
        mr: "मुलं 'I have ___ ___s' हे वाक्य 1–5 संख्यांसह बोलू शकतात",
      },
      {
        en: "Children ask and answer 'How many ___s?'",
        mr: "मुलं 'How many ___s?' विचारू आणि उत्तर देऊ शकतात",
      },
    ],
    page_numbers: [9, 10, 11, 12],
    thematic_group: 'Numbers',
    suggested_month: 6,
  },

  {
    id: 'bb-g1-en-04',
    lesson_number: 4,
    title_en: 'My Classroom',
    title_mr: 'माझी वर्गखोली',
    title_hi: 'मेरी कक्षा',
    title_ur: 'میری کلاس',
    vocabulary: ['chair', 'table', 'window', 'door', 'bench', 'wall', 'fan', 'floor'],
    target_structures: [
      'Where is the ___?',
      'The ___ is here.',
      'Point to the ___.',
    ],
    learning_objectives: [
      {
        en: 'Children can name at least 6 classroom objects in English',
        mr: 'मुलं किमान 6 वर्गातील वस्तूंची नावे English मध्ये सांगू शकतात',
      },
      {
        en: "Children respond correctly to 'Where is the ___?' questions",
        mr: "मुलं 'Where is the ___?' प्रश्नांना योग्य उत्तर देऊ शकतात",
      },
      {
        en: "Children follow 'Point to the ___' instructions",
        mr: "मुलं 'Point to the ___' सूचनांचे पालन करू शकतात",
      },
    ],
    page_numbers: [13, 14, 15, 16],
    thematic_group: 'School',
    suggested_month: 6,
  },

  // ── JULY ──────────────────────────────────────────────────────────────────

  {
    id: 'bb-g1-en-05',
    lesson_number: 5,
    title_en: 'My Body',
    title_mr: 'माझे शरीर',
    title_hi: 'मेरा शरीर',
    title_ur: 'میرا جسم',
    vocabulary: [
      'head', 'eyes', 'ears', 'nose', 'mouth',
      'hands', 'feet', 'shoulders', 'knees', 'fingers',
    ],
    target_structures: [
      'I have two ___s.',
      'Touch your ___.',
      'This is my ___.',
    ],
    learning_objectives: [
      {
        en: 'Children can name at least 8 body parts in English',
        mr: 'मुलं किमान 8 शरीराचे अवयव English मध्ये सांगू शकतात',
      },
      {
        en: "Children respond correctly to 'Touch your ___' commands",
        mr: "मुलं 'Touch your ___' commands ला योग्यरित्या respond करू शकतात",
      },
      {
        en: 'Children can sing the Head-Shoulders-Knees-and-Toes song',
        mr: 'मुलं Head-Shoulders-Knees-and-Toes गाणे म्हणू शकतात',
      },
    ],
    page_numbers: [17, 18, 19, 20],
    thematic_group: 'Body',
    suggested_month: 7,
  },

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

  {
    id: 'bb-g1-en-07',
    lesson_number: 7,
    title_en: 'Colors',
    title_mr: 'रंग',
    title_hi: 'रंग',
    title_ur: 'رنگ',
    vocabulary: [
      'red', 'blue', 'yellow', 'green',
      'black', 'white', 'orange', 'pink', 'purple', 'brown',
    ],
    target_structures: [
      'The ___ is ___.',
      'I like ___.',
      'What color is this?',
    ],
    learning_objectives: [
      {
        en: 'Children can name at least 8 colors in English',
        mr: 'मुलं किमान 8 रंगांची नावे English मध्ये सांगू शकतात',
      },
      {
        en: "Children describe objects using 'The ___ is ___'",
        mr: "मुलं 'The ___ is ___' वापरून वस्तूंचे वर्णन करू शकतात",
      },
      {
        en: "Children ask and answer 'What color is this?'",
        mr: "मुलं 'What color is this?' विचारू आणि उत्तर देऊ शकतात",
      },
    ],
    page_numbers: [25, 26, 27, 28],
    thematic_group: 'Colors',
    suggested_month: 7,
  },

  {
    id: 'bb-g1-en-08',
    lesson_number: 8,
    title_en: 'Animals',
    title_mr: 'प्राणी',
    title_hi: 'जानवर',
    title_ur: 'جانور',
    vocabulary: [
      'cat', 'dog', 'cow', 'bird', 'fish',
      'elephant', 'lion', 'horse', 'monkey', 'rabbit',
    ],
    target_structures: [
      'I see a ___.',
      'The ___ says ___.',
      'The ___ is big / small.',
    ],
    learning_objectives: [
      {
        en: 'Children can name at least 8 common animals in English',
        mr: 'मुलं किमान 8 प्राण्यांची नावे English मध्ये सांगू शकतात',
      },
      {
        en: "Children say animal sounds using 'The ___ says ___'",
        mr: "मुलं 'The ___ says ___' वापरून प्राण्यांचे आवाज सांगू शकतात",
      },
      {
        en: "Children describe animals with 'big' and 'small'",
        mr: "मुलं 'big' आणि 'small' वापरून प्राण्यांचे वर्णन करू शकतात",
      },
    ],
    page_numbers: [29, 30, 31, 32],
    thematic_group: 'Animals',
    suggested_month: 7,
  },

  // ── AUGUST ────────────────────────────────────────────────────────────────

  {
    id: 'bb-g1-en-09',
    lesson_number: 9,
    title_en: 'Fruits',
    title_mr: 'फळे',
    title_hi: 'फल',
    title_ur: 'پھل',
    vocabulary: [
      'mango', 'banana', 'apple', 'orange',
      'grapes', 'coconut', 'guava', 'papaya', 'watermelon',
    ],
    target_structures: [
      'I like ___.',
      'This is a ___.',
      'Give me a ___, please.',
    ],
    learning_objectives: [
      {
        en: 'Children can name at least 7 fruits in English',
        mr: 'मुलं किमान 7 फळांची नावे English मध्ये सांगू शकतात',
      },
      {
        en: "Children express food preference using 'I like ___'",
        mr: "मुलं 'I like ___' वापरून खाण्याची आवड व्यक्त करू शकतात",
      },
      {
        en: "Children make polite requests: 'Give me a ___, please'",
        mr: "मुलं 'Give me a ___, please' वापरून विनम्र विनंती करू शकतात",
      },
    ],
    page_numbers: [33, 34, 35, 36],
    thematic_group: 'Food',
    suggested_month: 8,
  },

  {
    id: 'bb-g1-en-10',
    lesson_number: 10,
    title_en: 'Vegetables',
    title_mr: 'भाज्या',
    title_hi: 'सब्ज़ियाँ',
    title_ur: 'سبزیاں',
    vocabulary: [
      'tomato', 'potato', 'onion', 'carrot',
      'spinach', 'pumpkin', 'brinjal', 'beans', 'cabbage',
    ],
    target_structures: [
      'We need ___.',
      'I eat ___ every day.',
      'Do you like ___?',
    ],
    learning_objectives: [
      {
        en: 'Children can name at least 7 vegetables in English',
        mr: 'मुलं किमान 7 भाज्यांची नावे English मध्ये सांगू शकतात',
      },
      {
        en: "Children say 'I eat ___ every day'",
        mr: "मुलं 'I eat ___ every day' बोलू शकतात",
      },
      {
        en: "Children ask 'Do you like ___?' and give a yes/no answer",
        mr: "मुलं 'Do you like ___?' विचारू आणि होय/नाही उत्तर देऊ शकतात",
      },
    ],
    page_numbers: [37, 38, 39, 40],
    thematic_group: 'Food',
    suggested_month: 8,
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
