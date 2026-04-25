import { Audio } from 'expo-av';
import { create } from 'zustand';
import { ADVANCE_PHASE_MARKER, sendChatMessage, type ChatMessage } from '@/lib/anthropic';
import { RECORDING_OPTIONS, requestMicPermission, transcribeAudio } from '@/lib/stt';
import { getActivitiesForLesson, recommendActivity } from '@/data/activities';
import { getLessonById } from '@/data/lessons';
import type {
  Activity,
  BalbharatiLesson,
  ConversationMessage,
  ConversationPhase,
  PlanningDecisions,
  VoiceInputState,
} from '@/types';
import { useAuthStore } from './authStore';

// Stored outside Zustand — Audio.Recording is not serializable
let _activeRecording: Audio.Recording | null = null;

interface ConversationStore {
  lesson: BalbharatiLesson | null;
  activities: Activity[];
  recommendedActivity: Activity | null;
  currentPhase: ConversationPhase;
  messages: ConversationMessage[];
  chatHistory: ChatMessage[];
  decisions: PlanningDecisions;
  voice: VoiceInputState;
  isAiThinking: boolean;
  isComplete: boolean;

  startConversation: (lessonId: string) => Promise<void>;
  sendTeacherMessage: (content: string) => Promise<void>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  confirmTranscript: () => Promise<void>;
  retryRecording: () => void;
  reset: () => void;
}

const EMPTY_DECISIONS: PlanningDecisions = {
  objective: null,
  hookDescription: null,
  tlmStatus: null,
  tlmMissing: [],
  selectedActivity: null,
  practiceMode: null,
  assessmentMethod: null,
  includeWorksheet: true,
  includeAssessment: false,
};

const EMPTY_VOICE: VoiceInputState = {
  isRecording: false,
  isProcessing: false,
  interimTranscript: '',
  finalTranscript: '',
  error: null,
};

function makeMsg(
  role: ConversationMessage['role'],
  content: string,
  phase: ConversationPhase
): ConversationMessage {
  return { id: `${Date.now()}-${Math.random()}`, role, content, timestamp: new Date(), phase };
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
  lesson: null,
  activities: [],
  recommendedActivity: null,
  currentPhase: 1,
  messages: [],
  chatHistory: [],
  decisions: { ...EMPTY_DECISIONS },
  voice: { ...EMPTY_VOICE },
  isAiThinking: false,
  isComplete: false,

  startConversation: async (lessonId: string) => {
    const lesson = getLessonById(lessonId);
    if (!lesson) return;

    const profile = useAuthStore.getState().profile;
    const lessonActivities = getActivitiesForLesson(lessonId);
    const recommended = profile
      ? recommendActivity(lessonActivities, profile.student_count ?? 30, profile.resources ?? [])
      : lessonActivities[0] ?? null;

    set({
      lesson,
      activities: lessonActivities,
      recommendedActivity: recommended,
      currentPhase: 1,
      messages: [],
      chatHistory: [],
      decisions: { ...EMPTY_DECISIONS },
      voice: { ...EMPTY_VOICE },
      isAiThinking: true,
      isComplete: false,
    });

    if (!profile) {
      set({ isAiThinking: false });
      return;
    }

    try {
      const seed: ChatMessage = {
        role: 'user',
        content: `Start Phase 1 for Lesson ${lesson.lessonNumber}: ${lesson.title.en}. Begin by asking about the learning objective.`,
      };
      const aiText = await sendChatMessage([seed], profile, lesson, lessonActivities);
      const { displayText, advancePhase } = parseAiResponse(aiText, 1);

      set((s) => ({
        messages: [...s.messages, makeMsg('ai', displayText, 1)],
        chatHistory: [seed, { role: 'assistant', content: aiText }],
        currentPhase: advancePhase ? 2 : 1,
        isAiThinking: false,
      }));
    } catch {
      set((s) => ({
        messages: [
          ...s.messages,
          makeMsg(
            'ai',
            'माफ करा, AI उपलब्ध नाही. कृपया internet तपासा आणि पुन्हा प्रयत्न करा.\nSorry, the AI assistant is unavailable. Please check your connection and try again.',
            1
          ),
        ],
        isAiThinking: false,
      }));
    }
  },

  sendTeacherMessage: async (content: string) => {
    const { lesson, activities, chatHistory, currentPhase } = get();
    const profile = useAuthStore.getState().profile;
    if (!lesson || !profile) return;

    const updatedHistory: ChatMessage[] = [...chatHistory, { role: 'user', content }];

    set((s) => ({
      messages: [...s.messages, makeMsg('teacher', content, currentPhase)],
      chatHistory: updatedHistory,
      voice: { ...EMPTY_VOICE },
      isAiThinking: true,
    }));

    try {
      const aiText = await sendChatMessage(updatedHistory, profile, lesson, activities);
      const { displayText, advancePhase } = parseAiResponse(aiText, currentPhase);

      const nextPhase: ConversationPhase = advancePhase
        ? Math.min(currentPhase + 1, 7) as ConversationPhase
        : currentPhase;

      // Complete when teacher responds during phase 7 (the review/confirm phase).
      // currentPhase===7 means we were already in phase 7 before this reply;
      // nextPhase===7 means no further advance happened — teacher confirmed the plan.
      const isComplete = currentPhase === 7 && nextPhase === 7;

      set((s) => ({
        messages: [...s.messages, makeMsg('ai', displayText, nextPhase)],
        chatHistory: [...updatedHistory, { role: 'assistant', content: aiText }],
        currentPhase: nextPhase,
        isAiThinking: false,
        isComplete,
      }));
    } catch {
      set((s) => ({
        messages: [
          ...s.messages,
          makeMsg('ai', 'माफ करा, काहीतरी चुकलं. पुन्हा try करा. / Sorry, something went wrong. Please try again.', currentPhase),
        ],
        isAiThinking: false,
      }));
    }
  },

  startRecording: async () => {
    const hasPermission = await requestMicPermission();
    if (!hasPermission) {
      set((s) => ({ voice: { ...s.voice, error: 'Microphone permission denied' } }));
      return;
    }

    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      _activeRecording = new Audio.Recording();
      await _activeRecording.prepareToRecordAsync(RECORDING_OPTIONS);
      await _activeRecording.startAsync();
      set((s) => ({
        voice: { ...s.voice, isRecording: true, error: null, finalTranscript: '', interimTranscript: '' },
      }));
    } catch (err: any) {
      _activeRecording = null;
      set((s) => ({ voice: { ...s.voice, error: err?.message ?? 'Could not start recording' } }));
    }
  },

  stopRecording: async () => {
    if (!_activeRecording) return;

    set((s) => ({ voice: { ...s.voice, isRecording: false, isProcessing: true } }));

    try {
      await _activeRecording.stopAndUnloadAsync();
      const uri = _activeRecording.getURI();
      _activeRecording = null;

      if (!uri) throw new Error('No recording URI');

      const profile = useAuthStore.getState().profile;
      const language = profile?.preferred_language ?? 'mr';
      const transcript = await transcribeAudio(uri, language);

      if (!transcript.trim()) {
        set((s) => ({
          voice: {
            ...s.voice,
            isProcessing: false,
            error: 'ओळखता आलं नाही. पुन्हा बोला किंवा type करा.',
          },
        }));
        return;
      }

      set((s) => ({ voice: { ...s.voice, isProcessing: false, finalTranscript: transcript } }));
    } catch {
      _activeRecording = null;
      set((s) => ({
        voice: {
          ...s.voice,
          isProcessing: false,
          error: 'ओळखता आलं नाही. पुन्हा बोला किंवा type करा.',
        },
      }));
    }
  },

  confirmTranscript: async () => {
    const { voice } = get();
    if (voice.finalTranscript.trim()) {
      await get().sendTeacherMessage(voice.finalTranscript);
    }
  },

  retryRecording: () => set({ voice: { ...EMPTY_VOICE } }),

  reset: () => {
    if (_activeRecording) {
      _activeRecording.stopAndUnloadAsync().catch(() => {});
      _activeRecording = null;
    }
    set({
      lesson: null,
      activities: [],
      recommendedActivity: null,
      currentPhase: 1,
      messages: [],
      chatHistory: [],
      decisions: { ...EMPTY_DECISIONS },
      voice: { ...EMPTY_VOICE },
      isAiThinking: false,
      isComplete: false,
    });
  },
}));

function parseAiResponse(
  raw: string,
  currentPhase: ConversationPhase
): { displayText: string; advancePhase: boolean } {
  const advancePhase = raw.includes(ADVANCE_PHASE_MARKER);
  const displayText = raw.replace(ADVANCE_PHASE_MARKER, '').trim();
  return { displayText, advancePhase };
}
