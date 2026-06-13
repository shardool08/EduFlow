# PedaStudio — Development Context

## Chat Summary (Claude → Cursor handoff)

### Product Overview
PedaStudio (formerly EduFlow) is an AI-powered lesson planning companion for municipal school teachers in Maharashtra, India. It supports Grade 1-8 across 10 mediums (Marathi, Hindi, English, Urdu, Gujarati, Kannada, Sindhi, Telugu, Tamil, Bengali + Semi-English).

### User Profile
- Government municipal school teachers earning ₹60,000+/month
- Age: 40+ years, moderate tech comfort
- Schools: PCMC and NMC municipal corporation schools
- Primary need: English lesson planning (English is L2 for most, L1 for English-medium schools)

### Key Product Decisions

1. **Co-creation, not generation** — Teachers must engage in planning decisions. No pre-built ready-made plans. The quick-plan form collects teacher's choices for hook, TLMs, practice style, assessment, then AI generates a plan incorporating those choices.

2. **Two planning paths built:**
   - Quick-plan form (1 API call) — PRIMARY, shown to all teachers
   - Chat-based planning (7+ API calls) — EXISTS but link removed from UI (too expensive)

3. **Flashcard strategy:**
   - Currently: emoji-based from vocabulary in curriculum data (free, instant)
   - In progress: pre-generated AI illustrations via Claude batch + DALL-E/Flux
   - Grade-appropriate: Grade 1-2 = word cards, Grade 3 = phrase cards, Grade 4-5 = sentence pattern cards
   - Scripts ready at scripts/generate-flashcards.mjs and scripts/generate-images.mjs

4. **Two textbooks per grade:**
   - L1 (English medium schools) — "English Balbharati"
   - L2 (Marathi/Hindi/Urdu/etc. medium) — "My English Book"
   - Curriculum index auto-selects based on teacher's registered medium

5. **Pricing: completely free** for teachers. API costs funded by founder.

6. **Cost optimization:** Quick-plan form reduced API costs by 85-90% compared to chat.

### Architecture

- **Frontend:** Next.js 15 App Router, all 'use client' components
- **Styling:** Tailwind CSS v4 with @theme in globals.css (no tailwind.config.js)
- **AI:** Claude Sonnet via Anthropic API
- **Data:** localStorage only (no backend/database)
- **Auth:** Phone + OTP (simulated — any 4 digits work)
- **Theme:** "Charming Seaside" — white headers, teal buttons (#2A7A6A), peach highlights, aqua nav

### Color Tokens (Tailwind v4 in globals.css)
```
primary-50 to primary-900: Steel blue (#496580 is primary-500)
accent-50 to accent-900: Teal (#5BBFB0 is accent-500, #2A7A6A is accent-700)
warm-50 to warm-900: Peach (#FFDBBB is warm-300)
Seaside border: #D0EAE4
Nav background: #F0FAF8
```

### Files Modified in This Session
Every file in app/ and lib/ was touched for:
1. Color theme migration from dark green (#1a3d28) to Charming Seaside
2. Grade 2-5 curriculum data addition
3. Quick-plan feature
4. Scan textbook feature
5. Flashcard selector with print sizes
6. Auth flow (phone + OTP)
7. App rename EduFlow → PedaStudio

### API Routes
- `/api/chat` — Multi-turn chat (deprecated, still works)
- `/api/generate-plan` — Plan generation (accepts customPrompt from quick-plan)
- `/api/scan` — Textbook image analysis (6 action types)
- `/api/worksheet` — Worksheet + flashcard generation
- `/api/images` — Image API (currently unused)

### Immediate TODO
1. Run flashcard generation pipeline
2. Build flashcard UI that loads from pre-generated JSON instead of emoji map
3. Verify Grade 4-5 curriculum against physical textbooks
4. Deploy to Vercel
5. Consider: voice input, notification system, offline PWA

### Cost Analysis
- Current (quick-plan): ~₹35-65/teacher/month
- At 500 teachers: ~₹15-30K/month
- Pre-generated flashcards: one-time ~$15-25, then ₹0 forever
