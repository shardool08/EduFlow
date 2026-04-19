import { StyleSheet, Text, View } from 'react-native';
import type { ConversationMessage } from '@/types';

interface Props {
  message: ConversationMessage;
}

export function MessageBubble({ message }: Props) {
  const isAi = message.role === 'ai';
  return (
    <View style={[styles.row, isAi ? styles.rowAi : styles.rowTeacher]}>
      {isAi && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AI</Text>
        </View>
      )}
      <View style={[styles.bubble, isAi ? styles.bubbleAi : styles.bubbleTeacher]}>
        <Text style={[styles.text, isAi ? styles.textAi : styles.textTeacher]}>
          {message.content}
        </Text>
      </View>
    </View>
  );
}

// Shown while the AI is composing its response
export function ThinkingBubble({ label }: { label: string }) {
  return (
    <View style={[styles.row, styles.rowAi]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>AI</Text>
      </View>
      <View style={[styles.bubble, styles.bubbleAi, styles.thinkingBubble]}>
        <Text style={[styles.text, styles.textAi, styles.thinkingText]}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  rowAi: { justifyContent: 'flex-start' },
  rowTeacher: { justifyContent: 'flex-end' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    flexShrink: 0,
  },
  avatarText: { fontSize: 10, color: '#FFFFFF', fontWeight: '700' },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleAi: {
    backgroundColor: '#EEF2FF',
    borderBottomLeftRadius: 4,
  },
  bubbleTeacher: {
    backgroundColor: '#4F46E5',
    borderBottomRightRadius: 4,
  },
  thinkingBubble: { opacity: 0.6 },
  text: { fontSize: 16, lineHeight: 24 },
  textAi: { color: '#1E1B4B' },
  textTeacher: { color: '#FFFFFF' },
  thinkingText: { fontStyle: 'italic' },
});
