import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Enhanced3DScene from '../enhanced3d';

export default function Enhanced3DScreen() {
  return (
    <View style={styles.container}>
      <Enhanced3DScene />
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>Controles Avançados:</Text>
        <Text style={styles.instructionText}>• W/S/A/D/Q/E: Mover objeto</Text>
        <Text style={styles.instructionText}>• Setas: Rotacionar objeto</Text>
        <Text style={styles.instructionText}>• Mouse: Clique e arraste para orbitar</Text>
        <Text style={styles.instructionText}>• Roda do mouse: Zoom</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  instructions: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 10,
  },
  instructionText: {
    color: '#fff',
    fontSize: 14,
    marginVertical: 2,
  },
});