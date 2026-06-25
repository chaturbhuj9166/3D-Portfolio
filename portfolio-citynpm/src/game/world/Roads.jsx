import { useMemo } from 'react'
import { Instances, Instance } from '@react-three/drei'
import { CITY } from '../../data/portfolio'

const EXTENT = 72 // roads run edge to edge

// Asphalt road grid with painted lane markings.
export default function Roads() {
  const { gridLines, roadWidth } = CITY

  // Dashed centre-line markings, generated deterministically along every road.
  const dashes = useMemo(() => {
    const out = []
    const step = 6
    for (const line of gridLines) {
      for (let p = -EXTENT + 3; p < EXTENT; p += step) {
        // vertical road (runs along Z) -> dash centred on x=line
        out.push({ pos: [line, 0.07, p], rot: 0 })
        // horizontal road (runs along X) -> dash centred on z=line
        out.push({ pos: [p, 0.07, line], rot: Math.PI / 2 })
      }
    }
    return out
  }, [gridLines])

  // Crosswalk stripes at every intersection.
  const crossings = useMemo(() => {
    const out = []
    for (const x of gridLines)
      for (const z of gridLines) out.push([x, z])
    return out
  }, [gridLines])

  return (
    <group>
      {/* Vertical roads (along Z) */}
      {gridLines.map((x, i) => (
        <mesh key={`v${i}`} position={[x, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[roadWidth, EXTENT * 2]} />
          <meshStandardMaterial color="#26282d" roughness={0.95} />
        </mesh>
      ))}
      {/* Horizontal roads (along X) */}
      {gridLines.map((z, i) => (
        <mesh key={`h${i}`} position={[0, 0.045, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[EXTENT * 2, roadWidth]} />
          <meshStandardMaterial color="#26282d" roughness={0.95} />
        </mesh>
      ))}

      {/* Lane dashes */}
      <Instances limit={dashes.length} castShadow={false}>
        <boxGeometry args={[0.22, 0.02, 2.2]} />
        <meshStandardMaterial color="#e8e2cf" emissive="#3a3520" emissiveIntensity={0.3} />
        {dashes.map((d, i) => (
          <Instance key={i} position={d.pos} rotation={[0, d.rot, 0]} />
        ))}
      </Instances>

      {/* Crosswalk pads */}
      {crossings.map(([x, z], i) => (
        <mesh key={`c${i}`} position={[x, 0.06, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[roadWidth - 0.5, roadWidth - 0.5]} />
          <meshStandardMaterial color="#2c2f35" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}
