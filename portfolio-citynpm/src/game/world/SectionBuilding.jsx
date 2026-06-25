import { Suspense, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { useGame } from '../../store/useGame'
import BuildingGLB from './BuildingGLB'

// One of the five interactive "section" buildings. Renders a GLB model when
// `data.model` is set (otherwise a procedural tower), plus a floating label and
// a proximity interaction icon.
export default function SectionBuilding({ data }) {
  const { id, label, color, accent, position, rotation, height, footprint, model, scale, offset } = data
  const [px, pz] = position
  const [w, d] = footprint

  const near = useGame((s) => s.nearBuilding === id)
  const open = useGame((s) => s.open)

  const iconRef = useRef()
  const ringRef = useRef()
  const haloRef = useRef()

  const floors = useMemo(() => {
    const n = Math.max(3, Math.floor(height / 3.2))
    return Array.from({ length: n }, (_, i) => 1.8 + i * (height / n))
  }, [height])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (iconRef.current) {
      iconRef.current.position.y = height + 4 + Math.sin(t * 2) * 0.35
      iconRef.current.scale.setScalar(near ? 1 : 0.001)
    }
    if (ringRef.current && near) ringRef.current.rotation.z = t * 1.5
    if (haloRef.current) {
      haloRef.current.rotation.z = t * 0.4
      haloRef.current.material.opacity = near ? 0.85 : 0.4
    }
  })

  return (
    <group position={[px, 0, pz]} rotation={[0, rotation, 0]}>
      {model ? (
        <>
          {/* glowing base pad that marks this building as interactive */}
          <mesh ref={haloRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.28, 0]}>
            <ringGeometry args={[Math.max(w, d) * 0.55, Math.max(w, d) * 0.7, 48]} />
            <meshBasicMaterial color={accent} transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
          <Suspense fallback={null}>
            <BuildingGLB url={model} scale={scale} offset={offset} />
          </Suspense>
        </>
      ) : (
        <ProceduralTower w={w} d={d} height={height} color={color} accent={accent} label={label} floors={floors} />
      )}

      {/* Floating label above the building (billboarded) */}
      <Billboard position={[0, height + 6, 0]}>
        <Text fontSize={1.6} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.05} outlineColor="#000">
          {label}
        </Text>
      </Billboard>

      {/* Proximity interaction icon */}
      <group ref={iconRef} position={[0, height + 4, 0]}>
        <Billboard>
          <mesh ref={ringRef}>
            <ringGeometry args={[1.05, 1.35, 6]} />
            <meshBasicMaterial color={accent} side={THREE.DoubleSide} />
          </mesh>
          <mesh
            onClick={(e) => {
              e.stopPropagation()
              if (near) open(id)
            }}
            onPointerOver={() => (document.body.style.cursor = 'pointer')}
            onPointerOut={() => (document.body.style.cursor = '')}
          >
            <circleGeometry args={[1, 24]} />
            <meshBasicMaterial color="#0b0f1a" />
          </mesh>
          <Text position={[0, 0.05, 0.01]} fontSize={1.1} color={accent} anchorX="center" anchorY="middle">
            {label[0]}
          </Text>
          <Text position={[0, -1.7, 0.01]} fontSize={0.5} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.04} outlineColor="#000">
            Press  E
          </Text>
        </Billboard>
      </group>
    </group>
  )
}

// Procedural fallback tower (used if a building has no GLB model).
function ProceduralTower({ w, d, height, color, accent, label, floors }) {
  return (
    <>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[w + 1.6, 1.2, d + 1.6]} />
        <meshStandardMaterial color="#3a3f4b" roughness={0.8} />
      </mesh>
      <mesh position={[0, height / 2 + 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, height, d]} />
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.25} />
      </mesh>
      {floors.map((y, i) => (
        <mesh key={i} position={[0, y + 1.2, 0]}>
          <boxGeometry args={[w + 0.06, 0.55, d + 0.06]} />
          <meshStandardMaterial color="#10151d" emissive={accent} emissiveIntensity={i % 2 === 0 ? 0.9 : 0.45} roughness={0.3} metalness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 3.9, d / 2 + 0.7]}>
        <boxGeometry args={[w * 0.85, 1.1, 0.25]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.4} />
      </mesh>
      <Text position={[0, 3.9, d / 2 + 0.86]} fontSize={0.62} color="#0a0a0a" anchorX="center" anchorY="middle" maxWidth={w}>
        {label.toUpperCase()}
      </Text>
    </>
  )
}
