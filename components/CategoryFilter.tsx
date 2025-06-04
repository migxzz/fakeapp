import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { ThemedView } from './ThemedView';

type Category = {
  id: string;
  name: string;
};

type CategoryFilterProps = {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
};

export default function CategoryFilter({ 
  categories = [], 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) {
  
  // Verificação de segurança
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => onSelectCategory(category.id)}
            activeOpacity={0.7}
          >
            <ThemedView 
              style={[
                styles.categoryItem, 
                category.id === selectedCategory && styles.selectedCategory
              ]}
            >
              <Text 
                style={[
                  styles.categoryText,
                  category.id === selectedCategory && styles.selectedCategoryText
                ]}
              >
                {category.name}
              </Text>
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'transparent',
  },
  selectedCategory: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
});