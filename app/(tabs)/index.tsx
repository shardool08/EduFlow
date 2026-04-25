import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const LESSONS = [
  { id: 'bb-g1-en-01', number: 1, en: 'Greetings',  mr: 'अभिवादन'    },
  { id: 'bb-g1-en-06', number: 6, en: 'My Family',  mr: 'माझे कुटुंब' },
];

export default function HomeTab() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.appName}>EduFlow</Text>
        <Text style={s.tagline}>तुमचा English lesson planning साथी</Text>

        <Text style={s.sectionLabel}>धडे — Lessons</Text>

        {LESSONS.map((lesson) => (
          <Pressable
            key={lesson.id}
            style={({ pressed }) => [s.card, pressed && s.cardPressed]}
            onPress={() => router.push(`/plan/${lesson.id}`)}
            accessibilityRole="button"
            accessibilityLabel={`Lesson ${lesson.number}: ${lesson.en}`}
          >
            <View style={s.badge}><Text style={s.badgeText}>{lesson.number}</Text></View>
            <View style={s.info}>
              <Text style={s.en}>{lesson.en}</Text>
              <Text style={s.mr}>{lesson.mr}</Text>
            </View>
            <Text style={s.chevron}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#F8FAFC' },
  scroll:       { padding: 24, gap: 16 },
  appName:      { fontSize: 26, fontWeight: '800', color: '#4F46E5' },
  tagline:      { fontSize: 14, color: '#64748B' },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8 },
  card:         { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 16, gap: 14, borderWidth: 1.5, borderColor: '#E2E8F0', minHeight: 72 },
  cardPressed:  { opacity: 0.75 },
  badge:        { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  badgeText:    { fontSize: 16, fontWeight: '700', color: '#4F46E5' },
  info:         { flex: 1, gap: 2 },
  en:           { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  mr:           { fontSize: 14, color: '#64748B' },
  chevron:      { fontSize: 24, color: '#CBD5E1' },
});
