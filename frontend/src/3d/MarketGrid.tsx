import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function MarketGrid() {
  const gridRef = useRef<THREE.GridHelper>(null!);
  const grid2Ref = useRef<THREE.GridHelper>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (gridRef.current) {
      gridRef.current.position.z = (t * 0.4) % 4;
    }
    if (grid2Ref.current) {
      grid2Ref.current.position.z = ((t * 0.4) % 4) - 4;
    }
  });

  const gridMaterial = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      color: '#003344',
      transparent: true,
      opacity: 0.45,
    });
    return mat;
  }, []);

  return (
    <group position={[0, -2.5, 0]} rotation={[0, 0, 0]}>
      <primitive
        ref={gridRef}
        object={new THREE.GridHelper(12, 20, '#004455', '#002233')}
        position={[0, 0, 0]}
      />
      <primitive
        ref={grid2Ref}
        object={new THREE.GridHelper(12, 20, '#004455', '#002233')}
        position={[0, 0, -4]}
      />
    </group>
  );
}
