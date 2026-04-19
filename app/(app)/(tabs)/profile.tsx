import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store';

export default function Profile() {
  const { t } = useTranslation();
  const router = useRouter();
  const { profile, signOut } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert(t('profile.signOut'), t('profile.signOutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.signOut'),
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('profile.title')}</Text>

        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.full_name?.charAt(0).toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text style={styles.name}>{profile?.full_name ?? ''}</Text>
          <Text style={styles.email}>{profile?.email ?? ''}</Text>
          {profile?.role ? (
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{profile.role}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.menu}>
          <Pressable style={styles.menuItem} onPress={() => {}}>
            <Text style={styles.menuItemText}>{t('profile.editProfile')}</Text>
            <Text style={styles.menuChevron}>›</Text>
          </Pressable>
          <Pressable style={[styles.menuItem, styles.menuItemLast]} onPress={() => {}}>
            <Text style={styles.menuItemText}>{t('profile.settings')}</Text>
            <Text style={styles.menuChevron}>›</Text>
          </Pressable>
        </View>

        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>{t('profile.signOut')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 24, gap: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#0F172A' },
  avatarWrapper: { alignItems: 'center', gap: 8, paddingVertical: 8 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#FFFFFF' },
  name: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  email: { fontSize: 14, color: '#64748B' },
  roleBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
  },
  roleText: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  menu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuItemText: { fontSize: 15, color: '#0F172A' },
  menuChevron: { fontSize: 20, color: '#94A3B8' },
  signOutButton: {
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  signOutText: { fontSize: 15, color: '#EF4444', fontWeight: '600' },
});
