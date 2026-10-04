import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Lighting({ progress = 1, timeOfDay = 'day' }) {
  const dirLightRef = useRef();

  const isNight = timeOfDay === 'night';

  const ambientIntensity = isNight ? 0.12 : 0.45;
  const dirIntensity = isNight ? 0.25 : 1.4;
  const dirColor = isNight ? '#4466aa' : '#fff5e0';

  useFrame(() => {
    if (dirLightRef.current) {
      dirLightRef.current.shadow.mapSize.width = 1024;
      dirLightRef.current.shadow.mapSize.height = 1024;
    }
  });

  return (
    <>
      <ambientLight intensity={ambientIntensity} color={isNight ? '#334466' : '#faf5ef'} />

      {/* Main sun / key light */}
      <directionalLight
        ref={dirLightRef}
        position={[12, 18, 10]}
        intensity={dirIntensity}
        color={dirColor}
        castShadow
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-camera-near={1}
        shadow-camera-far={60}
      />

      {/* Secondary fill light — opposite side */}
      <directionalLight
        position={[-10, 12, -8]}
        intensity={isNight ? 0.08 : 0.35}
        color={isNight ? '#2233aa' : '#c8d8ef'}
      />

      {/* Sky / ground hemisphere for realistic ambient */}
      <hemisphereLight
        skyColor={isNight ? '#112244' : '#b8d4f0'}
        groundColor={isNight ? '#1a1a1a' : '#8a7860'}
        intensity={isNight ? 0.15 : 0.5}
      />

      {/* Warm backlight for depth */}
      {progress > 0.5 && (
        <directionalLight
          position={[-5, 8, 12]}
          intensity={isNight ? 0.05 : 0.2}
          color="#ffe8c0"
        />
      )}

      {/* Night interior glow */}
      {isNight && progress > 0.5 && (
        <>
          <pointLight position={[0, 2.5, -2]} intensity={0.4} color="#ffcc66" distance={6} />
          <pointLight position={[0, 5.7, -2]} intensity={0.35} color="#ffcc66" distance={6} />
          <pointLight position={[0, 8.9, -2]} intensity={0.3} color="#ffcc66" distance={6} />
          <pointLight position={[3, 4, 0]} intensity={0.2} color="#ffe8b0" distance={5} />
        </>
      )}

      {/* Night exterior accent lights */}
      {isNight && progress > 0.7 && (
        <>
          <spotLight
            position={[0, 0, -6]}
            angle={0.5}
            penumbra={0.8}
            intensity={0.6}
            color="#ffd080"
            target-position={[0, 5, -3.5]}
            castShadow={false}
          />
        </>
      )}
    </>
  );
}
