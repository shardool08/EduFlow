import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLessonById } from '@/data/lessons';

export default function PlanningScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const lesson = getLessonById(lessonId);

  const lessonTitle = lesson ? lesson.mr : lessonId;
  const firstMessage = `नमस्कार! आज आपण ${lessonTitle} शिकवायचं आहे. सुरुवात करूया का?`;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
        >
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <View style={styles.headerText}>
          {lesson && (
            <>
              <Text style={styles.headerLesson}>Lesson {lesson.number}</Text>
              <Text style={styles.headerTitle}>{lesson.en} — {lesson.mr}</Text>
            </>
          )}
        </View>
      </View>

      {/* Chat area */}
      <ScrollView
        style={styles.chat}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {/* AI bubble */}
        <View style={styles.aiBubbleRow}>
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>🤖</Text>
          </View>
          <View style={styles.aiBubble}>
            <Text style={styles.aiBubbleText}>{firstMessage}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Mic button */}
      <View style={styles.inputBar}>
        <Pressable
          style={({ pressed }) => [styles.micButton, pressed && styles.micButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel="बोला — speak your response"
        >
          <Text style={styles.micIcon}>🎤</Text>
          <Text style={styles.micLabel}>बोला</Text>
        </Pressable>
        <Text style={styles.typeHint}>⌨ Type instead</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 12,
  },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 24, color: '#0F172A' },
  headerText: { flex: 1 },
  headerLesson: { fontSize: 12, fontWeight: '600', color: '#4F46E5', textTransform: 'uppercase', letterSpacing: 0.5 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginTop: 1 },

  // Chat
  chat: { flex: 1 },
  chatContent: { padding: 16, gap: 12 },

  aiBubbleRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarText: { fontSize: 18 },
  aiBubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  aiBubbleText: { fontSize: 17, color: '#0F172A', lineHeight: 26 },

  // Mic input bar
  inputBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
    alignItems: 'center',
  },
  micButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    alignSelf: 'stretch',
    minHeight: 56,
  },
  micButtonPressed: { opacity: 0.85 },
  micIcon: { fontSize: 24 },
  micLabel: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  typeHint: { fontSize: 13, color: '#94A3B8' },
});
