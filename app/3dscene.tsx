import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber/native';

import { OrbitControls } from '@react-three/drei/native';
import * as THREE from 'three';

function Model({ position, rotation }) {
  return (
    <mesh position={position} rotation={rotation} scale={[1.5, 1.5, 1.5]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={0x88ccff} metalness={0.5} roughness={0.2} />
    </mesh>
  );
}

function Scene() {
  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const controlsRef = useRef();
  const { camera, gl } = useThree();
  
  // Custom keyboard controls
  useEffect(() => {
    const handleKeyDown = (event) => {
      const speed = 0.5;
      const rotSpeed = 0.1;
      
      switch(event.key) {
        // Position controls
        case 'w': setPosition(prev => [prev[0], prev[1] + speed, prev[2]]); break;
        case 's': setPosition(prev => [prev[0], prev[1] - speed, prev[2]]); break;
        case 'a': setPosition(prev => [prev[0] - speed, prev[1], prev[2]]); break;
        case 'd': setPosition(prev => [prev[0] + speed, prev[1], prev[2]]); break;
        case 'q': setPosition(prev => [prev[0], prev[1], prev[2] + speed]); break;
        case 'e': setPosition(prev => [prev[0], prev[1], prev[2] - speed]); break;
        
        // Rotation controls
        case 'ArrowUp': setRotation(prev => [prev[0] + rotSpeed, prev[1], prev[2]]); break;
        case 'ArrowDown': setRotation(prev => [prev[0] - rotSpeed, prev[1], prev[2]]); break;
        case 'ArrowLeft': setRotation(prev => [prev[0], prev[1] + rotSpeed, prev[2]]); break;
        case 'ArrowRight': setRotation(prev => [prev[0], prev[1] - rotSpeed, prev[2]]); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Custom animation
  useFrame((state, delta) => {
    if (controlsRef.current) {
      // Add subtle automatic rotation when not being controlled
      if (!controlsRef.current.isDragging) {
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 1;
      } else {
        controlsRef.current.autoRotate = false;
      }
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Main model */}
      <Model position={position} rotation={rotation} />
      

      
      {/* Custom controls that extend OrbitControls */}
      <OrbitControls 
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
      />
    </>
  );
}

export default function ThreeDScene() {
  return (
    <View style={styles.container}>
      <Canvas
        gl={{ alpha: false }}
        camera={{ position: [0, 0, 10], fov: 45 }}
        style={styles.canvas}
      >
        <Scene />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  canvas: {
    flex: 1,
  },
});