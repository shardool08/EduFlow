import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store';
import type { UserRole } from '@/types';

type Step = 1 | 2 | 3;

const ROLES: Array<{ key: UserRole; icon: string }> = [
  { key: 'student', icon: '📚' },
  { key: 'teacher', icon: '🎓' },
  { key: 'parent', icon: '👪' },
];

export default function Register() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signUp, isLoading } = useAuthStore();

  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<UserRole | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (step === 1 && !role) next.role = 'Please select a role';
    if (step === 2) {
      if (!fullName.trim()) next.fullName = t('auth.errors.nameRequired');
      if (!email.trim()) next.email = t('auth.errors.emailRequired');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t('auth.errors.invalidEmail');
    }
    if (step === 3) {
      if (!password) next.password = t('auth.errors.passwordRequired');
      else if (password.length < 8) next.password = t('auth.errors.passwordTooShort');
      if (password !== confirmPassword) next.confirmPassword = t('auth.errors.passwordMismatch');
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
    else router.back();
  };

  const handleNext = () => {
    if (validate()) setStep((s) => (s + 1) as Step);
  };

  const handleSubmit = async () => {
    if (!validate() || !role) return;
    try {
      await signUp({ email, password, full_name: fullName, role });
      router.replace({ pathname: '/(auth)/verify-email', params: { email } });
    } catch (err: any) {
      const message =
        err?.message?.toLowerCase().includes('already registered')
          ? t('auth.errors.emailInUse')
          : t('auth.errors.generic');
      Alert.alert(t('common.error'), message);
    }
  };

  const progress = `${(step / 3) * 100}%`;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Progress header */}
          <View style={styles.header}>
            <Pressable onPress={goBack} style={styles.backButton}>
              <Text style={styles.backText}>←</Text>
            </Pressable>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: progress }]} />
            </View>
            <Text style={styles.stepText}>{step} / 3</Text>
          </View>

          {/* Step 1 — Role selection */}
          {step === 1 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('auth.register.steps.role.title')}</Text>
              <Text style={styles.stepSubtitle}>{t('auth.register.steps.role.subtitle')}</Text>
              <View style={styles.roleGrid}>
                {ROLES.map(({ key, icon }) => (
                  <Pressable
                    key={key}
                    style={[styles.roleCard, role === key ? styles.roleCardActive : null]}
                    onPress={() => setRole(key)}
                  >
                    <Text style={styles.roleIcon}>{icon}</Text>
                    <Text style={[styles.roleName, role === key ? styles.roleNameActive : null]}>
                      {t(`auth.register.steps.role.${key}`)}
                    </Text>
                    <Text style={[styles.roleDesc, role === key ? styles.roleDescActive : null]}>
                      {t(`auth.register.steps.role.${key}Desc`)}
                    </Text>
                  </Pressable>
                ))}
              </View>
              {errors.role ? <Text style={styles.errorText}>{errors.role}</Text> : null}
            </View>
          )}

          {/* Step 2 — Personal info */}
          {step === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('auth.register.steps.info.title')}</Text>
              <Text style={styles.stepSubtitle}>{t('auth.register.steps.info.subtitle')}</Text>
              <View style={styles.form}>
                <View style={styles.field}>
                  <Text style={styles.label}>{t('auth.register.steps.info.fullName')}</Text>
                  <TextInput
                    style={[styles.input, errors.fullName ? styles.inputError : null]}
                    value={fullName}
                    onChangeText={setFullName}
                    autoComplete="name"
                    placeholder="John Doe"
                    placeholderTextColor="#94A3B8"
                  />
                  {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>{t('auth.register.steps.info.email')}</Text>
                  <TextInput
                    style={[styles.input, errors.email ? styles.inputError : null]}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    placeholder="you@example.com"
                    placeholderTextColor="#94A3B8"
                  />
                  {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                </View>
              </View>
            </View>
          )}

          {/* Step 3 — Password */}
          {step === 3 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('auth.register.steps.password.title')}</Text>
              <Text style={styles.stepSubtitle}>{t('auth.register.steps.password.subtitle')}</Text>
              <View style={styles.form}>
                <View style={styles.field}>
                  <Text style={styles.label}>{t('auth.register.steps.password.password')}</Text>
                  <TextInput
                    style={[styles.input, errors.password ? styles.inputError : null]}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor="#94A3B8"
                  />
                  {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>{t('auth.register.steps.password.confirmPassword')}</Text>
                  <TextInput
                    style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor="#94A3B8"
                  />
                  {errors.confirmPassword ? (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  ) : null}
                </View>
              </View>
            </View>
          )}

          {/* CTA */}
          <View style={styles.actions}>
            <Pressable
              style={[styles.button, isLoading ? styles.buttonDisabled : null]}
              onPress={step === 3 ? handleSubmit : handleNext}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading
                  ? t('common.loading')
                  : step === 3
                  ? t('auth.register.steps.password.createAccount')
                  : t('common.continue')}
              </Text>
            </Pressable>

            <View style={styles.footer}>
              <Text style={styles.footerText}>{t('auth.register.haveAccount')} </Text>
              <Pressable onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.footerLink}>{t('auth.register.signIn')}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  backButton: { padding: 4 },
  backText: { fontSize: 24, color: '#0F172A' },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#4F46E5', borderRadius: 3 },
  stepText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  stepContent: { flex: 1, marginBottom: 32 },
  stepTitle: { fontSize: 26, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  stepSubtitle: { fontSize: 15, color: '#64748B', marginBottom: 24 },
  roleGrid: { gap: 12 },
  roleCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  roleCardActive: { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' },
  roleIcon: { fontSize: 28, marginBottom: 8 },
  roleName: { fontSize: 17, fontWeight: '600', color: '#0F172A', marginBottom: 2 },
  roleNameActive: { color: '#4F46E5' },
  roleDesc: { fontSize: 13, color: '#64748B' },
  roleDescActive: { color: '#6366F1' },
  form: { gap: 20 },
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151' },
  input: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  inputError: { borderColor: '#EF4444' },
  errorText: { fontSize: 12, color: '#EF4444', marginTop: 4 },
  actions: { gap: 16, paddingBottom: 16 },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { fontSize: 14, color: '#64748B' },
  footerLink: { fontSize: 14, color: '#4F46E5', fontWeight: '600' },
});
