import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🏠 Home</Text>
        <Text style={styles.subtitle}>Camera + Lesson List</Text>
        <Text style={styles.hint}>Coming soon: take a photo of your textbook page or pick a lesson to start planning.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  title: { fontSize: 32, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  subtitle: { fontSize: 18, fontWeight: '600', color: '#4F46E5', marginBottom: 16 },
  hint: { fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 22 },
});
