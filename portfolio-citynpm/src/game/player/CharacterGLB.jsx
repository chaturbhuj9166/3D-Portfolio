import { useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'
import modelUrl from '../../assets/3d_character_young_boy.glb?url'

useGLTF.preload(modelUrl)

// --- tweakable transform (adjust if the model faces the wrong way / is sized off) ---
const FACING = 0 // set to Math.PI if the character faces the camera instead of away
const SCALE = 1
const Y_OFFSET = 0

// The RPM model ships in an A-pose. For this rig the upper-arm bone lowers around
// its local X axis and the forearm bends around its local Z axis (derived from
// the skeleton's bind-pose axes). These give a relaxed "hands near pockets" pose.
const ARM_DOWN = 0.4 // bring upper arms down to the sides (higher = more inward)
const FORE_BEND = 0.0 // bend forearms forward toward the pockets (mirrored L/R)

// Loads the Ready Player Me GLB and animates its skeleton procedurally
// (idle / walk / run / jump) — the model ships without animation clips, so we
// drive the standard humanoid bones directly on top of their bind pose.
export default function CharacterGLB({ anim }) {
  const { scene } = useGLTF(modelUrl)
  const model = useMemo(() => cloneSkeleton(scene), [scene])
  const stride = useRef(0)

  // Map bones by base name (RPM adds a numeric suffix, e.g. "LeftArm_27"),
  // enable shadows, and capture the bind pose with the pocket-pose baked in.
  const rig = useMemo(() => {
    const b = {}
    model.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.frustumCulled = false
      }
      if (o.isBone) {
        const base = o.name.replace(/_\d+$/, '')
        if (!b[base]) b[base] = o
      }
    })
    const base = {}
    for (const k in b) base[k] = b[k].rotation.clone()
    // arms down to the sides
    if (base.LeftArm) base.LeftArm.x += ARM_DOWN
    if (base.RightArm) base.RightArm.x += ARM_DOWN
    // forearms bent forward (hands toward pockets)
    if (base.LeftForeArm) base.LeftForeArm.z += FORE_BEND
    if (base.RightForeArm) base.RightForeArm.z -= FORE_BEND
    const hipsY = b.Hips ? b.Hips.position.y : 0
    return { b, base, hipsY }
  }, [model])

  useFrame((_, delta) => {
    const a = anim.current
    const { b, base, hipsY } = rig
    if (!b.Hips) return

    const dt = Math.min(delta, 0.05)
    const moving = a.mode === 'walk' || a.mode === 'run'
    const run = a.mode === 'run'
    const freq = run ? 10 : 6.5
    stride.current += dt * (moving ? freq : 1.5)
    const s = stride.current

    // set a bone's rotation = bindPose(+baked offsets) + delta
    const set = (name, dx = 0, dy = 0, dz = 0) => {
      const bone = b[name]
      if (!bone) return
      const r = base[name]
      bone.rotation.set(r.x + dx, r.y + dy, r.z + dz)
    }

    // arms swing forward/back while walking (opposite to the legs); subtle when idle.
    // This rides on top of the ARM_DOWN/FORE_BEND resting pose without changing it.
    // NOTE: the arm bones' local Z axes are mirrored, so the SAME signed value
    // makes the arms swing in OPPOSITE world directions (natural alternating gait).
    const armAmp = run ? 0.6 : moving ? 0.38 : 0.03
    const armSwing = Math.sin(s) * armAmp
    set('LeftArm', 0, 0, armSwing)
    set('RightArm', 0, 0, armSwing)
    set('LeftForeArm')
    set('RightForeArm')

    if (!a.grounded) {
      // ---- jump / airborne tuck (legs only) ----
      const t = THREE.MathUtils.clamp(a.air, 0, 1)
      set('LeftUpLeg', -0.5 - 0.4 * t)
      set('RightUpLeg', -0.1 - 0.7 * t)
      set('LeftLeg', 0.8 * t)
      set('RightLeg', 0.5 * t)
      set('Spine', 0.12)
      set('Head', -0.08)
      b.Hips.position.y = hipsY
    } else if (moving) {
      // ---- walk / run (legs swing around local X) ----
      const amp = run ? 0.85 : 0.5
      const sw = Math.sin(s) * amp
      set('LeftUpLeg', sw)
      set('RightUpLeg', -sw)
      set('LeftLeg', Math.max(0, -Math.sin(s)) * amp * 0.8)
      set('RightLeg', Math.max(0, Math.sin(s)) * amp * 0.8)
      set('Spine', run ? 0.2 : 0.09)
      set('Head', run ? -0.12 : -0.04)
      b.Hips.position.y = hipsY + Math.abs(Math.sin(s)) * (run ? 0.04 : 0.025)
    } else {
      // ---- idle breathing ----
      const br = Math.sin(s)
      set('LeftUpLeg', 0)
      set('RightUpLeg', 0)
      set('LeftLeg', 0)
      set('RightLeg', 0)
      set('Spine', br * 0.03)
      set('Head', Math.sin(s * 0.7) * 0.04)
      b.Hips.position.y = hipsY + br * 0.008
    }
  })

  return (
    <primitive object={model} rotation={[0, FACING, 0]} scale={SCALE} position={[0, Y_OFFSET, 0]} />
  )
}
