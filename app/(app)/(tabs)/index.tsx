import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store';
import { getLessonById } from '@/data/lessons';
import type { BalbharatiLesson } from '@/types';

// IDs that have been seeded into the database — only these are shown
const SEEDED_IDS = ['bb-g1-en-01', 'bb-g1-en-06'];
const SEEDED_LESSONS = SEEDED_IDS.map(getLessonById).filter(
  (l): l is BalbharatiLesson => l !== undefined,
);

const MONTH_NAMES = [
  '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const { profile } = useAuthStore();
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{t('home.greeting', { name: firstName })}</Text>
            <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
          </View>
          <Pressable
            style={styles.cameraButton}
            onPress={() => router.push('/(app)/camera')}
            accessibilityLabel="Scan textbook page"
          >
            <Ionicons name="camera-outline" size={22} color="#4F46E5" />
          </Pressable>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {([
            { value: '7', label: t('progress.streak') },
            { value: '3', label: t('progress.completed') },
            { value: '12h', label: t('progress.hours') },
          ] as const).map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Lesson list */}
        <Text style={styles.sectionTitle}>{t('home.continueLearning')}</Text>

        {SEEDED_LESSONS.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onPress={() => router.push(`/(app)/planning/${lesson.id}`)}
          />
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

function LessonCard({
  lesson,
  onPress,
}: {
  lesson: BalbharatiLesson;
  onPress: () => void;
}) {
  const monthLabel = lesson.suggestedMonth ? MONTH_NAMES[lesson.suggestedMonth] : null;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Lesson ${lesson.lessonNumber}: ${lesson.title.en}`}
    >
      {/* Accent bar */}
      <View style={styles.cardAccent} />

      {/* Body */}
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View style={styles.badgeRow}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberBadgeText}>{lesson.lessonNumber}</Text>
            </View>
            {monthLabel && (
              <View style={styles.monthBadge}>
                <Text style={styles.monthBadgeText}>{monthLabel}</Text>
              </View>
            )}
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
        </View>

        <Text style={styles.lessonTitle}>{lesson.title.en}</Text>
        <Text style={styles.lessonTitleMr}>{lesson.title.mr}</Text>

        {lesson.thematicGroup && (
          <Text style={styles.thematicGroup}>{lesson.thematicGroup}</Text>
        )}

        <Text style={styles.vocabPreview} numberOfLines={1}>
          {lesson.vocabulary.slice(0, 5).join(' · ')}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 24, gap: 20 },

  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  headerText: { flex: 1, gap: 4 },
  greeting: { fontSize: 24, fontWeight: '700', color: '#0F172A' },
  subtitle: { fontSize: 15, color: '#64748B' },
  cameraButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statValue: { fontSize: 24, fontWeight: '700', color: '#4F46E5' },
  statLabel: { fontSize: 11, color: '#64748B', textAlign: 'center', marginTop: 4 },

  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#0F172A' },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPressed: { opacity: 0.85 },
  cardAccent: { width: 4, backgroundColor: '#4F46E5' },
  cardBody: { flex: 1, padding: 16, gap: 6 },

  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badgeRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadgeText: { fontSize: 13, fontWeight: '700', color: '#4F46E5' },
  monthBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  monthBadgeText: { fontSize: 11, color: '#64748B', fontWeight: '500' },

  lessonTitle: { fontSize: 17, fontWeight: '600', color: '#0F172A' },
  lessonTitleMr: { fontSize: 13, color: '#64748B' },
  thematicGroup: { fontSize: 12, color: '#4F46E5', fontWeight: '500' },
  vocabPreview: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
});
