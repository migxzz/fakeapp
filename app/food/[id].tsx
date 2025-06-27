import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
  Easing,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { foodItems } from '@/services/foodData';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.4;

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const food = foodItems.find(item => item.id === id);
  
  const scrollY = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const heartScale = useSharedValue(1);
  const isFavorite = useSharedValue(0);
  
  // Animação para entrada da tela
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);
  
  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 500 });
    contentTranslateY.value = withTiming(0, { duration: 500 });
  }, []);
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  
  const imageAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.2, 1],
      Extrapolate.CLAMP
    );
    
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -50],
      Extrapolate.CLAMP
    );
    
    const opacity = interpolate(
      scrollY.value,
      [0, 100, 200],
      [1, 0.8, 0],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ scale }, { translateY }],
      opacity,
    };
  });
  
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [100, 150],
      [0, 1],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });
  
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: contentTranslateY.value }],
    };
  });
  
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  const handleAddToCart = () => {
    buttonScale.value = withSpring(0.9, {}, () => {
      buttonScale.value = withSpring(1);
    });
    
    // Adicionar ao carrinho
    addToCart({
      id: food.id,
      name: food.name,
      price: food.price,
      image: food.image
    });
    
    showToast(`${food.name} adicionado à nave! 🚀`);
  };
  
  const handleToggleFavorite = () => {
    isFavorite.value = isFavorite.value ? 0 : 1;
    heartScale.value = withSpring(1.3, {}, () => {
      heartScale.value = withSpring(1);
    });
  };
  
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });
  
  const heartAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolate(
      isFavorite.value,
      [0, 1],
      [0, 1]
    );
    
    return {
      transform: [{ scale: heartScale.value }],
      color: color ? '#FF6B6B' : '#ccc',
    };
  });
  
  if (!food) {
    return (
      <ThemedView style={styles.notFound}>
        <ThemedText>Produto não encontrado na galáxia</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header animado */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <ThemedText type="subtitle" numberOfLines={1}>
          {food.name}
        </ThemedText>
      </Animated.View>
      
      {/* Botão de voltar */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      {/* Botão de favorito */}
      <TouchableOpacity 
        style={styles.favoriteButton} 
        onPress={handleToggleFavorite}
      >
        <Animated.View style={heartAnimatedStyle}>
          <Ionicons 
            name={isFavorite.value ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite.value ? "#FF6B6B" : "white"} 
          />
        </Animated.View>
      </TouchableOpacity>
      
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Imagem com efeito parallax */}
        <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
          <Image source={{ uri: food.image }} style={styles.image} />
          <View style={styles.imageDarkOverlay} />
        </Animated.View>
        
        {/* Conteúdo */}
        <Animated.View style={[styles.contentContainer, contentAnimatedStyle]}>
          <ThemedText type="title" style={styles.name}>{food.name}</ThemedText>
          <ThemedText style={styles.price}>R$ {food.price.toFixed(2)}</ThemedText>
          
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle">Descrição</ThemedText>
            <ThemedText style={styles.description}>{food.description}</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle">Ingredientes</ThemedText>
            <View style={styles.ingredientsList}>
              {food.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#8B5CF6" />
                  <ThemedText style={styles.ingredientText}>{ingredient}</ThemedText>
                </View>
              ))}
            </View>
          </ThemedView>
        </Animated.View>
      </Animated.ScrollView>
      
      {/* Botão de adicionar ao carrinho */}
      <Animated.View style={[styles.bottomBar, buttonAnimatedStyle]}>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <ThemedText style={styles.addToCartText}>
            Adicionar à Nave
          </ThemedText>
        </TouchableOpacity>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000011',
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#0F0F23',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#8B5CF6',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    width: SCREEN_WIDTH,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imageDarkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  contentContainer: {
    padding: 20,
    marginTop: -30,
    backgroundColor: '#0F0F23',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  name: {
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A855F7',
    marginBottom: 16,
  },
  section: {
    marginTop: 24,
  },
  description: {
    marginTop: 8,
    lineHeight: 22,
  },
  ingredientsList: {
    marginTop: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientText: {
    marginLeft: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#0F0F23',
    borderTopWidth: 1,
    borderTopColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  addToCartButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  addToCartText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});