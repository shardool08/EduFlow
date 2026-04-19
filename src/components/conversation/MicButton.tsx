import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  isRecording: boolean;
  isDisabled: boolean;
  label: string;
  onPress: () => void;
}

export function MicButton({ isRecording, isDisabled, label, onPress }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;
  const anim = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isRecording) {
      anim.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.07, duration: 550, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 550, useNativeDriver: true }),
        ])
      );
      anim.current.start();
    } else {
      anim.current?.stop();
      anim.current = null;
      Animated.timing(pulse, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    }
  }, [isRecording]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: pulse }] }}>
      <Pressable
        style={[
          styles.button,
          isRecording ? styles.recording : null,
          isDisabled ? styles.disabled : null,
        ]}
        onPress={handlePress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Ionicons
          name={isRecording ? 'stop-circle' : 'mic'}
          size={36}
          color="#FFFFFF"
        />
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#4F46E5',
    // Spec: 56dp+ height, full width
    minHeight: 64,
    borderRadius: 16,
    paddingHorizontal: 24,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  recording: {
    backgroundColor: '#DC2626',
    shadowColor: '#DC2626',
  },
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
