import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import * as THREE from 'three';

// Skybox component using cube texture
function Skybox() {
  const { scene } = useThree();
  
  useEffect(() => {
    try {
      
      const geometry = new THREE.BoxGeometry(1000, 1000, 1000);
      const materialArray = [
        new THREE.MeshBasicMaterial({ color: 0x0077ff, side: THREE.BackSide }), // direita
        new THREE.MeshBasicMaterial({ color: 0x00aaff, side: THREE.BackSide }), // esquerda
        new THREE.MeshBasicMaterial({ color: 0x00ddff, side: THREE.BackSide }), // topo
        new THREE.MeshBasicMaterial({ color: 0x005588, side: THREE.BackSide }), // base
        new THREE.MeshBasicMaterial({ color: 0x0099ff, side: THREE.BackSide }), // frente
        new THREE.MeshBasicMaterial({ color: 0x0088cc, side: THREE.BackSide })  // trás
      ];
      
      const skybox = new THREE.Mesh(geometry, materialArray);
      scene.add(skybox);
      

      
      return () => {
        scene.remove(skybox);
        scene.background = null;
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
      <Canvas
        gl={{ alpha: false, antialias: true }}
        camera={{ position: [0, 5, 10], fov: 45 }}
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