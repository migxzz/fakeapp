import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Dimensions, Alert } from 'react-native';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import * as THREE from 'three';

// Skybox do Universo
function Skybox() {
  const { scene } = useThree();
  
  useEffect(() => {
    try {
      // Criar skybox do universo
      const geometry = new THREE.SphereGeometry(500, 60, 40);
      
      // Criar textura de estrelas procedural
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const context = canvas.getContext('2d');
      
      // Fundo preto do espaço
      context.fillStyle = '#000000';
      context.fillRect(0, 0, 1024, 1024);
      
      // Adicionar estrelas
      for (let i = 0; i < 2000; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const size = Math.random() * 2;
        const brightness = Math.random();
        
        context.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fill();
      }
      
      // Adicionar algumas nebulosas sutis em tons de cinza
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const size = Math.random() * 80 + 40;
        
        const nebulaGradient = context.createRadialGradient(x, y, 0, x, y, size);
        nebulaGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        nebulaGradient.addColorStop(1, 'transparent');
        
        context.fillStyle = nebulaGradient;
        context.fillRect(x - size, y - size, size * 2, size * 2);
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.MeshBasicMaterial({ 
        map: texture, 
        side: THREE.BackSide 
      });
      
      const skybox = new THREE.Mesh(geometry, material);
      scene.add(skybox);
      
      return () => {
        scene.remove(skybox);
      };
    } catch (error) {
      console.error("Erro ao carregar o skybox:", error);
    }
  }, [scene]);
  
  return null;
}

// Planeta Terra component
function Model({ position, rotation }) {
  const modelRef = useRef();

  // Texturas da Terra
  const earthTexture = new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/WorldMap-A_non-Frame.png/1024px-WorldMap-A_non-Frame.png');
  const bumpTexture = new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/5/56/Bump-map-demo-bumps.jpg');
  
  // Material da Terra
  const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    bumpMap: bumpTexture,
    bumpScale: 0.1,
    shininess: 100
  });

  // Animação de rotação da Terra
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.2; // Rotação mais lenta
    }
  });

  return (
    <mesh 
      ref={modelRef}
      position={position} 
      rotation={rotation}
      scale={[2, 2, 2]}
      castShadow
      receiveShadow
      material={earthMaterial}
    >
      <sphereGeometry args={[1, 64, 64]} />
    </mesh>
  );
}

// Scene component with custom controls
function Scene() {
  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const { camera, gl, scene } = useThree();
  
  // Refs para controle de mouse
  const mouseDown = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const cameraDistance = useRef(10);
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));
  
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

  // Custom mouse controls
  useEffect(() => {
    const handleMouseDown = (event) => {
      mouseDown.current = true;
      lastMousePosition.current = { x: event.clientX, y: event.clientY };
    };
    
    const handleMouseUp = () => {
      mouseDown.current = false;
    };
    
    const handleMouseMove = (event) => {
      if (mouseDown.current) {
        const deltaX = event.clientX - lastMousePosition.current.x;
        const deltaY = event.clientY - lastMousePosition.current.y;
        
        // Rotação horizontal (em torno do eixo Y)
        const horizontalAngle = deltaX * 0.01;
        
        // Rotação vertical (em torno do eixo X)
        const verticalAngle = deltaY * 0.01;
        
        // Calcular nova posição da câmera
        const phi = Math.acos(camera.position.y / cameraDistance.current);
        const theta = Math.atan2(camera.position.z, camera.position.x);
        
        const newPhi = Math.max(0.1, Math.min(Math.PI - 0.1, phi + verticalAngle));
        const newTheta = theta - horizontalAngle;
        
        const newX = cameraDistance.current * Math.sin(newPhi) * Math.cos(newTheta);
        const newY = cameraDistance.current * Math.cos(newPhi);
        const newZ = cameraDistance.current * Math.sin(newPhi) * Math.sin(newTheta);
        
        camera.position.set(newX, newY, newZ);
        camera.lookAt(cameraTarget.current);
        
        lastMousePosition.current = { x: event.clientX, y: event.clientY };
      }
    };
    
    const handleWheel = (event) => {
      // Zoom com a roda do mouse
      const zoomSpeed = 0.1;
      cameraDistance.current = Math.max(5, Math.min(20, cameraDistance.current + event.deltaY * zoomSpeed * 0.01));
      
      const direction = new THREE.Vector3().subVectors(camera.position, cameraTarget.current).normalize();
      camera.position.copy(direction.multiplyScalar(cameraDistance.current).add(cameraTarget.current));
    };
    
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('wheel', handleWheel);
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [camera]);

  // Inicializar a câmera
  useEffect(() => {
    camera.position.set(0, 5, 10);
    camera.lookAt(cameraTarget.current);
  }, [camera]);

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
      
      {/* Adicionar um plano para receber sombras */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
    </>
  );
}

export default function Enhanced3DScene() {
  return (
    <View style={styles.container}>
      {/* Header com frase motivacional */}
      <Animated.View 
        entering={FadeInDown.delay(300)}
        style={styles.header}
      >
        <ThemedText style={styles.headerTitle}>Planet Food</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          🌍 Estamos presentes no planeta todo! 🚀
        </ThemedText>
        <ThemedText style={styles.headerDescription}>
          Sabores galácticos entregues em qualquer lugar da Terra
        </ThemedText>
      </Animated.View>

      <Canvas
        gl={{ alpha: false, antialias: true }}
        camera={{ position: [0, 5, 10], fov: 45 }}
        style={styles.canvas}
        shadows
      >
        <Scene />
      </Canvas>

      {/* Painel de informações interativo */}
      <Animated.View 
        entering={FadeInUp.delay(600)}
        style={styles.infoPanel}
      >
        <View style={styles.statItem}>
          <Ionicons name="planet" size={24} color="#8B5CF6" />
          <ThemedText style={styles.statNumber}>195</ThemedText>
          <ThemedText style={styles.statLabel}>Países</ThemedText>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="rocket" size={24} color="#A855F7" />
          <ThemedText style={styles.statNumber}>24/7</ThemedText>
          <ThemedText style={styles.statLabel}>Entregas</ThemedText>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="star" size={24} color="#F59E0B" />
          <ThemedText style={styles.statNumber}>5.0</ThemedText>
          <ThemedText style={styles.statLabel}>Avaliação</ThemedText>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(15,15,35,0.95)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F3F4F6',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoPanel: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(15,15,35,0.95)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F3F4F6',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  canvas: {
    flex: 1,
  },
});