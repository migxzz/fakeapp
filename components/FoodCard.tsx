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
  onAddToCart?: (item: { id: string; name: string; price: number; image: string }) => void;
};

export default function FoodCard({ id, name, price, image, description, onPress, onAddToCart }: FoodCardProps) {
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
            {onAddToCart && (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => onAddToCart({ id, name, price, image })}
              >
                <ThemedText style={styles.addButtonText}>+</ThemedText>
              </TouchableOpacity>
            )}
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
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    backgroundColor: '#0F0F23',
    borderWidth: 1,
    borderColor: '#8B5CF6',
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
    color: '#A855F7',
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});