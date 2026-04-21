-- ============================================================
-- Pathshala AI — Initial Schema
-- ============================================================

-- ── Enable extensions ────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Lessons ──────────────────────────────────────────────────
CREATE TABLE public.lessons (
  id                  TEXT PRIMARY KEY,           -- 'bb-g1-en-06'
  lesson_number       INTEGER NOT NULL UNIQUE,
  title_en            TEXT NOT NULL,
  title_mr            TEXT NOT NULL,
  title_hi            TEXT NOT NULL,
  title_ur            TEXT NOT NULL,
  vocabulary          TEXT[]  NOT NULL DEFAULT '{}',
  target_structures   TEXT[]  NOT NULL DEFAULT '{}',
  learning_objectives JSONB   NOT NULL DEFAULT '[]',  -- [{en, mr}]
  page_numbers        INTEGER[] NOT NULL DEFAULT '{}',
  thematic_group      TEXT,
  suggested_month     INTEGER CHECK (suggested_month BETWEEN 1 AND 12),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── Activities ───────────────────────────────────────────────
CREATE TABLE public.activities (
  id                        TEXT PRIMARY KEY,
  title_en                  TEXT NOT NULL,
  title_mr                  TEXT NOT NULL,
  title_hi                  TEXT NOT NULL,
  title_ur                  TEXT NOT NULL,
  type                      TEXT NOT NULL CHECK (type IN ('song','game','craft','roleplay','movement','story')),
  practice_mode             TEXT NOT NULL CHECK (practice_mode IN ('guided','individual','group')),
  applicable_lessons        TEXT[] NOT NULL DEFAULT '{}',
  min_class_size            INTEGER NOT NULL DEFAULT 10,
  max_class_size            INTEGER NOT NULL DEFAULT 80,
  required_resources        TEXT[] DEFAULT '{}',
  duration_minutes          INTEGER NOT NULL,
  instructions_en           TEXT NOT NULL,
  instructions_mr           TEXT NOT NULL,
  instructions_hi           TEXT NOT NULL,
  instructions_ur           TEXT NOT NULL,
  classroom_management_tips TEXT[] DEFAULT '{}',
  created_at                TIMESTAMPTZ DEFAULT NOW()
);

-- ── Page fingerprints (camera recognition) ───────────────────
CREATE TABLE public.page_fingerprints (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_number  INTEGER NOT NULL,
  lesson_id    TEXT REFERENCES public.lessons(id) ON DELETE SET NULL,
  phash        TEXT,           -- perceptual hash (64-bit hex)
  image_url    TEXT,           -- Supabase Storage reference image URL
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_number)
);

-- ── Teacher profiles ─────────────────────────────────────────
-- Extends Supabase auth.users with teacher-specific fields
CREATE TABLE public.profiles (
  id                   UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email                TEXT NOT NULL,
  full_name            TEXT NOT NULL,
  role                 TEXT NOT NULL DEFAULT 'teacher'
                         CHECK (role IN ('student','teacher','parent')),
  avatar_url           TEXT,
  school               TEXT,
  corporation          TEXT CHECK (corporation IN ('PMC','PCMC','NMC')),
  medium               TEXT CHECK (medium IN ('mr','hi','ur','en')),
  english_comfort      TEXT CHECK (english_comfort IN ('difficult','stumbling','comfortable')),
  section              TEXT,
  student_count        INTEGER CHECK (student_count BETWEEN 1 AND 100),
  resources            TEXT[] DEFAULT '{}',
  current_lesson_id    TEXT REFERENCES public.lessons(id) ON DELETE SET NULL,
  completed_lesson_ids TEXT[] DEFAULT '{}',
  preferred_language   TEXT DEFAULT 'mr' CHECK (preferred_language IN ('mr','hi','ur','en')),
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile stub on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'teacher')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE public.lessons           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;

-- Lessons: public read
CREATE POLICY "lessons_public_read"
  ON public.lessons FOR SELECT USING (true);

-- Activities: public read
CREATE POLICY "activities_public_read"
  ON public.activities FOR SELECT USING (true);

-- Page fingerprints: public read
CREATE POLICY "fingerprints_public_read"
  ON public.page_fingerprints FOR SELECT USING (true);

-- Profiles: user sees own row
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX idx_activities_lessons  ON public.activities USING GIN (applicable_lessons);
CREATE INDEX idx_fingerprints_phash  ON public.page_fingerprints (phash);
CREATE INDEX idx_fingerprints_page   ON public.page_fingerprints (page_number);
