import React, { useMemo } from 'react';
import * as THREE from 'three';

/* ─── Realistic Colour Palette ─── */
const C = {
  wallMain: '#e8ddd0', wallAccent: '#d4c8b8', wallSide: '#ddd2c4', wallBase: '#b8a898',
  concrete: '#a09890', concreteLight: '#c0b8b0', concreteDark: '#706860', plinth: '#887868',
  glass: '#8aacbe', glassDark: '#5a7a8e', frameDark: '#2a2a2a', frameGray: '#4a4a4a',
  metalRail: '#555555', metalDark: '#333333',
  wood: '#8B6914', woodDark: '#6a4a0a', tileRoof: '#6a5a4a', waterTank: '#7a8a7a',
  ground: '#8a8070', grassDark: '#3a5a28', grassLight: '#4a7a30', soil: '#6a5a40',
  road: '#444444', roadMark: '#cccccc', paver: '#a09080', paverAlt: '#908070',
  trunk: '#5a3a1a', leaf1: '#2a6a1a', leaf2: '#3a7a20', leaf3: '#1a5a10',
  accent: '#c8a97e', nameBoard: '#1a1a2a', lightWarm: '#ffd700',
};

function m(color, opacity, roughness = 0.75, metalness = 0.05) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, transparent: true, opacity });
}

function gm(opacity = 0.35) {
  return new THREE.MeshPhysicalMaterial({
    color: C.glass, roughness: 0.05, metalness: 0.1, transparent: true, opacity,
    transmission: 0.5, thickness: 0.05, side: THREE.DoubleSide,
  });
}

function Box({ pos, size, material, rot }) {
  return (
    <mesh position={pos} rotation={rot || [0, 0, 0]} material={material} castShadow receiveShadow>
      <boxGeometry args={size} />
    </mesh>
  );
}

/* ════════════════ FOUNDATION ════════════════ */
export function Foundation({ progress = 1 }) {
  const o = Math.min(progress * 2, 1);
  const mGround = useMemo(() => m(C.ground, o, 0.95), [o]);
  const mConc = useMemo(() => m(C.concreteDark, o, 0.85, 0.15), [o]);
  const mPlinth = useMemo(() => m(C.plinth, o, 0.8), [o]);
  const mGrid = useMemo(() => m(C.accent, o * 0.25, 0.5, 0.3), [o]);
  const mPaver = useMemo(() => m(C.paver, o, 0.9), [o]);

  const footings = useMemo(() => {
    const arr = [];
    for (let x = -5; x <= 5; x += 2.5) for (let z = -3; z <= 3; z += 3) arr.push([x, -0.35, z]);
    return arr;
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} material={mGround} receiveShadow>
        <planeGeometry args={[36, 30]} />
      </mesh>
      <Box pos={[0, -0.55, 0]} size={[16, 0.08, 12]} material={mPaver} />
      <Box pos={[0, -0.35, 0]} size={[12, 0.5, 8]} material={mConc} />
      <Box pos={[0, 0.05, 0]} size={[11.6, 0.4, 7.6]} material={mPlinth} />
      {footings.map((p, i) => <Box key={`ft-${i}`} pos={p} size={[1.0, 0.7, 1.0]} material={mConc} />)}
      {[-5, -2.5, 0, 2.5, 5].map((x, i) => <Box key={`gx-${i}`} pos={[x, 0.01, 0]} size={[0.015, 0.005, 9]} material={mGrid} />)}
      {[-3, 0, 3].map((z, i) => <Box key={`gz-${i}`} pos={[0, 0.01, z]} size={[12, 0.005, 0.015]} material={mGrid} />)}
      {[[0, -0.3, -6.2, 16, 0.3, 0.3], [0, -0.3, 6.2, 16, 0.3, 0.3], [-8.1, -0.3, 0, 0.3, 0.3, 12.7], [8.1, -0.3, 0, 0.3, 0.3, 12.7]].map((a, i) =>
        <Box key={`cwf-${i}`} pos={[a[0], a[1], a[2]]} size={[a[3], a[4], a[5]]} material={mConc} />
      )}
    </group>
  );
}

/* ════════════════ STRUCTURE ════════════════ */
export function Structure({ progress = 0 }) {
  const floorH = 3.2, floors = 3;
  const s = Math.min(progress, 1);
  const o = Math.min(progress * 1.5, 1);
  const mCol = useMemo(() => m(C.concrete, o, 0.6, 0.15), [o]);
  const mBeam = useMemo(() => m(C.concreteLight, o, 0.55, 0.12), [o]);
  const mSlab = useMemo(() => m(C.concrete, o, 0.7, 0.1), [o]);

  const colPositions = useMemo(() => {
    const arr = [];
    for (let x = -5; x <= 5; x += 2.5) for (let z = -3; z <= 3; z += 3) arr.push([x, z]);
    return arr;
  }, []);

  const bp = Math.min(Math.max((progress - 0.35) / 0.35, 0), 1);
  const bpz = Math.min(Math.max((progress - 0.4) / 0.35, 0), 1);
  const sp = Math.min(Math.max((progress - 0.55) / 0.45, 0), 1);

  return (
    <group>
      {colPositions.map((p, ci) => (
        <group key={`cg-${ci}`}>
          {Array.from({ length: floors }).map((_, f) => (
            <Box key={`c-${ci}-${f}`} pos={[p[0], 0.25 + f * floorH + (floorH * s) / 2, p[1]]} size={[0.3, floorH * s, 0.3]} material={mCol} />
          ))}
        </group>
      ))}
      {bp > 0 && Array.from({ length: floors }).map((_, f) =>
        [-3, 0, 3].map((z, zi) => <Box key={`bx-${f}-${zi}`} pos={[0, 0.25 + (f + 1) * floorH * s, z]} size={[10.3 * bp, 0.25, 0.25]} material={mBeam} />)
      )}
      {bpz > 0 && Array.from({ length: floors }).map((_, f) =>
        [-5, -2.5, 0, 2.5, 5].map((x, xi) => <Box key={`bz-${f}-${xi}`} pos={[x, 0.25 + (f + 1) * floorH * s, 0]} size={[0.25, 0.25, 6.3 * bpz]} material={mBeam} />)
      )}
      {sp > 0 && Array.from({ length: floors }).map((_, f) =>
        <Box key={`slab-${f}`} pos={[0, 0.25 + (f + 1) * floorH * s, 0]} size={[10.8 * sp, 0.15, 6.8 * sp]} material={mSlab} />
      )}
    </group>
  );
}

/* ════════════════ WALLS ════════════════ */
export function Walls({ progress = 0 }) {
  const floorH = 3.2, wallH = 3.0, floors = 3;
  const o = Math.min(progress * 1.5, 1);
  const s = Math.min(progress, 1);

  const mWall = useMemo(() => m(C.wallMain, o, 0.82), [o]);
  const mWallSide = useMemo(() => m(C.wallSide, o, 0.82), [o]);
  const mWallAccent = useMemo(() => m(C.wallAccent, o, 0.8), [o]);
  const mPlinthB = useMemo(() => m(C.wallBase, o, 0.75), [o]);
  const mCornice = useMemo(() => m(C.concreteLight, o, 0.6), [o]);
  const mPartition = useMemo(() => m('#d8d0c8', o * 0.9, 0.85), [o]);
  const mStair = useMemo(() => m(C.concrete, o, 0.65), [o]);

  const ip = Math.min(Math.max((progress - 0.5) / 0.5, 0), 1);
  const stairP = Math.min(Math.max((progress - 0.6) / 0.4, 0), 1);

  return (
    <group>
      {Array.from({ length: floors }).map((_, f) => {
        const baseY = 0.25 + f * floorH;
        return (
          <group key={`wf-${f}`}>
            <Box pos={[-4.2, baseY + wallH * s / 2, -3.4]} size={[1.8, wallH * s, 0.2]} material={mWall} />
            <Box pos={[4.2, baseY + wallH * s / 2, -3.4]} size={[1.8, wallH * s, 0.2]} material={mWall} />
            <Box pos={[0, baseY + wallH * s - 0.25, -3.4]} size={[10.8, 0.5, 0.2]} material={mWall} />
            <Box pos={[0, baseY + 0.45 * s, -3.4]} size={[10.8, 0.9 * s, 0.2]} material={mWall} />
            {[-2.5, 0, 2.5].map((x, pi) => <Box key={`fwp-${f}-${pi}`} pos={[x, baseY + wallH * s / 2, -3.4]} size={[0.35, wallH * s, 0.22]} material={mWallAccent} />)}
            <Box pos={[0, baseY + wallH * s / 2, 3.4]} size={[10.8, wallH * s, 0.2]} material={mWall} />
            <Box pos={[-5.3, baseY + wallH * s / 2, 0]} size={[0.2, wallH * s, 6.6]} material={mWallSide} />
            {[-1.5, 1.5].map((z, ri) => <Box key={`lwr-${f}-${ri}`} pos={[-5.22, baseY + wallH * s / 2, z]} size={[0.05, wallH * s * 0.6, 1.2]} material={mWallAccent} />)}
            <Box pos={[5.3, baseY + wallH * s / 2, 0]} size={[0.2, wallH * s, 6.6]} material={mWallSide} />
            {[-1.5, 1.5].map((z, ri) => <Box key={`rwr-${f}-${ri}`} pos={[5.22, baseY + wallH * s / 2, z]} size={[0.05, wallH * s * 0.6, 1.2]} material={mWallAccent} />)}
            {f > 0 && (
              <>
                <Box pos={[0, baseY + 0.05, -3.5]} size={[11, 0.08, 0.05]} material={mCornice} />
                <Box pos={[-5.4, baseY + 0.05, 0]} size={[0.05, 0.08, 6.8]} material={mCornice} />
                <Box pos={[5.4, baseY + 0.05, 0]} size={[0.05, 0.08, 6.8]} material={mCornice} />
              </>
            )}
            {ip > 0 && (
              <>
                <Box pos={[0, baseY + wallH * ip / 2, 0]} size={[0.12, wallH * ip, 5.5]} material={mPartition} />
                <Box pos={[-2.5, baseY + wallH * ip / 2, -1.5]} size={[5, wallH * ip, 0.1]} material={mPartition} />
                <Box pos={[2.5, baseY + wallH * ip / 2, 1.5]} size={[5, wallH * ip, 0.1]} material={mPartition} />
              </>
            )}
          </group>
        );
      })}
      <Box pos={[0, 0.5, -3.52]} size={[11.2, 0.5, 0.08]} material={mPlinthB} />
      <Box pos={[-5.42, 0.5, 0]} size={[0.08, 0.5, 7]} material={mPlinthB} />
      <Box pos={[5.42, 0.5, 0]} size={[0.08, 0.5, 7]} material={mPlinthB} />
      <Box pos={[0, 0.5, 3.52]} size={[11.2, 0.5, 0.08]} material={mPlinthB} />
      {stairP > 0 && (() => {
        const steps = Math.floor(stairP * 16);
        const half = 8;
        return (
          <group>
            {Array.from({ length: Math.min(steps, half) }).map((_, i) => (
              <Box key={`s1-${i}`} pos={[4.5, 0.25 + i * 0.2, 2.5 - i * 0.28]} size={[1.0, 0.18, 0.4]} material={mStair} />
            ))}
            {steps >= half && <Box pos={[4.5, 0.25 + half * 0.2, 2.5 - half * 0.28]} size={[1.0, 0.15, 0.8]} material={mStair} />}
            {Array.from({ length: Math.max(0, steps - half) }).map((_, i) => (
              <Box key={`s2-${i}`} pos={[4.5, 0.25 + (half + i + 1) * 0.2, 2.5 - half * 0.28 + (i + 1) * 0.28]} size={[1.0, 0.18, 0.4]} material={mStair} />
            ))}
            <Box pos={[5.05, 1.5, 1.5]} size={[0.08, 3, 2.5]} material={mPartition} />
          </group>
        );
      })()}
    </group>
  );
}

/* ════════════════ WINDOWS & DOORS ════════════════ */
export function WindowsDoors({ progress = 0 }) {
  const floorH = 3.2, floors = 3;
  const o = Math.min(progress * 1.5, 1);
  const ws = Math.min(progress * 1.2, 1);

  // ALL materials at top level — no hooks inside conditionals
  const mFrame = useMemo(() => m(C.frameDark, o, 0.2, 0.7), [o]);
  const mGlass = useMemo(() => gm(Math.min(progress, 0.35)), [progress]);
  const mSill = useMemo(() => m(C.concreteLight, o, 0.5), [o]);
  const mRail = useMemo(() => m(C.metalRail, o, 0.3, 0.8), [o]);
  const mDoor = useMemo(() => m(C.woodDark, o, 0.6, 0.05), [o]);
  const mCanopy = useMemo(() => m(C.concreteDark, o, 0.5, 0.2), [o]);
  const mGlassRail = useMemo(() => gm(Math.min(progress * 0.8, 0.25)), [progress]);
  const mConcrete = useMemo(() => m(C.concrete, o, 0.7), [o]);
  const mNameBoard = useMemo(() => m(C.nameBoard, o, 0.6), [o]);

  const frontWinX = [-3.75, -1.25, 1.25, 3.75];

  return (
    <group>
      {Array.from({ length: floors }).map((_, f) => {
        const baseY = 0.25 + f * floorH;
        const winY = baseY + 1.55;
        return (
          <group key={`wd-${f}`}>
            {frontWinX.map((x, wi) => (
              <group key={`fw-${f}-${wi}`} position={[x, winY, -3.52]} scale={[ws, ws, 1]}>
                <Box pos={[0, 0, 0]} size={[1.6, 1.5, 0.06]} material={mFrame} />
                <Box pos={[-0.4, 0, 0.01]} size={[0.72, 1.38, 0.02]} material={mGlass} />
                <Box pos={[0.4, 0, 0.01]} size={[0.72, 1.38, 0.02]} material={mGlass} />
                <Box pos={[0, 0, 0.02]} size={[0.04, 1.5, 0.03]} material={mFrame} />
                <Box pos={[0, 0.25, 0.02]} size={[1.6, 0.03, 0.03]} material={mFrame} />
                <Box pos={[0, -0.8, 0.06]} size={[1.7, 0.06, 0.12]} material={mSill} />
                <Box pos={[0, 0.8, 0.03]} size={[1.7, 0.06, 0.08]} material={mSill} />
              </group>
            ))}
            {[-1.5, 1.5].map((z, wi) => (
              <group key={`lw-${f}-${wi}`} position={[-5.42, winY, z]} rotation={[0, Math.PI / 2, 0]} scale={[ws, ws, 1]}>
                <Box pos={[0, 0, 0]} size={[1.2, 1.3, 0.06]} material={mFrame} />
                <Box pos={[0, 0, 0.01]} size={[1.08, 1.18, 0.02]} material={mGlass} />
                <Box pos={[0, 0.1, 0.02]} size={[1.2, 0.03, 0.03]} material={mFrame} />
                <Box pos={[0, -0.7, 0.06]} size={[1.3, 0.06, 0.12]} material={mSill} />
              </group>
            ))}
            {[-1.5, 1.5].map((z, wi) => (
              <group key={`rw-${f}-${wi}`} position={[5.42, winY, z]} rotation={[0, -Math.PI / 2, 0]} scale={[ws, ws, 1]}>
                <Box pos={[0, 0, 0]} size={[1.2, 1.3, 0.06]} material={mFrame} />
                <Box pos={[0, 0, 0.01]} size={[1.08, 1.18, 0.02]} material={mGlass} />
                <Box pos={[0, 0.1, 0.02]} size={[1.2, 0.03, 0.03]} material={mFrame} />
                <Box pos={[0, -0.7, 0.06]} size={[1.3, 0.06, 0.12]} material={mSill} />
              </group>
            ))}
            {/* Balconies — always rendered, visibility by opacity */}
            {f > 0 && (
              <group position={[0, baseY, -3.55]} visible={progress > 0.4}>
                <Box pos={[0, 0.02, -0.6]} size={[6, 0.15, 1.2]} material={mConcrete} />
                {[-2.5, -1.2, 0, 1.2, 2.5].map((bx, bi) => (
                  <Box key={`br-${f}-${bi}`} pos={[bx, 0.5, -1.15]} size={[0.04, 0.95, 0.04]} material={mRail} />
                ))}
                <Box pos={[0, 0.97, -1.15]} size={[5.1, 0.04, 0.05]} material={mRail} />
                <Box pos={[0, 0.5, -1.13]} size={[4.9, 0.82, 0.02]} material={mGlassRail} />
                <Box pos={[0, 0.1, -1.15]} size={[5.1, 0.03, 0.05]} material={mRail} />
                <Box pos={[-2.5, 0.5, -0.58]} size={[0.04, 0.95, 1.2]} material={mRail} />
                <Box pos={[2.5, 0.5, -0.58]} size={[0.04, 0.95, 1.2]} material={mRail} />
              </group>
            )}
          </group>
        );
      })}

      {/* Entrance door — always rendered, visibility toggled */}
      <group position={[0, 0.25, -3.45]} visible={progress > 0.25}>
        <Box pos={[0, 1.15, 0]} size={[1.8, 2.3, 0.1]} material={mFrame} />
        <Box pos={[-0.42, 1.1, 0.02]} size={[0.82, 2.1, 0.05]} material={mDoor} />
        <Box pos={[0.42, 1.1, 0.02]} size={[0.82, 2.1, 0.05]} material={mDoor} />
        <Box pos={[-0.08, 1.0, 0.06]} size={[0.04, 0.18, 0.04]} material={mRail} />
        <Box pos={[0.08, 1.0, 0.06]} size={[0.04, 0.18, 0.04]} material={mRail} />
        <Box pos={[0, 2.35, 0.01]} size={[1.7, 0.3, 0.02]} material={mGlass} />
        <Box pos={[-1.05, 1.1, 0.01]} size={[0.35, 2.0, 0.02]} material={mGlass} />
        <Box pos={[1.05, 1.1, 0.01]} size={[0.35, 2.0, 0.02]} material={mGlass} />
      </group>

      {/* Canopy */}
      <group position={[0, 2.75, -4.0]} visible={progress > 0.35}>
        <Box pos={[0, 0, 0]} size={[3.5, 0.12, 1.5]} material={mCanopy} />
        <Box pos={[-1.5, -0.3, 0.7]} size={[0.06, 0.5, 0.06]} material={mRail} />
        <Box pos={[1.5, -0.3, 0.7]} size={[0.06, 0.5, 0.06]} material={mRail} />
        <Box pos={[-1.5, -0.15, 0.3]} size={[0.04, 0.04, 0.9]} material={mRail} rot={[0.3, 0, 0]} />
        <Box pos={[1.5, -0.15, 0.3]} size={[0.04, 0.04, 0.9]} material={mRail} rot={[0.3, 0, 0]} />
      </group>

      {/* Steps */}
      <group position={[0, 0, -3.7]} visible={progress > 0.3}>
        {[0, 1, 2].map((i) => (
          <Box key={`step-${i}`} pos={[0, -0.35 + i * (-0.15), -0.4 - i * 0.35]} size={[2.5 + i * 0.3, 0.15, 0.35]} material={mConcrete} />
        ))}
      </group>

      {/* Name board */}
      <group position={[0, 3.1, -3.55]} visible={progress > 0.6}>
        <Box pos={[0, 0, 0]} size={[2.8, 0.4, 0.04]} material={mNameBoard} />
      </group>
    </group>
  );
}

/* ════════════════ ROOF ════════════════ */
export function Roof({ progress = 0 }) {
  const topY = 0.25 + 3 * 3.2;
  const o = Math.min(progress * 1.5, 1);
  const s = Math.min(progress, 1);

  const mRoof = useMemo(() => m(C.tileRoof, o, 0.7, 0.1), [o]);
  const mParapet = useMemo(() => m(C.wallMain, o, 0.8), [o]);
  const mCoping = useMemo(() => m(C.concreteLight, o, 0.5), [o]);
  const mTank = useMemo(() => m(C.waterTank, o, 0.4, 0.3), [o]);
  const mStairRoom = useMemo(() => m(C.wallAccent, o, 0.8), [o]);
  const mMetal = useMemo(() => m(C.metalDark, o, 0.3, 0.7), [o]);
  const mDoor = useMemo(() => m(C.frameDark, o, 0.3, 0.5), [o]);
  const mSolar = useMemo(() => m('#1a2a4a', o, 0.4, 0.5), [o]);

  return (
    <group>
      <Box pos={[0, topY + 0.1, 0]} size={[11 * s, 0.2, 7 * s]} material={mRoof} />

      <group visible={progress > 0.2}>
        <Box pos={[0, topY + 0.65, -3.4]} size={[11 * s, 0.9, 0.12]} material={mParapet} />
        <Box pos={[0, topY + 0.65, 3.4]} size={[11 * s, 0.9, 0.12]} material={mParapet} />
        <Box pos={[-5.3, topY + 0.65, 0]} size={[0.12, 0.9, 6.7 * s]} material={mParapet} />
        <Box pos={[5.3, topY + 0.65, 0]} size={[0.12, 0.9, 6.7 * s]} material={mParapet} />
        <Box pos={[0, topY + 1.15, -3.4]} size={[11.2 * s, 0.08, 0.2]} material={mCoping} />
        <Box pos={[0, topY + 1.15, 3.4]} size={[11.2 * s, 0.08, 0.2]} material={mCoping} />
        <Box pos={[-5.35, topY + 1.15, 0]} size={[0.2, 0.08, 7 * s]} material={mCoping} />
        <Box pos={[5.35, topY + 1.15, 0]} size={[0.2, 0.08, 7 * s]} material={mCoping} />
      </group>

      <group position={[4, topY + 0.2, 1.5]} visible={progress > 0.4}>
        <Box pos={[0, 1.2, 0]} size={[2.2, 2.4, 2.2]} material={mStairRoom} />
        <Box pos={[0, 1.0, -1.12]} size={[0.8, 1.8, 0.06]} material={mDoor} />
        <Box pos={[0, 2.45, 0]} size={[2.4, 0.1, 2.4]} material={mCoping} />
      </group>

      <group position={[-3, topY + 0.2, 1.5]} visible={progress > 0.55}>
        {[[-0.5, -0.5], [-0.5, 0.5], [0.5, -0.5], [0.5, 0.5]].map(([lx, lz], li) => (
          <Box key={`ts-${li}`} pos={[lx, 1, lz]} size={[0.1, 2, 0.1]} material={mMetal} />
        ))}
        <mesh position={[0, 2.3, 0]} material={mTank} castShadow>
          <cylinderGeometry args={[0.7, 0.7, 0.9, 16]} />
        </mesh>
        <mesh position={[0, 2.8, 0]} material={mCoping}>
          <cylinderGeometry args={[0.75, 0.75, 0.06, 16]} />
        </mesh>
      </group>

      <group position={[2, topY + 1.2, -2]} visible={progress > 0.7}>
        <mesh material={mMetal} castShadow><cylinderGeometry args={[0.02, 0.02, 2, 6]} /></mesh>
        <mesh position={[0.15, 0.8, 0]} rotation={[0, 0, -0.3]} material={mMetal}>
          <cylinderGeometry args={[0.3, 0.15, 0.05, 12]} />
        </mesh>
      </group>

      <group position={[-1, topY + 0.4, -1.5]} rotation={[-0.4, 0, 0]} visible={progress > 0.8}>
        <Box pos={[0, 0, 0]} size={[2.5, 0.04, 1.5]} material={mSolar} />
        <Box pos={[0, -0.03, 0]} size={[2.55, 0.03, 1.55]} material={mMetal} />
      </group>
    </group>
  );
}

/* ════════════════ LANDSCAPE ════════════════ */
export function Landscape({ progress = 0 }) {
  const o = Math.min(progress * 1.5, 1);
  const s = Math.min(progress, 1);

  const mGrass = useMemo(() => m(C.grassDark, o, 0.95), [o]);
  const mGrassL = useMemo(() => m(C.grassLight, o, 0.92), [o]);
  const mRoad = useMemo(() => m(C.road, o, 0.85), [o]);
  const mPaver = useMemo(() => m(C.paver, o, 0.88), [o]);
  const mCWall = useMemo(() => m(C.wallAccent, o, 0.8), [o]);
  const mGate = useMemo(() => m(C.metalDark, o, 0.25, 0.7), [o]);
  const mTrunk = useMemo(() => m(C.trunk, o, 0.9), [o]);
  const mLeaf1 = useMemo(() => m(C.leaf1, o, 0.85), [o]);
  const mLeaf2 = useMemo(() => m(C.leaf2, o, 0.85), [o]);
  const mLeaf3 = useMemo(() => m(C.leaf3, o, 0.85), [o]);
  const mCoping = useMemo(() => m(C.concreteLight, o, 0.55), [o]);
  const mFlower = useMemo(() => m('#c44040', o, 0.7), [o]);
  const mLamp = useMemo(() => m(C.metalDark, o, 0.3, 0.6), [o]);
  const mLightM = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({ color: C.lightWarm, roughness: 0.3, metalness: 0.1, transparent: true, opacity: o, emissive: C.lightWarm, emissiveIntensity: 0.6 });
    return mat;
  }, [o]);
  const mRoadMark = useMemo(() => m(C.roadMark, o * 0.6, 0.7), [o]);
  const mWhiteLine = useMemo(() => m('#ffffff', o * 0.4, 0.7), [o]);
  const mNamePlate = useMemo(() => m(C.nameBoard, o, 0.6), [o]);

  const leafMats = [mLeaf1, mLeaf2, mLeaf3];

  function Tree({ pos, height = 3, leafRadius = 1.2, leafMat }) {
    return (
      <group position={pos} scale={[s, s, s]}>
        <mesh position={[0, height / 2, 0]} material={mTrunk} castShadow>
          <cylinderGeometry args={[0.08, 0.14, height, 8]} />
        </mesh>
        <mesh position={[0, height + 0.2, 0]} material={leafMat} castShadow>
          <sphereGeometry args={[leafRadius, 10, 8]} />
        </mesh>
        <mesh position={[leafRadius * 0.5, height - 0.1, leafRadius * 0.3]} material={leafMat} castShadow>
          <sphereGeometry args={[leafRadius * 0.65, 8, 6]} />
        </mesh>
        <mesh position={[-leafRadius * 0.4, height + 0.4, -leafRadius * 0.3]} material={leafMat} castShadow>
          <sphereGeometry args={[leafRadius * 0.55, 8, 6]} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.59, 0]} material={mGrass} receiveShadow>
        <planeGeometry args={[42, 36]} />
      </mesh>
      <Box pos={[-7, -0.56, 0]} size={[1.5, 0.02, 10]} material={mGrassL} />
      <Box pos={[7, -0.56, 0]} size={[1.5, 0.02, 10]} material={mGrassL} />
      <Box pos={[0, -0.56, 5.5]} size={[14, 0.02, 1.2]} material={mGrassL} />

      {/* Compound wall */}
      <group visible={progress > 0.15}>
        <Box pos={[-4.5, 0.1, -6.2]} size={[7, 1.2 * s, 0.15]} material={mCWall} />
        <Box pos={[4.5, 0.1, -6.2]} size={[7, 1.2 * s, 0.15]} material={mCWall} />
        <Box pos={[-4.5, 0.75 * s, -6.2]} size={[7.1, 0.08, 0.22]} material={mCoping} />
        <Box pos={[4.5, 0.75 * s, -6.2]} size={[7.1, 0.08, 0.22]} material={mCoping} />
        <Box pos={[-1, 0.25, -6.2]} size={[0.35, 1.5 * s, 0.35]} material={mCoping} />
        <Box pos={[1, 0.25, -6.2]} size={[0.35, 1.5 * s, 0.35]} material={mCoping} />
        <Box pos={[-1, 1.05 * s, -6.2]} size={[0.45, 0.1, 0.45]} material={mCoping} />
        <Box pos={[1, 1.05 * s, -6.2]} size={[0.45, 0.1, 0.45]} material={mCoping} />
        <Box pos={[-8.1, 0.1, 0]} size={[0.15, 1.2 * s, 12.4]} material={mCWall} />
        <Box pos={[8.1, 0.1, 0]} size={[0.15, 1.2 * s, 12.4]} material={mCWall} />
        <Box pos={[0, 0.1, 6.2]} size={[16.4, 1.2 * s, 0.15]} material={mCWall} />
        <Box pos={[-8.15, 0.75 * s, 0]} size={[0.22, 0.08, 12.5]} material={mCoping} />
        <Box pos={[8.15, 0.75 * s, 0]} size={[0.22, 0.08, 12.5]} material={mCoping} />
        <Box pos={[0, 0.75 * s, 6.25]} size={[16.5, 0.08, 0.22]} material={mCoping} />
      </group>

      {/* Gate */}
      <group position={[0, 0, -6.2]} visible={progress > 0.25}>
        <Box pos={[-0.48, 0.45, 0]} size={[0.95, 0.9, 0.04]} material={mGate} />
        <Box pos={[0.48, 0.45, 0]} size={[0.95, 0.9, 0.04]} material={mGate} />
        {[0.15, 0.35, 0.55, 0.75].map((gy, gi) => <Box key={`gb-${gi}`} pos={[0, gy, 0.02]} size={[1.9, 0.025, 0.015]} material={mGate} />)}
        {[-0.7, -0.4, -0.1, 0.1, 0.4, 0.7].map((gx, gi) => <Box key={`gv-${gi}`} pos={[gx, 0.45, 0.02]} size={[0.02, 0.85, 0.015]} material={mGate} />)}
      </group>

      {/* Driveway */}
      <group visible={progress > 0.2}>
        <Box pos={[0, -0.57, -5]} size={[2.5 * s, 0.04, 2.5]} material={mPaver} />
        <Box pos={[0, -0.57, -8]} size={[3 * s, 0.04, 3.5]} material={mRoad} />
      </group>

      {/* Road */}
      <group visible={progress > 0.3}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.58, -11]} material={mRoad} receiveShadow>
          <planeGeometry args={[42 * s, 3.5]} />
        </mesh>
        <Box pos={[0, -0.56, -11]} size={[40 * s, 0.005, 0.08]} material={mRoadMark} />
      </group>

      {/* Trees */}
      <group visible={progress > 0.35}>
        <Tree pos={[-7, -0.5, -4]} height={3.5} leafRadius={1.3} leafMat={leafMats[0]} />
        <Tree pos={[-7, -0.5, 2]} height={4} leafRadius={1.5} leafMat={leafMats[1]} />
        <Tree pos={[7, -0.5, -3]} height={3} leafRadius={1.1} leafMat={leafMats[2]} />
        <Tree pos={[7, -0.5, 3]} height={3.8} leafRadius={1.4} leafMat={leafMats[0]} />
        <Tree pos={[-3, -0.5, 6.5]} height={2.8} leafRadius={1.0} leafMat={leafMats[1]} />
        <Tree pos={[3, -0.5, 6.5]} height={3.2} leafRadius={1.2} leafMat={leafMats[2]} />
        <Tree pos={[-8, -0.5, -10]} height={4.5} leafRadius={1.8} leafMat={leafMats[0]} />
        <Tree pos={[8, -0.5, -10]} height={4.5} leafRadius={1.8} leafMat={leafMats[1]} />
        <Tree pos={[-14, -0.5, -10]} height={4} leafRadius={1.5} leafMat={leafMats[2]} />
        <Tree pos={[14, -0.5, -10]} height={4} leafRadius={1.5} leafMat={leafMats[0]} />
      </group>

      {/* Flower bushes */}
      <group visible={progress > 0.5}>
        {[-3, -1, 1, 3].map((x, fi) => (
          <group key={`bush-${fi}`} position={[x, -0.4, -4.8]} scale={[s, s, s]}>
            <mesh material={leafMats[fi % 3]} castShadow><sphereGeometry args={[0.35, 8, 6]} /></mesh>
            {fi % 2 === 0 && <mesh position={[0, 0.15, 0.1]} material={mFlower}><sphereGeometry args={[0.12, 6, 4]} /></mesh>}
          </group>
        ))}
      </group>

      {/* Path lights */}
      <group visible={progress > 0.6}>
        {[-2.5, 2.5].map((x, li) => (
          <group key={`lamp-${li}`} position={[x, -0.55, -5.5]} scale={[s, s, s]}>
            <mesh position={[0, 0.5, 0]} material={mLamp} castShadow><cylinderGeometry args={[0.035, 0.045, 1, 6]} /></mesh>
            <mesh position={[0, 1.05, 0]} material={mLightM}><sphereGeometry args={[0.1, 8, 8]} /></mesh>
            <pointLight position={[0, 1.1, 0]} intensity={0.15} color="#ffd700" distance={3} />
          </group>
        ))}
      </group>

      {/* Parking */}
      <group position={[5, -0.57, -5]} visible={progress > 0.45}>
        <Box pos={[0, 0, 0]} size={[3 * s, 0.03, 3]} material={mPaver} />
        {[-0.8, 0.8].map((px, pi) => <Box key={`pl-${pi}`} pos={[px, 0.02, 0]} size={[0.04, 0.005, 2.5]} material={mWhiteLine} />)}
      </group>

      {/* Nameplate */}
      <group visible={progress > 0.7}>
        <Box pos={[-1, 0.6, -6.38]} size={[0.6, 0.25, 0.02]} material={mNamePlate} />
      </group>
    </group>
  );
}

export default { Foundation, Structure, Walls, WindowsDoors, Roof, Landscape };
