import { useMemo } from 'react'
import { PARKS, makeRng } from '../../data/portfolio'
import { isLakePark } from '../../data/world'
import { Bush, Flower, GrassField } from '../props/Nature'

const FLOWER_COLORS = ['#ff5c8a', '#ffd23f', '#7c5cff', '#ff8a3d', '#ffffff']

// Green parks: lawns, flower beds, a glowing fountain. Trees, benches and lamps
// come from the shared world data (rendered by <Trees /> and <Decorations />)
// so they line up exactly with the player's colliders.
export default function Parks() {
  const parks = useMemo(() => {
    // Trees are rendered + collided via <Trees /> (shared world data).
    return PARKS.map(([cx, cz], pi) => {
      const rng = makeRng(600 + pi * 41)
      const bushes = []
      const flowers = []
      const tufts = []
      for (let i = 0; i < 8; i++)
        bushes.push([cx + (rng() - 0.5) * 18, 0, cz + (rng() - 0.5) * 18, 0.7 + rng() * 0.6])
      for (let i = 0; i < 30; i++)
        flowers.push([
          cx + (rng() - 0.5) * 18,
          0,
          cz + (rng() - 0.5) * 18,
          FLOWER_COLORS[Math.floor(rng() * FLOWER_COLORS.length)],
        ])
      for (let i = 0; i < 120; i++)
        tufts.push([cx + (rng() - 0.5) * 20, 0, cz + (rng() - 0.5) * 20, rng() * Math.PI, 0.7 + rng() * 0.6])
      return { cx, cz, bushes, flowers, tufts, pi }
    })
  }, [])

  return (
    <group>
      {parks.map((p) => (
        <group key={p.pi}>
          {/* path cross */}
          <mesh position={[p.cx, 0.26, p.cz]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.2, 20]} />
            <meshStandardMaterial color="#b8a07a" roughness={1} />
          </mesh>
          <mesh position={[p.cx, 0.26, p.cz]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
            <planeGeometry args={[3.2, 20]} />
            <meshStandardMaterial color="#b8a07a" roughness={1} />
          </mesh>

          <GrassField tufts={p.tufts} />
          {p.bushes.map((b, i) => (
            <Bush key={i} position={[b[0], 0.25, b[2]]} scale={b[3]} />
          ))}
          {p.flowers.map((f, i) => (
            <Flower key={i} position={[f[0], 0.25, f[2]]} color={f[3]} />
          ))}

          {/* glowing fountain (skipped where the animated water pond goes) */}
          {!isLakePark(p.cx, p.cz) && (
            <group position={[p.cx, 0.25, p.cz]}>
              <mesh position={[0, 0.4, 0]} castShadow>
                <cylinderGeometry args={[1.8, 2, 0.8, 16]} />
                <meshStandardMaterial color="#6b7280" roughness={0.8} />
              </mesh>
              <mesh position={[0, 0.85, 0]}>
                <cylinderGeometry args={[1.5, 1.5, 0.25, 16]} />
                <meshStandardMaterial color="#7cc4ff" emissive="#3aa0ff" emissiveIntensity={1.2} />
              </mesh>
              <mesh position={[0, 1.6, 0]}>
                <cylinderGeometry args={[0.18, 0.25, 1.4, 8]} />
                <meshStandardMaterial color="#6b7280" />
              </mesh>
              <pointLight position={[0, 1.4, 0]} color="#5ab0ff" intensity={14} distance={16} decay={2} />
            </group>
          )}
        </group>
      ))}
    </group>
  )
}
