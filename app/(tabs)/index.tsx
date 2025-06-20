import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import FoodCarousel from '@/components/FoodCarousel';
import FoodCard from '@/components/FoodCard';
import CategoryFilter from '@/components/CategoryFilter';
import { featuredItems, foodItems, categories } from '@/services/foodData';

export default function HomeScreen() {
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedView style={styles.header}>
          <ThemedText type="title">Migxzz Delivery</ThemedText>
          <ThemedText style={styles.subtitle}>
            Comida deliciosa entregue na sua porta
          </ThemedText>
        </ThemedView>

        {/* Carrossel de destaques com efeito parallax */}
        <FoodCarousel data={featuredItems} />

        {/* Filtro de categorias com animações */}
        <ThemedView style={styles.sectionHeader}>
          <ThemedText type="subtitle">Categorias</ThemedText>
        </ThemedView>
        <CategoryFilter 
          categories={categories} 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Lista de produtos com animações */}
        <ThemedView style={styles.sectionHeader}>
          <ThemedText type="subtitle">
            {selectedCategory === 'all' ? 'Todos os Produtos' : 
              categories.find(c => c.id === selectedCategory)?.name || 'Produtos'}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.foodList}>
          {filteredItems.map((item) => (
            <FoodCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              description={item.description}
              onPress={handleFoodPress}
            />
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Espaço para a tab bar
  },
  header: {
    marginBottom: 16,
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 8,
  },
  foodList: {
    marginTop: 8,
  },
});