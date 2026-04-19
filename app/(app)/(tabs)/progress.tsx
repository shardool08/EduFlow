import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Progress() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('progress.title')}</Text>

        <View style={styles.statsRow}>
          {([
            { value: '7', label: t('progress.streak') },
            { value: '3', label: t('progress.completed') },
            { value: '12', label: t('progress.hours') },
          ] as const).map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Progress charts coming soon</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 24, gap: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#0F172A' },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statValue: { fontSize: 28, fontWeight: '700', color: '#4F46E5' },
  statLabel: { fontSize: 11, color: '#64748B', textAlign: 'center', marginTop: 4 },
  placeholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  placeholderText: { fontSize: 14, color: '#94A3B8' },
});
