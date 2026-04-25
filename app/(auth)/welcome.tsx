import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  const canSubmit = phone.replace(/\D/g, '').length === 10;

  function handleSendOtp() {
    // OTP sending skipped for now — navigate straight to the app.
    router.replace('/(tabs)/home');
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Greeting */}
        <View style={styles.hero}>
          <Text style={styles.namaste}>नमस्कार! 🙏</Text>
          <Text style={styles.tagline}>
            तुमच्या रोजच्या English lesson{'\n'}साठी मदतनीस
          </Text>
        </View>

        {/* Phone input */}
        <View style={styles.form}>
          <Text style={styles.label}>तुमचा mobile number</Text>
          <View style={styles.phoneRow}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="number-pad"
              maxLength={10}
              placeholder="10-digit number"
              placeholderTextColor="#CBD5E1"
              accessibilityLabel="Mobile number input"
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              !canSubmit && styles.buttonDisabled,
              pressed && canSubmit && styles.buttonPressed,
            ]}
            onPress={handleSendOtp}
            disabled={!canSubmit}
            accessibilityRole="button"
            accessibilityLabel="OTP पाठवा"
          >
            <Text style={styles.buttonText}>OTP पाठवा</Text>
          </Pressable>

          <Text style={styles.privacy}>
            तुमचा नंबर कोणालाही दिला जाणार नाही
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  inner: { flex: 1, paddingHorizontal: 28, justifyContent: 'center', gap: 40 },

  hero: { alignItems: 'center', gap: 12 },
  namaste: { fontSize: 40, fontWeight: '800', color: '#0F172A' },
  tagline: { fontSize: 18, color: '#475569', textAlign: 'center', lineHeight: 28 },

  form: { gap: 16 },
  label: { fontSize: 16, fontWeight: '600', color: '#334155' },

  phoneRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  countryCode: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  countryCodeText: { fontSize: 16, fontWeight: '700', color: '#334155' },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    letterSpacing: 2,
  },

  button: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonDisabled: { backgroundColor: '#C7D2FE' },
  buttonPressed: { opacity: 0.85 },
  buttonText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },

  privacy: { fontSize: 13, color: '#94A3B8', textAlign: 'center' },
});
