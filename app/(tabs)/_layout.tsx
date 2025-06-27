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
          backgroundColor: '#0F0F23',
          borderTopColor: '#8B5CF6',
          borderTopWidth: 1,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Planeta',
          tabBarIcon: ({ color }) => <TabBarIcon name="planet" color={color} />,
        }}
      />


      <Tabs.Screen
        name="enhanced-3d"
        options={{
          title: 'Terra 3D',
          tabBarIcon: ({ color }) => <TabBarIcon name="earth" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Cardápio',
          tabBarIcon: ({ color }) => <TabBarIcon name="restaurant" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Astronauta',
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