import { View } from 'react-native';

export function TabBarBackground() {
  return <View style={{ 
    flex: 1, 
    backgroundColor: '#0F0F23',
    borderTopWidth: 1,
    borderTopColor: '#8B5CF6'
  }} />;
}

export function useBottomTabOverflow() {
  return 0;
}