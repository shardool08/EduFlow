import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LESSONS = [
  { id: 'bb-g1-en-01', number: 1, en: 'Greetings', mr: 'अभिवादन' },
  { id: 'bb-g1-en-06', number: 6, en: 'My Family', mr: 'माझे कुटुंब' },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Text style={styles.appName}>EduFlow</Text>
        <Text style={styles.appTagline}>तुमचा English lesson planning साथी</Text>

        {/* Two equal entry-point buttons */}
        <View style={styles.entryRow}>
          <Pressable
            style={({ pressed }) => [styles.entryCard, pressed && styles.entryCardPressed]}
            accessibilityRole="button"
            accessibilityLabel="Take textbook photo"
          >
            <Text style={styles.entryIcon}>📷</Text>
            <Text style={styles.entryMarathi}>पाठ्यपुस्तकाचा{'\n'}photo घ्या</Text>
            <Text style={styles.entryEnglish}>Take textbook photo</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.entryCard, pressed && styles.entryCardPressed]}
            accessibilityRole="button"
            accessibilityLabel="Pick a lesson"
          >
            <Text style={styles.entryIcon}>📖</Text>
            <Text style={styles.entryMarathi}>धडा निवडा</Text>
            <Text style={styles.entryEnglish}>Pick a lesson</Text>
          </Pressable>
        </View>

        {/* Lesson list */}
        <Text style={styles.sectionLabel}>धडे — Lessons</Text>
        <View style={styles.lessonList}>
          {LESSONS.map((lesson) => (
            <Pressable
              key={lesson.id}
              style={({ pressed }) => [styles.lessonCard, pressed && styles.lessonCardPressed]}
              accessibilityRole="button"
              accessibilityLabel={`Lesson ${lesson.number}: ${lesson.en}`}
            >
              <View style={styles.lessonBadge}>
                <Text style={styles.lessonBadgeText}>{lesson.number}</Text>
              </View>
              <View style={styles.lessonText}>
                <Text style={styles.lessonEn}>{lesson.en}</Text>
                <Text style={styles.lessonMr}>{lesson.mr}</Text>
              </View>
              <Text style={styles.lessonChevron}>›</Text>
            </Pressable>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 24, gap: 20 },

  appName: { fontSize: 26, fontWeight: '800', color: '#4F46E5' },
  appTagline: { fontSize: 15, color: '#64748B', marginTop: 2 },

  // Entry buttons
  entryRow: { flexDirection: 'row', gap: 12 },
  entryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 8,
    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  entryCardPressed: { opacity: 0.75 },
  entryIcon: { fontSize: 36 },
  entryMarathi: { fontSize: 16, fontWeight: '700', color: '#0F172A', textAlign: 'center', lineHeight: 22 },
  entryEnglish: { fontSize: 12, color: '#94A3B8', textAlign: 'center' },

  // Lesson list
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  lessonList: { gap: 10 },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    gap: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    minHeight: 56,
  },
  lessonCardPressed: { opacity: 0.75 },
  lessonBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonBadgeText: { fontSize: 15, fontWeight: '700', color: '#4F46E5' },
  lessonText: { flex: 1, gap: 2 },
  lessonEn: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  lessonMr: { fontSize: 14, color: '#64748B' },
  lessonChevron: { fontSize: 22, color: '#CBD5E1', fontWeight: '300' },
});
