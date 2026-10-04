import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Foundation, Structure, Walls, WindowsDoors, Roof, Landscape } from '../three/BuildingModel';
import Lighting from '../three/Lighting';

const viewModes = [
  { id: '3d', label: '3D View' },
  { id: 'floor', label: 'Floor View' },
  { id: 'exterior', label: 'Exterior' },
  { id: 'day', label: 'Day' },
  { id: 'night', label: 'Night' },
];

function StudioScene({ viewMode }) {
  const isNight = viewMode === 'night';
  const isFloor = viewMode === 'floor';

  useFrame(({ camera, clock }) => {
    if (isFloor) {
      camera.position.set(0, 20, 0.1);
      camera.lookAt(0, 0, 0);
    } else {
      const t = clock.getElapsedTime() * 0.2;
      const r = 16;
      camera.position.x = Math.sin(t) * r;
      camera.position.z = Math.cos(t) * r;
      camera.position.y = 8;
      camera.lookAt(0, 4, 0);
    }
  });

  return (
    <>
      <Lighting progress={1} timeOfDay={isNight ? 'night' : 'day'} />
      <Foundation progress={1} />
      <Structure progress={1} />
      <Walls progress={1} />
      <WindowsDoors progress={1} />
      <Roof progress={1} />
      <Landscape progress={1} />
      <fog attach="fog" args={[isNight ? '#0a0a15' : '#1a1a1a', 25, 55]} />
    </>
  );
}

export default function DesignStudio() {
  const [viewMode, setViewMode] = useState('3d');

  return (
    <section className="section studio-section" id="studio">
      <div className="section-number">3D DESIGN STUDIO</div>
      <h2 className="section-heading">
        SEE YOUR BUILDING<br />BEFORE IT EXISTS.
      </h2>
      <div className="section-line" />
      <p className="section-text">
        Our 3D design capabilities allow you to explore every detail of your project 
        before a single brick is laid. Navigate through your future building, examine 
        materials, and experience the space in stunning detail.
      </p>

      <div className="studio-viewer">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [16, 8, 16], fov: 45 }}
          gl={{ antialias: true, alpha: false }}
          style={{ background: viewMode === 'night' ? '#0a0a15' : '#1a1a1a' }}
        >
          <Suspense fallback={null}>
            <StudioScene viewMode={viewMode} />
          </Suspense>
        </Canvas>

        <div className="studio-controls">
          {viewModes.map((mode) => (
            <button
              key={mode.id}
              className={`studio-control-btn ${viewMode === mode.id ? 'active' : ''}`}
              onClick={() => setViewMode(mode.id)}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="studio-cta">
        <button className="btn-outline" onClick={() => {
          const el = document.getElementById('contact');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}>
          EXPLORE 3D DESIGN
        </button>
      </div>
    </section>
  );
}
