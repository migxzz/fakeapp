import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInRight, 
  SlideOutLeft,
  Layout
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCart } from '@/contexts/CartContext';

// Dados de exemplo para o carrinho
const cartItems = [
  {
    id: '1',
    name: 'Hambúrguer Galáctico',
    price: 28.90,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1398&auto=format&fit=crop',
    quantity: 2,
  },
  {
    id: '5',
    name: 'Macarrão Nebulosa',
    price: 36.90,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=1471&auto=format&fit=crop',
    quantity: 1,
  },
];

export default function CartScreen() {
  const { items, updateQuantity, totalPrice } = useCart();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Nave de Carga</ThemedText>
      
      {items.length > 0 ? (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Animated.View
                entering={SlideInRight}
                exiting={SlideOutLeft}
                layout={Layout.springify()}
                style={styles.cartItem}
              >
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <ThemedText type="subtitle" numberOfLines={1}>{item.name}</ThemedText>
                  <ThemedText style={styles.itemPrice}>R$ {item.price.toFixed(2)}</ThemedText>
                </View>
                <View style={styles.quantityControl}>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, -1)}
                  >
                    <Ionicons name="remove" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                  <ThemedText style={styles.quantity}>{item.quantity}</ThemedText>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, 1)}
                  >
                    <Ionicons name="add" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
          />
          
          <Animated.View 
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.summaryContainer}
          >
            <ThemedView style={styles.summaryRow}>
              <ThemedText>Subtotal</ThemedText>
              <ThemedText>R$ {totalPrice.toFixed(2)}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.summaryRow}>
              <ThemedText>Taxa de entrega</ThemedText>
              <ThemedText>R$ 5.00</ThemedText>
            </ThemedView>
            <ThemedView style={[styles.summaryRow, styles.totalRow]}>
              <ThemedText type="subtitle">Total</ThemedText>
              <ThemedText type="subtitle" style={styles.totalPrice}>
                R$ {(totalPrice + 5).toFixed(2)}
              </ThemedText>
            </ThemedView>
            
            <TouchableOpacity style={styles.checkoutButton}>
              <ThemedText style={styles.checkoutButtonText}>
                Lançar Nave
              </ThemedText>
            </TouchableOpacity>
          </Animated.View>
        </>
      ) : (
        <ThemedView style={styles.emptyContainer}>
          <Ionicons name="rocket-outline" size={80} color="#8B5CF6" />
          <ThemedText style={styles.emptyText}>
            Sua nave está vazia
          </ThemedText>
          <TouchableOpacity style={styles.shopButton}>
            <ThemedText style={styles.shopButtonText}>
              Explorar Galáxia
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000011',
  },
  title: {
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#0F0F23',
    borderWidth: 1,
    borderColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemPrice: {
    marginTop: 4,
    color: '#A855F7',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 12,
    fontWeight: 'bold',
  },
  summaryContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#0F0F23',
    borderWidth: 1,
    borderColor: '#8B5CF6',
    marginBottom: 100,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalPrice: {
    color: '#A855F7',
  },
  checkoutButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  checkoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.7,
  },
  shopButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  shopButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});