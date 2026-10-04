import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Foundation } from '../three/BuildingModel';
import Lighting from '../three/Lighting';

function HeroCamera() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime() * 0.12;
    camera.position.x = Math.sin(t) * 16;
    camera.position.z = Math.cos(t) * 16;
    camera.position.y = 10;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function HeroScene() {
  return (
    <>
      <Lighting progress={0.3} />
      <HeroCamera />
      <Foundation progress={1} />
      <gridHelper args={[40, 40, '#c8a97e', '#1a1a1a']} position={[0, -0.58, 0]} />
      <fog attach="fog" args={['#0e0e0e', 18, 45]} />
    </>
  );
}

export default function Hero3D() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-canvas-container">
        <Canvas
          camera={{ position: [14, 10, 14], fov: 42 }}
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </Canvas>
      </div>

      <div className="hero-overlay">
        <div className="hero-arch-marks">
          <div className="arch-mark top-left" />
          <div className="arch-mark top-right" />
          <div className="arch-mark bottom-left" />
          <div className="arch-mark bottom-right" />
        </div>

        <h1 className="hero-title">
          <span>CITY</span><br /><span>CONSTRUCTIONS</span>
        </h1>
        <p className="hero-subtitle">
          WE BUILD MORE THAN STRUCTURES.<br />
          WE BUILD THE FUTURE.
        </p>
        <p className="hero-tagline">
          Construction &bull; Architecture &bull; Engineering &bull; 3D Design
        </p>
        <div className="hero-scroll-indicator">
          <span className="hero-scroll-text">Scroll to Build</span>
          <div className="hero-scroll-line" />
        </div>
      </div>

      <div className="hero-coords">
        <span>LAT 10.9617° N</span>
        <span>LON 79.3881° E</span>
      </div>
    </section>
  );
}
