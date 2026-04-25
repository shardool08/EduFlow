import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileTab() {
  return (
    <SafeAreaView style={s.container}>
      <View style={s.center}>
        <Text style={s.icon}>👤</Text>
        <Text style={s.title}>Profile</Text>
        <Text style={s.sub}>Teacher settings — coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  icon:      { fontSize: 48 },
  title:     { fontSize: 24, fontWeight: '700', color: '#0F172A' },
  sub:       { fontSize: 15, color: '#64748B' },
});
