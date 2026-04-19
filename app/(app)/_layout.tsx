import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/store';

export default function AppLayout() {
  const { session } = useAuthStore();

  if (!session) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
