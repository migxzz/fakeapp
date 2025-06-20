import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { TabBarBackground } from '../../components/ui/TabBarBackground';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light']?.tint ?? '#007AFF',
        tabBarBackground: () => <TabBarBackground />,
        tabBarStyle: {
          height: 90,
          paddingBottom: 20,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="3d"
        options={{
          title: '3D Básico',
          tabBarIcon: ({ color }) => <TabBarIcon name="cube" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="3d-advanced"
        options={{
          title: '3D Avançado',
          tabBarIcon: ({ color }) => <TabBarIcon name="cube-outline" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="enhanced-3d"
        options={{
          title: '3D SkyBox',
          tabBarIcon: ({ color }) => <TabBarIcon name="planet" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => <TabBarIcon name="menu" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}