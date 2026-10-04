import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const cameraStages = [
  // Stage 0: Foundation — elevated top-down view of the site
  { position: [0, 20, 14], lookAt: [0, 0, 0], fov: 45 },
  // Stage 1: Structure — dramatic low-angle looking up at columns
  { position: [14, 3, 10], lookAt: [0, 5, 0], fov: 50 },
  // Stage 2: Walls — exterior three-quarter perspective
  { position: [-13, 7, -10], lookAt: [0, 4, 0], fov: 46 },
  // Stage 3: Windows/Doors — closer front view to see entrance and windows
  { position: [4, 4, -12], lookAt: [0, 3.5, -3], fov: 44 },
  // Stage 4: Roof — elevated angle showing roof details
  { position: [-6, 18, -10], lookAt: [0, 8, 0], fov: 48 },
  // Stage 5: Landscape — wide establishing shot with compound wall
  { position: [-18, 10, 12], lookAt: [0, 3, 0], fov: 52 },
  // Stage 6: Final — cinematic three-quarter beauty shot
  { position: [15, 9, -13], lookAt: [0, 4, 0], fov: 46 },
];

export default function CameraController({ scrollProgress = 0, isOrbit = false }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 20, 14));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentPos = useRef(new THREE.Vector3(0, 20, 14));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const orbitAngle = useRef(0);

  useFrame((state, delta) => {
    if (isOrbit) {
      orbitAngle.current += delta * 0.15;
      const radius = 20;
      const x = Math.sin(orbitAngle.current) * radius;
      const z = Math.cos(orbitAngle.current) * radius;
      targetPos.current.set(x, 10, z);
      targetLookAt.current.set(0, 4, 0);
    } else {
      const totalStages = cameraStages.length;
      const stageFloat = scrollProgress * (totalStages - 1);
      const stageIndex = Math.min(Math.floor(stageFloat), totalStages - 2);
      const stageFraction = stageFloat - stageIndex;

      const from = cameraStages[stageIndex];
      const to = cameraStages[stageIndex + 1];

      // Smoothstep interpolation for cinematic feel
      const t = stageFraction * stageFraction * (3 - 2 * stageFraction);

      targetPos.current.set(
        THREE.MathUtils.lerp(from.position[0], to.position[0], t),
        THREE.MathUtils.lerp(from.position[1], to.position[1], t),
        THREE.MathUtils.lerp(from.position[2], to.position[2], t),
      );

      targetLookAt.current.set(
        THREE.MathUtils.lerp(from.lookAt[0], to.lookAt[0], t),
        THREE.MathUtils.lerp(from.lookAt[1], to.lookAt[1], t),
        THREE.MathUtils.lerp(from.lookAt[2], to.lookAt[2], t),
      );
    }

    // Smooth camera movement with damping
    const lerpSpeed = 2.5;
    currentPos.current.lerp(targetPos.current, 1 - Math.exp(-lerpSpeed * delta));
    currentLookAt.current.lerp(targetLookAt.current, 1 - Math.exp(-lerpSpeed * delta));

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
    camera.updateProjectionMatrix();
  });

  return null;
}
