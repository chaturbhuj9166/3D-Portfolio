import { useMemo } from 'react'
import { BLOCK_CENTERS, PARKS, CITY, makeRng } from '../../data/portfolio'
import { LAMPS, TRAFFIC, SIGNS, BENCHES } from '../../data/world'
import { useGame } from '../../store/useGame'
import { Bush, Flower } from '../props/Nature'
import { StreetLamp, TrafficLight, Bench, RoadSign } from '../props/Street'

const FLOWER_COLORS = ['#ff5c8a', '#ffd23f', '#7c5cff', '#ff8a3d']
const PARK_SET = new Set(PARKS.map((p) => p.join(',')))

// Renders all street furniture (lamps, traffic lights, signs, benches) from the
// shared world data — the same positions the player collides against — plus
// low, non-colliding bushes & flowers around the built blocks.
export default function Decorations() {
  const night = useGame((s) => s.mode === 'night')
  const greenery = useMemo(() => {
    const out = []
    BLOCK_CENTERS.forEach((cx) => {
      BLOCK_CENTERS.forEach((cz) => {
        if (PARK_SET.has([cx, cz].join(','))) return
        const rng = makeRng(7100 + cx * 13 + cz * 31)
        const e = CITY.blockInner / 2 - 1.5
        for (let i = 0; i < 5; i++) {
          const edge = Math.floor(rng() * 4)
          const t = (rng() - 0.5) * 2 * e
          let bx = cx
          let bz = cz
          if (edge === 0) {
            bx = cx + t
            bz = cz - e
          } else if (edge === 1) {
            bx = cx + t
            bz = cz + e
          } else if (edge === 2) {
            bx = cx - e
            bz = cz + t
          } else {
            bx = cx + e
            bz = cz + t
          }
          if (rng() > 0.5)
            out.push({ type: 'bush', pos: [bx, 0.25, bz], scale: 0.7 + rng() * 0.5, key: `b${cx}${cz}${i}` })
          else
            out.push({
              type: 'flower',
              pos: [bx, 0.25, bz],
              color: FLOWER_COLORS[Math.floor(rng() * FLOWER_COLORS.length)],
              key: `f${cx}${cz}${i}`,
            })
        }
      })
    })
    return out
  }, [])

  return (
    <group>
      {LAMPS.map((l) => (
        <StreetLamp key={l.key} position={[l.x, 0.25, l.z]} rotation={l.rot} light={l.light && night} />
      ))}
      {TRAFFIC.map((t) => (
        <TrafficLight key={t.key} position={[t.x, 0.25, t.z]} rotation={t.rot} state={t.state} />
      ))}
      {SIGNS.map((s) => (
        <RoadSign key={s.key} position={[s.x, 0.25, s.z]} rotation={s.rot} label={s.label} color={s.color} />
      ))}
      {BENCHES.map((b) => (
        <Bench key={b.key} position={[b.x, 0.25, b.z]} rotation={b.rot} />
      ))}
      {greenery.map((g) => {
        if (g.type === 'bush') return <Bush key={g.key} position={g.pos} scale={g.scale} />
        if (g.type === 'flower') return <Flower key={g.key} position={g.pos} color={g.color} />
        return null
      })}
    </group>
  )
}
