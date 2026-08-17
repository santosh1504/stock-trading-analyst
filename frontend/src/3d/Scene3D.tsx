import { Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

const AIOrb       = lazy(() => import('./AIOrb').then(m => ({ default: m.AIOrb })));
const FloatingGraph = lazy(() => import('./FloatingGraph').then(m => ({ default: m.FloatingGraph })));
const MarketGrid  = lazy(() => import('./MarketGrid').then(m => ({ default: m.MarketGrid })));
const Particles   = lazy(() => import('./Particles').then(m => ({ default: m.Particles })));

interface Scene3DProps {
  prices?: number[];
  minimal?: boolean;
}

function SceneContent({ prices, minimal }: Scene3DProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#00d4ff" />
      <directionalLight position={[-5, -3, -5]} intensity={0.2} color="#003366" />
      {!minimal && <MarketGrid />}
      <Particles />
      <AIOrb position={[-2.2, 0.2, 0]} scale={1.1} />
      {!minimal && (
        <FloatingGraph prices={prices} position={[1.8, 0.1, 0]} />
      )}
      {!minimal && (
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.8}
          autoRotate
          autoRotateSpeed={0.4}
        />
      )}
    </>
  );
}

// Lightweight fallback for reduced-motion or weak devices
function FallbackBg() {
  return (
    <div className="absolute inset-0 bg-radial-navy opacity-80" aria-hidden="true">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 40% at 30% 50%, rgba(0,212,255,0.08) 0%, transparent 70%)',
      }} />
    </div>
  );
}

export function Scene3D({ prices, minimal = false }: Scene3DProps) {
  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return <FallbackBg />;
  }

  return (
    <div className="canvas-container" aria-hidden="true">
      <Suspense fallback={<FallbackBg />}>
        <Canvas
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          dpr={[1, 1.5]}
          style={{ background: 'transparent' }}
        >
          <SceneContent prices={prices} minimal={minimal} />
        </Canvas>
      </Suspense>
    </div>
  );
}
