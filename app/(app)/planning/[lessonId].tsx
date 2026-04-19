import { useEffect, useRef } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageBubble, ThinkingBubble } from '@/components/conversation/MessageBubble';
import { PhaseIndicator } from '@/components/conversation/PhaseIndicator';
import { VoiceInput } from '@/components/conversation/VoiceInput';
import { useConversationStore } from '@/store';

export default function PlanningScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  const { lesson, messages, currentPhase, isAiThinking, isComplete, startConversation, reset } =
    useConversationStore();

  const scrollRef = useRef<ScrollView>(null);

  // Start conversation when screen mounts
  useEffect(() => {
    if (lessonId) {
      startConversation(lessonId);
    }
    return () => {
      reset();
    };
  }, [lessonId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length, isAiThinking]);

  const handleBack = () => {
    Alert.alert(
      t('common.back'),
      t('planning.backConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.back'),
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <View style={styles.headerTitle}>
          {lesson ? (
            <>
              <Text style={styles.lessonNumber}>Lesson {lesson.lessonNumber}</Text>
              <Text style={styles.lessonTitle} numberOfLines={1}>
                {lesson.title.en}
                {lesson.title.mr !== lesson.title.en ? ` — ${lesson.title.mr}` : ''}
              </Text>
            </>
          ) : (
            <Text style={styles.lessonNumber}>{t('common.loading')}</Text>
          )}
        </View>
      </View>

      {/* ── Phase indicator ─────────────────────────────────────────── */}
      <PhaseIndicator currentPhase={currentPhase} />

      {/* ── Message history ─────────────────────────────────────────── */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isAiThinking && (
            <ThinkingBubble label={t('planning.thinking')} />
          )}

          {isComplete && (
            <View style={styles.completeBanner}>
              <Text style={styles.completeText}>🎉 {t('planning.done')}</Text>
              <Pressable
                style={styles.generateButton}
                onPress={() => router.push('/(app)/plan-review')}
              >
                <Text style={styles.generateButtonText}>{t('planning.generatePlan')}</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>

        {/* ── Voice / text input ──────────────────────────────────────── */}
        <VoiceInput />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 12,
  },
  backButton: { padding: 4 },
  backText: { fontSize: 22, color: '#0F172A' },
  headerTitle: { flex: 1 },
  lessonNumber: { fontSize: 12, color: '#64748B', fontWeight: '500', textTransform: 'uppercase' },
  lessonTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A', marginTop: 1 },
  messages: { flex: 1 },
  messagesContent: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  completeBanner: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  completeText: { fontSize: 16, fontWeight: '600', color: '#065F46' },
  generateButton: {
    marginTop: 12,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  generateButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
