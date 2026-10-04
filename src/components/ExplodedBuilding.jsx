import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Foundation, Structure, Walls, WindowsDoors, Roof, Landscape } from '../three/BuildingModel';
import Lighting from '../three/Lighting';
import * as THREE from 'three';

function ExplodedScene({ explodeProgress }) {
  const groupRef = useRef();

  // Calculate vertical offsets for each layer
  const sep = explodeProgress * 4; // max separation distance

  return (
    <>
      <Lighting progress={1} />

      {/* Landscape layer */}
      <group position={[0, -sep * 3, 0]}>
        <Landscape progress={1} />
      </group>

      {/* Foundation layer */}
      <group position={[0, -sep * 2, 0]}>
        <Foundation progress={1} />
      </group>

      {/* Structure layer */}
      <group position={[0, -sep, 0]}>
        <Structure progress={1} />
      </group>

      {/* Walls layer */}
      <group position={[0, 0, 0]}>
        <Walls progress={1} />
      </group>

      {/* Windows layer */}
      <group position={[0, sep, 0]}>
        <WindowsDoors progress={1} />
      </group>

      {/* Roof layer */}
      <group position={[0, sep * 2, 0]}>
        <Roof progress={1} />
      </group>

      <fog attach="fog" args={['#1a1a1a', 30, 70]} />
    </>
  );
}

function RotatingCamera() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime() * 0.15;
    camera.position.x = Math.sin(t) * 22;
    camera.position.z = Math.cos(t) * 22;
    camera.position.y = 14;
    camera.lookAt(0, 3, 0);
  });
  return null;
}

const layerLabels = [
  'LANDSCAPE',
  'FOUNDATION',
  'STRUCTURE',
  'WALL SYSTEM',
  'OPENINGS',
  'ROOF',
];

export default function ExplodedBuilding() {
  const sectionRef = useRef(null);
  const [explodeProgress, setExplodeProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / sectionHeight));

      // Explode in first half, reassemble in second half
      let explode;
      if (progress < 0.5) {
        explode = progress * 2; // 0 → 1
      } else {
        explode = 2 - progress * 2; // 1 → 0
      }
      setExplodeProgress(explode);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="exploded-section" ref={sectionRef} id="exploded">
      <div className="exploded-sticky">
        <div className="exploded-canvas">
          <Canvas
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [18, 14, 18], fov: 48 }}
            gl={{ antialias: true, alpha: false }}
            style={{ background: '#1a1a1a' }}
          >
            <Suspense fallback={null}>
              <ExplodedScene explodeProgress={explodeProgress} />
              <RotatingCamera />
            </Suspense>
          </Canvas>
        </div>

        {/* Heading */}
        <div style={{
          position: 'absolute',
          top: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          <div className="section-number">ASSEMBLY VIEW</div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(18px, 2.5vw, 32px)',
            fontWeight: 200,
            letterSpacing: 'clamp(3px, 0.6vw, 8px)',
            color: 'var(--warm-white)',
            textTransform: 'uppercase',
          }}>
            HOW IT ALL COMES TOGETHER
          </div>
        </div>

        {/* Labels */}
        <div className="exploded-labels" style={{
          right: '60px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}>
          {layerLabels.map((label, i) => (
            <div
              key={label}
              className={`exploded-label ${explodeProgress > 0.2 ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
