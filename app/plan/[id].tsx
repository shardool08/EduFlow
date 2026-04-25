import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const LESSONS: Record<string, { number: number; en: string; mr: string }> = {
  'bb-g1-en-01': { number: 1, en: 'Greetings',  mr: 'अभिवादन'    },
  'bb-g1-en-06': { number: 6, en: 'My Family',  mr: 'माझे कुटुंब' },
};

export default function PlanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const lesson = LESSONS[id] ?? { number: 0, en: id, mr: '' };

  const aiMessage = `नमस्कार! आज आपण "${lesson.mr || lesson.en}" शिकवायचं आहे. सुरुवात करूया का?`;

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.back} hitSlop={12}>
          <Text style={s.backText}>←</Text>
        </Pressable>
        <View style={s.headerInfo}>
          <Text style={s.lessonNum}>Lesson {lesson.number}</Text>
          <Text style={s.lessonTitle}>{lesson.en} — {lesson.mr}</Text>
        </View>
      </View>

      {/* AI message bubble */}
      <View style={s.chat}>
        <View style={s.bubble}>
          <Text style={s.bubbleText}>{aiMessage}</Text>
        </View>
      </View>

      {/* Mic button */}
      <View style={s.footer}>
        <Pressable
          style={({ pressed }) => [s.mic, pressed && s.micPressed]}
          accessibilityRole="button"
          accessibilityLabel="बोला"
        >
          <Text style={s.micIcon}>🎤</Text>
          <Text style={s.micLabel}>बोला</Text>
        </Pressable>
        <Text style={s.hint}>⌨ Type instead</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#F8FAFC' },

  header:      { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', gap: 12 },
  back:        { padding: 4 },
  backText:    { fontSize: 26, color: '#0F172A' },
  headerInfo:  { flex: 1 },
  lessonNum:   { fontSize: 12, fontWeight: '600', color: '#4F46E5', textTransform: 'uppercase', letterSpacing: 0.5 },
  lessonTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginTop: 2 },

  chat:        { flex: 1, padding: 16, justifyContent: 'flex-start' },
  bubble:      { backgroundColor: '#fff', borderRadius: 16, borderTopLeftRadius: 4, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', alignSelf: 'flex-start', maxWidth: '90%' },
  bubbleText:  { fontSize: 17, color: '#0F172A', lineHeight: 26 },

  footer:      { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0', gap: 10, alignItems: 'center' },
  mic:         { backgroundColor: '#4F46E5', borderRadius: 14, paddingVertical: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, alignSelf: 'stretch', minHeight: 64 },
  micPressed:  { opacity: 0.85 },
  micIcon:     { fontSize: 26 },
  micLabel:    { fontSize: 22, fontWeight: '700', color: '#fff' },
  hint:        { fontSize: 13, color: '#94A3B8' },
});
