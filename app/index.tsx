import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  return (
    <SafeAreaView style={s.container}>
      <View style={s.inner}>
        <Text style={s.heading}>नमस्कार! 🙏</Text>
        <Text style={s.sub}>तुमच्या रोजच्या English lesson साठी मदतनीस</Text>

        <View style={s.row}>
          <View style={s.prefix}><Text style={s.prefixText}>+91</Text></View>
          <TextInput
            style={s.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="number-pad"
            maxLength={10}
            placeholder="mobile number"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <Pressable
          style={({ pressed }) => [s.btn, pressed && s.btnPressed]}
          onPress={() => router.replace('/(tabs)/')}
        >
          <Text style={s.btnText}>OTP पाठवा</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner:     { flex: 1, paddingHorizontal: 28, justifyContent: 'center', gap: 20 },
  heading:   { fontSize: 36, fontWeight: '800', color: '#0F172A', textAlign: 'center' },
  sub:       { fontSize: 16, color: '#64748B', textAlign: 'center', lineHeight: 24 },
  row:       { flexDirection: 'row', gap: 10 },
  prefix:    { backgroundColor: '#F1F5F9', borderRadius: 12, paddingHorizontal: 14, justifyContent: 'center', borderWidth: 1.5, borderColor: '#E2E8F0' },
  prefixText:{ fontSize: 16, fontWeight: '700', color: '#334155' },
  input:     { flex: 1, borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, padding: 16, fontSize: 18, color: '#0F172A', backgroundColor: '#F8FAFC' },
  btn:       { backgroundColor: '#4F46E5', borderRadius: 14, paddingVertical: 18, alignItems: 'center', minHeight: 56 },
  btnPressed:{ opacity: 0.8 },
  btnText:   { fontSize: 18, fontWeight: '700', color: '#fff' },
});
