import React, { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Foundation, Structure, Walls, WindowsDoors, Roof, Landscape } from '../three/BuildingModel';
import Lighting from '../three/Lighting';
import * as THREE from 'three';

const blueprintStages = [
  { label: 'BLUEPRINT', desc: 'Plan' },
  { label: '3D WIREFRAME', desc: 'Design' },
  { label: 'STRUCTURAL MODEL', desc: 'Build' },
  { label: 'MATERIALIZED', desc: 'Deliver' },
  { label: 'FINISHED BUILDING', desc: 'Complete' },
];

function BlueprintScene({ progress }) {
  const groupRef = useRef();

  // Map progress to building completeness
  const buildP = progress;
  const foundationP = Math.min(buildP / 0.2, 1);
  const structureP = Math.max(0, Math.min((buildP - 0.15) / 0.25, 1));
  const wallsP = Math.max(0, Math.min((buildP - 0.35) / 0.25, 1));
  const windowsP = Math.max(0, Math.min((buildP - 0.55) / 0.25, 1));
  const roofP = Math.max(0, Math.min((buildP - 0.7) / 0.3, 1));
  const landscapeP = Math.max(0, Math.min((buildP - 0.85) / 0.15, 1));

  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime() * 0.1 + progress * Math.PI;
    const radius = 16 + (1 - progress) * 5;
    camera.position.x = Math.sin(t) * radius;
    camera.position.z = Math.cos(t) * radius;
    camera.position.y = 8 + (1 - progress) * 8;
    camera.lookAt(0, 3, 0);
  });

  return (
    <>
      <Lighting progress={buildP} timeOfDay={progress > 0.9 ? 'night' : 'day'} />
      <Foundation progress={foundationP} />
      {buildP > 0.1 && <Structure progress={structureP} />}
      {buildP > 0.3 && <Walls progress={wallsP} />}
      {buildP > 0.5 && <WindowsDoors progress={windowsP} />}
      {buildP > 0.65 && <Roof progress={roofP} />}
      {buildP > 0.8 && <Landscape progress={landscapeP} />}
      <fog attach="fog" args={['#1a1a1a', 25, 55]} />
    </>
  );
}

export default function BlueprintToBuilding() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -rect.top / sectionHeight));
      setProgress(p);
      setCurrentStage(Math.min(Math.floor(p * blueprintStages.length), blueprintStages.length - 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stage = blueprintStages[currentStage];

  return (
    <section className="blueprint-section" ref={sectionRef}>
      <div className="blueprint-sticky">
        <div className="blueprint-canvas">
          <Canvas
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [20, 16, 20], fov: 45 }}
            gl={{ antialias: true, alpha: false }}
            style={{ background: '#1a1a1a' }}
          >
            <Suspense fallback={null}>
              <BlueprintScene progress={progress} />
            </Suspense>
          </Canvas>
        </div>

        <div className="blueprint-info" style={{
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}>
          <div className="blueprint-step">
            FROM BLUEPRINT TO BUILDING
          </div>
          <div className="blueprint-title">{stage.label}</div>
          <div style={{
            display: 'flex',
            gap: '32px',
            justifyContent: 'center',
            marginTop: '24px',
          }}>
            {blueprintStages.map((s, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                opacity: currentStage >= i ? 1 : 0.3,
                transition: 'opacity 0.5s',
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: currentStage >= i ? 'var(--accent)' : 'var(--dark-gray)',
                  transition: 'background 0.5s',
                }} />
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8px',
                  letterSpacing: '2px',
                  color: 'var(--concrete)',
                  textTransform: 'uppercase',
                }}>
                  {s.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
