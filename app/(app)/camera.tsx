import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getLessonById } from '@/data/lessons';
import type { BalbharatiLesson } from '@/types';

const SEEDED_IDS = ['bb-g1-en-01', 'bb-g1-en-06'];
const SEEDED_LESSONS = SEEDED_IDS.map(getLessonById).filter(
  (l): l is BalbharatiLesson => l !== undefined,
);

export default function CameraScreen() {
  const router = useRouter();

  const handleLessonPress = (lessonId: string) => {
    router.push(`/(app)/planning/${lessonId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </Pressable>
          <Text style={styles.headerTitle}>Scan Page</Text>
          <View style={styles.backButton} />
        </View>

        {/* Camera placeholder */}
        <View style={styles.cameraPlaceholder}>
          <Ionicons name="camera-outline" size={48} color="#CBD5E1" />
          <Text style={styles.cameraTitle}>Camera recognition coming soon</Text>
          <Text style={styles.cameraSubtitle}>
            Point your camera at a Balbharati textbook page to auto-detect the lesson.
          </Text>
        </View>

        {/* Fallback lesson list */}
        <View style={styles.fallbackHeader}>
          <Text style={styles.fallbackTitle}>Select a lesson instead</Text>
          <Text style={styles.fallbackSubtitle}>Tap a lesson to start planning</Text>
        </View>

        {SEEDED_LESSONS.map((lesson) => (
          <Pressable
            key={lesson.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => handleLessonPress(lesson.id)}
            accessibilityRole="button"
            accessibilityLabel={`Lesson ${lesson.lessonNumber}: ${lesson.title.en}`}
          >
            <View style={styles.cardAccent} />
            <View style={styles.cardBody}>
              <View style={styles.cardRow}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>{lesson.lessonNumber}</Text>
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.lessonTitle}>{lesson.title.en}</Text>
                  <Text style={styles.lessonTitleMr}>{lesson.title.mr}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </View>
            </View>
          </Pressable>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 24, gap: 16 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#0F172A' },

  cameraPlaceholder: {
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    paddingVertical: 48,
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: 12,
  },
  cameraTitle: { fontSize: 16, fontWeight: '600', color: '#64748B', textAlign: 'center' },
  cameraSubtitle: { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 20 },

  fallbackHeader: { gap: 2, marginTop: 8 },
  fallbackTitle: { fontSize: 17, fontWeight: '600', color: '#0F172A' },
  fallbackSubtitle: { fontSize: 13, color: '#64748B' },

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
  cardBody: { flex: 1, padding: 16 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadgeText: { fontSize: 14, fontWeight: '700', color: '#4F46E5' },
  cardText: { flex: 1, gap: 2 },
  lessonTitle: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  lessonTitleMr: { fontSize: 13, color: '#64748B' },
});
