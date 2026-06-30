import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import CharacterGLB from './CharacterGLB'
import { useKeyboard } from './useKeyboard'
import { useGame } from '../../store/useGame'
import { BUILDINGS, CITY, SPAWN } from '../../data/portfolio'
import { BOX_COLLIDERS, CIRCLE_COLLIDERS } from '../../data/world'

const WALK = 5
const RUN = 10
const JUMP_V = 8
const GRAVITY = -22
const CAM_DIST = 9
const PLAYER_R = 0.6

// Section-building interaction zones (proximity only; physical blocking is done
// by the shared BOX_COLLIDERS, which include these buildings as rotated boxes).
const INTERACT_ZONES = BUILDINGS.map((b) => ({
  id: b.id,
  x: b.position[0],
  z: b.position[1],
  radius: b.footprint[0] / 2 + 4.5,
}))

export default function Player() {
  const group = useRef()
  const keys = useKeyboard()
  const { camera, gl } = useThree()

  const anim = useRef({ mode: 'idle', speed: 0, grounded: true, air: 0 })
  const vel = useRef(new THREE.Vector3())
  const velY = useRef(0)
  const yaw = useRef(Math.PI) // start looking toward +Z buildings
  const pitch = useRef(0.5)
  const faceYaw = useRef(Math.PI)

  const setNear = useGame((s) => s.setNearBuilding)

  // ---- Mouse look: hold left button + drag to orbit (look up / down / around) ----
  useEffect(() => {
    const dom = gl.domElement
    let dragging = false
    const onDown = (e) => {
      if (e.button !== 0) return
      if (useGame.getState().openBuilding) return
      dragging = true
      dom.style.cursor = 'grabbing'
    }
    const onUp = () => {
      dragging = false
      dom.style.cursor = 'grab'
    }
    const onMove = (e) => {
      if (!dragging) return
      yaw.current -= e.movementX * 0.004
      pitch.current = THREE.MathUtils.clamp(
        pitch.current - e.movementY * 0.004,
        0.06, // look up toward the skyline / sky
        1.4, // look down over the city
      )
    }
    dom.style.cursor = 'grab'
    dom.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointermove', onMove)
    return () => {
      dom.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointermove', onMove)
    }
  }, [gl])

  // ---- Interaction key (E) ----
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'KeyE') return
      const st = useGame.getState()
      if (st.openBuilding) return
      if (st.nearBuilding) {
        document.exitPointerLock?.()
        st.open(st.nearBuilding)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ---- Init spawn ----
  useEffect(() => {
    if (group.current) {
      group.current.position.set(SPAWN[0], 0, SPAWN[2])
      group.current.rotation.y = Math.PI
    }
  }, [])

  const _target = new THREE.Vector3()
  const _camPos = new THREE.Vector3()

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    const dt = Math.min(delta, 0.05)
    const k = keys.current
    const paused = !!useGame.getState().openBuilding

    // --- camera-relative movement; the character turns to face where it walks ---
    //   up    -> into the screen (away from camera)
    //   down  -> toward the camera (character turns around, face visible)
    //   left/right -> screen left / right
    const sin = Math.sin(yaw.current)
    const cos = Math.cos(yaw.current)
    const fwd = new THREE.Vector3(sin, 0, cos)
    const right = new THREE.Vector3(-cos, 0, sin)
    let iz = 0
    let ix = 0
    if (!paused) {
      if (k.forward) iz += 1
      if (k.back) iz -= 1
      if (k.right) ix += 1
      if (k.left) ix -= 1
    }
    const move = new THREE.Vector3()
    move.addScaledVector(fwd, iz).addScaledVector(right, ix)
    const moving = move.lengthSq() > 0.0001
    if (moving) move.normalize()

    const running = k.run && moving
    const targetSpeed = moving ? (running ? RUN : WALK) : 0
    // smooth horizontal velocity
    vel.current.lerp(move.multiplyScalar(targetSpeed), 1 - Math.pow(0.0001, dt))

    g.position.x += vel.current.x * dt
    g.position.z += vel.current.z * dt

    // --- jump + gravity ---
    if (anim.current.grounded && k.jump && !paused) {
      velY.current = JUMP_V
      anim.current.grounded = false
    }
    velY.current += GRAVITY * dt
    g.position.y += velY.current * dt
    if (g.position.y <= 0) {
      g.position.y = 0
      velY.current = 0
      anim.current.grounded = true
    }

    // --- rotated-box collision (section + generic buildings) ---
    for (const b of BOX_COLLIDERS) {
      const dx = g.position.x - b.x
      const dz = g.position.z - b.z
      // world -> box-local (rotate by -rot)
      const c = Math.cos(b.rot)
      const s = Math.sin(b.rot)
      const lx = dx * c + dz * s
      const lz = -dx * s + dz * c
      const hw = b.hw + PLAYER_R
      const hd = b.hd + PLAYER_R
      if (Math.abs(lx) < hw && Math.abs(lz) < hd) {
        const ox = hw - Math.abs(lx)
        const oz = hd - Math.abs(lz)
        let plx = lx
        let plz = lz
        if (ox < oz) plx = lx < 0 ? -hw : hw
        else plz = lz < 0 ? -hd : hd
        // box-local -> world (rotate by +rot)
        g.position.x = b.x + (plx * c - plz * s)
        g.position.z = b.z + (plx * s + plz * c)
      }
    }

    // --- circular collision (trees, lamps, signs, benches, fountains) ---
    for (const o of CIRCLE_COLLIDERS) {
      const r = o.radius + PLAYER_R
      const dx = g.position.x - o.x
      const dz = g.position.z - o.z
      const dist = Math.hypot(dx, dz)
      if (dist < r && dist > 0.0001) {
        const push = r - dist
        g.position.x += (dx / dist) * push
        g.position.z += (dz / dist) * push
      }
    }

    // --- nearest interactive building (proximity prompt) ---
    let near = null
    let nearDist = Infinity
    for (const z of INTERACT_ZONES) {
      const dist = Math.hypot(g.position.x - z.x, g.position.z - z.z)
      if (dist < z.radius && dist < nearDist) {
        nearDist = dist
        near = z.id
      }
    }
    setNear(near)

    // --- world bounds ---
    const b = CITY.bounds
    g.position.x = THREE.MathUtils.clamp(g.position.x, -b, b)
    g.position.z = THREE.MathUtils.clamp(g.position.z, -b, b)

    // --- character turns to face its movement direction (down => faces camera) ---
    if (moving) {
      faceYaw.current = Math.atan2(vel.current.x, vel.current.z)
    }
    let diff = faceYaw.current - g.rotation.y
    diff = Math.atan2(Math.sin(diff), Math.cos(diff))
    g.rotation.y += diff * Math.min(1, dt * 12)

    // --- camera auto-follows behind the player when walking forward / turning,
    //     so no mouse is needed. It stays put when idle, strafing or backing up
    //     (so pressing down keeps the character's face toward the camera). ---
    if (moving && iz > 0) {
      let cdiff = faceYaw.current - yaw.current
      cdiff = Math.atan2(Math.sin(cdiff), Math.cos(cdiff))
      yaw.current += cdiff * Math.min(1, dt * 3)
    }

    // --- animation state ---
    anim.current.speed = vel.current.length()
    anim.current.air = THREE.MathUtils.clamp(g.position.y / 1.5, 0, 1)
    if (!anim.current.grounded) anim.current.mode = 'jump'
    else if (anim.current.speed > WALK + 1.5) anim.current.mode = 'run'
    else if (anim.current.speed > 0.4) anim.current.mode = 'walk'
    else anim.current.mode = 'idle'

    // --- third person camera follow (yaw is only changed by mouse-drag) ---
    _target.set(g.position.x, g.position.y + 1.6, g.position.z)
    const cp = Math.cos(pitch.current)
    _camPos.set(
      _target.x - sin * CAM_DIST * cp,
      _target.y + CAM_DIST * Math.sin(pitch.current),
      _target.z - cos * CAM_DIST * cp,
    )
    camera.position.lerp(_camPos, 1 - Math.pow(0.001, dt))
    camera.lookAt(_target)
  })

  return (
    <group ref={group}>
      <CharacterGLB anim={anim} />
      {/* soft warm rim light that travels with the player */}
      <pointLight position={[0, 2.4, 0]} color="#ffd9a0" intensity={6} distance={9} decay={2} />
    </group>
  )
}
