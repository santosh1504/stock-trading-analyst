import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AIOrbProps {
  position?: [number, number, number];
  scale?: number;
}

export function AIOrb({ position = [0, 0, 0], scale = 1 }: AIOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.2;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.15;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.4;
      innerRef.current.rotation.z = t * 0.3;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.15;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Outer glow shell */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.0, 64, 64]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#003366"
          emissiveIntensity={0.4}
          transparent
          opacity={0.12}
          wireframe={false}
        />
      </mesh>

      {/* Wireframe sphere */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.82, 24, 24]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.6}
          transparent
          opacity={0.35}
          wireframe
        />
      </mesh>

      {/* Core solid sphere */}
      <mesh>
        <sphereGeometry args={[0.55, 64, 64]} />
        <meshStandardMaterial
          color="#0a1628"
          emissive="#001a33"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Orbit ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.3, 0.018, 8, 80]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={1.0}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Ambient point light */}
      <pointLight color="#00d4ff" intensity={2} distance={5} />
    </group>
  );
}
