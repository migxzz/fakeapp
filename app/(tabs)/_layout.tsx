import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import { TabBarBackground } from '@/components/ui/TabBarBackground';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function TabLayout() {
  const backgroundColor = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
  const tabBarActiveTintColor = useThemeColor({ light: '#FF6B6B', dark: '#FF6B6B' }, 'tint');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          position: 'absolute',
          height: Platform.OS === 'ios' ? 90 : 70,
        },
        tabBarBackground: () => <TabBarBackground />,
        headerStyle: {
          backgroundColor,
        },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Cardápio',
          tabBarIcon: ({ color }) => <Ionicons name="restaurant" size={24} color={color} />,
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrinho',
          tabBarIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} />,
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
    </Tabs>
  );
}