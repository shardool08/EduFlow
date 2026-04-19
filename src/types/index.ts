// ─── Auth & User ─────────────────────────────────────────────────────────────
export type UserRole = 'student' | 'teacher' | 'parent';
export type Corporation = 'PMC' | 'PCMC' | 'NMC';
export type SupportedLanguage = 'mr' | 'hi' | 'ur' | 'en';
export type EnglishComfort = 'difficult' | 'stumbling' | 'comfortable';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  // Teacher-specific fields (populated during registration)
  school?: string;
  corporation?: Corporation;
  medium?: SupportedLanguage;
  english_comfort?: EnglishComfort;
  section?: string;
  student_count?: number;
  resources?: string[];
  current_lesson_id?: string;
  completed_lesson_ids?: string[];
  preferred_language?: SupportedLanguage;
}

export interface RegistrationData {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
}

// ─── Lesson & Activity (Section 6 schemas) ───────────────────────────────────
export interface BalbharatiLesson {
  id: string;
  lessonNumber: number;
  title: { en: string; mr: string; hi: string; ur: string };
  vocabulary: string[];
  targetStructures: string[];
  learningObjectives: Array<{ en: string; mr: string }>;
  pageNumbers: number[];
  thematicGroup?: string;
  suggestedMonth?: number;
}

export type ActivityType = 'song' | 'game' | 'craft' | 'roleplay' | 'movement' | 'story';
export type PracticeMode = 'guided' | 'individual' | 'group';

export interface Activity {
  id: string;
  title: { en: string; mr: string; hi: string; ur: string };
  type: ActivityType;
  practiceMode: PracticeMode;
  applicableLessons: string[];
  minClassSize: number;
  maxClassSize: number;
  requiredResources: string[];
  durationMinutes: number;
  instructions: { en: string; mr: string; hi: string; ur: string };
  classroomManagementTips: string[];
}

// ─── Planning Conversation (Section 4) ───────────────────────────────────────
export type ConversationPhase = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type MessageRole = 'ai' | 'teacher';

export interface ConversationMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  phase: ConversationPhase;
}

export interface PlanningDecisions {
  objective: string | null;
  hookDescription: string | null;
  tlmStatus: 'have_all' | 'partial' | 'none' | null;
  tlmMissing: string[];
  selectedActivity: Activity | null;
  practiceMode: PracticeMode | null;
  assessmentMethod: string | null;
  includeWorksheet: boolean;
  includeAssessment: boolean;
}

export interface VoiceInputState {
  isRecording: boolean;
  isProcessing: boolean;
  interimTranscript: string;
  finalTranscript: string;
  error: string | null;
}
