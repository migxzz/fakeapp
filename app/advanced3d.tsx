import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber/native';

import { Environment, useTexture } from '@react-three/drei/native';
import * as THREE from 'three';

// Skybox component using cube texture
function Skybox() {
  const { scene } = useThree();
  
  useEffect(() => {
    // Criar um skybox temporário com cores sólidas
    const geometry = new THREE.BoxGeometry(1000, 1000, 1000);
    const materialArray = [
      new THREE.MeshBasicMaterial({ color: 0x0077ff, side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ color: 0x00aaff, side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ color: 0x00ddff, side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ color: 0x005588, side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ color: 0x0099ff, side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ color: 0x0088cc, side: THREE.BackSide })
    ];
    
    const skybox = new THREE.Mesh(geometry, materialArray);
    scene.add(skybox);
    
    return () => {
      scene.remove(skybox);
    };
  }, [scene]);
  
  return null;
}

// Main model component
function Model({ position, rotation }) {
  const modelRef = useRef();

  // Animation
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <mesh ref={modelRef} position={position} rotation={rotation} scale={[1.5, 1.5, 1.5]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshPhysicalMaterial 
        color={0x88ccff}
        metalness={0.7}
        roughness={0.2}
        clearcoat={0.8}
        clearcoatRoughness={0.2}
        reflectivity={1.0}
      />
    </mesh>
  );
}

// Scene component with controls
function Scene() {
  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const { camera, gl } = useThree();
  const touchStartRef = useRef({ x: 0, y: 0 });
  const lastRotationRef = useRef([0, 0, 0]);
  
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

  // Auto-rotation animation
  useFrame((state, delta) => {
    // Apply subtle auto-rotation when not being controlled
    setRotation(prev => [prev[0], prev[1] + delta * 0.2, prev[2]]);
  });

  return (
    <>
      {/* Skybox */}
      <Skybox />
      
      {/* Main model */}
      <Model position={position} rotation={rotation} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={0.8} />
    </>
  );
}

export default function Advanced3DScene() {
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const [cameraPosition, setCameraPosition] = useState([0, 0, 10]);
  
  // Create pan responder for touch controls
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setTouchPosition({
          x: evt.nativeEvent.locationX,
          y: evt.nativeEvent.locationY
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        // Calculate camera movement based on touch
        const { dx, dy } = gestureState;
        const sensitivity = 0.05;
        
        setCameraPosition(prev => [
          prev[0] - dx * sensitivity,
          prev[1] + dy * sensitivity,
          prev[2]
        ]);
      }
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Canvas
        gl={{ alpha: false }}
        camera={{ position: cameraPosition, fov: 45 }}
        style={styles.canvas}
        shadows
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