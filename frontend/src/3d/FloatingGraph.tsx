import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingGraphProps {
  prices?: number[];
  position?: [number, number, number];
}

const DEFAULT_PRICES = [100, 105, 103, 108, 112, 110, 115, 118, 116, 122];

export function FloatingGraph({ prices = DEFAULT_PRICES, position = [0, 0, 0] }: FloatingGraphProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const lineRef = useRef<THREE.Line>(null!);

  const geometry = useMemo(() => {
    const pts = prices.map((p, i) => {
      const x = (i / (prices.length - 1)) * 4 - 2;
      const minP = Math.min(...prices);
      const maxP = Math.max(...prices);
      const range = maxP - minP || 1;
      const y = ((p - minP) / range) * 1.5 - 0.75;
      return new THREE.Vector3(x, y, 0);
    });
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    return geo;
  }, [prices]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.25;
      groupRef.current.position.y = position[1] + Math.sin(t * 0.4) * 0.1;
    }
  });

  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: '#00ff88',
        transparent: true,
        opacity: 0.85,
      }),
    []
  );

  return (
    <group ref={groupRef} position={position}>
      {/* Grid base plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
        <planeGeometry args={[4.5, 2]} />
        <meshStandardMaterial
          color="#0a1628"
          transparent
          opacity={0.3}
          wireframe={false}
        />
      </mesh>

      {/* Price line */}
      <primitive object={new THREE.Line(geometry, material)} ref={lineRef} />

      {/* Dots at each price point */}
      {prices.map((p, i) => {
        const x = (i / (prices.length - 1)) * 4 - 2;
        const minP = Math.min(...prices);
        const maxP = Math.max(...prices);
        const range = maxP - minP || 1;
        const y = ((p - minP) / range) * 1.5 - 0.75;
        return (
          <mesh key={i} position={[x, y, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial
              color="#00ff88"
              emissive="#00ff88"
              emissiveIntensity={1.2}
            />
          </mesh>
        );
      })}

      <pointLight color="#00ff88" intensity={0.8} distance={4} />
    </group>
  );
}
