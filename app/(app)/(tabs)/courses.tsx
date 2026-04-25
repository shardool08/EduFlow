import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store';
import { getLessonById } from '@/data/lessons';
import type { BalbharatiLesson } from '@/types';

// ── Data ──────────────────────────────────────────────────────────────────────

const SEEDED_IDS = ['bb-g1-en-01', 'bb-g1-en-06'];
const SEEDED_LESSONS = SEEDED_IDS.map(getLessonById).filter(
  (l): l is BalbharatiLesson => l !== undefined,
);

type LessonStatus = 'completed' | 'current' | 'upcoming';

function getStatus(
  lessonId: string,
  currentLessonId: string,
  completedIds: string[],
): LessonStatus {
  if (completedIds.includes(lessonId)) return 'completed';
  if (lessonId === currentLessonId) return 'current';
  return 'upcoming';
}

// ── Screen ─────────────────────────────────────────────────────────────────────

export default function RoadmapScreen() {
  const router = useRouter();
  const { profile } = useAuthStore();

  // Default current lesson to the first seeded lesson if profile has none set
  const currentLessonId = profile?.current_lesson_id ?? SEEDED_IDS[0];
  const completedIds: string[] = profile?.completed_lesson_ids ?? [];
  const completedCount = SEEDED_LESSONS.filter((l) =>
    completedIds.includes(l.id),
  ).length;

  const [expandedId, setExpandedId] = useState<string | null>(currentLessonId);

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.title}>Roadmap</Text>
          <View style={styles.progressBadge}>
            <Text style={styles.progressBadgeText}>
              {completedCount} / {SEEDED_LESSONS.length} lessons
            </Text>
          </View>
        </View>

        {/* ── Progress bar ───────────────────────────────────────────── */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  SEEDED_LESSONS.length > 0
                    ? (completedCount / SEEDED_LESSONS.length) * 100
                    : 0
                }%`,
              },
            ]}
          />
        </View>

        {/* ── Lesson cards ───────────────────────────────────────────── */}
        <View style={styles.roadmap}>
          {SEEDED_LESSONS.map((lesson, index) => {
            const status = getStatus(lesson.id, currentLessonId, completedIds);
            const isExpanded = expandedId === lesson.id;
            const isLast = index === SEEDED_LESSONS.length - 1;

            return (
              <View key={lesson.id}>
                <LessonCard
                  lesson={lesson}
                  status={status}
                  isExpanded={isExpanded}
                  onToggle={() => toggle(lesson.id)}
                  onPlan={() =>
                    router.push(`/(app)/planning/${lesson.id}`)
                  }
                />
                {/* Connector between cards */}
                {!isLast && (
                  <View style={styles.connector}>
                    <View
                      style={[
                        styles.connectorLine,
                        status === 'completed' && styles.connectorLineDone,
                      ]}
                    />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── LessonCard ─────────────────────────────────────────────────────────────────

function LessonCard({
  lesson,
  status,
  isExpanded,
  onToggle,
  onPlan,
}: {
  lesson: BalbharatiLesson;
  status: LessonStatus;
  isExpanded: boolean;
  onToggle: () => void;
  onPlan: () => void;
}) {
  return (
    <View
      style={[
        styles.card,
        status === 'current' && styles.cardCurrent,
        status === 'completed' && styles.cardCompleted,
        status === 'upcoming' && styles.cardUpcoming,
      ]}
    >
      {/* ── Card header (always visible) ── */}
      <Pressable
        style={styles.cardHeader}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={`Lesson ${lesson.lessonNumber}: ${lesson.title.en}`}
      >
        <StatusDot status={status} />

        <View style={styles.cardMeta}>
          <View style={styles.cardTitleRow}>
            <Text
              style={[
                styles.cardTitle,
                status === 'upcoming' && styles.cardTitleMuted,
              ]}
            >
              {lesson.title.en}
            </Text>
            {status === 'current' && (
              <View style={styles.currentPill}>
                <Text style={styles.currentPillText}>Current</Text>
              </View>
            )}
            {status === 'completed' && (
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            )}
          </View>
          <Text style={styles.cardSubtitle}>
            Lesson {lesson.lessonNumber} · {lesson.title.mr}
          </Text>
        </View>

        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={status === 'upcoming' ? '#CBD5E1' : '#94A3B8'}
        />
      </Pressable>

      {/* ── Expanded detail ── */}
      {isExpanded && (
        <View style={styles.detail}>
          {/* Objectives */}
          <Text style={styles.detailLabel}>Learning Objectives</Text>
          {lesson.learningObjectives.map((obj, i) => (
            <View key={i} style={styles.objectiveRow}>
              <Text style={styles.objectiveBullet}>•</Text>
              <Text style={styles.objectiveText}>{obj.en}</Text>
            </View>
          ))}

          {/* Vocabulary */}
          <Text style={[styles.detailLabel, { marginTop: 14 }]}>
            Vocabulary ({lesson.vocabulary.length} words)
          </Text>
          <View style={styles.vocabWrap}>
            {lesson.vocabulary.map((word) => (
              <View key={word} style={styles.vocabChip}>
                <Text style={styles.vocabChipText}>{word}</Text>
              </View>
            ))}
          </View>

          {/* Target structures */}
          {lesson.targetStructures.length > 0 && (
            <>
              <Text style={[styles.detailLabel, { marginTop: 14 }]}>
                Target Structures
              </Text>
              {lesson.targetStructures.map((s) => (
                <Text key={s} style={styles.structureText}>
                  "{s}"
                </Text>
              ))}
            </>
          )}

          {/* CTA */}
          <Pressable
            style={({ pressed }) => [
              styles.planButton,
              pressed && styles.planButtonPressed,
            ]}
            onPress={onPlan}
            accessibilityRole="button"
            accessibilityLabel={`Plan Lesson ${lesson.lessonNumber}`}
          >
            <Ionicons name="create-outline" size={18} color="#FFFFFF" />
            <Text style={styles.planButtonText}>Plan this lesson</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ── StatusDot ──────────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: LessonStatus }) {
  if (status === 'completed') {
    return (
      <View style={[styles.dot, styles.dotCompleted]}>
        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
      </View>
    );
  }
  if (status === 'current') {
    return (
      <View style={styles.dotCurrentOuter}>
        <View style={styles.dotCurrentInner} />
      </View>
    );
  }
  return <View style={[styles.dot, styles.dotUpcoming]} />;
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 24, gap: 20 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 24, fontWeight: '700', color: '#0F172A' },
  progressBadge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  progressBadgeText: { fontSize: 13, fontWeight: '600', color: '#4F46E5' },

  progressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 3,
  },

  roadmap: { gap: 0 },

  connector: { alignItems: 'center', height: 24, justifyContent: 'center' },
  connectorLine: {
    width: 2,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  connectorLineDone: { backgroundColor: '#10B981' },

  // Cards
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
  },
  cardCurrent: {
    borderColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  cardCompleted: { borderColor: '#10B981' },
  cardUpcoming: { borderColor: '#E2E8F0', opacity: 0.75 },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  cardMeta: { flex: 1, gap: 3 },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  cardTitleMuted: { color: '#94A3B8' },
  cardSubtitle: { fontSize: 12, color: '#64748B' },

  currentPill: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  currentPillText: { fontSize: 11, fontWeight: '700', color: '#4F46E5' },

  // Status dots
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCompleted: { backgroundColor: '#10B981' },
  dotUpcoming: { backgroundColor: '#E2E8F0' },
  dotCurrentOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCurrentInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4F46E5',
  },

  // Detail panel
  detail: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 6,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  objectiveRow: { flexDirection: 'row', gap: 6 },
  objectiveBullet: { fontSize: 13, color: '#4F46E5', lineHeight: 20 },
  objectiveText: { flex: 1, fontSize: 13, color: '#334155', lineHeight: 20 },

  vocabWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  vocabChip: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  vocabChipText: { fontSize: 13, color: '#334155', fontWeight: '500' },

  structureText: {
    fontSize: 13,
    color: '#64748B',
    fontStyle: 'italic',
    lineHeight: 20,
  },

  planButton: {
    marginTop: 16,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  planButtonPressed: { opacity: 0.85 },
  planButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
