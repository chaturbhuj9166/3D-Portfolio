import { CITY, BLOCK_CENTERS } from '../../data/portfolio'

// Grass base plane + raised sidewalk slabs for every city block.
export default function Ground() {
  const blocks = []
  for (const x of BLOCK_CENTERS) {
    for (const z of BLOCK_CENTERS) {
      blocks.push([x, z])
    }
  }
  const s = CITY.blockInner

  return (
    <group>
      {/* Grass / terrain base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[CITY.groundSize, CITY.groundSize]} />
        <meshStandardMaterial color="#1f3a24" roughness={1} metalness={0} />
      </mesh>

      {/* Sidewalk slabs (one per block) */}
      {blocks.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          {/* concrete slab */}
          <mesh position={[0, 0.12, 0]} receiveShadow castShadow>
            <boxGeometry args={[s, 0.24, s]} />
            <meshStandardMaterial color="#8c93a1" roughness={0.9} />
          </mesh>
          {/* curb trim */}
          <mesh position={[0, 0.22, 0]}>
            <boxGeometry args={[s + 0.4, 0.06, s + 0.4]} />
            <meshStandardMaterial color="#6a7180" roughness={0.9} />
          </mesh>
          {/* inner grass planter so buildings sit on green */}
          <mesh position={[0, 0.25, 0]} receiveShadow>
            <boxGeometry args={[s - 6, 0.02, s - 6]} />
            <meshStandardMaterial color="#2e6b3a" roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
