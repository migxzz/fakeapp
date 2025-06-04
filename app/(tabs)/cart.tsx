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

// Dados de exemplo para o carrinho
const cartItems = [
  {
    id: '1',
    name: 'Hambúrguer Artesanal',
    price: 28.90,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1398&auto=format&fit=crop',
    quantity: 2,
  },
  {
    id: '5',
    name: 'Macarrão à Carbonara',
    price: 36.90,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=1471&auto=format&fit=crop',
    quantity: 1,
  },
];

export default function CartScreen() {
  const [items, setItems] = React.useState(cartItems);

  const updateQuantity = (id: string, change: number) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Seu Carrinho</ThemedText>
      
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
                    <Ionicons name="remove" size={18} color="#FF6B6B" />
                  </TouchableOpacity>
                  <ThemedText style={styles.quantity}>{item.quantity}</ThemedText>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, 1)}
                  >
                    <Ionicons name="add" size={18} color="#FF6B6B" />
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
                Finalizar Pedido
              </ThemedText>
            </TouchableOpacity>
          </Animated.View>
        </>
      ) : (
        <ThemedView style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <ThemedText style={styles.emptyText}>
            Seu carrinho está vazio
          </ThemedText>
          <TouchableOpacity style={styles.shopButton}>
            <ThemedText style={styles.shopButtonText}>
              Explorar Cardápio
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
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    color: '#FF6B6B',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
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
    backgroundColor: '#f9f9f9',
    marginBottom: 100, // Espaço para a tab bar
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
    color: '#FF6B6B',
  },
  checkoutButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
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
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '80%',
  },
  shopButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});