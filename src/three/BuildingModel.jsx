import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';

/* ─── Realistic Colour Palette ─── */
const C = {
  // Walls
  wallMain: '#e8ddd0',      // Warm cream plaster
  wallAccent: '#d4c8b8',    // Slightly darker accent walls
  wallSide: '#ddd2c4',      // Side wall tone
  wallBase: '#b8a898',      // Darker base / plinth
  
  // Structure
  concrete: '#a09890',      // Exposed concrete
  concreteLight: '#c0b8b0', // Light concrete
  concreteDark: '#706860',  // Dark concrete
  plinth: '#887868',        // Plinth band
  
  // Glass & Metal
  glass: '#8aacbe',         // Reflective blue glass
  glassDark: '#5a7a8e',     // Darker glass
  frameDark: '#2a2a2a',     // Dark aluminum frames
  frameGray: '#4a4a4a',     // Gray frames
  metalRail: '#555555',     // Railing metal
  metalDark: '#333333',     // Dark metal
  
  // Details
  wood: '#8B6914',          // Wooden door
  woodDark: '#6a4a0a',      // Dark wood
  tileRoof: '#6a5a4a',      // Roof tiles / terrace
  waterTank: '#7a8a7a',     // Water tank
  
  // Ground / Landscape
  ground: '#8a8070',        // Bare ground
  grassDark: '#3a5a28',     // Dark grass
  grassLight: '#4a7a30',    // Light grass
  soil: '#6a5a40',          // Soil
  road: '#444444',          // Road
  roadMark: '#cccccc',      // Road markings
  paver: '#a09080',         // Paver blocks
  paverAlt: '#908070',      // Alternate pavers
  
  // Trees
  trunk: '#5a3a1a',
  leaf1: '#2a6a1a',
  leaf2: '#3a7a20',
  leaf3: '#1a5a10',
  
  // Accent
  accent: '#c8a97e',
  nameBoard: '#1a1a2a',
  lightWarm: '#ffd700',
};

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.75,
    metalness: opts.metalness ?? 0.05,
    transparent: opts.transparent ?? true,
    opacity: opts.opacity ?? 1,
    side: opts.side ?? THREE.FrontSide,
    ...(opts.emissive ? { emissive: opts.emissive, emissiveIntensity: opts.emissiveIntensity ?? 0.3 } : {}),
  });
}

function glassMat(opacity = 0.35) {
  return new THREE.MeshPhysicalMaterial({
    color: C.glass,
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    opacity,
    transmission: 0.5,
    thickness: 0.05,
    side: THREE.DoubleSide,
  });
}

/* ====================================================================
   BOX helper – reduces repetition
   ==================================================================== */
function Box({ pos, size, material, rot }) {
  return (
    <mesh position={pos} rotation={rot || [0, 0, 0]} material={material} castShadow receiveShadow>
      <boxGeometry args={size} />
    </mesh>
  );
}

/* ====================================================================
   FOUNDATION — Ground, excavation, plinth, footings, grid
   ==================================================================== */
export function Foundation({ progress = 1 }) {
  const o = Math.min(progress * 2, 1);

  const mGround = useMemo(() => mat(C.ground, { roughness: 0.95, opacity: o }), [o]);
  const mConc = useMemo(() => mat(C.concreteDark, { roughness: 0.85, opacity: o }), [o]);
  const mPlinth = useMemo(() => mat(C.plinth, { roughness: 0.8, opacity: o }), [o]);
  const mGrid = useMemo(() => mat(C.accent, { opacity: o * 0.25, metalness: 0.3 }), [o]);
  const mPaver = useMemo(() => mat(C.paver, { roughness: 0.9, opacity: o }), [o]);

  // Footing positions — 5 x 3 grid
  const footings = useMemo(() => {
    const arr = [];
    for (let x = -5; x <= 5; x += 2.5) {
      for (let z = -3; z <= 3; z += 3) {
        arr.push([x, -0.35, z]);
      }
    }
    return arr;
  }, []);

  return (
    <group>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} material={mGround} receiveShadow>
        <planeGeometry args={[36, 30]} />
      </mesh>

      {/* Compound area paving */}
      <Box pos={[0, -0.55, 0]} size={[16, 0.08, 12]} material={mPaver} />

      {/* Foundation slab / raft */}
      <Box pos={[0, -0.35, 0]} size={[12, 0.5, 8]} material={mConc} />

      {/* Plinth beam */}
      <Box pos={[0, 0.05, 0]} size={[11.6, 0.4, 7.6]} material={mPlinth} />

      {/* Footings */}
      {footings.map((p, i) => (
        <Box key={`ft-${i}`} pos={p} size={[1.0, 0.7, 1.0]} material={mConc} />
      ))}

      {/* Grid lines */}
      {[-5, -2.5, 0, 2.5, 5].map((x, i) => (
        <Box key={`gx-${i}`} pos={[x, 0.01, 0]} size={[0.015, 0.005, 9]} material={mGrid} />
      ))}
      {[-3, 0, 3].map((z, i) => (
        <Box key={`gz-${i}`} pos={[0, 0.01, z]} size={[12, 0.005, 0.015]} material={mGrid} />
      ))}

      {/* Compound wall foundation */}
      {[
        [0, -0.3, -6.2, 16, 0.3, 0.3],
        [0, -0.3, 6.2, 16, 0.3, 0.3],
        [-8.1, -0.3, 0, 0.3, 0.3, 12.7],
        [8.1, -0.3, 0, 0.3, 0.3, 12.7],
      ].map((a, i) => (
        <Box key={`cwf-${i}`} pos={[a[0], a[1], a[2]]} size={[a[3], a[4], a[5]]} material={mConc} />
      ))}
    </group>
  );
}

/* ====================================================================
   STRUCTURE — Columns, beams, floor slabs (3 floors)
   ==================================================================== */
export function Structure({ progress = 0 }) {
  const floorH = 3.2;
  const floors = 3;
  const s = Math.min(progress, 1);
  const o = Math.min(progress * 1.5, 1);

  const mCol = useMemo(() => mat(C.concrete, { roughness: 0.6, metalness: 0.15, opacity: o }), [o]);
  const mBeam = useMemo(() => mat(C.concreteLight, { roughness: 0.55, metalness: 0.12, opacity: o }), [o]);
  const mSlab = useMemo(() => mat(C.concrete, { roughness: 0.7, metalness: 0.1, opacity: o }), [o]);

  const colPositions = useMemo(() => {
    const arr = [];
    for (let x = -5; x <= 5; x += 2.5) {
      for (let z = -3; z <= 3; z += 3) {
        arr.push([x, z]);
      }
    }
    return arr;
  }, []);

  return (
    <group>
      {colPositions.map((p, ci) => (
        <group key={`cg-${ci}`}>
          {Array.from({ length: floors }).map((_, f) => (
            <Box
              key={`c-${ci}-${f}`}
              pos={[p[0], 0.25 + f * floorH + (floorH * s) / 2, p[1]]}
              size={[0.3, floorH * s, 0.3]}
              material={mCol}
            />
          ))}
        </group>
      ))}

      {/* Beams X */}
      {progress > 0.35 && Array.from({ length: floors }).map((_, f) => {
        const bp = Math.min((progress - 0.35) / 0.35, 1);
        return [-3, 0, 3].map((z, zi) => (
          <Box
            key={`bx-${f}-${zi}`}
            pos={[0, 0.25 + (f + 1) * floorH * s, z]}
            size={[10.3 * bp, 0.25, 0.25]}
            material={mBeam}
          />
        ));
      })}

      {/* Beams Z */}
      {progress > 0.4 && Array.from({ length: floors }).map((_, f) => {
        const bp = Math.min((progress - 0.4) / 0.35, 1);
        return [-5, -2.5, 0, 2.5, 5].map((x, xi) => (
          <Box
            key={`bz-${f}-${xi}`}
            pos={[x, 0.25 + (f + 1) * floorH * s, 0]}
            size={[0.25, 0.25, 6.3 * bp]}
            material={mBeam}
          />
        ));
      })}

      {/* Floor slabs */}
      {progress > 0.55 && Array.from({ length: floors }).map((_, f) => {
        const sp = Math.min((progress - 0.55) / 0.45, 1);
        return (
          <Box
            key={`slab-${f}`}
            pos={[0, 0.25 + (f + 1) * floorH * s, 0]}
            size={[10.8 * sp, 0.15, 6.8 * sp]}
            material={mSlab}
          />
        );
      })}
    </group>
  );
}

/* ====================================================================
   WALLS — Realistic plastered walls with recesses, plinth band, cornice
   ==================================================================== */
export function Walls({ progress = 0 }) {
  const floorH = 3.2;
  const wallH = 3.0;
  const floors = 3;
  const o = Math.min(progress * 1.5, 1);
  const s = Math.min(progress, 1);

  const mWall = useMemo(() => mat(C.wallMain, { roughness: 0.82, opacity: o }), [o]);
  const mWallSide = useMemo(() => mat(C.wallSide, { roughness: 0.82, opacity: o }), [o]);
  const mWallAccent = useMemo(() => mat(C.wallAccent, { roughness: 0.8, opacity: o }), [o]);
  const mPlinth = useMemo(() => mat(C.wallBase, { roughness: 0.75, opacity: o }), [o]);
  const mCornice = useMemo(() => mat(C.concreteLight, { roughness: 0.6, opacity: o }), [o]);
  const mPartition = useMemo(() => mat('#d8d0c8', { roughness: 0.85, opacity: o * 0.9 }), [o]);

  return (
    <group>
      {Array.from({ length: floors }).map((_, f) => {
        const baseY = 0.25 + f * floorH;
        return (
          <group key={`wf-${f}`}>
            {/* ── FRONT WALL (facing -Z) ── */}
            {/* Left solid panel */}
            <Box pos={[-4.2, baseY + wallH * s / 2, -3.4]} size={[1.8, wallH * s, 0.2]} material={mWall} />
            {/* Right solid panel */}
            <Box pos={[4.2, baseY + wallH * s / 2, -3.4]} size={[1.8, wallH * s, 0.2]} material={mWall} />
            {/* Top panel above windows */}
            <Box pos={[0, baseY + wallH * s - 0.25, -3.4]} size={[10.8, 0.5, 0.2]} material={mWall} />
            {/* Bottom panel below windows */}
            <Box pos={[0, baseY + 0.45 * s, -3.4]} size={[10.8, 0.9 * s, 0.2]} material={mWall} />
            {/* Pillars between windows */}
            {[-2.5, 0, 2.5].map((x, pi) => (
              <Box key={`fwp-${f}-${pi}`} pos={[x, baseY + wallH * s / 2, -3.4]} size={[0.35, wallH * s, 0.22]} material={mWallAccent} />
            ))}

            {/* ── BACK WALL (+Z) ── */}
            <Box pos={[0, baseY + wallH * s / 2, 3.4]} size={[10.8, wallH * s, 0.2]} material={mWall} />

            {/* ── LEFT WALL (-X) ── */}
            <Box pos={[-5.3, baseY + wallH * s / 2, 0]} size={[0.2, wallH * s, 6.6]} material={mWallSide} />
            {/* Recessed panels for depth on left wall */}
            {[-1.5, 1.5].map((z, ri) => (
              <Box key={`lwr-${f}-${ri}`} pos={[-5.22, baseY + wallH * s / 2, z]} size={[0.05, wallH * s * 0.6, 1.2]} material={mWallAccent} />
            ))}

            {/* ── RIGHT WALL (+X) ── */}
            <Box pos={[5.3, baseY + wallH * s / 2, 0]} size={[0.2, wallH * s, 6.6]} material={mWallSide} />
            {[-1.5, 1.5].map((z, ri) => (
              <Box key={`rwr-${f}-${ri}`} pos={[5.22, baseY + wallH * s / 2, z]} size={[0.05, wallH * s * 0.6, 1.2]} material={mWallAccent} />
            ))}

            {/* ── Floor string course / band ── */}
            {f > 0 && (
              <>
                <Box pos={[0, baseY + 0.05, -3.5]} size={[11, 0.08, 0.05]} material={mCornice} />
                <Box pos={[-5.4, baseY + 0.05, 0]} size={[0.05, 0.08, 6.8]} material={mCornice} />
                <Box pos={[5.4, baseY + 0.05, 0]} size={[0.05, 0.08, 6.8]} material={mCornice} />
              </>
            )}

            {/* ── Interior walls ── */}
            {progress > 0.5 && (
              <>
                <Box pos={[0, baseY + wallH * Math.min((progress - 0.5) / 0.5, 1) / 2, 0]} 
                  size={[0.12, wallH * Math.min((progress - 0.5) / 0.5, 1), 5.5]} material={mPartition} />
                <Box pos={[-2.5, baseY + wallH * Math.min((progress - 0.5) / 0.5, 1) / 2, -1.5]} 
                  size={[5, wallH * Math.min((progress - 0.5) / 0.5, 1), 0.1]} material={mPartition} />
                <Box pos={[2.5, baseY + wallH * Math.min((progress - 0.5) / 0.5, 1) / 2, 1.5]} 
                  size={[5, wallH * Math.min((progress - 0.5) / 0.5, 1), 0.1]} material={mPartition} />
              </>
            )}
          </group>
        );
      })}

      {/* Plinth band — darker base strip */}
      <Box pos={[0, 0.5, -3.52]} size={[11.2, 0.5, 0.08]} material={mPlinth} />
      <Box pos={[-5.42, 0.5, 0]} size={[0.08, 0.5, 7]} material={mPlinth} />
      <Box pos={[5.42, 0.5, 0]} size={[0.08, 0.5, 7]} material={mPlinth} />
      <Box pos={[0, 0.5, 3.52]} size={[11.2, 0.5, 0.08]} material={mPlinth} />

      {/* Staircase — more realistic with landing */}
      {progress > 0.6 && (() => {
        const sp = Math.min((progress - 0.6) / 0.4, 1);
        const steps = Math.floor(sp * 16);
        const mStair = mat(C.concrete, { roughness: 0.65, opacity: o });
        const half = 8;
        return (
          <group>
            {/* Stair flight 1 */}
            {Array.from({ length: Math.min(steps, half) }).map((_, i) => (
              <Box key={`s1-${i}`} pos={[4.5, 0.25 + i * 0.2, 2.5 - i * 0.28]} size={[1.0, 0.18, 0.4]} material={mStair} />
            ))}
            {/* Landing */}
            {steps >= half && (
              <Box pos={[4.5, 0.25 + half * 0.2, 2.5 - half * 0.28]} size={[1.0, 0.15, 0.8]} material={mStair} />
            )}
            {/* Stair flight 2 */}
            {Array.from({ length: Math.max(0, steps - half) }).map((_, i) => (
              <Box key={`s2-${i}`} pos={[4.5, 0.25 + (half + i + 1) * 0.2, 2.5 - half * 0.28 + (i + 1) * 0.28]} 
                size={[1.0, 0.18, 0.4]} material={mStair} />
            ))}
            {/* Stair walls */}
            <Box pos={[5.05, 1.5, 1.5]} size={[0.08, 3, 2.5]} material={mPartition} />
          </group>
        );
      })()}
    </group>
  );
}

/* ====================================================================
   WINDOWS & DOORS — Realistic aluminum-framed windows, main door, balconies
   ==================================================================== */
export function WindowsDoors({ progress = 0 }) {
  const floorH = 3.2;
  const floors = 3;
  const o = Math.min(progress * 1.5, 1);
  const ws = Math.min(progress * 1.2, 1); // window scale

  const mFrame = useMemo(() => mat(C.frameDark, { roughness: 0.2, metalness: 0.7, opacity: o }), [o]);
  const mGlass = useMemo(() => glassMat(Math.min(progress, 0.35)), [progress]);
  const mSill = useMemo(() => mat(C.concreteLight, { roughness: 0.5, opacity: o }), [o]);
  const mRail = useMemo(() => mat(C.metalRail, { roughness: 0.3, metalness: 0.8, opacity: o }), [o]);
  const mDoor = useMemo(() => mat(C.woodDark, { roughness: 0.6, metalness: 0.05, opacity: o }), [o]);
  const mCanopy = useMemo(() => mat(C.concreteDark, { roughness: 0.5, metalness: 0.2, opacity: o }), [o]);
  const mGlassRail = useMemo(() => glassMat(Math.min(progress * 0.8, 0.25)), [progress]);

  // Front windows — between pillars
  const frontWinX = [-3.75, -1.25, 1.25, 3.75];

  return (
    <group>
      {Array.from({ length: floors }).map((_, f) => {
        const baseY = 0.25 + f * floorH;
        const winY = baseY + 1.55;
        return (
          <group key={`wd-${f}`}>
            {/* ── FRONT WINDOWS ── */}
            {frontWinX.map((x, wi) => (
              <group key={`fw-${f}-${wi}`} position={[x, winY, -3.52]} scale={[ws, ws, 1]}>
                {/* Outer frame */}
                <Box pos={[0, 0, 0]} size={[1.6, 1.5, 0.06]} material={mFrame} />
                {/* Glass panes (2 panes) */}
                <Box pos={[-0.4, 0, 0.01]} size={[0.72, 1.38, 0.02]} material={mGlass} />
                <Box pos={[0.4, 0, 0.01]} size={[0.72, 1.38, 0.02]} material={mGlass} />
                {/* Center mullion */}
                <Box pos={[0, 0, 0.02]} size={[0.04, 1.5, 0.03]} material={mFrame} />
                {/* Horizontal transom */}
                <Box pos={[0, 0.25, 0.02]} size={[1.6, 0.03, 0.03]} material={mFrame} />
                {/* Window sill */}
                <Box pos={[0, -0.8, 0.06]} size={[1.7, 0.06, 0.12]} material={mSill} />
                {/* Lintel */}
                <Box pos={[0, 0.8, 0.03]} size={[1.7, 0.06, 0.08]} material={mSill} />
              </group>
            ))}

            {/* ── SIDE WINDOWS (LEFT) ── */}
            {[-1.5, 1.5].map((z, wi) => (
              <group key={`lw-${f}-${wi}`} position={[-5.42, winY, z]} rotation={[0, Math.PI / 2, 0]} scale={[ws, ws, 1]}>
                <Box pos={[0, 0, 0]} size={[1.2, 1.3, 0.06]} material={mFrame} />
                <Box pos={[0, 0, 0.01]} size={[1.08, 1.18, 0.02]} material={mGlass} />
                <Box pos={[0, 0.1, 0.02]} size={[1.2, 0.03, 0.03]} material={mFrame} />
                <Box pos={[0, -0.7, 0.06]} size={[1.3, 0.06, 0.12]} material={mSill} />
              </group>
            ))}

            {/* ── SIDE WINDOWS (RIGHT) ── */}
            {[-1.5, 1.5].map((z, wi) => (
              <group key={`rw-${f}-${wi}`} position={[5.42, winY, z]} rotation={[0, -Math.PI / 2, 0]} scale={[ws, ws, 1]}>
                <Box pos={[0, 0, 0]} size={[1.2, 1.3, 0.06]} material={mFrame} />
                <Box pos={[0, 0, 0.01]} size={[1.08, 1.18, 0.02]} material={mGlass} />
                <Box pos={[0, 0.1, 0.02]} size={[1.2, 0.03, 0.03]} material={mFrame} />
                <Box pos={[0, -0.7, 0.06]} size={[1.3, 0.06, 0.12]} material={mSill} />
              </group>
            ))}

            {/* ── BALCONIES (front, floors 2 & 3) ── */}
            {f > 0 && progress > 0.4 && (
              <group position={[0, baseY, -3.55]}>
                {/* Balcony slab — projecting out */}
                <Box pos={[0, 0.02, -0.6]} size={[6, 0.15, 1.2]} material={useMemo(() => mat(C.concrete, { opacity: o }), [o])} />
                
                {/* Glass railing panels */}
                {[-2.5, -1.2, 0, 1.2, 2.5].map((bx, bi) => (
                  <group key={`br-${f}-${bi}`}>
                    {/* Vertical post */}
                    <Box pos={[bx, 0.5, -1.15]} size={[0.04, 0.95, 0.04]} material={mRail} />
                  </group>
                ))}
                {/* Top rail */}
                <Box pos={[0, 0.97, -1.15]} size={[5.1, 0.04, 0.05]} material={mRail} />
                {/* Glass panel */}
                <Box pos={[0, 0.5, -1.13]} size={[4.9, 0.82, 0.02]} material={mGlassRail} />
                {/* Bottom rail */}
                <Box pos={[0, 0.1, -1.15]} size={[5.1, 0.03, 0.05]} material={mRail} />
                {/* Side rails */}
                <Box pos={[-2.5, 0.5, -0.58]} size={[0.04, 0.95, 1.2]} material={mRail} />
                <Box pos={[2.5, 0.5, -0.58]} size={[0.04, 0.95, 1.2]} material={mRail} />
              </group>
            )}
          </group>
        );
      })}

      {/* ── MAIN ENTRANCE DOOR ── */}
      {progress > 0.25 && (
        <group position={[0, 0.25, -3.45]}>
          {/* Door frame */}
          <Box pos={[0, 1.15, 0]} size={[1.8, 2.3, 0.1]} material={mFrame} />
          {/* Left door leaf */}
          <Box pos={[-0.42, 1.1, 0.02]} size={[0.82, 2.1, 0.05]} material={mDoor} />
          {/* Right door leaf */}
          <Box pos={[0.42, 1.1, 0.02]} size={[0.82, 2.1, 0.05]} material={mDoor} />
          {/* Door handles */}
          <Box pos={[-0.08, 1.0, 0.06]} size={[0.04, 0.18, 0.04]} material={mRail} />
          <Box pos={[0.08, 1.0, 0.06]} size={[0.04, 0.18, 0.04]} material={mRail} />
          {/* Transom window above door */}
          <Box pos={[0, 2.35, 0.01]} size={[1.7, 0.3, 0.02]} material={mGlass} />
          {/* Sidelights */}
          <Box pos={[-1.05, 1.1, 0.01]} size={[0.35, 2.0, 0.02]} material={mGlass} />
          <Box pos={[1.05, 1.1, 0.01]} size={[0.35, 2.0, 0.02]} material={mGlass} />
        </group>
      )}

      {/* ── ENTRANCE CANOPY ── */}
      {progress > 0.35 && (
        <group position={[0, 2.75, -4.0]}>
          {/* Canopy slab */}
          <Box pos={[0, 0, 0]} size={[3.5, 0.12, 1.5]} material={mCanopy} />
          {/* Support brackets */}
          <Box pos={[-1.5, -0.3, 0.7]} size={[0.06, 0.5, 0.06]} material={mRail} />
          <Box pos={[1.5, -0.3, 0.7]} size={[0.06, 0.5, 0.06]} material={mRail} />
          {/* Diagonal braces */}
          <Box pos={[-1.5, -0.15, 0.3]} size={[0.04, 0.04, 0.9]} material={mRail} rot={[0.3, 0, 0]} />
          <Box pos={[1.5, -0.15, 0.3]} size={[0.04, 0.04, 0.9]} material={mRail} rot={[0.3, 0, 0]} />
        </group>
      )}

      {/* ── ENTRANCE STEPS ── */}
      {progress > 0.3 && (
        <group position={[0, 0, -3.7]}>
          {[0, 1, 2].map((i) => (
            <Box key={`step-${i}`} pos={[0, -0.35 + i * (-0.15), -0.4 - i * 0.35]} 
              size={[2.5 + i * 0.3, 0.15, 0.35]} material={useMemo(() => mat(C.concrete, { opacity: o }), [o])} />
          ))}
        </group>
      )}

      {/* ── NAME BOARD ── */}
      {progress > 0.6 && (
        <group position={[0, 3.1, -3.55]}>
          <Box pos={[0, 0, 0]} size={[2.8, 0.4, 0.04]} material={useMemo(() => mat(C.nameBoard, { opacity: o }), [o])} />
          {/* "CITY CONSTRUCTIONS" text is implied by the dark board — would need TextGeometry for actual text */}
        </group>
      )}
    </group>
  );
}

/* ====================================================================
   ROOF — Parapet wall, water tank, staircase room, antenna
   ==================================================================== */
export function Roof({ progress = 0 }) {
  const topY = 0.25 + 3 * 3.2; // base of roof
  const o = Math.min(progress * 1.5, 1);
  const s = Math.min(progress, 1);

  const mRoof = useMemo(() => mat(C.tileRoof, { roughness: 0.7, metalness: 0.1, opacity: o }), [o]);
  const mParapet = useMemo(() => mat(C.wallMain, { roughness: 0.8, opacity: o }), [o]);
  const mCoping = useMemo(() => mat(C.concreteLight, { roughness: 0.5, opacity: o }), [o]);
  const mTank = useMemo(() => mat(C.waterTank, { roughness: 0.4, metalness: 0.3, opacity: o }), [o]);
  const mStairRoom = useMemo(() => mat(C.wallAccent, { roughness: 0.8, opacity: o }), [o]);
  const mMetal = useMemo(() => mat(C.metalDark, { roughness: 0.3, metalness: 0.7, opacity: o }), [o]);

  return (
    <group>
      {/* Roof slab */}
      <Box pos={[0, topY + 0.1, 0]} size={[11 * s, 0.2, 7 * s]} material={mRoof} />

      {/* ── Parapet walls ── */}
      {progress > 0.2 && (
        <>
          {/* Front */}
          <Box pos={[0, topY + 0.65, -3.4]} size={[11 * s, 0.9, 0.12]} material={mParapet} />
          {/* Back */}
          <Box pos={[0, topY + 0.65, 3.4]} size={[11 * s, 0.9, 0.12]} material={mParapet} />
          {/* Left */}
          <Box pos={[-5.3, topY + 0.65, 0]} size={[0.12, 0.9, 6.7 * s]} material={mParapet} />
          {/* Right */}
          <Box pos={[5.3, topY + 0.65, 0]} size={[0.12, 0.9, 6.7 * s]} material={mParapet} />

          {/* Coping (top cap of parapet) */}
          <Box pos={[0, topY + 1.15, -3.4]} size={[11.2 * s, 0.08, 0.2]} material={mCoping} />
          <Box pos={[0, topY + 1.15, 3.4]} size={[11.2 * s, 0.08, 0.2]} material={mCoping} />
          <Box pos={[-5.35, topY + 1.15, 0]} size={[0.2, 0.08, 7 * s]} material={mCoping} />
          <Box pos={[5.35, topY + 1.15, 0]} size={[0.2, 0.08, 7 * s]} material={mCoping} />
        </>
      )}

      {/* ── Staircase headroom ── */}
      {progress > 0.4 && (
        <group position={[4, topY + 0.2, 1.5]}>
          <Box pos={[0, 1.2, 0]} size={[2.2, 2.4, 2.2]} material={mStairRoom} />
          {/* Door */}
          <Box pos={[0, 1.0, -1.12]} size={[0.8, 1.8, 0.06]} material={useMemo(() => mat(C.frameDark, { opacity: o }), [o])} />
          {/* Small roof */}
          <Box pos={[0, 2.45, 0]} size={[2.4, 0.1, 2.4]} material={mCoping} />
        </group>
      )}

      {/* ── Overhead water tank ── */}
      {progress > 0.55 && (
        <group position={[-3, topY + 0.2, 1.5]}>
          {/* Tank supports */}
          {[[-0.5, -0.5], [-0.5, 0.5], [0.5, -0.5], [0.5, 0.5]].map(([lx, lz], li) => (
            <Box key={`ts-${li}`} pos={[lx, 1, lz]} size={[0.1, 2, 0.1]} material={mMetal} />
          ))}
          {/* Tank body */}
          <mesh position={[0, 2.3, 0]} material={mTank} castShadow>
            <cylinderGeometry args={[0.7, 0.7, 0.9, 16]} />
          </mesh>
          {/* Tank lid */}
          <mesh position={[0, 2.8, 0]} material={mCoping}>
            <cylinderGeometry args={[0.75, 0.75, 0.06, 16]} />
          </mesh>
        </group>
      )}

      {/* ── TV Antenna / Dish ── */}
      {progress > 0.7 && (
        <group position={[2, topY + 1.2, -2]}>
          <mesh material={mMetal} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 2, 6]} />
          </mesh>
          {/* Small dish */}
          <mesh position={[0.15, 0.8, 0]} rotation={[0, 0, -0.3]} material={mMetal}>
            <cylinderGeometry args={[0.3, 0.15, 0.05, 12]} />
          </mesh>
        </group>
      )}

      {/* ── Solar panel frame (optional modern touch) ── */}
      {progress > 0.8 && (
        <group position={[-1, topY + 0.4, -1.5]} rotation={[-0.4, 0, 0]}>
          <Box pos={[0, 0, 0]} size={[2.5, 0.04, 1.5]} material={useMemo(() => mat('#1a2a4a', { metalness: 0.5, opacity: o }), [o])} />
          {/* Frame */}
          <Box pos={[0, -0.03, 0]} size={[2.55, 0.03, 1.55]} material={mMetal} />
        </group>
      )}
    </group>
  );
}

/* ====================================================================
   LANDSCAPE — Compound wall, gate, trees, garden, driveway, road
   ==================================================================== */
export function Landscape({ progress = 0 }) {
  const o = Math.min(progress * 1.5, 1);
  const s = Math.min(progress, 1);

  const mGrass = useMemo(() => mat(C.grassDark, { roughness: 0.95, opacity: o }), [o]);
  const mGrassL = useMemo(() => mat(C.grassLight, { roughness: 0.92, opacity: o }), [o]);
  const mRoad = useMemo(() => mat(C.road, { roughness: 0.85, opacity: o }), [o]);
  const mPaver = useMemo(() => mat(C.paver, { roughness: 0.88, opacity: o }), [o]);
  const mCWall = useMemo(() => mat(C.wallAccent, { roughness: 0.8, opacity: o }), [o]);
  const mGate = useMemo(() => mat(C.metalDark, { roughness: 0.25, metalness: 0.7, opacity: o }), [o]);
  const mTrunk = useMemo(() => mat(C.trunk, { roughness: 0.9, opacity: o }), [o]);
  const mLeaf1 = useMemo(() => mat(C.leaf1, { roughness: 0.85, opacity: o }), [o]);
  const mLeaf2 = useMemo(() => mat(C.leaf2, { roughness: 0.85, opacity: o }), [o]);
  const mLeaf3 = useMemo(() => mat(C.leaf3, { roughness: 0.85, opacity: o }), [o]);
  const mCoping = useMemo(() => mat(C.concreteLight, { roughness: 0.55, opacity: o }), [o]);
  const mFlower = useMemo(() => mat('#c44040', { roughness: 0.7, opacity: o }), [o]);
  const mLamp = useMemo(() => mat(C.metalDark, { roughness: 0.3, metalness: 0.6, opacity: o }), [o]);
  const mLight = useMemo(() => mat(C.lightWarm, { emissive: C.lightWarm, emissiveIntensity: 0.6, opacity: o }), [o]);

  const leafMats = [mLeaf1, mLeaf2, mLeaf3];

  // Tree component
  function Tree({ pos, height = 3, leafRadius = 1.2, leafMat }) {
    const ts = s;
    return (
      <group position={pos} scale={[ts, ts, ts]}>
        <mesh position={[0, height / 2, 0]} material={mTrunk} castShadow>
          <cylinderGeometry args={[0.08, 0.14, height, 8]} />
        </mesh>
        {/* Multiple leaf clusters for realism */}
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
      {/* ── Extended grass ground ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.59, 0]} material={mGrass} receiveShadow>
        <planeGeometry args={[42, 36]} />
      </mesh>

      {/* Garden patches around building */}
      <Box pos={[-7, -0.56, 0]} size={[1.5, 0.02, 10]} material={mGrassL} />
      <Box pos={[7, -0.56, 0]} size={[1.5, 0.02, 10]} material={mGrassL} />
      <Box pos={[0, -0.56, 5.5]} size={[14, 0.02, 1.2]} material={mGrassL} />

      {/* ── Compound wall ── */}
      {progress > 0.15 && (
        <>
          {/* Front wall (with gate opening) */}
          <Box pos={[-4.5, 0.1, -6.2]} size={[7, 1.2 * s, 0.15]} material={mCWall} />
          <Box pos={[4.5, 0.1, -6.2]} size={[7, 1.2 * s, 0.15]} material={mCWall} />
          {/* Wall coping */}
          <Box pos={[-4.5, 0.75 * s, -6.2]} size={[7.1, 0.08, 0.22]} material={mCoping} />
          <Box pos={[4.5, 0.75 * s, -6.2]} size={[7.1, 0.08, 0.22]} material={mCoping} />
          {/* Gate pillars */}
          <Box pos={[-1, 0.25, -6.2]} size={[0.35, 1.5 * s, 0.35]} material={mCoping} />
          <Box pos={[1, 0.25, -6.2]} size={[0.35, 1.5 * s, 0.35]} material={mCoping} />
          {/* Pillar caps */}
          <Box pos={[-1, 1.05 * s, -6.2]} size={[0.45, 0.1, 0.45]} material={mCoping} />
          <Box pos={[1, 1.05 * s, -6.2]} size={[0.45, 0.1, 0.45]} material={mCoping} />

          {/* Side walls */}
          <Box pos={[-8.1, 0.1, 0]} size={[0.15, 1.2 * s, 12.4]} material={mCWall} />
          <Box pos={[8.1, 0.1, 0]} size={[0.15, 1.2 * s, 12.4]} material={mCWall} />
          {/* Back wall */}
          <Box pos={[0, 0.1, 6.2]} size={[16.4, 1.2 * s, 0.15]} material={mCWall} />

          {/* Coping on side and back */}
          <Box pos={[-8.15, 0.75 * s, 0]} size={[0.22, 0.08, 12.5]} material={mCoping} />
          <Box pos={[8.15, 0.75 * s, 0]} size={[0.22, 0.08, 12.5]} material={mCoping} />
          <Box pos={[0, 0.75 * s, 6.25]} size={[16.5, 0.08, 0.22]} material={mCoping} />
        </>
      )}

      {/* ── Gate ── */}
      {progress > 0.25 && (
        <group position={[0, 0, -6.2]}>
          {/* Gate leaves */}
          <Box pos={[-0.48, 0.45, 0]} size={[0.95, 0.9, 0.04]} material={mGate} />
          <Box pos={[0.48, 0.45, 0]} size={[0.95, 0.9, 0.04]} material={mGate} />
          {/* Gate horizontal bars */}
          {[0.15, 0.35, 0.55, 0.75].map((gy, gi) => (
            <Box key={`gb-${gi}`} pos={[0, gy, 0.02]} size={[1.9, 0.025, 0.015]} material={mGate} />
          ))}
          {/* Vertical bars */}
          {[-0.7, -0.4, -0.1, 0.1, 0.4, 0.7].map((gx, gi) => (
            <Box key={`gv-${gi}`} pos={[gx, 0.45, 0.02]} size={[0.02, 0.85, 0.015]} material={mGate} />
          ))}
        </group>
      )}

      {/* ── Driveway ── */}
      {progress > 0.2 && (
        <>
          <Box pos={[0, -0.57, -5]} size={[2.5 * s, 0.04, 2.5]} material={mPaver} />
          <Box pos={[0, -0.57, -8]} size={[3 * s, 0.04, 3.5]} material={mRoad} />
        </>
      )}

      {/* ── Road ── */}
      {progress > 0.3 && (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.58, -11]} material={mRoad} receiveShadow>
            <planeGeometry args={[42 * s, 3.5]} />
          </mesh>
          {/* Road center line */}
          <Box pos={[0, -0.56, -11]} size={[40 * s, 0.005, 0.08]} material={useMemo(() => mat(C.roadMark, { opacity: o * 0.6 }), [o])} />
        </>
      )}

      {/* ── Trees ── */}
      {progress > 0.35 && (
        <>
          <Tree pos={[-7, -0.5, -4]} height={3.5} leafRadius={1.3} leafMat={leafMats[0]} />
          <Tree pos={[-7, -0.5, 2]} height={4} leafRadius={1.5} leafMat={leafMats[1]} />
          <Tree pos={[7, -0.5, -3]} height={3} leafRadius={1.1} leafMat={leafMats[2]} />
          <Tree pos={[7, -0.5, 3]} height={3.8} leafRadius={1.4} leafMat={leafMats[0]} />
          <Tree pos={[-3, -0.5, 6.5]} height={2.8} leafRadius={1.0} leafMat={leafMats[1]} />
          <Tree pos={[3, -0.5, 6.5]} height={3.2} leafRadius={1.2} leafMat={leafMats[2]} />
          
          {/* Street trees */}
          <Tree pos={[-8, -0.5, -10]} height={4.5} leafRadius={1.8} leafMat={leafMats[0]} />
          <Tree pos={[8, -0.5, -10]} height={4.5} leafRadius={1.8} leafMat={leafMats[1]} />
          <Tree pos={[-14, -0.5, -10]} height={4} leafRadius={1.5} leafMat={leafMats[2]} />
          <Tree pos={[14, -0.5, -10]} height={4} leafRadius={1.5} leafMat={leafMats[0]} />
        </>
      )}

      {/* ── Flower bushes ── */}
      {progress > 0.5 && (
        <>
          {[-3, -1, 1, 3].map((x, fi) => (
            <group key={`bush-${fi}`} position={[x, -0.4, -4.8]} scale={[s, s, s]}>
              <mesh material={leafMats[fi % 3]} castShadow>
                <sphereGeometry args={[0.35, 8, 6]} />
              </mesh>
              {fi % 2 === 0 && (
                <mesh position={[0, 0.15, 0.1]} material={mFlower}>
                  <sphereGeometry args={[0.12, 6, 4]} />
                </mesh>
              )}
            </group>
          ))}
        </>
      )}

      {/* ── Garden path lights ── */}
      {progress > 0.6 && (
        <>
          {[-2.5, 2.5].map((x, li) => (
            <group key={`lamp-${li}`} position={[x, -0.55, -5.5]} scale={[s, s, s]}>
              <mesh position={[0, 0.5, 0]} material={mLamp} castShadow>
                <cylinderGeometry args={[0.035, 0.045, 1, 6]} />
              </mesh>
              <mesh position={[0, 1.05, 0]} material={mLight}>
                <sphereGeometry args={[0.1, 8, 8]} />
              </mesh>
              {/* Soft light glow */}
              <pointLight position={[0, 1.1, 0]} intensity={0.15} color="#ffd700" distance={3} />
            </group>
          ))}
        </>
      )}

      {/* ── Parking area ── */}
      {progress > 0.45 && (
        <group position={[5, -0.57, -5]}>
          <Box pos={[0, 0, 0]} size={[3 * s, 0.03, 3]} material={mPaver} />
          {/* Parking lines */}
          {[-0.8, 0.8].map((px, pi) => (
            <Box key={`pl-${pi}`} pos={[px, 0.02, 0]} size={[0.04, 0.005, 2.5]} material={useMemo(() => mat('#ffffff', { opacity: o * 0.4 }), [o])} />
          ))}
        </group>
      )}

      {/* ── Nameplate on gate pillar ── */}
      {progress > 0.7 && (
        <Box pos={[-1, 0.6, -6.38]} size={[0.6, 0.25, 0.02]} material={useMemo(() => mat(C.nameBoard, { opacity: o }), [o])} />
      )}
    </group>
  );
}

export default { Foundation, Structure, Walls, WindowsDoors, Roof, Landscape };
