// Supabase Edge Function: Balbharati page recognition via Claude Vision
// Deploy:  supabase functions deploy recognize-page
// Secret:  supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

import Anthropic from 'npm:@anthropic-ai/sdk@0.27.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// All 24 Balbharati Grade 1 English lessons — kept in sync with lessons.ts
const LESSONS = [
  { id: 'bb-g1-en-01', number: 1,  title: 'Greetings' },
  { id: 'bb-g1-en-02', number: 2,  title: 'My School' },
  { id: 'bb-g1-en-03', number: 3,  title: 'Numbers 1–5' },
  { id: 'bb-g1-en-04', number: 4,  title: 'My Classroom' },
  { id: 'bb-g1-en-05', number: 5,  title: 'My Body' },
  { id: 'bb-g1-en-06', number: 6,  title: 'My Family' },
  { id: 'bb-g1-en-07', number: 7,  title: 'Colors' },
  { id: 'bb-g1-en-08', number: 8,  title: 'Animals' },
  { id: 'bb-g1-en-09', number: 9,  title: 'Fruits' },
  { id: 'bb-g1-en-10', number: 10, title: 'Vegetables' },
  { id: 'bb-g1-en-11', number: 11, title: 'Numbers 6–10' },
  { id: 'bb-g1-en-12', number: 12, title: 'My House' },
  { id: 'bb-g1-en-13', number: 13, title: 'Clothing' },
  { id: 'bb-g1-en-14', number: 14, title: 'Weather' },
  { id: 'bb-g1-en-15', number: 15, title: 'Days of the Week' },
  { id: 'bb-g1-en-16', number: 16, title: 'Action Words' },
  { id: 'bb-g1-en-17', number: 17, title: 'Birds' },
  { id: 'bb-g1-en-18', number: 18, title: 'Shapes' },
  { id: 'bb-g1-en-19', number: 19, title: 'Transport' },
  { id: 'bb-g1-en-20', number: 20, title: 'Community Helpers' },
  { id: 'bb-g1-en-21', number: 21, title: 'Food I Like' },
  { id: 'bb-g1-en-22', number: 22, title: 'My Neighbourhood' },
  { id: 'bb-g1-en-23', number: 23, title: 'Festivals' },
  { id: 'bb-g1-en-24', number: 24, title: 'Good Habits' },
];

const LESSON_LIST_TEXT = LESSONS
  .map((l) => `${l.number}. ${l.title}`)
  .join('\n');

interface RequestBody {
  imageBase64: string;
  mimeType?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { imageBase64, mimeType = 'image/jpeg' }: RequestBody = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ lessonId: null, confidence: 0, error: 'Missing imageBase64' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! });

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 50,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `This is a photo of a page from the Maharashtra Balbharati Grade 1 English textbook "My English Reader".

Which lesson does this page belong to? The lessons are:
${LESSON_LIST_TEXT}

Look for the lesson title, page number, or content clues.
Respond with ONLY the lesson number as a single integer (e.g. "6"), or "0" if you cannot determine.`,
            },
          ],
        },
      ],
    });

    const raw = response.content[0]?.type === 'text' ? response.content[0].text.trim() : '0';
    const lessonNumber = parseInt(raw, 10);

    if (!lessonNumber || isNaN(lessonNumber)) {
      return new Response(
        JSON.stringify({ lessonId: null, confidence: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lesson = LESSONS.find((l) => l.number === lessonNumber);
    return new Response(
      JSON.stringify({
        lessonId: lesson?.id ?? null,
        lessonTitle: lesson?.title ?? null,
        lessonNumber,
        confidence: lesson ? 0.85 : 0,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return new Response(
      JSON.stringify({ lessonId: null, confidence: 0, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
