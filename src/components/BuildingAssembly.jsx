import React, { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Foundation, Structure, Walls, WindowsDoors, Roof, Landscape } from '../three/BuildingModel';
import CameraController from '../three/CameraController';
import Lighting from '../three/Lighting';

const stages = [
  { num: '01', title: 'FOUNDATION', desc: '"Every great structure begins with a strong foundation."', range: [0, 0.15] },
  { num: '02', title: 'STRUCTURE', desc: '"Precision in every connection."', range: [0.15, 0.30] },
  { num: '03', title: 'FORM', desc: '"From structure to space."', range: [0.30, 0.45] },
  { num: '04', title: 'DETAIL', desc: '"Designed down to the smallest detail."', range: [0.45, 0.60] },
  { num: '05', title: 'COMPLETION', desc: '"Where engineering becomes architecture."', range: [0.60, 0.75] },
  { num: '06', title: 'ENVIRONMENT', desc: '"Built for people. Designed for life."', range: [0.75, 0.90] },
  { num: '07', title: 'BUILT TO LAST', desc: '"Designed to belong."', range: [0.90, 1] },
];

function BuildingScene({ scrollProgress }) {
  const foundationP = Math.min(scrollProgress / 0.15, 1);
  const structureP = Math.max(0, Math.min((scrollProgress - 0.12) / 0.18, 1));
  const wallsP = Math.max(0, Math.min((scrollProgress - 0.28) / 0.17, 1));
  const windowsP = Math.max(0, Math.min((scrollProgress - 0.43) / 0.17, 1));
  const roofP = Math.max(0, Math.min((scrollProgress - 0.58) / 0.17, 1));
  const landscapeP = Math.max(0, Math.min((scrollProgress - 0.73) / 0.17, 1));

  const timeOfDay = scrollProgress > 0.92 ? 'night' : 'day';

  return (
    <>
      <Lighting progress={scrollProgress} timeOfDay={timeOfDay} />
      <CameraController scrollProgress={scrollProgress} isOrbit={scrollProgress > 0.95} />
      <Foundation progress={foundationP} />
      {scrollProgress > 0.1 && <Structure progress={structureP} />}
      {scrollProgress > 0.25 && <Walls progress={wallsP} />}
      {scrollProgress > 0.4 && <WindowsDoors progress={windowsP} />}
      {scrollProgress > 0.55 && <Roof progress={roofP} />}
      {scrollProgress > 0.7 && <Landscape progress={landscapeP} />}
      <fog attach="fog" args={[scrollProgress > 0.92 ? '#0a0a15' : '#1a1a1a', 25, 60]} />
    </>
  );
}

export default function BuildingAssembly() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / sectionHeight));
      setScrollProgress(progress);

      // Determine current stage
      for (let i = stages.length - 1; i >= 0; i--) {
        if (progress >= stages[i].range[0]) {
          setCurrentStage(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stage = stages[currentStage];

  return (
    <section className="scroll-3d-section" ref={sectionRef}>
      <div className="scroll-3d-sticky">
        <div className="scroll-3d-canvas">
          <Canvas
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [0, 18, 12], fov: 45 }}
            gl={{ antialias: true, alpha: false }}
            style={{ background: scrollProgress > 0.92 ? '#0a0a15' : '#1a1a1a' }}
          >
            <Suspense fallback={null}>
              <BuildingScene scrollProgress={scrollProgress} />
            </Suspense>
          </Canvas>
        </div>

        {/* Stage info */}
        <div className="scroll-stage-info left" style={{ opacity: scrollProgress > 0.01 && scrollProgress < 0.98 ? 1 : 0 }}>
          <div className="stage-number">{stage.num} — {stage.title}</div>
          <div className="stage-title">{stage.title}</div>
          <div className="stage-description">{stage.desc}</div>
        </div>

        {/* Progress bar */}
        <div className="scroll-progress-bar">
          <div className="scroll-progress-fill" style={{ height: `${scrollProgress * 100}%` }} />
          {stages.map((s, i) => (
            <div
              key={i}
              className="scroll-progress-label"
              style={{
                top: `${(s.range[0] + s.range[1]) / 2 * 100}%`,
                opacity: currentStage === i ? 1 : 0.3,
              }}
            >
              {s.num}
            </div>
          ))}
        </div>

        {/* Final text */}
        {scrollProgress > 0.93 && (
          <div style={{
            position: 'absolute',
            bottom: '80px',
            width: '100%',
            textAlign: 'center',
            zIndex: 10,
            opacity: Math.min((scrollProgress - 0.93) / 0.07, 1),
          }}>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(24px, 3.5vw, 48px)',
              fontWeight: 200,
              letterSpacing: 'clamp(4px, 1vw, 12px)',
              color: 'var(--warm-white)',
              textTransform: 'uppercase',
            }}>
              BUILT TO LAST.
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(16px, 2vw, 28px)',
              fontWeight: 200,
              letterSpacing: 'clamp(4px, 1vw, 10px)',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              marginTop: '8px',
            }}>
              DESIGNED TO BELONG.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
