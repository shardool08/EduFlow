import { useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useConversationStore } from '@/store';
import { usePdfStore } from '@/store';

export default function PlanReviewScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const { lesson, decisions } = useConversationStore();
  const { uris, isGenerating, isSharing, error, buildAndGenerate, share, reset } = usePdfStore();

  useEffect(() => {
    return () => reset();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>{t('share.title')}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {lesson && (
          <View style={styles.lessonCard}>
            <Text style={styles.lessonNum}>
              {t('planning.phase', { current: '', total: '' }).split(' ')[0]} {lesson.lessonNumber}
            </Text>
            <Text style={styles.lessonTitle}>{lesson.title.en}</Text>
            <Text style={styles.lessonSubtitle}>{lesson.title.mr}</Text>
            {decisions.objective ? (
              <Text style={styles.objective}>{decisions.objective}</Text>
            ) : null}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('share.documents')}</Text>

          <DocRow
            icon="📄"
            name={t('share.lessonPlan')}
            desc={t('share.lessonPlanDesc')}
            done={!!uris?.lessonPlanUri}
          />

          {decisions.includeWorksheet && (
            <DocRow
              icon="📝"
              name={t('share.worksheet')}
              desc={t('share.worksheetDesc')}
              done={!!uris?.worksheetUri}
            />
          )}

          {decisions.includeAssessment && (
            <DocRow
              icon="✅"
              name={t('share.assessment')}
              desc={t('share.assessmentDesc')}
              done={!!uris?.assessmentUri}
            />
          )}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      <View style={styles.actions}>
        {!uris ? (
          <Pressable
            style={[styles.primaryButton, isGenerating && styles.buttonDisabled]}
            onPress={buildAndGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? <ActivityIndicator color="#FFFFFF" size="small" /> : null}
            <Text style={styles.primaryButtonText}>
              {isGenerating ? t('share.generating') : t('share.generatePlan')}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.shareButton, isSharing && styles.buttonDisabled]}
            onPress={share}
            disabled={isSharing}
          >
            {isSharing ? <ActivityIndicator color="#FFFFFF" size="small" /> : null}
            <Text style={styles.shareButtonText}>
              {isSharing ? t('share.sharing') : t('share.shareWhatsApp')}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

function DocRow({
  icon,
  name,
  desc,
  done,
}: {
  icon: string;
  name: string;
  desc: string;
  done: boolean;
}) {
  return (
    <View style={styles.docRow}>
      <Text style={styles.docIcon}>{icon}</Text>
      <View style={styles.docInfo}>
        <Text style={styles.docName}>{name}</Text>
        <Text style={styles.docDesc}>{desc}</Text>
      </View>
      {done ? <Text style={styles.doneIcon}>✓</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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
  title: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  lessonCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  lessonNum: { fontSize: 12, color: '#4338CA', fontWeight: '600', textTransform: 'uppercase' },
  lessonTitle: { fontSize: 20, fontWeight: '700', color: '#1E1B4B', marginTop: 4 },
  lessonSubtitle: { fontSize: 14, color: '#6366F1', marginTop: 2 },
  objective: { fontSize: 13, color: '#374151', marginTop: 8, lineHeight: 20 },
  section: { gap: 8 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  docIcon: { fontSize: 24 },
  docInfo: { flex: 1 },
  docName: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  docDesc: { fontSize: 12, color: '#64748B', marginTop: 2 },
  doneIcon: { fontSize: 18, color: '#10B981', fontWeight: '700' },
  errorText: { fontSize: 13, color: '#EF4444', textAlign: 'center' },
  actions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    minHeight: 56,
  },
  shareButton: {
    backgroundColor: '#25D366',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    minHeight: 56,
  },
  buttonDisabled: { opacity: 0.6 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  shareButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
