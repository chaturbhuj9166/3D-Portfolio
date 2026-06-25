import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { useGame } from '../../store/useGame'

// One of the five interactive "section" buildings. A modern stylised tower
// with lit window bands, a rooftop crown, a glowing entrance sign, a floating
// label and a proximity interaction icon.
export default function SectionBuilding({ data }) {
  const { id, label, color, accent, position, rotation, height, footprint } = data
  const [px, pz] = position
  const [w, d] = footprint

  const near = useGame((s) => s.nearBuilding === id)
  const open = useGame((s) => s.open)

  const iconRef = useRef()
  const ringRef = useRef()

  // Window band positions up the tower.
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
    if (ringRef.current && near) {
      ringRef.current.rotation.z = t * 1.5
    }
  })

  return (
    <group position={[px, 0, pz]} rotation={[0, rotation, 0]}>
      {/* Plinth / base */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[w + 1.6, 1.2, d + 1.6]} />
        <meshStandardMaterial color="#3a3f4b" roughness={0.8} />
      </mesh>

      {/* Main tower body */}
      <mesh position={[0, height / 2 + 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, height, d]} />
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.25} />
      </mesh>

      {/* Glass core stripe (front) */}
      <mesh position={[0, height / 2 + 1.2, d / 2 + 0.06]}>
        <boxGeometry args={[w * 0.4, height * 0.92, 0.12]} />
        <meshStandardMaterial
          color="#0b1622"
          emissive={accent}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* Lit window bands wrapping the tower */}
      {floors.map((y, i) => (
        <mesh key={i} position={[0, y + 1.2, 0]}>
          <boxGeometry args={[w + 0.06, 0.55, d + 0.06]} />
          <meshStandardMaterial
            color="#10151d"
            emissive={accent}
            emissiveIntensity={i % 2 === 0 ? 0.9 : 0.45}
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>
      ))}

      {/* Rooftop crown + antenna */}
      <mesh position={[0, height + 1.6, 0]} castShadow>
        <boxGeometry args={[w * 0.6, 0.8, d * 0.6]} />
        <meshStandardMaterial color="#2a2f3a" roughness={0.7} />
      </mesh>
      <mesh position={[0, height + 3.2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 3, 6]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0, height + 4.7, 0]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2} />
      </mesh>

      {/* Entrance + glowing sign */}
      <mesh position={[0, 1.6, d / 2 + 0.85]} castShadow>
        <boxGeometry args={[3, 3.2, 0.3]} />
        <meshStandardMaterial color="#0c0f14" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 3.9, d / 2 + 0.7]}>
        <boxGeometry args={[w * 0.85, 1.1, 0.25]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.4} />
      </mesh>
      <Text
        position={[0, 3.9, d / 2 + 0.86]}
        fontSize={0.62}
        color="#0a0a0a"
        anchorX="center"
        anchorY="middle"
        maxWidth={w}
      >
        {label.toUpperCase()}
      </Text>

      {/* Floating label above the tower (billboarded) */}
      <Billboard position={[0, height + 6, 0]}>
        <Text fontSize={1.5} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.05} outlineColor="#000">
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
