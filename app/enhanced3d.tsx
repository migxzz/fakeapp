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

// Pizza orbitando component
function OrbitingPizza() {
  const pizzaRef = useRef();
  const orbitRadius = 4;
  
  // Textura de pizza real
  const pizzaTexture = new THREE.TextureLoader().load('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500&auto=format&fit=crop');
  const crustTexture = new THREE.TextureLoader().load('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop');
  
  useFrame((state) => {
    if (pizzaRef.current) {
      const time = state.clock.elapsedTime;
      pizzaRef.current.position.x = Math.cos(time * 0.5) * orbitRadius;
      pizzaRef.current.position.z = Math.sin(time * 0.5) * orbitRadius;
      pizzaRef.current.position.y = Math.sin(time * 0.3) * 0.5;
      pizzaRef.current.rotation.y += 0.02;
    }
  });
  
  return (
    <group ref={pizzaRef} scale={[0.4, 0.4, 0.4]}>
      {/* Base da pizza */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <meshPhongMaterial map={pizzaTexture} />
      </mesh>
      
      {/* Borda da pizza */}
      <mesh position={[0, 0.05, 0]}>
        <torusGeometry args={[1, 0.08, 8, 32]} />
        <meshPhongMaterial map={crustTexture} />
      </mesh>
      
      {/* Pepperonis */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 0.6;
        return (
          <mesh 
            key={i}
            position={[
              Math.cos(angle) * radius,
              0.06,
              Math.sin(angle) * radius
            ]}
          >
            <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
            <meshPhongMaterial color={0x8B0000} />
          </mesh>
        );
      })}
    </group>
  );
}

// Hambúrguer orbitando
function OrbitingBurger() {
  const burgerRef = useRef();
  const orbitRadius = 5;
  
  const bunTexture = new THREE.TextureLoader().load('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop');
  
  useFrame((state) => {
    if (burgerRef.current) {
      const time = state.clock.elapsedTime;
      const offset = Math.PI / 2; // 90 graus de diferença da pizza
      burgerRef.current.position.x = Math.cos(time * 0.5 + offset) * orbitRadius;
      burgerRef.current.position.z = Math.sin(time * 0.5 + offset) * orbitRadius;
      burgerRef.current.position.y = Math.sin(time * 0.4) * 0.3;
      burgerRef.current.rotation.y += 0.015;
    }
  });
  
  return (
    <group ref={burgerRef} scale={[0.3, 0.3, 0.3]}>
      {/* Pão de cima */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.8, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhongMaterial map={bunTexture} />
      </mesh>
      
      {/* Carne */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.2, 32]} />
        <meshPhongMaterial color={0x8B4513} />
      </mesh>
      
      {/* Queijo */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 0.05, 32]} />
        <meshPhongMaterial color={0xFFD700} />
      </mesh>
      
      {/* Pão de baixo */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
        <meshPhongMaterial map={bunTexture} />
      </mesh>
    </group>
  );
}

// Refrigerante orbitando
function OrbitingSoda() {
  const sodaRef = useRef();
  const orbitRadius = 4.5;
  
  useFrame((state) => {
    if (sodaRef.current) {
      const time = state.clock.elapsedTime;
      const offset = Math.PI; // 180 graus
      sodaRef.current.position.x = Math.cos(time * 0.5 + offset) * orbitRadius;
      sodaRef.current.position.z = Math.sin(time * 0.5 + offset) * orbitRadius;
      sodaRef.current.position.y = Math.sin(time * 0.6) * 0.4;
      sodaRef.current.rotation.y += 0.01;
    }
  });
  
  return (
    <group ref={sodaRef} scale={[0.25, 0.25, 0.25]}>
      {/* Lata */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
        <meshPhongMaterial color={0xFF0000} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Tampa */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshPhongMaterial color={0xC0C0C0} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Logo simulado */}
      <mesh position={[0, 0.2, 0.51]}>
        <planeGeometry args={[0.8, 0.4]} />
        <meshPhongMaterial color={0xFFFFFF} />
      </mesh>
    </group>
  );
}

// Sushi orbitando
function OrbitingSushi() {
  const sushiRef = useRef();
  const orbitRadius = 3.5;
  
  const riceTexture = new THREE.TextureLoader().load('https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500&auto=format&fit=crop');
  
  useFrame((state) => {
    if (sushiRef.current) {
      const time = state.clock.elapsedTime;
      const offset = (3 * Math.PI) / 2; // 270 graus
      sushiRef.current.position.x = Math.cos(time * 0.5 + offset) * orbitRadius;
      sushiRef.current.position.z = Math.sin(time * 0.5 + offset) * orbitRadius;
      sushiRef.current.position.y = Math.sin(time * 0.7) * 0.2;
      sushiRef.current.rotation.y += 0.025;
    }
  });
  
  return (
    <group ref={sushiRef} scale={[0.4, 0.4, 0.4]}>
      {/* Arroz */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.3, 32]} />
        <meshPhongMaterial map={riceTexture} />
      </mesh>
      
      {/* Peixe */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1, 0.1, 0.8]} />
        <meshPhongMaterial color={0xFF6B6B} />
      </mesh>
      
      {/* Nori (alga) */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 0.02, 32]} />
        <meshPhongMaterial color={0x2F4F2F} />
      </mesh>
    </group>
  );
}

// Planeta Terra component
function Model({ position, rotation }) {
  const modelRef = useRef();

  // Carregando só a textura principal
  const earthTexture = new THREE.TextureLoader().load('/earth_albedo.jpg');
  
  // Material da Terra só com textura (mais rápido)
  const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture
  });

  // Animação de rotação da Terra
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.2;
      // Nuvens giram um pouco mais rápido
      if (modelRef.current.children[1]) {
        modelRef.current.children[1].rotation.y += delta * 0.25;
      }
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
      
      {/* Comidas orbitando */}
      <OrbitingPizza />
      <OrbitingBurger />
      <OrbitingSoda />
      <OrbitingSushi />
      
      {/* Lighting - iluminando a Terra toda */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={1.2} />
      <directionalLight position={[0, 0, 10]} intensity={1} />
      <directionalLight position={[0, 0, -10]} intensity={1} />
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