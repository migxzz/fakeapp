import React, { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  FadeOutUp,
  Layout
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import FoodCard from '@/components/FoodCard';
import CategoryFilter from '@/components/CategoryFilter';
import { foodItems, categories } from '@/services/foodData';

export default function MenuScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredItems = selectedCategory === 'all'
    ? foodItems
    : foodItems.filter(item => 
        item.category.toLowerCase() === selectedCategory.toLowerCase()
      );

  const handleFoodPress = (id: string) => {
    router.push(`/food/${id}`);
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      <ThemedView style={styles.header}>
        <ThemedText type="title">Nosso Cardápio</ThemedText>
        <ThemedText style={styles.subtitle}>
          Explore nossas deliciosas opções
        </ThemedText>
      </ThemedView>

      <CategoryFilter 
        categories={categories} 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 100).springify()}
            exiting={FadeOutUp}
            layout={Layout.springify()}
          >
            <FoodCard
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              description={item.description}
              onPress={handleFoodPress}
            />
          </Animated.View>
        )}
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={64} color="#ccc" />
            <ThemedText style={styles.emptyText}>
              Nenhum item encontrado nesta categoria
            </ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 100, // Espaço para a tab bar
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});