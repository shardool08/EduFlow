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

### Tab 2: Roadmap Screen

Simple, scrollable year view showing all lessons in sequence.

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
- OTP digits: 32sp+ font, large input boxes
- Auto-read OTP if permission granted
- Retry OTP after 30 seconds

### Screen 2: About You (4 fields)

| # | Field | Type | Notes |
|---|-------|------|-------|
| 1 | Name (तुमचं नाव) | Voice input + text | Mic button is primary |
| 2 | School name (शाळेचं नाव) | Voice input + text | Voice-first pattern |
| 3 | Corporation (महानगरपालिका) | Single select | PMC / PCMC / NMC |
| 4 | English comfort | Single select | Three options with Marathi descriptions |

### Screen 3: About Your Class (4 fields)

| # | Field | Type | Notes |
|---|-------|------|-------|
| 1 | Grade (इयत्ता) | Locked to "Grade 1" | |
| 2 | Section (तुकडी) | Text input | e.g. "1A" |
| 3 | Student count (विद्यार्थी संख्या) | Number picker | Range: 10-80 |
| 4 | Classroom resources | Multi-select | Blackboard, Charts, Story books, Speaker, TV, None |

---

## 4. Planning Conversation Flow (Core Engine)

The conversation is a **structured, guided dialogue** with 7 phases:

```
Phase 1: Set the Objective     → "What should children learn today?"
Phase 2: Plan the Hook         → "How will you grab their attention?"
Phase 3: TLM Audit             → "What materials do you have?"
Phase 4: Choose the Activity   → "Here are 3 activities — which one?"
Phase 5: Plan the Practice     → AI recommends guided/individual/group
Phase 6: Plan the Assessment   → "Here's what to check for..."
Phase 7: Review & Confirm      → "Here's your full plan. Ready?"
```

---

## 5. Printable Output Specifications

### 5.1 Lesson Plan PDF
- A4, portrait, bilingual
- Teacher name, school, date in header
- 7-phase structure with time markers
- Classroom management tips woven throughout
- "Made with Pathshala AI" footer
- B&W safe

### 5.2 Worksheet
- A4, child-facing
- Item types: picture matching, circling, tracing, labeling, drawing
- Instructions in teacher's L1
- B&W optimized

### 5.3 Assessment Sheet (Opt-In)
- A4, 5-8 items
- Scoring guide for teacher
- Generated only on explicit request

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
    hi: string;
    ur: string;
  };
  vocabulary: string[];
  targetStructures: string[];
  learningObjectives: { en: string; mr: string; }[];
  pageNumbers: number[];
  thematicGroup?: string;
  suggestedMonth?: number;
}
```

### Activity Schema
```typescript
interface Activity {
  id: string;
  title: { en: string; mr: string; hi: string; ur: string; };
  type: "song" | "game" | "craft" | "roleplay" | "movement" | "story";
  practiceMode: "guided" | "individual" | "group";
  applicableLessons: string[];
  applicableObjectives: string[];
  minClassSize: number;
  maxClassSize: number;
  requiredResources: string[];
  durationMinutes: number;
  instructions: { en: string; mr: string; hi: string; ur: string; };
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
  grade: 1;
  section: string;
  studentCount: number;
  resources: string[];
  currentLessonId: string;
  completedLessonIds: string[];
  preferredLanguage: "mr" | "hi" | "ur" | "en";
  createdAt: Date;
}
```

---

## 7. AI Prompt Engineering

### System Prompt for Planning Conversation

```
You are Pathshala AI, a warm, patient, experienced English teaching companion
for Grade 1 teachers in Maharashtra municipal corporation schools.

CONVERSATION RULES:
- Speak in teacher's preferred language always.
- Guide through 7 phases: Objective → Hook → TLM Audit →
  Activity Selection → Practice Planning → Assessment → Review.
- Offer 2-3 options at each phase, let teacher choose.
- Keep responses SHORT — 3-5 sentences per turn.
- Be warm and encouraging.
```

---

## 8. Voice Input Implementation

### Speech Recognition Setup
- Provider: Google Cloud Speech-to-Text API
- Languages: mr-IN, hi-IN, en-IN
- Handle code-mixing naturally

### Voice Input UX Flow
1. Teacher taps mic button
2. Visual feedback: mic pulses
3. Interim transcription shown in real-time
4. Confirm | Retry buttons
5. On confirm: send to AI conversation

---

## 9. WhatsApp Share Implementation

1. Teacher confirms plan in Phase 7
2. App generates PDFs
3. Show bundle preview screen
4. "WhatsApp वर पाठवा" button opens native Share sheet

---

## 10. Internationalization (i18n)

```
i18n/
├── mr.json     # Marathi (default)
├── hi.json     # Hindi
├── ur.json     # Urdu
└── en.json     # English
```

---

## 11. Feature Status Matrix

| Feature | Priority | Status |
|---------|----------|--------|
| Phone + OTP auth | P0 | SHIPS |
| Voice-assisted registration | P0 | SHIPS |
| Teacher profile | P0 | SHIPS |
| Camera capture + recognition | P0 | SHIPS |
| Lesson list | P0 | SHIPS |
| Voice-led co-planning (7 phases) | P0 | SHIPS |
| Activity pool | P0 | SHIPS |
| Lesson plan PDF | P0 | SHIPS |
| Worksheet (opt-out) | P0 | SHIPS |
| WhatsApp share | P0 | SHIPS |
| Lesson sequence roadmap | P0 | SHIPS |
| Bilingual UI (4 languages) | P0 | SHIPS |
| Assessment sheet (opt-in) | P1 | AT RISK |
| Monthly pacing layer | P1 | AT RISK |
| Urdu voice input | P2 | SLIPS |
| Text-to-speech | P2 | SLIPS |

---

## 12. Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup: Expo + TypeScript + Zustand + Supabase
- [ ] i18n framework with all 4 language files
- [ ] Registration flow (3 screens + OTP)
- [ ] Voice input component
- [ ] Teacher profile CRUD
- [ ] Navigation structure (3 tabs + planning flow)

### Phase 2: Content & Data (Week 3-4)
- [ ] Index Balbharati Grade 1 English textbook
- [ ] Build activity pool (3 activities per lesson minimum)
- [ ] Camera fingerprinting
- [ ] Lesson data model in Supabase

### Phase 3: Core Engine (Week 5-6)
- [ ] Planning conversation flow: 7-phase guided dialogue
- [ ] Claude API integration
- [ ] Voice → STT → Claude API → response pipeline
- [ ] Activity recommendation engine

### Phase 4: Outputs (Week 7-8)
- [ ] Server-side PDF generation
- [ ] Lesson plan + worksheet PDF templates
- [ ] WhatsApp share integration

### Phase 5: Roadmap & Polish (Week 9-10)
- [ ] Roadmap screen
- [ ] Complete i18n translations
- [ ] Urdu RTL layout support

### Phase 6: QA & Launch (Week 11-12)
- [ ] Test across all 4 mediums
- [ ] Test on Android devices
- [ ] Test PDF printing on school photocopier
- [ ] Soft launch with initial teacher group
