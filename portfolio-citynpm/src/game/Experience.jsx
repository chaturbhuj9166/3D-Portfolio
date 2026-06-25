import { Suspense } from 'react'
import { Stars, Sparkles, Sky, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

import Ground from './world/Ground'
import Roads from './world/Roads'
import Decorations from './world/Decorations'
import Parks from './world/Parks'
import GenericBuildings from './world/GenericBuildings'
import SectionBuilding from './world/SectionBuilding'
import BuildingGLB from './world/BuildingGLB'
import TreesGLB from './world/TreesGLB'
import Player from './player/Player'
import ExportGLB from './utils/ExportGLB'
import { BUILDINGS, WATER_MODEL } from '../data/portfolio'
import { LAKES } from '../data/world'
import { useGame } from '../store/useGame'

// Sun direction (shared by the Sky, the sun disc and the key light in day mode).
const SUN = [150, 80, 110]

export default function Experience() {
  const day = useGame((s) => s.mode === 'day')

  return (
    <>
      {/* ----- Sky / atmosphere ----- */}
      {day ? (
        <>
          <color attach="background" args={['#bcd6ef']} />
          <fog attach="fog" args={['#cfe0ee', 80, 320]} />
          <Sky sunPosition={SUN} turbidity={6} rayleigh={1.2} mieCoefficient={0.005} mieDirectionalG={0.85} />
          {/* visible sun disc */}
          <mesh position={SUN}>
            <sphereGeometry args={[10, 24, 24]} />
            <meshBasicMaterial color="#fff6da" />
          </mesh>
          {/* image-based reflections (loads async; isolated so the scene never blanks) */}
          <Suspense fallback={null}>
            <Environment preset="park" background={false} />
          </Suspense>
        </>
      ) : (
        <>
          <color attach="background" args={['#0a0e1a']} />
          <fog attach="fog" args={['#0a0e1a', 55, 150]} />
          <Stars radius={180} depth={60} count={2500} factor={4} saturation={0} fade speed={0.5} />
          <Sparkles count={40} scale={[120, 20, 120]} position={[0, 12, 0]} size={3} speed={0.2} color="#ffd9a0" opacity={0.4} />
        </>
      )}

      {/* ----- Key light (sun by day, moon by night) ----- */}
      <directionalLight
        position={day ? SUN : [40, 70, 20]}
        intensity={day ? 2.6 : 0.7}
        color={day ? '#fff4e0' : '#9fb4ff'}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={320}
        shadow-camera-left={-110}
        shadow-camera-right={110}
        shadow-camera-top={110}
        shadow-camera-bottom={-110}
        shadow-bias={-0.0005}
      />
      <hemisphereLight
        args={day ? ['#bfe0ff', '#9a8f78', 0.9] : ['#2a3a6a', '#0a0e1a', 0.35]}
      />
      <ambientLight intensity={day ? 0.5 : 0.18} color={day ? '#ffffff' : '#5566aa'} />

      {/* ----- The city ----- */}
      <Ground />
      <Roads />
      <GenericBuildings />
      <Parks />
      <Suspense fallback={null}>
        <TreesGLB />
      </Suspense>
      <Decorations />
      {BUILDINGS.map((b) => (
        <SectionBuilding key={b.id} data={b} />
      ))}

      {/* animated water ponds */}
      {LAKES.map((l) => (
        <group key={l.key} position={[l.x, 0.06, l.z]}>
          <Suspense fallback={null}>
            <BuildingGLB url={WATER_MODEL} scale={l.scale} offset={l.offset} play />
          </Suspense>
        </group>
      ))}

      <Player />
      <ExportGLB />

      {/* ----- Post-processing ----- */}
      <EffectComposer disableNormalPass>
        <Bloom
          intensity={day ? 0.45 : 0.9}
          luminanceThreshold={day ? 0.8 : 0.55}
          luminanceSmoothing={0.25}
          mipmapBlur
          radius={0.7}
        />
        <Vignette eskil={false} offset={0.25} darkness={day ? 0.5 : 0.85} />
      </EffectComposer>
    </>
  )
}
