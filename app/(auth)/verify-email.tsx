import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';

export default function VerifyEmail() {
  const { t } = useTranslation();
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const handleResend = async () => {
    if (email) {
      await supabase.auth.resend({ type: 'signup', email });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>📧</Text>
        <Text style={styles.title}>{t('auth.verifyEmail.title')}</Text>
        <Text style={styles.subtitle}>{t('auth.verifyEmail.subtitle')}</Text>
        {email ? <Text style={styles.email}>{email}</Text> : null}
        <Text style={styles.instruction}>{t('auth.verifyEmail.instruction')}</Text>

        <View style={styles.actions}>
          <Pressable style={styles.outlineButton} onPress={handleResend}>
            <Text style={styles.outlineButtonText}>{t('auth.verifyEmail.resend')}</Text>
          </Pressable>

          <Pressable onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.link}>{t('auth.verifyEmail.backToLogin')}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  icon: { fontSize: 64, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '700', color: '#0F172A', textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#64748B', textAlign: 'center' },
  email: { fontSize: 15, fontWeight: '600', color: '#4F46E5', textAlign: 'center' },
  instruction: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 4 },
  actions: { marginTop: 32, gap: 16, width: '100%', alignItems: 'center' },
  outlineButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#4F46E5',
    alignItems: 'center',
  },
  outlineButtonText: { color: '#4F46E5', fontSize: 16, fontWeight: '600' },
  link: { fontSize: 14, color: '#64748B' },
});
