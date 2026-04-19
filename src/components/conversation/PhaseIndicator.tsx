import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { ConversationPhase } from '@/types';

const TOTAL_PHASES = 7;

interface Props {
  currentPhase: ConversationPhase;
}

export function PhaseIndicator({ currentPhase }: Props) {
  const { t } = useTranslation();
  const phaseLabel = t(`planning.phases.${currentPhase}`);

  return (
    <View style={styles.container}>
      <View style={styles.dots}>
        {Array.from({ length: TOTAL_PHASES }, (_, i) => {
          const phase = (i + 1) as ConversationPhase;
          const isActive = phase === currentPhase;
          const isDone = phase < currentPhase;
          return (
            <View
              key={phase}
              style={[
                styles.dot,
                isDone ? styles.dotDone : null,
                isActive ? styles.dotActive : null,
              ]}
            />
          );
        })}
      </View>
      <Text style={styles.label}>
        {t('planning.phase', { current: currentPhase, total: TOTAL_PHASES })}
        {' — '}
        {phaseLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
    gap: 6,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  dotDone: {
    backgroundColor: '#A5B4FC',
  },
  dotActive: {
    width: 20,
    backgroundColor: '#4F46E5',
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
});
