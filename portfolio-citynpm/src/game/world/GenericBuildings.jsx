import { GENERIC_BUILDINGS } from '../../data/world'

// Low-poly skyline buildings filling non-section blocks, with warm/cool lit
// window bands for the night look. Geometry comes from the shared world data
// so these exact boxes are also used as solid colliders.
export default function GenericBuildings() {
  return (
    <group>
      {GENERIC_BUILDINGS.map((b) => (
        <group key={b.key} position={[b.x, 0, b.z]}>
          <mesh position={[0, b.h / 2 + 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={b.color} roughness={0.7} metalness={0.2} />
          </mesh>
          {b.lit &&
            Array.from({ length: b.floors }).map((_, f) => (
              <mesh key={f} position={[0, 2 + f * (b.h / b.floors), 0]}>
                <boxGeometry args={[b.w + 0.04, 0.4, b.d + 0.04]} />
                <meshStandardMaterial
                  color="#0d1118"
                  emissive={b.win}
                  emissiveIntensity={f % 2 === 0 ? 0.7 : 0.35}
                  roughness={0.4}
                />
              </mesh>
            ))}
          {/* rooftop unit */}
          <mesh position={[0, b.h + 0.6, 0]} castShadow>
            <boxGeometry args={[b.w * 0.4, 0.7, b.d * 0.4]} />
            <meshStandardMaterial color="#23272f" />
          </mesh>
        </group>
      ))}
    </group>
  )
}
