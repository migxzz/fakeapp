import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Enhanced3DScene from '../enhanced3d';

export default function Enhanced3DScreen() {
  return (
    <View style={styles.container}>
      <Enhanced3DScene />
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>Controles da Nave Espacial:</Text>
        <Text style={styles.instructionText}>• W/S/A/D/Q/E: Mover a Terra</Text>
        <Text style={styles.instructionText}>• Setas: Rotacionar planeta</Text>
        <Text style={styles.instructionText}>• Mouse: Orbitar pelo universo</Text>
        <Text style={styles.instructionText}>• Roda do mouse: Aproximar/Afastar</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000011',
  },
  instructions: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(15,15,35,0.9)',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  instructionText: {
    color: '#F3F4F6',
    fontSize: 14,
    marginVertical: 2,
    fontWeight: '500',
  },
});