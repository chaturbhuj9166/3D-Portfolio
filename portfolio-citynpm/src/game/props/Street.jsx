import { Text, Billboard } from '@react-three/drei'

// ---- Street lamp with warm point light ------------------------------------
export function StreetLamp({ position = [0, 0, 0], rotation = 0, light = true }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* pole */}
      <mesh position={[0, 2.6, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 5.2, 8]} />
        <meshStandardMaterial color="#2b2f36" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* arm */}
      <mesh position={[0.6, 5.1, 0]} castShadow>
        <boxGeometry args={[1.4, 0.16, 0.16]} />
        <meshStandardMaterial color="#2b2f36" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* lamp head */}
      <mesh position={[1.25, 4.95, 0]}>
        <boxGeometry args={[0.6, 0.3, 0.45]} />
        <meshStandardMaterial color="#1a1d22" />
      </mesh>
      {/* glowing bulb */}
      <mesh position={[1.25, 4.78, 0]}>
        <boxGeometry args={[0.5, 0.12, 0.36]} />
        <meshStandardMaterial color="#fff2cf" emissive="#ffcf7a" emissiveIntensity={3} />
      </mesh>
      {light && (
        <pointLight
          position={[1.25, 4.6, 0]}
          color="#ffb86b"
          intensity={28}
          distance={20}
          decay={2}
        />
      )}
    </group>
  )
}

// ---- Traffic light ---------------------------------------------------------
export function TrafficLight({ position = [0, 0, 0], rotation = 0, state = 0 }) {
  const lamps = [
    { c: '#ff3b30', y: 3.7 },
    { c: '#ffcc00', y: 3.2 },
    { c: '#34c759', y: 2.7 },
  ]
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.13, 3.6, 8]} />
        <meshStandardMaterial color="#26292f" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 3.2, 0]} castShadow>
        <boxGeometry args={[0.55, 1.5, 0.4]} />
        <meshStandardMaterial color="#15171b" />
      </mesh>
      {lamps.map((l, i) => (
        <mesh key={i} position={[0, l.y, 0.22]}>
          <circleGeometry args={[0.16, 16]} />
          <meshStandardMaterial
            color={l.c}
            emissive={l.c}
            emissiveIntensity={state === i ? 3 : 0.15}
          />
        </mesh>
      ))}
    </group>
  )
}

// ---- Park bench ------------------------------------------------------------
export function Bench({ position = [0, 0, 0], rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 0.12, 0.6]} />
        <meshStandardMaterial color="#7a5230" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.85, -0.24]} rotation={[0.25, 0, 0]} castShadow>
        <boxGeometry args={[2, 0.45, 0.1]} />
        <meshStandardMaterial color="#7a5230" roughness={0.8} />
      </mesh>
      {[-0.85, 0.85].map((x, i) => (
        <mesh key={i} position={[x, 0.25, 0]} castShadow>
          <boxGeometry args={[0.12, 0.5, 0.55]} />
          <meshStandardMaterial color="#3a3f48" metalness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

// ---- Road sign pointing to a section --------------------------------------
export function RoadSign({ position = [0, 0, 0], rotation = 0, label = '', color = '#2e7d32' }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 2.6, 6]} />
        <meshStandardMaterial color="#3a3f48" metalness={0.6} />
      </mesh>
      <mesh position={[0.55, 2.4, 0]} castShadow>
        <boxGeometry args={[1.7, 0.7, 0.08]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <Billboard position={[0.55, 2.4, 0.06]}>
        <Text fontSize={0.26} color="#fff" anchorX="center" anchorY="middle" maxWidth={1.6}>
          {label}
        </Text>
      </Billboard>
    </group>
  )
}
