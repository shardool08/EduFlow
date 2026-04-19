import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store';

export default function Home() {
  const { t } = useTranslation();
  const { profile } = useAuthStore();
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{t('home.greeting', { name: firstName })}</Text>
          <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
        </View>

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

        <Text style={styles.sectionTitle}>{t('home.continueLearning')}</Text>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Your courses will appear here</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 24, gap: 24 },
  header: { gap: 4 },
  greeting: { fontSize: 24, fontWeight: '700', color: '#0F172A' },
  subtitle: { fontSize: 15, color: '#64748B' },
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
  placeholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  placeholderText: { fontSize: 14, color: '#94A3B8' },
});
