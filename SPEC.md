# Pathshala AI — v1 Product Specification

> **Mission:** A municipal corporation Grade 1 English teacher opens the app at 9 PM, points her camera at tomorrow's textbook page (or picks a lesson from a list), and the app walks her through planning a complete 40-minute lesson. She speaks in her language; the app thinks with her. By the time she's done, she has a lesson plan, a worksheet, and materials she's been guided to check or make by hand. She shares the bundle to WhatsApp and walks into class tomorrow prepared.

---

## 1. Context & Constraints

### Who We Serve
- **Teachers:** Grade 1 English (L2) teachers in PCMC and NMC municipal corporation schools
- **Mediums:** Marathi, Hindi, Urdu, English
- **Curriculum:** SCERT Maharashtra / Balbharati Grade 1 English textbook
- **Pedagogy:** NCF — Foundational Stage (play-based, oral-first, multisensory)

### User Persona: "Sunita Tai"
- Age: 42-55 years old
- 20+ years teaching Marathi/EVS, assigned English recently
- Uses WhatsApp daily, makes UPI payments — functional but not fluent with apps
- Does NOT type comfortably in English; even Marathi typing is slow
- Most fluent mode of communication: speaking
- Device: Personal Android smartphone, 5.5"+ screen, used in the evening (8-10 PM)
- Pain: "I can do the activity. But I don't know what to do before and after it. And I have no time to figure it out."

### Hard Constraints
- Timeline: 3 months (hard-locked)
- Voice-first: speaking is the primary input, typing is fallback
- Bilingual outputs: teacher instructions in her L1, English content for children
- Designed for 40+ year old users: large fonts, large targets, no hidden UI
- WhatsApp is the primary distribution channel
- All printable PDFs must work in B&W on old school photocopiers
- No printed TLMs — audit what teacher has, guide physical creation

---

## 2. App Architecture

### Screens & Navigation

```
[Splash] → [Auth: Phone + OTP] → [Registration: 3 screens] → [First Lesson Setup]
                                                                       ↓
                                                              [Main App: 3 tabs]
                                                              ├── Home (Camera + Lesson List)
                                                              ├── Roadmap (Year View)
                                                              └── Profile (Settings)
                                                                       ↓
                                                    [Planning Flow: Voice Conversation → Review → Share]
```

### Tab 1: Home Screen

Two equal entry points — no hierarchy between them:

```
┌─────────────────────────────────┐
│  📷  पाठ्यपुस्तकाचा              │
│       photo घ्या                 │
│  (Take textbook photo)          │
├─────────────────────────────────┤
│  📖  धडा निवडा                   │
│       (Pick a lesson)           │
│                                 │
│  ✅ Lesson 5: My Body           │
│  ▶  Lesson 6: My Family  ← Next│
│     Lesson 7: Colors            │
│     Lesson 8: Animals           │
│     ...                         │
└─────────────────────────────────┘
│  Auto-suggestion banner:        │
│  "तुम्ही Lesson 5 वर आहात.       │
│   Lesson 6 सुरू करायचे का?"      │
└─────────────────────────────────┘
```

#### Camera Entry Point
- Opens device camera with large viewfinder
- Large shutter button (72dp minimum)
- On capture: send image to recognition engine
- Recognition: match against pre-fingerprinted Balbharati pages
- If recognized: show lesson title, ask "हा धडा आहे का?" (Is this the lesson?) — confirm and proceed
- If NOT recognized: show friendly message "हा धडा ओळखता येत नाहीये. कृपया list मधून निवडा" and show lesson list
- Camera UI: no complicated framing guides — just point and shoot

#### Lesson List Entry Point
- Scrollable list of ALL Balbharati Grade 1 English lessons
- Each lesson shows: lesson number, title (English + Marathi), status icon (✅ completed, ▶ current, ○ upcoming)
- Current lesson is highlighted and auto-scrolled to
- Tapping any lesson starts the planning conversation

#### Auto-Suggestion
- Banner at bottom of home screen: "You're on Lesson 5. Start Lesson 6?"
- One-tap to begin planning the next lesson
- Based on teacher's last completed lesson

---

### Tab 2: Roadmap Screen

Simple, scrollable year view showing all lessons in sequence.

```
┌──────────────────────────────────┐
│  📋 वार्षिक आराखडा               │
│     (Annual Roadmap)             │
│                                  │
│  ── Completed ──                 │
│  ✅ 1. Greetings                 │
│  ✅ 2. My School                 │
│  ✅ 3. Numbers 1-5               │
│  ✅ 4. My Classroom              │
│  ✅ 5. My Body                   │
│                                  │
│  ── Current ──                   │
│  ▶  6. My Family         ← You  │
│                                  │
│  ── Upcoming ──                  │
│  ○  7. Colors                    │
│  ○  8. Animals                   │
│  ○  9. Food                      │
│  ...                             │
│                                  │
│  Progress: 5/30 lessons (17%)    │
│  ████░░░░░░░░░░░░░░░░░░░░░░     │
└──────────────────────────────────┘
```

#### Lesson Detail (on tap)
- Title (English + Marathi)
- Learning objectives (2-3 bullet points from Balbharati)
- Key vocabulary for this lesson
- Status: not started / in progress / completed
- "Plan this lesson" button → goes to planning conversation

#### Monthly Pacing Layer (AT RISK)
- If SCERT annual plan data is available: overlay month headers ("June", "July", etc.)
- If not available: ship without month labels, just sequential list

---

### Tab 3: Profile Screen

- Teacher name, school, corporation
- English comfort level (editable)
- Class details: section, student count, resources
- Current lesson position
- Language preference toggle (Marathi / Hindi / Urdu / English)
- App version, help/support link

---

## 3. Registration Flow

### Screen 1: Welcome + Phone Verification

```
┌──────────────────────────────────┐
│                                  │
│         नमस्कार! 🙏              │
│                                  │
│  तुमच्या रोजच्या English lesson  │
│  साठी मदतनीस                    │
│                                  │
│  ┌──────────────────────────┐    │
│  │  +91  │  Phone number    │    │
│  └──────────────────────────┘    │
│                                  │
│  ┌──────────────────────────┐    │
│  │     OTP पाठवा             │    │
│  └──────────────────────────┘    │
│                                  │
│  तुमचा नंबर कोणालाही              │
│  दिला जाणार नाही                 │
└──────────────────────────────────┘
```

- OTP digits: 32sp+ font, large input boxes
- Auto-read OTP if permission granted
- Retry OTP after 30 seconds

### Screen 2: About You (4 fields)

| # | Field | Type | Notes |
|---|-------|------|-------|
| 1 | Name (तुमचं नाव) | Voice input + text | Mic button is primary, keyboard is secondary |
| 2 | School name (शाळेचं नाव) | Voice input + text | Same voice-first pattern |
| 3 | Corporation (महानगरपालिका) | Single select | Options: PMC / PCMC / NMC |
| 4 | English comfort | Single select | Three options with Marathi descriptions — see below |

**English comfort options (this field silently controls AI scaffolding depth):**
- "मला English बोलायला अवघड जातं" (I find English difficult) → AI uses full Marathi instructions, phonetic transliteration for English words
- "मी English बोलू शकते, पण कधी कधी अडखळते" (I can speak, sometimes I stumble) → AI uses bilingual instructions
- "मला English आरामात येतं" (I'm comfortable in English) → AI uses mostly English with some Marathi support

### Screen 3: About Your Class (4 fields)

| # | Field | Type | Notes |
|---|-------|------|-------|
| 1 | Grade (इयत्ता) | Locked to "Grade 1" | Show "More grades coming soon" note |
| 2 | Section (तुकडी) | Text input | e.g. "1A", "1 तुकडी अ" |
| 3 | Student count (विद्यार्थी संख्या) | Number picker | Range: 10-80 |
| 4 | Classroom resources | Multi-select with icons | Options: ⬛ Blackboard, 📋 Charts/Flashcards, 📖 Story books, 🔊 Speaker/Audio, 📺 TV/Smartboard, ❌ None of these |

### Post-Registration: First Lesson Setup

Immediately after Screen 3, show:

```
"तुम्ही सध्या Balbharati च्या कोणत्या धड्यावर आहात?"
(Which Balbharati lesson are you currently on?)
```

Scrollable list of all lessons. Teacher taps one. This sets her position on the roadmap.

---

## 4. Planning Conversation Flow (Core Engine)

This is the soul of the app. When a teacher taps a lesson (from camera, list, or roadmap), she enters a voice-led co-planning conversation.

### Conversation Architecture

The conversation is NOT free-form chat. It is a **structured, guided dialogue** with 7 phases that map to the lesson wrapper structure. The AI leads the teacher through each phase, asking questions, offering options, and capturing her decisions.

```
Phase 1: Set the Objective     → "What should children learn today?"
Phase 2: Plan the Hook         → "How will you grab their attention?"
Phase 3: TLM Audit             → "What materials do you have?"
Phase 4: Choose the Activity   → "Here are 3 activities — which one?"
Phase 5: Plan the Practice     → AI recommends guided/individual/group
Phase 6: Plan the Assessment   → "Here's what to check for..."
Phase 7: Review & Confirm      → "Here's your full plan. Ready?"
```

### Phase 1: Set the Objective

AI (voice, in teacher's L1):
> "उद्या Lesson 6 — My Family आहे. या धड्यातून मुलांनी काय शिकायला हवं?
> मी suggest करू शकते:
> 1. मुलं 6 family members ची नावं English मध्ये सांगू शकतील
> 2. मुलं 'This is my ___' हे वाक्य बोलू शकतील
> 3. दोन्ही
> तुम्हाला काय योग्य वाटतं?"

Teacher speaks her choice. AI confirms and moves to Phase 2.

**Implementation notes:**
- Objectives are pre-mapped per Balbharati lesson in the content database
- AI offers 2-3 options, teacher picks or modifies
- If teacher says something custom, AI incorporates it
- The selected objective is referenced throughout the remaining phases

### Phase 2: Plan the Hook (5 min)

AI:
> "छान. मुलांचं लक्ष वेधण्यासाठी तुम्ही काय कराल?
> एक idea: तुम्ही स्वतःच्या family चा photo दाखवा आणि English मध्ये सांगा 'This is my family.'
> किंवा: मुलांना विचारा 'तुमच्या घरी कोण कोण आहे?' — मराठीत, मग English words introduce करा.
> काय करायचं?"

Teacher speaks. AI captures her choice and moves on.

### Phase 3: TLM Audit

AI:
> "या धड्यासाठी family members चे flashcards लागतील — आई, बाबा, ताई, दादा, आजी, आजोबा.
> तुमच्याकडे हे flashcards आहेत का?"

**If teacher says yes:** AI moves on.
**If teacher says partially:** AI identifies what's missing and guides physical creation.
**If teacher says no:** AI walks her through making them:
> "ठीक आहे. तुमच्याकडे जुनी notebook किंवा chart paper आहे का? एक page फाडा आणि सहा भागात कापा. आता पहिल्या तुकड्यावर आईचा साधा चेहरा काढा..."

### Phase 4: Choose the Activity (10-15 min block)

AI presents 2-3 curated activities from the activity pool, matched to:
- The selected objective
- The teacher's available resources
- The class size
- The practice mode (guided/individual/group)

> "या objective साठी तीन activities आहेत:
> 1. 🎵 Action Song: 'This is my mother, this is my father...' — गाणं शिकवा, मुलं follow करतात
> 2. 🃏 Flashcard Game: flashcards दाखवा, मुलं English मध्ये बोलतात — pairs मध्ये
> 3. ✋ Point and Say: तुम्ही family member बोला, मुलं picture कडे point करतात
> तुमच्या वर्गाला (38 मुलं) pairs मधला flashcard game चांगला जाईल. तुम्हाला काय वाटतं?"

**AI recommends the best fit** but teacher chooses. The recommendation considers:
- Class size: 38 students → pairs work well, whole-class circle doesn't
- Resources: if she has flashcards (from Phase 3) → flashcard game is viable
- Age appropriateness: Grade 1 → action songs and games over worksheets

### Phase 5: Plan the Practice

Based on the chosen activity, AI recommends practice mode:

> "38 मुलांसाठी guided practice आधी करू — तुम्ही 2-3 examples दाखवा, मग pairs मध्ये practice करू द्या.
> Classroom tip: प्रत्येक pair मध्ये एक confident मूल ठेवा — त्यांना leader बनवा."

This is where classroom management tips are woven in contextually.

### Phase 6: Plan the Assessment

AI embeds assessment in the plan:
> "Check for understanding: activity नंतर 5 random मुलांना विचारा 'Who is this?' flashcard दाखवून.
> Exit token: प्रत्येक मूल दारातून बाहेर जाताना एक family member English मध्ये बोलेल.
> Written assessment sheet हवी आहे का? (optional)"

If teacher says yes to written assessment → generate printable assessment sheet.

### Phase 7: Review & Confirm

AI reads back the complete plan:
> "तुमचा उद्याचा plan तयार आहे:
> Hook: तुमच्या family चा photo दाखवणे (5 min)
> Prior knowledge: 'घरी कोण कोण?' विचारणे (3 min)
> Core teaching: flashcards ने 6 family members introduce (8 min)
> Practice: Flashcard game in pairs (12 min)
> Check: 5 random मुलांना 'Who is this?' (4 min)
> Exit token: दारातून बाहेर जाताना 1 family member बोलणे (3 min)
> Closure: उद्या काय शिकणार ते सांगणे (2 min)
> Worksheet: हो
> Assessment sheet: नाही
>
> काही बदल करायचे आहेत?"

If teacher confirms → generate the bundle (lesson plan PDF + worksheet + assessment if opted in).

### Conversation UI

```
┌──────────────────────────────────┐
│  ← Back          Lesson 6       │
│                  My Family       │
├──────────────────────────────────┤
│                                  │
│  AI message bubble (Marathi)     │
│  "या धड्यासाठी तीन activities   │
│   आहेत..."                       │
│                                  │
│         Teacher's response       │
│         "पहिला action song"     │
│                                  │
│  AI message bubble               │
│  "छान! Action song साठी..."     │
│                                  │
├──────────────────────────────────┤
│                                  │
│     ┌──────────────────┐         │
│     │   🎤  बोला       │         │
│     │   (56dp+ height) │         │
│     └──────────────────┘         │
│                                  │
│     ⌨ Type instead              │
└──────────────────────────────────┘
```

- Mic button: 56dp+ height, full width, prominent color
- "Type instead" link: small, below mic button, opens keyboard
- AI messages: displayed as text bubbles with an option to listen (text-to-speech — AT RISK feature)
- Teacher messages: transcribed speech shown in a different-colored bubble
- Progress indicator: subtle dots or steps showing which planning phase they're in (1 of 7)

---

## 5. Printable Output Specifications

### 5.1 Lesson Plan PDF

**File:** A4, portrait, single page if possible (two pages max)

```
┌─────────────────────────────────────────┐
│  Pathshala AI                    Date   │
│  Teacher: Sunita Patil                  │
│  School: PMC School No. 47, Kothrud     │
│  Lesson 6: My Family                   │
│  Objective: मुलं 6 family members ची     │
│  नावं English मध्ये सांगू शकतील          │
├─────────────────────────────────────────┤
│                                         │
│  🎯 Hook (0-5 min)                      │
│  तुमच्या family चा photo दाखवा.         │
│  English मध्ये सांगा: "This is my       │
│  family."                               │
│  💡 Tip: सर्व मुलांना उभे करा —         │
│  सर्वांचे लक्ष वेधा.                     │
│                                         │
│  📋 Prior Knowledge (5-8 min)           │
│  विचारा: "तुमच्या घरी कोण कोण आहे?"    │
│  ऐका: आई, बाबा, ताई, दादा...           │
│  मराठीतून English words introduce        │
│  करा.                                    │
│                                         │
│  📖 Core Teaching (8-16 min)            │
│  Flashcards एक एक दाखवा.               │
│  प्रत्येक card साठी:                     │
│  1. English word बोला: "Mother"         │
│  2. मुलांना repeat करायला सांगा          │
│  3. Marathi मध्ये explain करा:           │
│     "Mother म्हणजे आई"                  │
│  💡 Tip: शांत मुलांना specifically       │
│  विचारा — confident मुलांना सोडा.       │
│                                         │
│  🎮 Practice: Flashcard Game in Pairs   │
│  (16-28 min)                            │
│  Guided: तुम्ही 2 examples दाखवा.       │
│  Pairs: एक मूल card दाखवतं, दुसरं       │
│  English word बोलतं.                    │
│  💡 Tip: प्रत्येक pair मध्ये एक          │
│  confident मूल ठेवा.                    │
│                                         │
│  ✅ Check for Understanding (28-33 min) │
│  5 random मुलांना flashcard दाखवून       │
│  विचारा: "Who is this?"                │
│  बघा: hesitation, wrong answer,         │
│  confusion                              │
│                                         │
│  🚪 Exit Token (33-36 min)             │
│  प्रत्येक मूल दारातून बाहेर जाताना       │
│  एक family member English मध्ये         │
│  बोलेल.                                 │
│                                         │
│  🔚 Closure (36-40 min)                │
│  Recap: "आज आपण family शिकलो."         │
│  Preview: "उद्या आपण Colors             │
│  शिकणार आहोत!"                          │
│                                         │
├─────────────────────────────────────────┤
│  Made with Pathshala AI                 │
└─────────────────────────────────────────┘
```

**Design rules:**
- Fonts: Noto Sans Devanagari (16pt body, 20pt headers), Noto Sans (Latin)
- Phase headers: bold, colored icon prefix
- Classroom management tips: indented, prefixed with 💡, slightly different background
- Time markers on every phase
- B&W safe: icons can be emoji or simple Unicode symbols that print well

### 5.2 Worksheet

**File:** A4, portrait, child-facing

- Header: Lesson title, child's name line ("नाव: ___________"), date line
- Content types for Grade 1 English:
  - Picture matching: draw line from word to picture
  - Circling: circle the correct picture for the word
  - Tracing: trace the English word (large, dotted letters)
  - Labeling: write the word under the picture (with dotted guide)
  - Drawing: draw your family and label in English
- Large illustrations from curated library
- Instructions in teacher's L1 (small text at top): "मुलांना सांगा: picture बघा आणि English word लिहा"
- B&W optimized: thick outlines, no color-dependent content
- Footer: "Made with Pathshala AI" + lesson number

### 5.3 Assessment Sheet (Opt-In, AT RISK)

**File:** A4, portrait, 5-8 items

- Same design language as worksheet
- Item types: picture recognition, word-picture matching, simple labeling, circling
- Scoring guide for teacher at the bottom (small text): "3+ correct = strong, 2 = developing, 0-1 = needs support"
- Generated only when teacher explicitly requests during Phase 6

---

## 6. Content Data Model

### Balbharati Lesson Schema
```typescript
interface BalbharatiLesson {
  id: string;                    // "bb-g1-en-06"
  lessonNumber: number;          // 6
  title: {
    en: string;                  // "My Family"
    mr: string;                  // "माझे कुटुंब"
    hi: string;                  // "मेरा परिवार"
    ur: string;                  // "میرا خاندان"
  };
  vocabulary: string[];          // ["mother", "father", "sister", ...]
  targetStructures: string[];    // ["This is my ___"]
  learningObjectives: {
    en: string;
    mr: string;
  }[];
  pageNumbers: number[];         // [24, 25] — for camera fingerprinting
  thematicGroup?: string;        // "Self and Family"
  suggestedMonth?: number;       // 7 (July) — if SCERT plan available
}
```

### Activity Schema
```typescript
interface Activity {
  id: string;
  title: { en: string; mr: string; hi: string; ur: string; };
  type: "song" | "game" | "craft" | "roleplay" | "movement" | "story";
  practiceMode: "guided" | "individual" | "group";
  applicableLessons: string[];   // lesson IDs
  applicableObjectives: string[];
  minClassSize: number;
  maxClassSize: number;
  requiredResources: string[];   // ["flashcards", "blackboard"]
  durationMinutes: number;       // 10-15
  instructions: {
    en: string;
    mr: string;
    hi: string;
    ur: string;
  };
  classroomManagementTips: string[];
}
```

### Teacher Profile Schema
```typescript
interface TeacherProfile {
  id: string;
  phone: string;
  name: string;
  school: string;
  corporation: "PMC" | "PCMC" | "NMC";
  medium: "mr" | "hi" | "ur" | "en";
  englishComfort: "difficult" | "stumbling" | "comfortable";
  grade: 1;                     // locked in v1
  section: string;
  studentCount: number;
  resources: string[];          // ["blackboard", "flashcards", ...]
  currentLessonId: string;      // "bb-g1-en-06"
  completedLessonIds: string[];
  preferredLanguage: "mr" | "hi" | "ur" | "en";
  createdAt: Date;
}
```

---

## 7. AI Prompt Engineering

### System Prompt for Planning Conversation

The Claude API system prompt must encode:
1. The teacher's profile (name, comfort level, class size, resources, medium)
2. The selected Balbharati lesson (vocabulary, objectives, structures)
3. Available activities for this lesson
4. The 7-phase conversation structure
5. Language rules (respond in teacher's L1, English content for children)
6. Classroom management awareness (class size determines tips)
7. TLM audit protocol

```
You are Pathshala AI, a warm, patient, experienced English teaching companion
for Grade 1 teachers in Maharashtra municipal corporation schools.

You are speaking with {teacher.name}, who teaches at {teacher.school}
({teacher.corporation}). She has {teacher.studentCount} students in her class.
Her English comfort level is: {teacher.englishComfort}.
She has these resources in her classroom: {teacher.resources}.

Today she is planning: {lesson.title.en} (Lesson {lesson.lessonNumber}).
Key vocabulary: {lesson.vocabulary}
Target structures: {lesson.targetStructures}
Learning objectives: {lesson.learningObjectives}

CONVERSATION RULES:
- Speak in {teacher.preferredLanguage} always. Use English only for
  the actual English content children will learn.
- You are guiding her through 7 phases: Objective → Hook → TLM Audit →
  Activity Selection → Practice Planning → Assessment → Review.
- At each phase, offer 2-3 options and ask her to choose.
- RECOMMEND the best option based on her class size and resources,
  but always let her decide.
- Weave classroom management tips naturally into your suggestions.
  For a class of {teacher.studentCount}:
  - If >40: suggest pair work, group rotation, avoid whole-class circles
  - If 20-40: pairs and small groups both work
  - If <20: whole-class activities, circle time, individual attention
- For TLM audit: ask what she has, never generate printables.
  If she's missing something critical, guide her to make it by hand.
- Keep your responses SHORT — 3-5 sentences per turn. This is a
  conversation, not a lecture.
- Be warm, encouraging, and respectful of her experience. She is a
  skilled teacher. You are helping her structure, not teaching her
  how to teach.
- End each turn with a clear question that moves to the next phase.

ENGLISH COMFORT SCAFFOLDING:
- If "difficult": Use full {teacher.preferredLanguage} instructions.
  Transliterate English words phonetically. Example: "Mother (मदर)"
- If "stumbling": Use bilingual instructions. English words in English
  script with L1 explanation nearby.
- If "comfortable": Use mostly English with occasional L1 support.

AVAILABLE ACTIVITIES FOR THIS LESSON:
{activities}

After all 7 phases, generate the final lesson plan summary and ask
for confirmation.
```

### Worksheet Generation Prompt
```
Generate a Grade 1 English worksheet for: {lesson.title}
Vocabulary: {lesson.vocabulary}
Target structure: {lesson.targetStructures}

Rules:
- 4-6 items maximum (Grade 1 attention span)
- Use only these item types: picture matching, circling, tracing, labeling, drawing
- Instructions to teacher in {teacher.preferredLanguage}
- Student-facing content in simple English
- Every item must have a picture reference (use illustration IDs from the library)
- Large fonts (18pt+), thick outlines, B&W safe
- Output as structured JSON that the PDF template can render
```

---

## 8. Voice Input Implementation

### Speech Recognition Setup
- Provider: Google Cloud Speech-to-Text API
- Languages: `mr-IN` (Marathi), `hi-IN` (Hindi), `en-IN` (English)
- Auto-detect language based on teacher's preferred language setting
- Enable interim results for real-time transcription feedback
- Handle code-mixing: teachers naturally mix English words into Marathi/Hindi speech

### Voice Input UX Flow
```
1. Teacher taps mic button (🎤)
2. Visual feedback: mic icon pulses, recording indicator appears
3. Audio recorded and streamed to STT
4. Interim transcription shown in real-time (light text)
5. Teacher stops speaking (auto-detect silence after 2 seconds, or tap to stop)
6. Final transcription shown in bold
7. Two buttons: ✓ Confirm  |  🔄 Retry
8. On confirm: send transcribed text to AI conversation
```

### Fallback
- If STT fails or returns low confidence: show "ओळखता आलं नाही. पुन्हा बोला किंवा type करा" (Couldn't recognize. Speak again or type.)
- Keyboard input always available via "⌨ Type instead" link below mic button

---

## 9. WhatsApp Share Implementation

### Share Flow
1. Teacher confirms lesson plan in Phase 7
2. App generates PDFs (lesson plan + worksheet + assessment if opted in)
3. Show "Share" screen with bundle preview:
   - Lesson plan PDF thumbnail
   - Worksheet PDF thumbnail
   - Assessment PDF thumbnail (if generated)
4. Large "WhatsApp वर पाठवा" button
5. Opens native Share sheet with PDFs attached
6. Teacher picks WhatsApp contact or group

### Technical Notes
- Use React Native's `Share` API or `react-native-share` for multi-file sharing
- PDFs generated server-side, downloaded to device, then shared
- Each PDF should be under 5MB (WhatsApp limit)
- File naming: `Lesson_6_My_Family_Plan.pdf`, `Lesson_6_My_Family_Worksheet.pdf`

---

## 10. Illustration Library

### Scope
- ~150 curated illustrations covering all Balbharati Grade 1 English lessons
- Categories: family members, body parts, animals, food, colors, school objects, daily actions, nature
- Generated using AI image generation with consistent style

### Style Guide
- Flat illustration style, soft warm colors
- Thick outlines (2-3px) — critical for B&W photocopying
- Indian context: Indian clothing, Indian families, Indian school settings
- Consistent character style across all illustrations
- No text in illustrations (text is added by the PDF template)
- Square aspect ratio (1:1) for flexible layout
- Export: PNG, 512x512px minimum, transparent background

### Storage
- Hosted on CDN (Supabase Storage or similar)
- Cached on device after first download
- Each illustration tagged with: lesson IDs, vocabulary words, category

---

## 11. Internationalization (i18n)

### File Structure
```
i18n/
├── mr.json     # Marathi (default)
├── hi.json     # Hindi
├── ur.json     # Urdu
└── en.json     # English
```

### Key Categories
```json
{
  "auth": { "welcome": "नमस्कार!", "sendOtp": "OTP पाठवा", ... },
  "registration": { "yourName": "तुमचं नाव", "schoolName": "शाळेचं नाव", ... },
  "home": { "takePhoto": "पाठ्यपुस्तकाचा photo घ्या", "pickLesson": "धडा निवडा", ... },
  "planning": { "speak": "बोला", "typeInstead": "Type करा", "confirm": "हो", ... },
  "roadmap": { "annualRoadmap": "वार्षिक आराखडा", "completed": "पूर्ण", ... },
  "share": { "shareToWhatsapp": "WhatsApp वर पाठवा", ... },
  "common": { "back": "मागे", "next": "पुढे", "cancel": "रद्द करा", ... }
}
```

### Urdu-Specific
- Use `I18nManager.forceRTL(true)` when Urdu is selected
- Font: Noto Nastaliq Urdu
- Test all screens for RTL layout — padding, icons, navigation direction all flip

---

## 12. Feature Status Matrix

| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| Phone + OTP auth | P0 | SHIPS | |
| Voice-assisted registration | P0 | SHIPS | |
| Teacher profile (9 fields) | P0 | SHIPS | |
| Camera capture + recognition | P0 | SHIPS | Pre-fingerprint textbook pages |
| Lesson list | P0 | SHIPS | |
| Auto-suggestion | P1 | SHIPS | |
| Voice-led co-planning (7 phases) | P0 | SHIPS | Core engine |
| Activity pool | P0 | SHIPS | Curate 3 activities per lesson minimum |
| Practice mode recommendation | P0 | SHIPS | AI recommends guided/individual/group |
| TLM audit + creation guidance | P0 | SHIPS | |
| Check for understanding | P0 | SHIPS | Embedded in plan |
| Exit tokens | P0 | SHIPS | |
| Classroom management tips | P0 | SHIPS | Woven throughout |
| Code-switching cues | P0 | SHIPS | |
| Lesson plan PDF | P0 | SHIPS | |
| Worksheet (opt-out) | P0 | SHIPS | |
| WhatsApp share | P0 | SHIPS | |
| Lesson sequence roadmap | P0 | SHIPS | |
| Bilingual UI (4 languages) | P0 | SHIPS | |
| Curated illustration library | P0 | SHIPS | |
| Assessment sheet (opt-in) | P1 | AT RISK | |
| Monthly pacing layer | P1 | AT RISK | Needs SCERT data |
| Thematic clustering | P2 | AT RISK | |
| Post-lesson voice reflection | P1 | AT RISK | |
| Class response capture | P1 | AT RISK | |
| TLM printables | — | SLIPS | Replaced by audit model |
| Urdu voice input | P2 | SLIPS | Hindi voice used in v1 |
| Text-to-speech (listen mode) | P2 | SLIPS | |
| Interactive roadmap visualization | P2 | SLIPS | |
| NCF competency mapping | P2 | SLIPS | |
| Progress-over-time view | P2 | SLIPS | |
| Dynamic image generation | — | SLIPS | |

---

## 13. Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup: Expo + TypeScript + Zustand + Supabase
- [ ] i18n framework with all 4 language files (skeleton)
- [ ] Registration flow (3 screens + OTP)
- [ ] Voice input component (mic button + Google STT integration)
- [ ] Teacher profile CRUD (Supabase)
- [ ] Navigation structure (3 tabs + planning flow)

### Phase 2: Content & Data (Week 3-4)
- [ ] Index Balbharati Grade 1 English textbook: all lessons, vocabulary, objectives
- [ ] Build activity pool: minimum 3 activities per lesson
- [ ] Camera fingerprinting: photograph and index every textbook page
- [ ] Begin illustration generation (AI + curation pipeline)
- [ ] Lesson data model in Supabase

### Phase 3: Core Engine (Week 5-6)
- [ ] Planning conversation flow: 7-phase guided dialogue
- [ ] Claude API integration with system prompt
- [ ] Voice input → STT → Claude API → response pipeline
- [ ] Conversation UI: message bubbles, mic button, phase indicators
- [ ] Activity recommendation engine (class size + resources + objective)
- [ ] TLM audit conversation logic

### Phase 4: Outputs (Week 7-8)
- [ ] Server-side PDF generation (Express + Puppeteer)
- [ ] Lesson plan PDF template (HTML → PDF)
- [ ] Worksheet PDF template
- [ ] WhatsApp share integration
- [ ] Bundle generation pipeline (plan + worksheet + optional assessment)
- [ ] PDF download + caching on device

### Phase 5: Roadmap & Polish (Week 9-10)
- [ ] Roadmap screen: lesson sequence with progress
- [ ] Home screen: camera + lesson list + auto-suggestion
- [ ] Complete i18n translations (all 4 languages)
- [ ] Illustration library: finalize, curate, upload to CDN
- [ ] Urdu RTL layout support
- [ ] Native speaker review of AI conversation tone

### Phase 6: QA & Launch (Week 11-12)
- [ ] Test across all 4 mediums
- [ ] Test on 3+ Android devices (different screen sizes)
- [ ] Test voice input in Marathi, Hindi, English
- [ ] Test PDF printing (actual school photocopier)
- [ ] Bug fixing
- [ ] Teacher onboarding guide (WhatsApp-shareable video or PDF)
- [ ] Soft launch with initial teacher group

### Slippage Buffer (Week 13-16)
- [ ] Assessment sheet generation
- [ ] Post-lesson voice reflection
- [ ] Monthly pacing layer (if SCERT data obtained)
- [ ] Class response capture
- [ ] Thematic clustering on roadmap

---

## 14. Open Questions (Resolve in Week 1)

| # | Question | Impact | Owner |
|---|----------|--------|-------|
| 1 | Do all L2 mediums use the same Balbharati Grade 1 English textbook? | Camera fingerprinting scope | Team |
| 2 | Does SCERT publish an annual plan for Grade 1 English? | Roadmap monthly pacing | Team |
| 3 | Does Balbharati have a teacher's handbook? | Activity suggestions, TLM lists | Team |
| 4 | Exact lesson count and titles in Balbharati Grade 1 English? | All content features | Obtain textbook |
| 5 | PWA vs React Native final decision? | Dev speed, offline, distribution | Tech lead |
| 6 | Budget for illustration curation (~150 images)? | Timeline for illustration pipeline | Project lead |
| 7 | Native speaker reviewers for Hindi, Urdu, English AI tone? | Quality of multi-language experience | Shardool |
