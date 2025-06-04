import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

type FoodCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  onPress: (id: string) => void;
};

export default function FoodCard({ id, name, price, image, description, onPress }: FoodCardProps) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(id)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <Image source={{ uri: image }} style={styles.image} />
        <ThemedView style={styles.infoContainer}>
          <ThemedText type="subtitle" style={styles.name}>{name}</ThemedText>
          <ThemedText style={styles.description} numberOfLines={2}>{description}</ThemedText>
          <View style={styles.priceContainer}>
            <ThemedText type="defaultSemiBold" style={styles.price}>
              R$ {price.toFixed(2)}
            </ThemedText>
          </View>
        </ThemedView>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    height: 180,
    width: '100%',
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    marginBottom: 4,
  },
  description: {
    marginBottom: 8,
    opacity: 0.7,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    color: '#FF6B6B',
  },
});