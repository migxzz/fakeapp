import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const menuItems = [
  { id: 'orders', title: 'Meus Pedidos', icon: 'receipt-outline' },
  { id: 'favorites', title: 'Favoritos', icon: 'heart-outline' },
  { id: 'address', title: 'Endereços', icon: 'location-outline' },
  { id: 'payment', title: 'Métodos de Pagamento', icon: 'card-outline' },
  { id: 'settings', title: 'Configurações', icon: 'settings-outline' },
  { id: 'help', title: 'Ajuda', icon: 'help-circle-outline' },
];

export default function ProfileScreen() {
  const avatarScale = useSharedValue(1);
  
  const handleAvatarPress = () => {
    avatarScale.value = withSpring(1.2, { damping: 10 }, () => {
      avatarScale.value = withSpring(1);
    });
  };
  
  const avatarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: avatarScale.value }],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={handleAvatarPress}>
          <Animated.View style={[styles.avatarContainer, avatarStyle]}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
              style={styles.avatar}
            />
          </Animated.View>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.name}>João Silva</ThemedText>
        <ThemedText style={styles.email}>joao.silva@exemplo.com</ThemedText>
      </ThemedView>

      <ThemedView style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <Animated.View
            key={item.id}
            entering={FadeInDown.delay(index * 100).springify()}
          >
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon} size={22} color="#FF6B6B" />
              </View>
              <ThemedText style={styles.menuTitle}>{item.title}</ThemedText>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ThemedView>

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
        <ThemedText style={styles.logoutText}>Sair</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FF6B6B',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    marginTop: 16,
  },
  email: {
    opacity: 0.7,
    marginTop: 4,
  },
  menuContainer: {
    marginTop: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    marginBottom: 100, // Espaço para a tab bar
  },
  logoutText: {
    color: '#FF6B6B',
    fontWeight: '500',
    marginLeft: 8,
  },
});