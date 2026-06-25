// ===========================================================================
//  Deterministic world generation shared by the renderer AND the collision
//  system, so every building / tree / prop the player sees is also solid.
// ===========================================================================
import { BLOCK_CENTERS, GENERIC_BLOCKS, PARKS, BUILDINGS, CITY, makeRng } from './portfolio'

const BODY_COLORS = ['#394150', '#2f3744', '#434b5c', '#525a6b', '#3d4555']
const WINDOWS = ['#ffd27a', '#ffc98a', '#9ad7ff', '#ffb86b', '#fce8b6']
const HALF = CITY.roadWidth / 2 + 0.8
const PARK_SET = new Set(PARKS.map((p) => p.join(',')))

// ---- Generic skyline buildings (axis-aligned boxes) -----------------------
export const GENERIC_BUILDINGS = []
GENERIC_BLOCKS.forEach(([cx, cz], bi) => {
  const rng = makeRng(1000 + bi * 97)
  const count = 3 + Math.floor(rng() * 3)
  for (let i = 0; i < count; i++) {
    const w = 4 + rng() * 4
    const d = 4 + rng() * 4
    const h = 6 + rng() * 20
    const ox = (rng() - 0.5) * 12
    const oz = (rng() - 0.5) * 12
    GENERIC_BUILDINGS.push({
      key: `${bi}-${i}`,
      x: cx + ox,
      z: cz + oz,
      w,
      h,
      d,
      color: BODY_COLORS[Math.floor(rng() * BODY_COLORS.length)],
      win: WINDOWS[Math.floor(rng() * WINDOWS.length)],
      floors: Math.max(2, Math.floor(h / 3)),
      lit: rng() > 0.25,
    })
  }
})

// ---- Trees (corner trees on built blocks + park trees) --------------------
export const TREES = []
BLOCK_CENTERS.forEach((cx) => {
  BLOCK_CENTERS.forEach((cz) => {
    if (PARK_SET.has([cx, cz].join(','))) return
    const rng = makeRng(7000 + cx * 13 + cz * 31)
    const e = CITY.blockInner / 2 - 1.5
    // two trees per block (opposite corners) to keep the city from feeling crowded
    const corners = [
      [cx - e, cz - e],
      [cx + e, cz + e],
    ]
    corners.forEach(([tx, tz], i) =>
      TREES.push({ key: `tc${cx}_${cz}_${i}`, x: tx, z: tz, scale: 0.8 + rng() * 0.4 }),
    )
  })
})
PARKS.forEach(([cx, cz], pi) => {
  const rng = makeRng(500 + pi * 41)
  for (let i = 0; i < 4; i++) {
    TREES.push({
      key: `tp${pi}_${i}`,
      x: cx + (rng() - 0.5) * 16,
      z: cz + (rng() - 0.5) * 16,
      scale: 0.8 + rng() * 0.5,
    })
  }
})

// ---- Street lamps ----------------------------------------------------------
export const LAMPS = []
for (const x of CITY.gridLines)
  for (const z of BLOCK_CENTERS)
    LAMPS.push({ key: `lv${x}_${z}`, x: x + HALF, z, rot: -Math.PI / 2, light: Math.abs(x) <= 30 })
for (const z of CITY.gridLines)
  for (const x of BLOCK_CENTERS)
    LAMPS.push({ key: `lh${x}_${z}`, x, z: z + HALF, rot: Math.PI, light: false })
PARKS.forEach(([cx, cz], pi) =>
  LAMPS.push({ key: `lp${pi}`, x: cx + 8, z: cz + 8, rot: Math.PI, light: true }),
)

// ---- Traffic lights --------------------------------------------------------
export const TRAFFIC = [
  [0, 0],
  [30, 0],
  [-30, 0],
  [0, 30],
  [0, -30],
].map(([x, z], i) => ({ key: `tr${i}`, x: x + HALF, z: z + HALF, rot: Math.PI * 0.25, state: i % 3 }))

// ---- Direction signs -------------------------------------------------------
// Placed directly in front of each building's entrance (mid-edge of the block),
// which keeps them clear of the corner trees.
export const SIGNS = BUILDINGS.map((b) => {
  const [x, z] = b.position
  const dist = 8
  const sx = x + Math.sin(b.rotation) * dist
  const sz = z + Math.cos(b.rotation) * dist
  return { key: b.id, x: sx, z: sz, rot: b.rotation, label: b.label, color: b.color }
})

// ---- Benches (built blocks + parks) ---------------------------------------
export const BENCHES = []
BLOCK_CENTERS.forEach((cx) => {
  BLOCK_CENTERS.forEach((cz) => {
    if (PARK_SET.has([cx, cz].join(','))) {
      BENCHES.push({ key: `pba${cx}_${cz}`, x: cx + 4, z: cz, rot: -Math.PI / 2 })
      BENCHES.push({ key: `pbb${cx}_${cz}`, x: cx - 4, z: cz, rot: Math.PI / 2 })
    } else {
      const e = CITY.blockInner / 2 - 1.5
      BENCHES.push({ key: `bb${cx}_${cz}`, x: cx, z: cz + e, rot: 0 })
    }
  })
})

// ---- Fountains (park centres) ---------------------------------------------
export const FOUNTAINS = PARKS.map(([cx, cz], pi) => ({ key: `f${pi}`, x: cx, z: cz }))

// ---- Animated water pond (placed in one park instead of a fountain) -------
export const LAKES = [
  { key: 'lake0', x: -45, z: 45, radius: 12, scale: 0.27, offset: [0, 0.55, 0] },
]
const LAKE_SET = new Set(LAKES.map((l) => `${l.x},${l.z}`))
export const isLakePark = (cx, cz) => LAKE_SET.has(`${cx},${cz}`)

// ---- Collider sets ---------------------------------------------------------
// Rotated boxes: section buildings (45°) + axis-aligned generic buildings.
export const BOX_COLLIDERS = [
  ...BUILDINGS.map((b) => ({
    x: b.position[0],
    z: b.position[1],
    hw: b.footprint[0] / 2 + 1,
    hd: b.footprint[1] / 2 + 1,
    rot: b.rotation,
  })),
  ...GENERIC_BUILDINGS.map((b) => ({ x: b.x, z: b.z, hw: b.w / 2, hd: b.d / 2, rot: 0 })),
]

// Circular colliders: trees + street furniture.
export const CIRCLE_COLLIDERS = [
  ...TREES.map((t) => ({ x: t.x, z: t.z, radius: 0.55 * t.scale })),
  ...LAMPS.map((l) => ({ x: l.x, z: l.z, radius: 0.4 })),
  ...TRAFFIC.map((t) => ({ x: t.x, z: t.z, radius: 0.4 })),
  ...SIGNS.map((s) => ({ x: s.x, z: s.z, radius: 0.35 })),
  ...BENCHES.map((b) => ({ x: b.x, z: b.z, radius: 1.1 })),
  ...FOUNTAINS.filter((f) => !isLakePark(f.x, f.z)).map((f) => ({ x: f.x, z: f.z, radius: 2.3 })),
  ...LAKES.map((l) => ({ x: l.x, z: l.z, radius: l.radius })),
]
