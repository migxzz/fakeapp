import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { ThemedText } from './ThemedText';

type AnimatedToastProps = {
  message: string;
  visible: boolean;
  onHide: () => void;
};

export default function AnimatedToast({ message, visible, onHide }: AnimatedToastProps) {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      // Animação de entrada
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSequence(
        withSpring(1.1, { damping: 10 }),
        withSpring(1, { damping: 15 })
      );

      // Auto hide após 2.5 segundos
      const timer = setTimeout(() => {
        translateY.value = withSpring(-100, { damping: 15 });
        opacity.value = withTiming(0, { duration: 300 });
        scale.value = withTiming(0.8, { duration: 300 });
        setTimeout(() => runOnJS(onHide)(), 300);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.toast}>
        <Ionicons name="rocket" size={24} color="#FFFFFF" />
        <ThemedText style={styles.message}>{message}</ThemedText>
        <Ionicons name="checkmark-circle" size={20} color="#00FF88" />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toast: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#A855F7',
  },
  message: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    flex: 1,
    marginHorizontal: 12,
  },
});