import { NextRequest, NextResponse } from "next/server";
import { anthropicMessages } from "@/lib/api-utils";

const ACTION_PROMPTS: Record<string, string> = {
  plan_lesson: `You are an expert teacher trainer for municipal schools in Maharashtra, India.
Look at this textbook page carefully. Generate a COMPLETE lesson plan for teaching this content.
Use the 7-phase lesson wrapper:
1. **Hook** (2-3 min) — An engaging opener to grab attention
2. **Prior Knowledge** (3-4 min) — Connect to what students already know
3. **Core Teaching** (10-12 min) — Main teaching with step-by-step instructions
4. **Guided Practice** (5-7 min) — Teacher-led practice with students
5. **Independent Practice** (5-7 min) — Students practice on their own
6. **Assessment / Check for Understanding** (3-5 min) — Quick check questions
7. **Closure** (2-3 min) — Summary and exit ticket

Include:
- Learning objectives (Bloom's taxonomy)
- Vocabulary from the page
- TLM (Teaching Learning Materials) needed
- Classroom management tips
- Time allocation for each phase
Format each phase clearly with Teacher Says and Student Does sections.`,

  design_assessment: `You are an assessment design expert for Grade 1-5 English in Maharashtra municipal schools.
Look at this textbook page carefully. Create a comprehensive assessment based on this content.
Include:
- **5 Oral Questions** (for teacher to ask verbally)
- **5 Fill in the Blanks** (with word bank)
- **3 Match the Following** pairs
- **3 True or False** statements
- **2 Picture-based Questions** (describe what to draw/show)
- **1 Short Answer Question**
Mark each question with difficulty: Easy / Medium / Hard
Include an answer key at the end.`,

  create_activity: `You are a creative activity designer for primary school classrooms in India.
Look at this textbook page carefully. Design 3 engaging classroom activities based on this content.
For each activity include:
- **Activity Name** (fun, catchy name)
- **Type**: Game / Role-play / Art & Craft / Group work / Pair work
- **Time needed**: minutes
- **Materials needed** (use only what's available in municipal schools)
- **Step-by-step instructions** (numbered, clear)
- **What students learn** from this activity
- **Classroom management tip**
Make activities suitable for classes of 30-40 students with limited resources.`,

  make_flashcards: `You are a primary school English vocabulary expert in India.
Look at this textbook page carefully. Extract ONLY words that a teacher would make flashcards for — concrete nouns (things students can see/touch/draw), action verbs (things students can act out), and simple adjectives (describing words students can understand visually).

INCLUDE: animals, fruits, vegetables, body parts, family members, objects, vehicles, food, clothing, colours, actions (run, jump, dance), weather, nature, feelings
EXCLUDE: grammar terms (noun, verb, adjective, singular, plural, tense, vowel, consonant), language names (English, Hindi, Marathi, Urdu), instruction words (read, write, answer, fill, match, complete, choose, tick, underline), abstract concepts (meaning, sentence, paragraph, comprehension, composition), meta words (lesson, unit, page, exercise, activity, example, practice)

For each word provide:
- **word** - simple meaning a child would understand

Example:
- **cat** - a small pet animal that says meow
- **rainbow** - colourful arc in the sky after rain
- **jump** - to push yourself up into the air

List 8-12 flashcard-worthy words from this page. Only words a teacher would hold up in class.`,

  extract_vocabulary: `You are extracting classroom flashcard vocabulary from a textbook page.
List ONLY concrete, visual, teachable words — things a child can see, touch, draw, or act out.

INCLUDE these types:
- Animals: cat, dog, elephant, bird, fish, butterfly
- Food: apple, mango, rice, milk, bread
- Objects: ball, book, pen, umbrella, clock
- People: mother, father, teacher, doctor, farmer
- Body: hand, eye, nose, ear, head
- Nature: sun, rain, tree, flower, river
- Actions: run, jump, sing, dance, eat, sleep
- Places: house, school, garden, market, park
- Colours: red, blue, green, yellow
- Feelings: happy, sad, angry, scared

NEVER include these:
- Grammar terms: noun, verb, adjective, singular, plural, tense, vowel, consonant, pronoun, preposition
- Language names: English, Hindi, Marathi, Urdu, Gujarati, Kannada, Bengali
- Instruction words: read, write, answer, fill, match, complete, tick, underline, circle, choose, practise, revise, listen, repeat, say, look, tell, ask, learn
- Meta words: lesson, unit, page, exercise, activity, example, practice, revision, question, answer, sentence, paragraph, word, meaning, story, poem
- Abstract: comprehension, composition, punctuation, alphabet, spelling, syllable, rhyme, blend, digraph

Format each line as: - **word** - simple child-friendly meaning
List 8-12 words only. Quality over quantity.`,

  create_worksheet: `You are a worksheet designer for primary school English.
Look at this textbook page carefully. Create a printable worksheet with:
- **Section A: Fill in the Blanks** (5 questions with word bank)
- **Section B: Match the Following** (5 pairs)
- **Section C: Rearrange the Words** (3 jumbled sentences)
- **Section D: Answer in One Word** (4 questions)
- **Section E: Write 3 Sentences** about the topic
- **Bonus: Draw and Colour** (1 picture related to the lesson)
Make it suitable for Grade 1-5 students. Include a title and student name/date field at the top.`,

  explain_content: `You are a helpful teaching assistant for municipal school teachers in Maharashtra.
Look at this textbook page carefully and explain:
- **What is this page about?** (2-3 sentence summary)
- **Key concepts** students should learn
- **Vocabulary** with simple meanings
- **How to teach this** (practical tips in 5 steps)
- **Common mistakes** students make with this content
- **Connection** to daily life (how to make it relatable)
Keep language simple. The teacher may be more comfortable in Marathi/Hindi, so use simple English.`,
};

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, action, teacherProfile } = await req.json();

    if (!imageBase64 || !action) {
      return NextResponse.json({ error: "Missing image or action" }, { status: 400 });
    }

    if (typeof imageBase64 === "string" && imageBase64.length > 4_000_000) {
      return NextResponse.json({ error: "Image too large" }, { status: 413 });
    }

    const systemPrompt = ACTION_PROMPTS[action];
    if (!systemPrompt) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const profileContext = teacherProfile
      ? `\nTeacher Profile: ${teacherProfile.name || "Teacher"}, Grade ${teacherProfile.grade || "1"}, Medium: ${teacherProfile.medium || "English"}, Class size: ${teacherProfile.studentCount || "30"} students.`
      : "";

    const result = await anthropicMessages({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: systemPrompt + profileContext,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: "Analyze this textbook page and generate the requested content. Be specific to what you see on this page.",
            },
          ],
        },
      ],
    });

    if (!result.ok) return result.response;

    const text = result.data.content?.[0]?.text;
    if (!text) {
      return NextResponse.json({ error: "Could not analyze the image. Please try again with a clearer photo." }, { status: 502 });
    }

    return NextResponse.json({ result: text });
  } catch (error: unknown) {
    console.error("Scan API error:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
