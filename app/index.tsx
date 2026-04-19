import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store';

export default function Index() {
  const { session } = useAuthStore();
  return session ? (
    <Redirect href="/(app)/(tabs)" />
  ) : (
    <Redirect href="/(auth)/welcome" />
  );
}
