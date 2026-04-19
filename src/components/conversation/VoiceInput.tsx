import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { MicButton } from './MicButton';
import { useConversationStore } from '@/store';

export function VoiceInput() {
  const { t } = useTranslation();
  const { voice, isAiThinking, startRecording, stopRecording, confirmTranscript, retryRecording, sendTeacherMessage } =
    useConversationStore();

  const [showTypeInput, setShowTypeInput] = useState(false);
  const [typeText, setTypeText] = useState('');

  const handleMicPress = () => {
    if (voice.isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSendText = () => {
    const text = typeText.trim();
    if (!text) return;
    sendTeacherMessage(text);
    setTypeText('');
    setShowTypeInput(false);
  };

  const micLabel = voice.isRecording
    ? t('planning.listening')
    : t('planning.speak');

  // Processing: waiting for STT result
  if (voice.isProcessing) {
    return (
      <View style={styles.container}>
        <View style={styles.processingRow}>
          <ActivityIndicator color="#4F46E5" size="small" />
          <Text style={styles.processingText}>{t('planning.processing')}</Text>
        </View>
      </View>
    );
  }

  // Transcript ready: show preview with Confirm / Retry
  if (voice.finalTranscript) {
    return (
      <View style={styles.container}>
        <View style={styles.transcriptBox}>
          <Text style={styles.transcriptText}>{voice.finalTranscript}</Text>
        </View>
        {voice.error ? <Text style={styles.errorText}>{voice.error}</Text> : null}
        <View style={styles.transcriptActions}>
          <Pressable
            style={[styles.actionButton, styles.retryButton]}
            onPress={retryRecording}
          >
            <Text style={styles.retryText}>{t('planning.retry')}</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.confirmButton]}
            onPress={confirmTranscript}
          >
            <Text style={styles.confirmText}>{t('planning.confirm')}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Type input mode
  if (showTypeInput) {
    return (
      <View style={styles.container}>
        <View style={styles.typeRow}>
          <TextInput
            style={styles.textInput}
            value={typeText}
            onChangeText={setTypeText}
            placeholder={t('planning.typeMessage')}
            placeholderTextColor="#94A3B8"
            multiline
            autoFocus
          />
          <Pressable
            style={[styles.sendButton, !typeText.trim() ? styles.sendButtonDisabled : null]}
            onPress={handleSendText}
            disabled={!typeText.trim()}
          >
            <Text style={styles.sendText}>{t('planning.send')}</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => setShowTypeInput(false)} style={styles.switchLink}>
          <Text style={styles.switchText}>🎤 {t('planning.speak')}</Text>
        </Pressable>
      </View>
    );
  }

  // Default: voice mode
  return (
    <View style={styles.container}>
      {voice.error ? (
        <Text style={styles.errorText}>{voice.error}</Text>
      ) : null}
      <MicButton
        isRecording={voice.isRecording}
        isDisabled={isAiThinking}
        label={micLabel}
        onPress={handleMicPress}
      />
      <Pressable
        onPress={() => setShowTypeInput(true)}
        disabled={isAiThinking}
        style={styles.switchLink}
      >
        <Text style={[styles.switchText, isAiThinking ? styles.switchTextDisabled : null]}>
          {t('planning.typeInstead')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 10,
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 64,
  },
  processingText: { fontSize: 16, color: '#4F46E5', fontWeight: '500' },
  transcriptBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  transcriptText: { fontSize: 16, color: '#0F172A', lineHeight: 24 },
  transcriptActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryButton: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  confirmButton: {
    backgroundColor: '#4F46E5',
  },
  retryText: { fontSize: 15, color: '#64748B', fontWeight: '500' },
  confirmText: { fontSize: 15, color: '#FFFFFF', fontWeight: '600' },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
    maxHeight: 120,
    backgroundColor: '#F8FAFC',
  },
  sendButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: { opacity: 0.4 },
  sendText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
  switchLink: { alignItems: 'center', paddingVertical: 2 },
  switchText: { fontSize: 14, color: '#64748B' },
  switchTextDisabled: { opacity: 0.4 },
  errorText: { fontSize: 13, color: '#EF4444', textAlign: 'center' },
});
